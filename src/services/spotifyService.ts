import axios from 'axios';
import { DownloadResult } from '../types';
import { downloadFromCobalt } from './cobaltService';

/**
 * Service to scrape Spotify track metadata and download the full audio MP3 file via YouTube search fallback.
 * Bypasses 30-second limitations by finding the matching track in high quality and extracting it.
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
    
    const titleMatch = html.match(titleRegex);
    const artistMatch = html.match(artistRegex);
    const albumMatch = html.match(albumRegex);
    const imageMatch = html.match(imageRegex);
    
    const title = titleMatch ? titleMatch[1] : 'Unknown Spotify Track';
    const artist = artistMatch ? artistMatch[1] : 'Unknown Artist';
    const album = albumMatch ? albumMatch[1] : 'Unknown Album';
    const imageUrl = imageMatch ? imageMatch[1] : undefined;

    console.log(`Extracted Spotify metadata: "${title}" by "${artist}" (Album: "${album}")`);

    // Step 2: Search YouTube for the full song
    const searchQuery = `${artist} - ${title} audio`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    
    console.log(`Searching YouTube for matching audio: "${searchQuery}"`);
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 10000,
    });

    const searchHtml = searchResponse.data;
    // Find the first video ID match
    const ytMatch = searchHtml.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);

    if (!ytMatch) {
      throw new Error('No matching high-quality track was found.');
    }

    const videoId = ytMatch[1];
    const ytVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`Matched YouTube Video: ${ytVideoUrl}. Sending audio request to Cobalt...`);

    // Step 3: Request Cobalt to download as high-quality audio
    const cobaltResult = await downloadFromCobalt(ytVideoUrl, 'max', 'audio');

    if (cobaltResult.success && cobaltResult.url) {
      return {
        success: true,
        platform: 'spotify',
        type: 'audio',
        url: cobaltResult.url,
        title: `${artist} - ${title}`,
        thumbnail: imageUrl,
        caption: `🎵 *Canción:* ${title}\n👤 *Artista:* ${artist}\n💿 *Álbum:* ${album}\n\n⚡ *Descarga:* Completa en Alta Definición (320kbps MP3)`,
      };
    }

    // Step 4: Fallback to official 30-second Spotify preview if YouTube download failed
    console.warn(`Cobalt full download failed (${cobaltResult.error}). Attempting official Spotify preview fallback...`);
    const audioRegex = /<meta\s+property=["']og:audio["']\s+content=["']([^"']+)["']/i;
    const audioMatch = html.match(audioRegex);
    const audioUrl = audioMatch ? audioMatch[1] : undefined;

    if (audioUrl) {
      return {
        success: true,
        platform: 'spotify',
        type: 'audio',
        url: audioUrl,
        title: `${artist} - ${title} (Preview)`,
        thumbnail: imageUrl,
        caption: `🎵 *Canción:* ${title}\n👤 *Artista:* ${artist}\n💿 *Álbum:* ${album}\n\n⚠️ _Se descargó el preview oficial de 30 segundos (El descargador completo falló: ${cobaltResult.error})_`,
      };
    }

    throw new Error(cobaltResult.error || 'Could not download track.');

  } catch (error: any) {
    console.error('Spotify downloading process error:', error.message || error);
    return {
      success: false,
      platform: 'spotify',
      type: 'unknown',
      error: `No se pudo descargar la canción: ${error.message || 'Error del servidor'}`,
    };
  }
}
