import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from '../bot';
import { getTranslation } from '../middlewares/i18n';
import { getQualityLabel, getFormatLabel } from '../utils/formatter';
import { PreferredQuality, PreferredFormat, Language } from '../types';

export const callbackComposer = new Composer<MyContext>();

// Main Settings Page Home
callbackComposer.callbackQuery('settings_home', async (ctx) => {
  const lang = ctx.session.settings.language;
  const settings = ctx.session.settings;

  const keyboard = new InlineKeyboard()
    .text(`🌐 ${lang === 'es' ? 'Idioma' : 'Language'}`, 'set_lang_menu')
    .text(`🎞️ ${lang === 'es' ? 'Calidad' : 'Quality'}`, 'set_qual_menu')
    .row()
    .text(`📂 ${lang === 'es' ? 'Formato' : 'Format'}`, 'set_form_menu')
    .row();

  const title = getTranslation(lang, 'settings_title');
  const details = `\n\n⚙️ *${lang === 'es' ? 'Ajustes Actuales' : 'Current Settings'}:*\n` +
    ` ├ 🌐 *${lang === 'es' ? 'Idioma' : 'Language'}:* \`${lang === 'es' ? 'Español' : 'English'}\`\n` +
    ` ├ 🎞️ *${lang === 'es' ? 'Calidad' : 'Quality'}:* \`${getQualityLabel(settings.quality)}\`\n` +
    ` └ 📂 *${lang === 'es' ? 'Formato' : 'Format'}:* \`${getFormatLabel(settings.format)}\``;

  try {
    await ctx.editMessageText(title + details, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error('Error rendering settings home callback:', err);
  }
});

// Language Selection Menu
callbackComposer.callbackQuery('set_lang_menu', async (ctx) => {
  const lang = ctx.session.settings.language;
  
  const keyboard = new InlineKeyboard()
    .text('🇪🇸 Español' + (lang === 'es' ? ' ✅' : ''), 'set_lang:es')
    .text('🇺🇸 English' + (lang === 'en' ? ' ✅' : ''), 'set_lang:en')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(lang, 'language_select'), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error('Error rendering language menu callback:', err);
  }
});

// Quality Selection Menu
callbackComposer.callbackQuery('set_qual_menu', async (ctx) => {
  const lang = ctx.session.settings.language;
  const settings = ctx.session.settings;
  
  const keyboard = new InlineKeyboard()
    .text(settings.quality === 'max' ? '🔥 Ultra HD (Max) ✅' : '🔥 Ultra HD (Max)', 'set_qual:max')
    .row()
    .text(settings.quality === '1080' ? '💎 Full HD (1080p) ✅' : '💎 Full HD (1080p)', 'set_qual:1080')
    .row()
    .text(settings.quality === '720' ? '✨ HD (720p) ✅' : '✨ HD (720p)', 'set_qual:720')
    .row()
    .text(settings.quality === '480' ? '📱 SD (480p) ✅' : '📱 SD (480p)', 'set_qual:480')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(lang, 'settings_quality', { quality: getQualityLabel(settings.quality) }), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error('Error rendering quality menu callback:', err);
  }
});

// Format Selection Menu
callbackComposer.callbackQuery('set_form_menu', async (ctx) => {
  const lang = ctx.session.settings.language;
  const settings = ctx.session.settings;
  
  const keyboard = new InlineKeyboard()
    .text(settings.format === 'video' ? '🎥 Video ✅' : '🎥 Video', 'set_form:video')
    .text(settings.format === 'audio' ? '🎵 Audio MP3 ✅' : '🎵 Audio MP3', 'set_form:audio')
    .row()
    .text(settings.format === 'document' ? '📂 Documento ✅' : '📂 Documento', 'set_form:document')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(lang, 'settings_format', { format: getFormatLabel(settings.format) }), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  } catch (err) {
    console.error('Error rendering format menu callback:', err);
  }
});

// Action: Set Language
callbackComposer.callbackQuery(/^set_lang:(es|en)$/, async (ctx) => {
  const newLang = ctx.match[1] as Language;
  ctx.session.settings.language = newLang;
  
  const keyboard = new InlineKeyboard()
    .text('🇪🇸 Español' + (newLang === 'es' ? ' ✅' : ''), 'set_lang:es')
    .text('🇺🇸 English' + (newLang === 'en' ? ' ✅' : ''), 'set_lang:en')
    .row()
    .text(newLang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(newLang, 'language_select'), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    
    await ctx.answerCallbackQuery({
      text: getTranslation(newLang, 'language_changed'),
    });
  } catch (err) {
    console.error('Error changing language:', err);
  }
});

// Action: Set Quality
callbackComposer.callbackQuery(/^set_qual:(max|1080|720|480)$/, async (ctx) => {
  const newQual = ctx.match[1] as PreferredQuality;
  ctx.session.settings.quality = newQual;
  const lang = ctx.session.settings.language;

  const keyboard = new InlineKeyboard()
    .text(newQual === 'max' ? '🔥 Ultra HD (Max) ✅' : '🔥 Ultra HD (Max)', 'set_qual:max')
    .row()
    .text(newQual === '1080' ? '💎 Full HD (1080p) ✅' : '💎 Full HD (1080p)', 'set_qual:1080')
    .row()
    .text(newQual === '720' ? '✨ HD (720p) ✅' : '✨ HD (720p)', 'set_qual:720')
    .row()
    .text(newQual === '480' ? '📱 SD (480p) ✅' : '📱 SD (480p)', 'set_qual:480')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(lang, 'settings_quality', { quality: getQualityLabel(newQual) }), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    
    await ctx.answerCallbackQuery({
      text: lang === 'es' ? `Calidad de video fijada en: ${newQual}p!` : `Video quality preferred to: ${newQual}p!`,
    });
  } catch (err) {
    console.error('Error changing quality:', err);
  }
});

// Action: Set Format
callbackComposer.callbackQuery(/^set_form:(video|audio|document)$/, async (ctx) => {
  const newForm = ctx.match[1] as PreferredFormat;
  ctx.session.settings.format = newForm;
  const lang = ctx.session.settings.language;

  const keyboard = new InlineKeyboard()
    .text(newForm === 'video' ? '🎥 Video ✅' : '🎥 Video', 'set_form:video')
    .text(newForm === 'audio' ? '🎵 Audio MP3 ✅' : '🎵 Audio MP3', 'set_form:audio')
    .row()
    .text(newForm === 'document' ? '📂 Documento ✅' : '📂 Documento', 'set_form:document')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  try {
    await ctx.editMessageText(getTranslation(lang, 'settings_format', { format: getFormatLabel(newForm) }), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
    
    await ctx.answerCallbackQuery({
      text: lang === 'es' ? `Formato de salida fijado en: ${newForm.toUpperCase()}!` : `Output format set to: ${newForm.toUpperCase()}!`,
    });
  } catch (err) {
    console.error('Error changing format:', err);
  }
});
