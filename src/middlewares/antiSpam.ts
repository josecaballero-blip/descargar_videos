import { Middleware, Context } from 'grammy';
import { getTranslation } from './i18n';
import { UserSession } from '../types';

// Simple in-memory tracker for rate limits (ephemeral, perfect for serverless environment)
const lastRequestTimes = new Map<number, number>();

// Cooldown in milliseconds (3 seconds)
const COOLDOWN_MS = 3000;

export const antiSpamMiddleware: Middleware<Context & { session?: UserSession }> = async (ctx, next) => {
  if (!ctx.from || ctx.from.is_bot) {
    return next();
  }

  const userId = ctx.from.id;
  const now = Date.now();
  const lastTime = lastRequestTimes.get(userId);

  // If a command or text is sent too fast
  if (lastTime && now - lastTime < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastTime)) / 1000);
    
    // Get user language preference (fallback to Spanish)
    const userLang = (ctx.session?.settings?.language || (ctx.from.language_code === 'en' ? 'en' : 'es')) as 'es' | 'en';
    
    try {
      // Only reply with spam warning if it's not a callback query (to avoid button spam popup)
      if (!ctx.callbackQuery) {
        await ctx.reply(
          getTranslation(userLang, 'anti_spam', { seconds: remainingSeconds }),
          { parse_mode: 'MarkdownV2' }
        );
      } else {
        await ctx.answerCallbackQuery({
          text: `⚠️ Cooldown active. Wait ${remainingSeconds}s.`,
          show_alert: true,
        });
      }
    } catch (err) {
      console.error('Error sending rate limit message:', err);
    }
    return; // Block execution of next handlers
  }

  // Update request time
  lastRequestTimes.set(userId, now);
  return next();
};
