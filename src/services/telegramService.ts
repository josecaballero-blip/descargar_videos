import axios from 'axios';
import { DownloadResult } from '../types';

/**
 * Service to scrap media from public Telegram posts.
 * Takes a link like t.me/channel/123 and scrapes the direct media source URL.
 */
export async function downloadFromTelegramPost(url: string): Promise<DownloadResult> {
  try {
    // Convert url to embed URL
    let embedUrl = url;
    if (!embedUrl.includes('?embed=1')) {
      embedUrl = embedUrl.split('?')[0] + '?embed=1';
    }

    console.log(`Scraping Telegram Post: ${embedUrl}`);

    const response = await axios.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });

    const html = response.data;

    // 1. Look for video tag src
    const videoRegex = /<video[^>]*src=["'](https:\/\/t\.me\/[^"']+)["']/i;
    const videoMatch = html.match(videoRegex);

    if (videoMatch && videoMatch[1]) {
      return {
        success: true,
        platform: 'telegram',
        type: 'video',
        url: videoMatch[1],
        title: 'Telegram Video',
      };
    }

    // 2. Look for background-image link for photos
    const photoRegex = /background-image\s*:\s*url\(\s*['"]?(https:\/\/t\.me\/[^'")]+)['"]?\s*\)/i;
    const photoMatch = html.match(photoRegex);

    if (photoMatch && photoMatch[1]) {
      return {
        success: true,
        platform: 'telegram',
        type: 'photo',
        url: photoMatch[1],
        title: 'Telegram Photo',
      };
    }

    return {
      success: false,
      platform: 'telegram',
      type: 'unknown',
      error: 'Could not find any public video or photo in this Telegram post embed.',
    };

  } catch (error: any) {
    console.error('Telegram post scraping error:', error.message || error);
    return {
      success: false,
      platform: 'telegram',
      type: 'unknown',
      error: 'Failed to access or parse public Telegram post. Make sure the channel is public.',
    };
  }
}
