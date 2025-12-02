/**
 * Number validation and manipulation utilities
 * Provides helpers for numeric input validation and formatting
 */

/**
 * Validates if a value is a valid number
 * @param value - Value to validate
 * @returns true if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validates if a string can be parsed as a number
 * @param value - String to validate
 * @returns true if string represents a valid number
 */
export function isNumericString(value: string): boolean {
  if (value.trim() === '') return false;
  return !isNaN(Number(value)) && isFinite(Number(value));
}

/**
 * Validates if a number is within a specified range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns true if number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return isValidNumber(value) && value >= min && value <= max;
}

/**
 * Validates if a number is a positive integer
 * @param value - Number to validate
 * @returns true if number is a positive integer
 */
export function isPositiveInteger(value: number): boolean {
  return isValidNumber(value) && Number.isInteger(value) && value > 0;
}

/**
 * Validates if a number is a non-negative integer
 * @param value - Number to validate
 * @returns true if number is zero or positive integer
 */
export function isNonNegativeInteger(value: number): boolean {
  return isValidNumber(value) && Number.isInteger(value) && value >= 0;
}

/**
 * Clamps a number between min and max values
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Rounds a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Safely parses a string to a number with fallback
 * @param value - String to parse
 * @param fallback - Fallback value if parsing fails (default: 0)
 * @returns Parsed number or fallback
 */
export function parseNumber(value: string, fallback: number = 0): number {
  const parsed = parseFloat(value);
  return isValidNumber(parsed) ? parsed : fallback;
}

/**
 * Safely parses a string to an integer with fallback
 * @param value - String to parse
 * @param fallback - Fallback value if parsing fails (default: 0)
 * @returns Parsed integer or fallback
 */
export function parseInteger(value: string, fallback: number = 0): number {
  const parsed = parseInt(value, 10);
  return isValidNumber(parsed) ? parsed : fallback;
}

/**
 * Validates decimal places in a number
 * @param value - Number to validate
 * @param maxDecimals - Maximum allowed decimal places
 * @returns true if number has valid decimal places
 */
export function hasValidDecimals(value: number, maxDecimals: number): boolean {
  if (!isValidNumber(value)) return false;
  const decimalPart = value.toString().split('.')[1];
  return !decimalPart || decimalPart.length <= maxDecimals;
}

/**
 * Formats a number with thousand separators
 * @param value - Number to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export function formatWithSeparators(
  value: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Validates percentage value (0-100)
 * @param value - Value to validate
 * @returns true if value is a valid percentage
 */
export function isValidPercentage(value: number): boolean {
  return isInRange(value, 0, 100);
}

/**
 * Converts percentage to decimal
 * @param percentage - Percentage value (0-100)
 * @returns Decimal value (0-1)
 */
export function percentageToDecimal(percentage: number): number {
  return percentage / 100;
}

/**
 * Converts decimal to percentage
 * @param decimal - Decimal value (0-1)
 * @returns Percentage value (0-100)
 */
export function decimalToPercentage(decimal: number): number {
  return decimal * 100;
}

/**
 * Validates crypto amount format
 * @param value - Amount to validate
 * @param maxDecimals - Maximum decimal places (default: 18 for ETH)
 * @returns true if amount is valid
 */
export function isValidCryptoAmount(
  value: number,
  maxDecimals: number = 18
): boolean {
  return (
    isValidNumber(value) &&
    value > 0 &&
    hasValidDecimals(value, maxDecimals)
  );
}

/**
 * Calculates percentage of a value
 * @param value - Base value
 * @param percentage - Percentage to calculate
 * @returns Calculated percentage amount
 */
export function calculatePercentage(value: number, percentage: number): number {
  return value * percentageToDecimal(percentage);
}

/**
 * Adds two numbers with proper decimal handling
 * @param a - First number
 * @param b - Second number
 * @param decimals - Decimal places to round to (default: 2)
 * @returns Sum rounded to specified decimals
 */
export function safeAdd(a: number, b: number, decimals: number = 2): number {
  return roundToDecimals(a + b, decimals);
}

/**
 * Subtracts two numbers with proper decimal handling
 * @param a - First number
 * @param b - Second number
 * @param decimals - Decimal places to round to (default: 2)
 * @returns Difference rounded to specified decimals
 */
export function safeSubtract(a: number, b: number, decimals: number = 2): number {
  return roundToDecimals(a - b, decimals);
}

/**
 * Multiplies two numbers with proper decimal handling
 * @param a - First number
 * @param b - Second number
 * @param decimals - Decimal places to round to (default: 2)
 * @returns Product rounded to specified decimals
 */
export function safeMultiply(a: number, b: number, decimals: number = 2): number {
  return roundToDecimals(a * b, decimals);
}

/**
 * Divides two numbers with proper decimal handling and zero-division check
 * @param a - Dividend
 * @param b - Divisor
 * @param decimals - Decimal places to round to (default: 2)
 * @returns Quotient rounded to specified decimals, or 0 if divisor is 0
 */
export function safeDivide(a: number, b: number, decimals: number = 2): number {
  if (b === 0) return 0;
  return roundToDecimals(a / b, decimals);
}
