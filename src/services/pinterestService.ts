import axios from 'axios';
import { DownloadResult } from '../types';

/**
 * Service to scrap Pinterest images and videos directly.
 * Extremely lightweight and stable.
 */
export async function downloadFromPinterest(url: string): Promise<DownloadResult> {
  try {
    console.log(`Scraping Pinterest URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const html = response.data;
    
    // 1. Try to find a video link first
    const videoRegex = /<meta\s+property=["']og:video["']\s+content=["'](https?:\/\/[^"']+)["']/i;
    const videoMatch = html.match(videoRegex);
    
    if (videoMatch && videoMatch[1]) {
      const videoUrl = videoMatch[1].replace(/&amp;/g, '&');
      return {
        success: true,
        platform: 'pinterest',
        type: 'video',
        url: videoUrl,
        title: 'Pinterest Video',
      };
    }

    // 2. Fallback to image link
    const imageRegex = /<meta\s+property=["']og:image["']\s+content=["'](https?:\/\/[^"']+)["']/i;
    const imageMatch = html.match(imageRegex);
    
    if (imageMatch && imageMatch[1]) {
      const imageUrl = imageMatch[1].replace(/&amp;/g, '&');
      return {
        success: true,
        platform: 'pinterest',
        type: 'photo',
        url: imageUrl,
        title: 'Pinterest Image',
      };
    }

    return {
      success: false,
      platform: 'pinterest',
      type: 'unknown',
      error: 'No media meta-tags found in this Pinterest post.',
    };

  } catch (error: any) {
    console.error('Pinterest scraping error:', error.message || error);
    return {
      success: false,
      platform: 'pinterest',
      type: 'unknown',
      error: 'Failed to access or parse Pinterest post.',
    };
  }
}
