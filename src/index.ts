import express from 'express';
import cors from 'cors';
import { run } from '@grammyjs/runner';
import { webhookCallback } from 'grammy';
import { bot } from './bot';
import { config, validateConfig } from './config/environment';

// Validate config on startup
validateConfig();

const app = express();

// Apply middle wares
app.use(cors());
app.use(express.json());

// Health Check Endpoint (Keep-Alive Strategy)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    bot: 'Nova Downloader Bot',
  });
});

app.get('/', (req, res) => {
  res.status(200).send('🚀 Nova Downloader Bot is running!');
});

// Configure Webhook Mode for Production (Vercel compatible)
if (config.NODE_ENV === 'production') {
  console.log('🌐 Webhook mode enabled. Setting up Express route...');
  
  // grammY express webhook callback integration
  // This route handles Telegram updates serverless-ly
  app.post(`/api/webhook`, webhookCallback(bot, 'express'));

  // Start express server only if not running in pure Vercel serverless context
  // (In Vercel, the express app is exported and managed by Vercel serverless runner)
  if (process.env.VERCEL !== '1') {
    app.listen(config.PORT, () => {
      console.log(`📡 Production server listening on port ${config.PORT}`);
    });
  }
} else {
  // Long Polling Mode for Local Development
  console.log('🔌 Local development mode. Starting Long Polling...');
  
  // Use @grammyjs/runner to handle updates concurrently and robustly
  const runner = run(bot);
  
  console.log('🤖 Bot is listening for messages in polling mode...');
  
  // Create a local dashboard server for dev checking
  app.listen(config.PORT, () => {
    console.log(`💻 Local health check server running on http://localhost:${config.PORT}/health`);
  });

  // Handle graceful stop
  const stopRunner = async () => {
    if (runner.isRunning()) {
      console.log('Stopping polling runner...');
      await runner.stop();
      console.log('Runner stopped.');
      process.exit(0);
    }
  };

  process.once('SIGINT', stopRunner);
  process.once('SIGTERM', stopRunner);
}

// Export Express app for Vercel Serverless Function handling
export default app;
export { bot };
