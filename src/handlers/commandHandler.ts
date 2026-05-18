import { Composer, InlineKeyboard } from 'grammy';
import { MyContext } from '../bot';
import { getTranslation } from '../middlewares/i18n';
import { getStats, getUptimeString, trackUser } from '../services/analyticsService';
import { getQualityLabel, getFormatLabel, formatPlatformName } from '../utils/formatter';

export const commandComposer = new Composer<MyContext>();

// /start command
commandComposer.command('start', async (ctx) => {
  if (ctx.from) trackUser(ctx.from.id);
  const lang = ctx.session.settings.language;
  
  await ctx.reply(getTranslation(lang, 'start'), {
    parse_mode: 'Markdown',
    link_preview_options: { is_disabled: true },
  });
});

// /help command
commandComposer.command('help', async (ctx) => {
  const lang = ctx.session.settings.language;
  await ctx.reply(getTranslation(lang, 'help'), {
    parse_mode: 'Markdown',
  });
});

// /about command
commandComposer.command('about', async (ctx) => {
  const lang = ctx.session.settings.language;
  await ctx.reply(getTranslation(lang, 'about'), {
    parse_mode: 'Markdown',
  });
});

// /ping command
commandComposer.command('ping', async (ctx) => {
  const start = Date.now();
  const lang = ctx.session.settings.language;
  const replyMessage = await ctx.reply('🏓 Pinging...');
  const latency = Date.now() - start;
  
  await ctx.api.editMessageText(
    ctx.chat.id,
    replyMessage.message_id,
    getTranslation(lang, 'ping', { ms: latency }),
    { parse_mode: 'Markdown' }
  );
});

// /donate command
commandComposer.command('donate', async (ctx) => {
  const lang = ctx.session.settings.language;
  await ctx.reply(getTranslation(lang, 'donate'), {
    parse_mode: 'Markdown',
    link_preview_options: { is_disabled: true },
  });
});

// /stats command
commandComposer.command('stats', async (ctx) => {
  const lang = ctx.session.settings.language;
  const stats = getStats();
  
  // Format platform counts beautifully
  let platformsText = '';
  const platformEntries = Object.entries(stats.platformCounts);
  
  if (platformEntries.length === 0) {
    platformsText = lang === 'es' ? '   _Aún no hay descargas registradas._' : '   _No downloads recorded yet._';
  } else {
    platformEntries
      .sort((a, b) => b[1] - a[1]) // Sort descending
      .forEach(([platform, count]) => {
        platformsText += `🔹 *${formatPlatformName(platform)}:* \`${count}\`\n`;
      });
  }

  const messageText = getTranslation(lang, 'stats_title', {
    total: stats.totalDownloads,
    users: stats.activeUsers,
    uptime: getUptimeString(),
  }) + '\n' + platformsText;

  await ctx.reply(messageText, {
    parse_mode: 'Markdown',
  });
});

// /settings command
commandComposer.command('settings', async (ctx) => {
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

  await ctx.reply(title + details, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
});

// /quality command shortcut
commandComposer.command('quality', async (ctx) => {
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

  await ctx.reply(getTranslation(lang, 'settings_quality', { quality: getQualityLabel(settings.quality) }), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
});

// /formats command shortcut
commandComposer.command('formats', async (ctx) => {
  const lang = ctx.session.settings.language;
  const settings = ctx.session.settings;
  
  const keyboard = new InlineKeyboard()
    .text(settings.format === 'video' ? '🎥 Video ✅' : '🎥 Video', 'set_form:video')
    .text(settings.format === 'audio' ? '🎵 Audio MP3 ✅' : '🎵 Audio MP3', 'set_form:audio')
    .row()
    .text(settings.format === 'document' ? '📂 Documento ✅' : '📂 Documento', 'set_form:document')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  await ctx.reply(getTranslation(lang, 'settings_format', { format: getFormatLabel(settings.format) }), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
});

// /language command shortcut
commandComposer.command('language', async (ctx) => {
  const lang = ctx.session.settings.language;
  
  const keyboard = new InlineKeyboard()
    .text('🇪🇸 Español' + (lang === 'es' ? ' ✅' : ''), 'set_lang:es')
    .text('🇺🇸 English' + (lang === 'en' ? ' ✅' : ''), 'set_lang:en')
    .row()
    .text(lang === 'es' ? '« Volver' : '« Back', 'settings_home');

  await ctx.reply(getTranslation(lang, 'language_select'), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
});
