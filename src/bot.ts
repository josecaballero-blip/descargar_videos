import { Bot, Context, session, SessionFlavor } from 'grammy';
import { config } from './config/environment';
import { UserSession } from './types';
import { antiSpamMiddleware } from './middlewares/antiSpam';
import { errorHandler } from './middlewares/errorHandler';
import { commandComposer } from './handlers/commandHandler';
import { callbackComposer } from './handlers/callbackHandler';
import { messageComposer } from './handlers/messageHandler';

// Define context type with session support
export type MyContext = Context & SessionFlavor<UserSession>;

// Create bot instance
export const bot = new Bot<MyContext>(config.TELEGRAM_BOT_TOKEN);

// Initialize default settings for new users
function createInitialSession(): UserSession {
  return {
    settings: {
      language: config.DEFAULT_LANGUAGE,
      quality: 'max',
      format: 'video',
      silentMode: false,
      autoDownload: true,
    },
    downloadCount: 0,
  };
}

// 1. Session Middleware (Uses standard built-in in-memory session)
bot.use(session({ initial: createInitialSession }));

// 2. Anti-Spam / Rate-limiting Middleware
bot.use(antiSpamMiddleware);

// 3. Command Handlers
bot.use(commandComposer);

// 4. Callback Query Handlers (Inline keyboards)
bot.use(callbackComposer);

// 5. Message Text Handlers
bot.use(messageComposer);

// 6. Global Error Handling
bot.catch(errorHandler);
