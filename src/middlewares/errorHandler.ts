import { BotError } from 'grammy';
import { getTranslation } from './i18n';

export async function errorHandler(error: BotError): Promise<void> {
  const ctx = error.ctx;
  console.error(`❌ ERROR in bot update [ID: ${ctx.update.update_id}]:`);
  console.error(error.error);

  const userId = ctx.from?.id;
  const userLang = (ctx.from?.language_code === 'en' ? 'en' : 'es') as 'es' | 'en';

  try {
    // Attempt to notify user that something went wrong
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({
        text: '❌ Error interno del servidor.',
        show_alert: true,
      });
    } else {
      await ctx.reply(
        getTranslation(userLang, 'error_generic'),
        { parse_mode: 'Markdown' }
      );
    }
  } catch (err) {
    console.error('Failed to send error notification to user:', err);
  }
}
