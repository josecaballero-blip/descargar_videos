export type MediaType = 'video' | 'audio' | 'photo' | 'photos' | 'gif' | 'unknown';

export interface DownloadResult {
  success: boolean;
  platform: string;
  type: MediaType;
  title?: string;
  filename?: string;
  // Single media URL (e.g. video, audio, single photo)
  url?: string;
  // Multiple media URLs (e.g. Instagram/TikTok photo carousels, slideshows)
  urls?: string[];
  // If TikTok slideshow has a backing audio
  musicUrl?: string;
  musicTitle?: string;
  duration?: number;
  thumbnail?: string;
  caption?: string;
  error?: string;
  size?: number; // Size in bytes if known
}

export type PreferredQuality = '1080' | '720' | '480' | 'max';
export type PreferredFormat = 'video' | 'audio' | 'document';
export type Language = 'es' | 'en';

export interface UserSettings {
  language: Language;
  quality: PreferredQuality;
  format: PreferredFormat;
  silentMode: boolean;
  autoDownload: boolean; // download immediately when link is sent
}

export interface UserSession {
  settings: UserSettings;
  lastMessageTime?: number;
  spamScore?: number;
  downloadCount: number;
}

export interface PlatformInfo {
  name: string;
  id: string;
  domains: string[];
  regex: RegExp;
  supportedMedia: MediaType[];
}

export interface BotStats {
  totalDownloads: number;
  activeUsers: number;
  platformCounts: Record<string, number>;
  startedAt: string;
}
