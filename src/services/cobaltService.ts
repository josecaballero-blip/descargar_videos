import axios from 'axios';
import { config } from '../config/environment';
import { DownloadResult, PreferredQuality, PreferredFormat } from '../types';

interface CobaltRequestParams {
  url: string;
  videoQuality?: string;
  audioFormat?: string;
  downloadMode?: 'auto' | 'audio' | 'video';
  filenamePattern?: 'classic' | 'pretty' | 'basic';
  youtubeVideoCodec?: 'h264' | 'vp9' | 'av1';
  tiktokFullAudio?: boolean;
}

interface CobaltResponse {
  status: 'success' | 'stream' | 'redirect' | 'picker' | 'error';
  url?: string;
  pickerType?: 'photo' | 'video' | 'mixed';
  picker?: Array<{
    url: string;
    type?: 'photo' | 'video';
  }>;
  audio?: string; // Audio track if available (e.g. TikTok slideshow bg music)
  text?: string;  // Error message or title
}

/**
 * Service to interface with the Cobalt API.
 * Handles downloading from YouTube, TikTok, Instagram, Twitter, Facebook, Reddit, etc.
 */
export async function downloadFromCobalt(
  url: string,
  quality: PreferredQuality = 'max',
  format: PreferredFormat = 'video'
): Promise<DownloadResult> {
  try {
    const apiEndpoint = config.COBALT_API_URL;
    
    // Map quality options to Cobalt values
    let cobaltQuality = '1080';
    if (quality === '720') cobaltQuality = '720';
    if (quality === '480') cobaltQuality = '480';
    if (quality === 'max') cobaltQuality = 'max';

    // Map format options
    const downloadMode = format === 'audio' ? 'audio' : 'auto';

    const payload: CobaltRequestParams = {
      url: url,
      videoQuality: cobaltQuality,
      audioFormat: 'mp3',
      downloadMode: downloadMode,
      filenamePattern: 'pretty',
      youtubeVideoCodec: 'h264', // Ensures Telegram inline play compatibility
      tiktokFullAudio: true,
    };

    console.log(`Sending Cobalt request for URL: ${url} (mode: ${downloadMode}, quality: ${cobaltQuality})`);
    
    const response = await axios.post<CobaltResponse>(apiEndpoint, payload, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds timeout
    });

    const data = response.data;
    console.log(`Cobalt API response status: ${data.status}`);

    if (data.status === 'error') {
      return {
        success: false,
        platform: 'cobalt',
        type: 'unknown',
        error: data.text || 'Cobalt API reported an error.',
      };
    }

    // 1. Handle Photo Galleries / Slideshows (e.g., TikTok slideshows, Instagram posts)
    if (data.status === 'picker' && data.picker && data.picker.length > 0) {
      const urls = data.picker.map(item => item.url);
      
      // Determine if it's photos or a mix
      const isAllPhotos = data.picker.every(item => item.type === 'photo' || !item.type);
      
      return {
        success: true,
        platform: 'cobalt',
        type: isAllPhotos ? 'photos' : 'video', // send as media group
        urls: urls,
        musicUrl: data.audio, // optional audio track
        musicTitle: 'TikTok Soundtrack',
        title: 'Nova Slideshow',
      };
    }

    // 2. Handle standard direct URLs (videos, audios, single images)
    if (data.url) {
      // Determine media type
      let type: 'video' | 'audio' | 'photo' = 'video';
      if (format === 'audio') {
        type = 'audio';
      } else if (url.includes('instagram.com/p/') && !url.includes('reel') && data.url.match(/\.(jpg|jpeg|png|webp)/i)) {
        type = 'photo';
      }

      return {
        success: true,
        platform: 'cobalt',
        type,
        url: data.url,
        title: data.text || 'Nova Downloader File',
        musicUrl: data.audio,
      };
    }

    // 3. Handle stream redirect
    if (data.status === 'stream' || data.status === 'redirect') {
      return {
        success: true,
        platform: 'cobalt',
        type: format === 'audio' ? 'audio' : 'video',
        url: data.url || response.headers.location,
        title: 'Nova Downloader File',
      };
    }

    return {
      success: false,
      platform: 'cobalt',
      type: 'unknown',
      error: 'Invalid response format from downloader API.',
    };

  } catch (error: any) {
    console.error('Cobalt API request error:', error.message || error);
    
    // Provide a human-readable explanation of error types
    let errorMessage = 'Could not contact the downloader engine.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'The download service timed out. Please try again.';
    } else if (error.response?.data?.text) {
      errorMessage = error.response.data.text;
    }

    return {
      success: false,
      platform: 'cobalt',
      type: 'unknown',
      error: errorMessage,
    };
  }
}
