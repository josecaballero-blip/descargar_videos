import { getTranslation, TranslationKey } from '../middlewares/i18n';
import { UserSettings } from '../types';

/**
 * Creates a premium quality fake progress bar for status updates.
 */
export function createProgressBar(percentage: number): string {
  const totalBlocks = 10;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  
  // High fidelity block indicators
  const filled = '⚡';
  const empty = '─';
  
  return `\`[${filled.repeat(filledBlocks)}${empty.repeat(emptyBlocks)}] ${percentage}%\``;
}

/**
 * Capitalizes a string first letter.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates an elegant quality header based on user settings.
 */
export function getQualityLabel(quality: string): string {
  switch (quality) {
    case 'max': return '🔥 Ultra HD (Max)';
    case '1080': return '💎 Full HD (1080p)';
    case '720': return '✨ HD (720p)';
    case '480': return '📱 SD (480p)';
    default: return quality;
  }
}

/**
 * Generates an elegant format label based on user settings.
 */
export function getFormatLabel(format: string): string {
  switch (format) {
    case 'video': return '🎥 Video (MP4)';
    case 'audio': return '🎵 Audio (MP3)';
    case 'document': return '📂 Document File';
    default: return format;
  }
}

/**
 * Formats platform name nicely.
 */
export function formatPlatformName(platform: string): string {
  const map: Record<string, string> = {
    tiktok: 'TikTok 📱',
    youtube: 'YouTube 🎥',
    instagram: 'Instagram 📸',
    facebook: 'Facebook 👥',
    twitter: 'Twitter/X 🐦',
    pinterest: 'Pinterest 📌',
    threads: 'Threads 🧵',
    vimeo: 'Vimeo 🎬',
    dailymotion: 'Dailymotion 📺',
    kwai: 'Kwai 📲',
    reddit: 'Reddit 🤖',
    snapchat: 'Snapchat 👻',
    capcut: 'CapCut 🎬',
    spotify: 'Spotify 🎵',
    soundcloud: 'SoundCloud ☁️',
    twitch: 'Twitch 👾',
    bilibili: 'Bilibili ⚡',
    tumblr: 'Tumblr 🎨',
    linkedin: 'LinkedIn 👔',
    telegram: 'Telegram ✈️',
    likee: 'Likee 🌟'
  };
  return map[platform.toLowerCase()] || capitalize(platform);
}
