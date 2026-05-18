import { Composer, InputFile } from 'grammy';
import axios from 'axios';
import { MyContext } from '../bot';
import { extractLinks } from '../utils/urlExtractor';

/**
 * Helper to download a Telegram public media URL to a buffer and return a grammY InputFile.
 * This is crucial because Telegram's Bot API blocks direct URL download references from t.me domains.
 */
async function getTelegramMediaFile(url: string): Promise<InputFile | string> {
  if (!url.startsWith('http')) return url;
  try {
    console.log(`Downloading Telegram file to local memory buffer: ${url}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
      timeout: 15000,
    });
    const buffer = Buffer.from(response.data);
    
    // Extract filename or default to telegram_media.mp4
    let filename = 'telegram_media.mp4';
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1]?.split('?')[0];
    if (lastPart && lastPart.includes('.')) {
      filename = lastPart;
    } else if (url.includes('/photo/')) {
      filename = 'telegram_photo.jpg';
    }
    
    return new InputFile(buffer, filename);
  } catch (err) {
    console.error('Error fetching Telegram media buffer, falling back to direct URL:', err);
    return url;
  }
}

/**
 * Helper to download any audio URL to a local memory buffer and wrap it in a grammY InputFile.
 * This completely prevents Telegram's 'failed to get HTTP URL content' API errors when downloading from Cobalt dynamic proxy tunnels.
 */
async function getAudioMediaFile(url: string, title: string): Promise<InputFile | string> {
  if (!url.startsWith('http')) return url;
  try {
    console.log(`Downloading audio file to local memory buffer: ${url}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 25000,
    });
    const buffer = Buffer.from(response.data);
    
    // Clean title for safe filename
    const cleanTitle = title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'audio';
    const filename = `${cleanTitle}.mp3`;
    
    return new InputFile(buffer, filename);
  } catch (err) {
    console.error(`Error downloading audio buffer for ${url}, falling back to direct URL:`, err);
    return url;
  }
}
import { downloadMedia } from '../services/downloadService';
import { getTranslation } from '../middlewares/i18n';
import { trackDownload, trackUser } from '../services/analyticsService';
import { createProgressBar, formatPlatformName } from '../utils/formatter';

export const messageComposer = new Composer<MyContext>();

