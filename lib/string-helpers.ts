export function truncate(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateRandomId(length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + "s"}`;
}

/**
 * Converts string to title case
 * @param str - String to convert
 * @returns Title cased string
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Converts camelCase to snake_case
 * @param str - String to convert
 * @returns snake_case string
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Converts snake_case to camelCase
 * @param str - String to convert
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts string to kebab-case
 * @param str - String to convert
 * @returns kebab-case string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Removes all whitespace from string
 * @param str - String to process
 * @returns String without whitespace
 */
export function removeSpaces(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Removes extra whitespace and trims
 * @param str - String to clean
 * @returns Cleaned string
 */
export function cleanWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Checks if string is empty or only whitespace
 * @param str - String to check
 * @returns true if string is empty
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Reverses a string
 * @param str - String to reverse
 * @returns Reversed string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Counts occurrences of substring in string
 * @param str - String to search in
 * @param substr - Substring to count
 * @returns Number of occurrences
 */
export function countOccurrences(str: string, substr: string): number {
  if (!substr) return 0;
  return (str.match(new RegExp(substr, 'g')) || []).length;
}

/**
 * Repeats a string n times
 * @param str - String to repeat
 * @param count - Number of times to repeat
 * @returns Repeated string
 */
export function repeat(str: string, count: number): string {
  return str.repeat(Math.max(0, count));
}

/**
 * Pads string to specified length with character
 * @param str - String to pad
 * @param length - Target length
 * @param char - Character to pad with (default: space)
 * @param side - Side to pad ('start' | 'end' | 'both')
 * @returns Padded string
 */
export function pad(
  str: string,
  length: number,
  char: string = ' ',
  side: 'start' | 'end' | 'both' = 'end'
): string {
  if (str.length >= length) return str;

  const padLength = length - str.length;
  const padChar = char.charAt(0);

  switch (side) {
    case 'start':
      return padChar.repeat(padLength) + str;
    case 'both': {
      const leftPad = Math.floor(padLength / 2);
      const rightPad = padLength - leftPad;
      return padChar.repeat(leftPad) + str + padChar.repeat(rightPad);
    }
    case 'end':
    default:
      return str + padChar.repeat(padLength);
  }
}

/**
 * Masks part of a string with specified character
 * @param str - String to mask
 * @param visibleStart - Number of visible characters at start
 * @param visibleEnd - Number of visible characters at end
 * @param maskChar - Character to use for masking (default: *)
 * @returns Masked string
 */
export function mask(
  str: string,
  visibleStart: number = 4,
  visibleEnd: number = 4,
  maskChar: string = '*'
): string {
  if (str.length <= visibleStart + visibleEnd) {
    return str;
  }

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const maskLength = str.length - visibleStart - visibleEnd;

  return start + maskChar.repeat(maskLength) + end;
}

/**
 * Extracts initials from a name
 * @param name - Name to extract initials from
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string
 */
export function getInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Wraps text to specified line length
 * @param text - Text to wrap
 * @param lineLength - Maximum line length
 * @returns Wrapped text
 */
export function wordWrap(text: string, lineLength: number = 80): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= lineLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}

/**
 * Escapes special characters for use in regex
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if string contains only alphanumeric characters
 * @param str - String to check
 * @returns true if alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Checks if string contains only letters
 * @param str - String to check
 * @returns true if only letters
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Checks if string contains only digits
 * @param str - String to check
 * @returns true if only digits
 */
export function isNumeric(str: string): boolean {
  return /^\d+$/.test(str);
}
