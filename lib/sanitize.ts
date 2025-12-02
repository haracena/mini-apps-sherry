/**
 * Advanced sanitization utilities for user input
 * Provides protection against XSS and injection attacks
 */

/**
 * Sanitizes HTML content by escaping dangerous characters
 * @param input - String that may contain HTML
 * @returns Escaped string safe for display
 */
export function escapeHtml(input: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Sanitizes input for SQL-like contexts by removing dangerous characters
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeSql(input: string): string {
  return input
    .trim()
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Sanitizes URL input by validating protocol and removing dangerous characters
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Allow only http, https, and mailto protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:'];

  try {
    const parsed = new URL(trimmed);
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    // If URL is invalid, return empty string
    return '';
  }
}

/**
 * Removes all whitespace from input
 * @param input - String to process
 * @returns String without whitespace
 */
export function removeWhitespace(input: string): string {
  return input.replace(/\s+/g, '');
}

/**
 * Normalizes whitespace by replacing multiple spaces with a single space
 * @param input - String to normalize
 * @returns String with normalized whitespace
 */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Removes all non-alphanumeric characters except specified ones
 * @param input - String to sanitize
 * @param allowedChars - Additional characters to allow (default: space and hyphen)
 * @returns Sanitized string
 */
export function sanitizeAlphanumeric(
  input: string,
  allowedChars: string = ' -'
): string {
  const escaped = allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`[^a-zA-Z0-9${escaped}]`, 'g');
  return input.replace(regex, '');
}

/**
 * Sanitizes phone number by keeping only digits, spaces, and common phone characters
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+\-() ]/g, '').trim();
}

/**
 * Sanitizes numeric input by removing non-digit characters
 * @param input - String to sanitize
 * @param allowDecimal - Whether to allow decimal point (default: false)
 * @returns Sanitized numeric string
 */
export function sanitizeNumeric(input: string, allowDecimal: boolean = false): string {
  if (allowDecimal) {
    return input.replace(/[^0-9.]/g, '');
  }
  return input.replace(/[^0-9]/g, '');
}

/**
 * Removes zero-width characters and other invisible Unicode characters
 * @param input - String to clean
 * @returns String without zero-width characters
 */
export function removeInvisibleChars(input: string): string {
  return input
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Control characters
}

/**
 * Comprehensive sanitization for general text input
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeText(input: string): string {
  return normalizeWhitespace(
    removeInvisibleChars(
      escapeHtml(input)
    )
  );
}