// Main text message handler (inspects links and coordinates downloads)
messageComposer.on('message:text', async (ctx) => {
  if (ctx.from) trackUser(ctx.from.id);

  const text = ctx.message.text || '';
  const lang = ctx.session.settings.language;
  const settings = ctx.session.settings;

  // Extract all supported links from message
  const extractedLinks = extractLinks(text);

  // If no links are found, and it's a private chat, warn user
  if (extractedLinks.length === 0) {
    if (ctx.chat.type === 'private') {
      await ctx.reply(getTranslation(lang, 'no_links'), {
        parse_mode: 'Markdown',
      });
    }
    return;
  }

  // Cap the number of links in a single message to 5 to prevent abuse
  const linksToProcess = extractedLinks.slice(0, 5);

  for (let i = 0; i < linksToProcess.length; i++) {
    const { url, platform } = linksToProcess[i];
    
    // Status text formatting
    const platformLabel = formatPlatformName(platform);
    
    // 1. Send status message: Analyzing
    let statusMessage = await ctx.reply(
      getTranslation(lang, 'analyzing', { platform: platformLabel }),
      {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      }
    );

    try {
      // Small state animation: Downloading
      await ctx.api.editMessageText(
        ctx.chat.id,
        statusMessage.message_id,
        getTranslation(lang, 'downloading') + `\n\n🔗 _Url: ${platformLabel}_`,
        { parse_mode: 'Markdown' }
      );

      // Perform download via download router
      const result = await downloadMedia(url, platform, settings.quality, settings.format);

      if (!result.success || (!result.url && !result.urls)) {
        console.error(`Download failed for URL: ${url}. Error: ${result.error}`);
        
        let errorKey: any = 'error_generic';
        if (result.error?.includes('not found') || result.error?.includes('private')) {
          errorKey = 'error_not_found';
        } else if (result.error?.includes('timeout')) {
          errorKey = 'error_timeout';
        }

        await ctx.api.editMessageText(
          ctx.chat.id,
          statusMessage.message_id,
          getTranslation(lang, errorKey) + `\n\n📌 _Url: ${url}_`,
          { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
        );
        continue;
      }

      // Small state animation: Processing & Sending
      await ctx.api.editMessageText(
        ctx.chat.id,
        statusMessage.message_id,
        getTranslation(lang, 'sending'),
        { parse_mode: 'Markdown' }
      );

      const captionText = result.caption || 
        `✅ *[${platformLabel}]* \n\n📱 *Descargado por:* @NovaDownloaderBot\n✨ *Calidad:* \`${settings.quality === 'max' ? 'Ultra HD' : settings.quality + 'p'}\``;

      // 2. Transmit Media
      if (result.type === 'photos' && result.urls && result.urls.length > 0) {
        // Send a complete slideshow / photo gallery
        const mediaGroup: Array<{
          type: 'photo';
          media: string;
          caption?: string;
          parse_mode?: 'Markdown';
        }> = result.urls.map((imageUrl, idx) => ({
          type: 'photo',
          media: imageUrl,
          caption: idx === 0 ? captionText : undefined, // Put caption only on the first item
          parse_mode: 'Markdown',
        }));

        // Send photos
        await ctx.replyWithMediaGroup(mediaGroup, {
          reply_to_message_id: ctx.message.message_id,
        });

        // Send optional background music if it exists (TikTok Advanced slideshow)
        if (result.musicUrl) {
          try {
            await ctx.replyWithAudio(result.musicUrl, {
              title: result.musicTitle || 'Slideshow Music',
              caption: '🎵 *Música de fondo del Slideshow*',
              parse_mode: 'Markdown',
              reply_to_message_id: ctx.message.message_id,
            });
          } catch (audioErr) {
            console.error('Failed to send optional slideshow audio:', audioErr);
          }
        }

      } else if (result.type === 'photo' && result.url) {
        // Send single photo
        const mediaSource = platform === 'telegram' ? await getTelegramMediaFile(result.url) : result.url;
        await ctx.replyWithPhoto(mediaSource, {
          caption: captionText,
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id,
        });

      } else if (result.url) {
        // Send Video, Audio, or Document
        const outputFormat = settings.format;
        const mediaSource = platform === 'telegram' ? await getTelegramMediaFile(result.url) : result.url;

        if (outputFormat === 'document') {
          // Send as document file to prevent lossy compression
          await ctx.replyWithDocument(mediaSource, {
            caption: captionText,
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
          });
        } else if (result.type === 'audio' || outputFormat === 'audio') {
          // Send as audio track
          let performer: string | undefined = undefined;
          let songTitle = result.title || 'Nova Downloader Audio';
          
          if (result.title && result.title.includes(' - ')) {
            const parts = result.title.split(' - ');
            performer = parts[0]?.trim();
            songTitle = parts[1]?.trim() || songTitle;
          }

          // Download the audio file to a buffer first to bypass Telegram direct fetch restrictions
          const audioSource = await getAudioMediaFile(result.url, result.title || 'audio');

          await ctx.replyWithAudio(audioSource, {
            caption: captionText,
            parse_mode: 'Markdown',
            title: songTitle,
            performer: performer,
            reply_to_message_id: ctx.message.message_id,
          });
        } else {
          // Send as playable video
          await ctx.replyWithVideo(mediaSource, {
            caption: captionText,
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id,
            supports_streaming: true,
          });
        }
      }

      // 3. Clear progress message and reply success
      await ctx.api.deleteMessage(ctx.chat.id, statusMessage.message_id);
      trackDownload(platform);

    } catch (err: any) {
      console.error(`Error sending media to user for URL: ${url}`, err);
      
      let errorText = getTranslation(lang, 'error_generic');
      if (err.description?.includes('too large') || err.message?.includes('413')) {
        errorText = getTranslation(lang, 'error_too_large');
      }

      try {
        await ctx.api.editMessageText(
          ctx.chat.id,
          statusMessage.message_id,
          errorText + `\n\n📌 _Url: ${url}_`,
          { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } }
        );
      } catch (editErr) {
        console.error('Failed to update error status message:', editErr);
      }
    }
  }
});
