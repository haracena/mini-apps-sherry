/**
 * UTC time utilities for daily streak calculations
 * Aligned with smart contract time logic (12:00 UTC reset)
 */

const SECONDS_PER_DAY = 86400;
const UTC_RESET_HOUR = 12;

/**
 * Get current day number based on UTC 12:00 reset
 * Matches the smart contract getCurrentDay() function
 * @returns Current day number since epoch
 */
export function getCurrentDay(): number {
  const now = Math.floor(Date.now() / 1000);
  const adjustedTime = now - UTC_RESET_HOUR * 3600;
  return Math.floor(adjustedTime / SECONDS_PER_DAY);
}

/**
 * Get timestamp of next reset (12:00 UTC)
 * @returns Unix timestamp of next 12:00 UTC
 */
export function getNextResetTime(): number {
  const currentDay = getCurrentDay();
  const nextDayStart = (currentDay + 1) * SECONDS_PER_DAY + UTC_RESET_HOUR * 3600;
  return nextDayStart;
}

/**
 * Get time remaining until next reset
 * @returns Seconds until next 12:00 UTC reset
 */
export function getTimeUntilReset(): number {
  const now = Math.floor(Date.now() / 1000);
  const nextReset = getNextResetTime();
  return Math.max(0, nextReset - now);
}

/**
 * Format seconds into human-readable countdown
 * @param seconds - Seconds to format
 * @returns Formatted string (e.g., "23h 45m 12s")
 */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Check if it's currently past reset time (after 12:00 UTC)
 * @returns true if past 12:00 UTC today
 */
export function isPastResetTime(): boolean {
  const now = new Date();
  const utcHours = now.getUTCHours();
  return utcHours >= UTC_RESET_HOUR;
}

/**
 * Get formatted reset time for display
 * @returns "12:00 UTC"
 */
export function getResetTimeDisplay(): string {
  return `${UTC_RESET_HOUR.toString().padStart(2, "0")}:00 UTC`;
}
