import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export interface Environment {
  TELEGRAM_BOT_TOKEN: string;
  COBALT_API_URL: string;
  PORT: number;
  WEBHOOK_URL: string;
  ADMIN_USER_IDS: number[];
  NODE_ENV: 'development' | 'production';
  DEFAULT_LANGUAGE: 'es' | 'en';
}

// Default public Cobalt API URL
const DEFAULT_COBALT_URL = 'https://api.cobalt.tools';

export const config: Environment = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  COBALT_API_URL: process.env.COBALT_API_URL || DEFAULT_COBALT_URL,
  PORT: parseInt(process.env.PORT || '3000', 10),
  WEBHOOK_URL: process.env.WEBHOOK_URL || '',
  ADMIN_USER_IDS: (process.env.ADMIN_USER_IDS || '')
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id)),
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  DEFAULT_LANGUAGE: (process.env.DEFAULT_LANGUAGE as 'es' | 'en') || 'es',
};

// Validate critical variables
export function validateConfig(): void {
  if (!config.TELEGRAM_BOT_TOKEN) {
    console.error('❌ CRITICAL ERROR: TELEGRAM_BOT_TOKEN is not set in the environment variables!');
    process.exit(1);
  }
  
  console.log('✅ Configuration validated successfully.');
  console.log(`🤖 Environment: ${config.NODE_ENV}`);
  console.log(`📡 Cobalt API: ${config.COBALT_API_URL}`);
  console.log(`👥 Admins loaded: ${config.ADMIN_USER_IDS.length}`);
}
