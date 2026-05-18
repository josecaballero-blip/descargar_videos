import { DownloadResult, PreferredQuality, PreferredFormat } from '../types';
import { downloadFromCobalt } from './cobaltService';
import { downloadFromPinterest } from './pinterestService';
import { downloadFromCapCut } from './capcutService';
import { downloadFromSpotify } from './spotifyService';
import { downloadFromSnapchat } from './snapchatService';
import { downloadFromTelegramPost } from './telegramService';

/**
 * Main Download Router.
 * Detects the platform and runs the most optimal scraper or API connection.
 */
export async function downloadMedia(
  url: string,
  platform: string,
  quality: PreferredQuality = 'max',
  format: PreferredFormat = 'video'
): Promise<DownloadResult> {
  console.log(`Routing download for [${platform}] - URL: ${url}`);
  
  try {
    switch (platform) {
      case 'pinterest':
        return await downloadFromPinterest(url);
        
      case 'capcut':
        return await downloadFromCapCut(url);
        
      case 'spotify':
        return await downloadFromSpotify(url);
        
      case 'snapchat':
        return await downloadFromSnapchat(url);
        
      case 'telegram':
        return await downloadFromTelegramPost(url);
        
      // Default to Cobalt API which handles TikTok, YouTube, Instagram, X/Twitter, FB, Reddit, Vimeo, etc.
      default:
        return await downloadFromCobalt(url, quality, format);
    }
  } catch (error: any) {
    console.error(`Router error on platform [${platform}]:`, error.message || error);
    return {
      success: false,
      platform,
      type: 'unknown',
      error: 'An unexpected routing error occurred during download.',
    };
  }
}
