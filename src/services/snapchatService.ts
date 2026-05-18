import axios from 'axios';
import { DownloadResult } from '../types';

/**
 * Service to scrap Snapchat public stories.
 * Extracts video links from stories metadata.
 */
export async function downloadFromSnapchat(url: string): Promise<DownloadResult> {
  try {
    console.log(`Scraping Snapchat URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });

    const html = response.data;
    
    // 1. Look for og:video meta tag
    const videoRegex = /<meta\s+property=["']og:video["']\s+content=["'](https?:\/\/[^"']+)["']/i;
    const videoMatch = html.match(videoRegex);
    
    if (videoMatch && videoMatch[1]) {
      const videoUrl = videoMatch[1].replace(/&amp;/g, '&');
      return {
        success: true,
        platform: 'snapchat',
        type: 'video',
        url: videoUrl,
        title: 'Snapchat Story',
      };
    }

    // 2. Look for og:image meta tag (for photo stories)
    const imageRegex = /<meta\s+property=["']og:image["']\s+content=["'](https?:\/\/[^"']+)["']/i;
    const imageMatch = html.match(imageRegex);
    
    if (imageMatch && imageMatch[1]) {
      const imageUrl = imageMatch[1].replace(/&amp;/g, '&');
      return {
        success: true,
        platform: 'snapchat',
        type: 'photo',
        url: imageUrl,
        title: 'Snapchat Story Image',
      };
    }

    return {
      success: false,
      platform: 'snapchat',
      type: 'unknown',
      error: 'Could not find story media in the page metadata.',
    };

  } catch (error: any) {
    console.error('Snapchat scraping error:', error.message || error);
    return {
      success: false,
      platform: 'snapchat',
      type: 'unknown',
      error: 'Failed to access or parse Snapchat story.',
    };
  }
}
