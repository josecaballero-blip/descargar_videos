import axios from 'axios';
import { DownloadResult } from '../types';

/**
 * Service to scrap Spotify track metadata and audio previews.
 * Extracts title, artist, cover image, and the 30-second preview MP3.
 */
export async function downloadFromSpotify(url: string): Promise<DownloadResult> {
  try {
    console.log(`Scraping Spotify URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const html = response.data;
    
    // Extract metadata from Open Graph tags
    const titleRegex = /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i;
    const artistRegex = /<meta\s+property=["']twitter:audio:artist_name["']\s+content=["']([^"']+)["']/i;
    const albumRegex = /<meta\s+property=["']twitter:audio:album_name["']\s+content=["']([^"']+)["']/i;
    const imageRegex = /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i;
    const audioRegex = /<meta\s+property=["']og:audio["']\s+content=["']([^"']+)["']/i;
    
    const titleMatch = html.match(titleRegex);
    const artistMatch = html.match(artistRegex);
    const albumMatch = html.match(albumRegex);
    const imageMatch = html.match(imageRegex);
    const audioMatch = html.match(audioRegex);
    
    const title = titleMatch ? titleMatch[1] : 'Unknown Spotify Track';
    const artist = artistMatch ? artistMatch[1] : 'Unknown Artist';
    const album = albumMatch ? albumMatch[1] : 'Unknown Album';
    const imageUrl = imageMatch ? imageMatch[1] : undefined;
    const audioUrl = audioMatch ? audioMatch[1] : undefined;

    if (audioUrl) {
      return {
        success: true,
        platform: 'spotify',
        type: 'audio',
        url: audioUrl,
        title: `${artist} - ${title} (Preview)`,
        thumbnail: imageUrl,
        caption: `🎵 *Track:* ${title}\n👤 *Artist:* ${artist}\n💿 *Album:* ${album}\n\n⚠️ _This is a high-quality 30-second preview. Use /search to find the full version!_`,
      };
    }

    // Fallback: If no audio preview found, send the metadata and album artwork as a photo
    if (imageUrl) {
      return {
        success: true,
        platform: 'spotify',
        type: 'photo',
        url: imageUrl,
        title: `${artist} - ${title}`,
        caption: `🎵 *Track:* ${title}\n👤 *Artist:* ${artist}\n💿 *Album:* ${album}\n\n⚠️ _No preview audio available for this track. Copy the title to find it on YouTube/SoundCloud!_`,
      };
    }

    return {
      success: false,
      platform: 'spotify',
      type: 'unknown',
      error: 'Could not extract metadata from this Spotify link.',
    };

  } catch (error: any) {
    console.error('Spotify scraping error:', error.message || error);
    return {
      success: false,
      platform: 'spotify',
      type: 'unknown',
      error: 'Failed to access or parse Spotify track.',
    };
  }
}
