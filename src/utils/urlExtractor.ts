export interface ExtractedLink {
  url: string;
  platform: string;
}

// Map of platforms and their matching regex patterns
export const PLATFORM_PATTERNS: Record<string, RegExp> = {
  tiktok: /https?:\/\/(?:[a-z0-9-]+\.)?tiktok\.com\/[a-zA-Z0-9_\-+&?#=/]+/i,
  youtube: /https?:\/\/(?:[a-z0-9-]+\.)?(?:youtube\.com|youtu\.be)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  instagram: /https?:\/\/(?:[a-z0-9-]+\.)?instagram\.com\/(?:p|reel|tv|stories|[a-zA-Z0-9_.]+)\/[a-zA-Z0-9_\-+&?#=/]*/i,
  facebook: /https?:\/\/(?:[a-z0-9-]+\.)?(?:facebook\.com|fb\.watch|fb\.com)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  twitter: /https?:\/\/(?:[a-z0-9-]+\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  pinterest: /https?:\/\/(?:[a-z0-9-]+\.)?(?:pinterest\.[a-z.]+|pin\.it)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  threads: /https?:\/\/(?:[a-z0-9-]+\.)?threads\.net\/[a-zA-Z0-9_\-+&?#=/]+/i,
  vimeo: /https?:\/\/(?:[a-z0-9-]+\.)?vimeo\.com\/[a-zA-Z0-9_\-+&?#=/]+/i,
  dailymotion: /https?:\/\/(?:[a-z0-9-]+\.)?(?:dailymotion\.com|dai\.ly)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  kwai: /https?:\/\/(?:[a-z0-9-]+\.)?(?:kwai\.com|kwai-video\.com)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  reddit: /https?:\/\/(?:[a-z0-9-]+\.)?reddit\.com\/r\/[a-zA-Z0-9_\-+&?#=/]+/i,
  snapchat: /https?:\/\/(?:[a-z0-9-]+\.)?snapchat\.com\/[a-zA-Z0-9_\-+&?#=/]+/i,
  capcut: /https?:\/\/(?:[a-z0-9-]+\.)?capcut\.com\/(?:watch|t|template)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  spotify: /https?:\/\/(?:[a-z0-9-]+\.)?spotify\.com\/(?:[a-zA-Z0-9_-]+\/)?(?:track|album|playlist|artist|show|episode)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  soundcloud: /https?:\/\/(?:[a-z0-9-]+\.)?soundcloud\.com\/[a-zA-Z0-9_\-+&?#=/]+/i,
  twitch: /https?:\/\/(?:[a-z0-9-]+\.)?(?:twitch\.tv|clips\.twitch\.tv)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  bilibili: /https?:\/\/(?:[a-z0-9-]+\.)?(?:bilibili\.com|b23\.tv)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  tumblr: /https?:\/\/(?:[a-z0-9-]+\.)?tumblr\.com\/[a-zA-Z0-9_\-+&?#=/]+/i,
  linkedin: /https?:\/\/(?:[a-z0-9-]+\.)?linkedin\.com\/(?:feed\/update|posts|sharing)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  telegram: /https?:\/\/(?:[a-z0-9-]+\.)?(?:t\.me|telegram\.me)\/[a-zA-Z0-9_\-+&?#=/]+/i,
  likee: /https?:\/\/(?:[a-z0-9-]+\.)?(?:likee\.video|likee\.com)\/[a-zA-Z0-9_\-+&?#=/]+/i,
};

// General regex to find any URL in a text
const GENERAL_URL_REGEX = /https?:\/\/[^\s"'<>\(\)]+/gi;

/**
 * Extracts all supported links from a given block of text.
 * It ignores regular paragraphs and returns a structured array of valid platform links.
 */
export function extractLinks(text: string): ExtractedLink[] {
  if (!text) return [];

  const foundLinks: ExtractedLink[] = [];
  const rawUrls = text.match(GENERAL_URL_REGEX);

  if (!rawUrls) return [];

  for (const rawUrl of rawUrls) {
    // Clean trailing punctuation that might get captured from paragraphs (like periods, commas, parenthesis)
    let cleanedUrl = rawUrl.replace(/[.,;:!?\)\(]+$/, '');
    
    // Check if the URL matches any of our supported platforms
    let matched = false;
    for (const [platform, regex] of Object.entries(PLATFORM_PATTERNS)) {
      if (regex.test(cleanedUrl)) {
        foundLinks.push({
          url: cleanedUrl,
          platform,
        });
        matched = true;
        break; // Stop checking other platforms for this URL
      }
    }
  }

  // Deduplicate links
  return foundLinks.filter((link, index, self) =>
    self.findIndex(l => l.url === link.url) === index
  );
}

/**
 * Checks if a specific URL is supported by our system.
 */
export function isSupportedUrl(url: string): boolean {
  for (const regex of Object.values(PLATFORM_PATTERNS)) {
    if (regex.test(url)) return true;
  }
  return false;
}
