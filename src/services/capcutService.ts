import axios from 'axios';
import { DownloadResult } from '../types';

/**
 * Service to scrap CapCut template preview videos directly.
 * Allows users to download clean template demo videos.
 */
export async function downloadFromCapCut(url: string): Promise<DownloadResult> {
  try {
    console.log(`Scraping CapCut URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });

    const html = response.data;
    
    // 1. Look for og:video or og:video:url metadata
    const videoMetaRegex = /<meta\s+property=["']og:video(?::url)?["']\s+content=["'](https?:\/\/[^"']+)["']/i;
    const match = html.match(videoMetaRegex);
    
    if (match && match[1]) {
      const videoUrl = match[1].replace(/&amp;/g, '&');
      return {
        success: true,
        platform: 'capcut',
        type: 'video',
        url: videoUrl,
        title: 'CapCut Template Preview',
      };
    }

    // 2. Look in JSON data inside script tags
    const jsonUrlRegex = /["']video(?:_url|Url)["']\s*:\s*["'](https?:\/\/[^"']+\.mp4[^"']*)["']/i;
    const jsonMatch = html.match(jsonUrlRegex);
    
    if (jsonMatch && jsonMatch[1]) {
      const videoUrl = JSON.parse(`"${jsonMatch[1]}"`); // Decode unicode escapes
      return {
        success: true,
        platform: 'capcut',
        type: 'video',
        url: videoUrl,
        title: 'CapCut Template Preview',
      };
    }

    return {
      success: false,
      platform: 'capcut',
      type: 'unknown',
      error: 'Could not extract template preview video. Make sure the template exists and is active.',
    };

  } catch (error: any) {
    console.error('CapCut scraping error:', error.message || error);
    return {
      success: false,
      platform: 'capcut',
      type: 'unknown',
      error: 'Failed to access or parse CapCut template.',
    };
  }
}
