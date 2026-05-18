import { BotStats } from '../types';

// In-memory metrics store
const startTime = new Date();
let totalDownloads = 0;
const uniqueUsers = new Set<number>();
const platformStats: Record<string, number> = {};

/**
 * Record a successful download event.
 */
export function trackDownload(platform: string): void {
  totalDownloads++;
  const key = platform.toLowerCase();
  platformStats[key] = (platformStats[key] || 0) + 1;
}

/**
 * Record a unique user active event.
 */
export function trackUser(userId: number): void {
  uniqueUsers.add(userId);
}

/**
 * Formats duration into human-readable uptime (Days, Hours, Minutes, Seconds)
 */
export function getUptimeString(): string {
  const diffMs = Date.now() - startTime.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  
  const days = Math.floor(diffSecs / 86400);
  const hours = Math.floor((diffSecs % 86400) / 3600);
  const mins = Math.floor((diffSecs % 3600) / 60);
  const secs = diffSecs % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Get all accumulated statistics.
 */
export function getStats(): BotStats {
  return {
    totalDownloads,
    activeUsers: uniqueUsers.size || 1, // At least 1 (the current user querying stats)
    platformCounts: platformStats,
    startedAt: startTime.toISOString(),
  };
}
