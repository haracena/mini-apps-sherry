/**
 * Form validation and handling utilities
 * Provides helpers for common form operations and validations
 */

import type { FieldError, FieldErrors } from 'react-hook-form';

/**
 * Extracts error message from React Hook Form field error
 * @param error - Field error object
 * @returns Error message string or undefined
 */
export function getFieldErrorMessage(error?: FieldError): string | undefined {
  if (!error) return undefined;
  return error.message;
}

/**
 * Checks if form has any errors
 * @param errors - Field errors object
 * @returns true if form has errors
 */
export function hasFormErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Gets all error messages from form errors
 * @param errors - Field errors object
 * @returns Array of error messages
 */
export function getAllErrorMessages(errors: FieldErrors): string[] {
  const messages: string[] = [];

  Object.values(errors).forEach((error) => {
    if (error?.message) {
      messages.push(error.message);
    }
  });

  return messages;
}

/**
 * Formats field name for display
 * Converts camelCase or snake_case to readable format
 * @param fieldName - Field name to format
 * @returns Formatted field name
 */
export function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Validates required field
 * @param value - Value to validate
 * @returns Error message or true if valid
 */
export function validateRequired(value: unknown): string | true {
  if (value === null || value === undefined || value === '') {
    return 'This field is required';
  }
  return true;
}

/**
 * Validates minimum length
 * @param value - String value to validate
 * @param min - Minimum length
 * @returns Error message or true if valid
 */
export function validateMinLength(value: string, min: number): string | true {
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return true;
}

/**
 * Validates maximum length
 * @param value - String value to validate
 * @param max - Maximum length
 * @returns Error message or true if valid
 */
export function validateMaxLength(value: string, max: number): string | true {
  if (value.length > max) {
    return `Must be no more than ${max} characters`;
  }
  return true;
}

/**
 * Validates minimum value for numbers
 * @param value - Number value to validate
 * @param min - Minimum value
 * @returns Error message or true if valid
 */
export function validateMinValue(value: number, min: number): string | true {
  if (value < min) {
    return `Must be at least ${min}`;
  }
  return true;
}

/**
 * Validates maximum value for numbers
 * @param value - Number value to validate
 * @param max - Maximum value
 * @returns Error message or true if valid
 */
export function validateMaxValue(value: number, max: number): string | true {
  if (value > max) {
    return `Must be no more than ${max}`;
  }
  return true;
}

/**
 * Validates value matches a pattern
 * @param value - String value to validate
 * @param pattern - Regex pattern
 * @param message - Custom error message
 * @returns Error message or true if valid
 */
export function validatePattern(
  value: string,
  pattern: RegExp,
  message: string = 'Invalid format'
): string | true {
  if (!pattern.test(value)) {
    return message;
  }
  return true;
}

/**
 * Validates two fields match (e.g., password confirmation)
 * @param value - Value to compare
 * @param compareValue - Value to compare against
 * @param fieldName - Name of field being compared (default: 'Field')
 * @returns Error message or true if valid
 */
export function validateMatch(
  value: string,
  compareValue: string,
  fieldName: string = 'Field'
): string | true {
  if (value !== compareValue) {
    return `${fieldName} does not match`;
  }
  return true;
}

/**
 * Creates a debounced validation function
 * @param validationFn - Validation function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced validation function
 */
export function createDebouncedValidator<T>(
  validationFn: (value: T) => Promise<string | true>,
  delay: number = 300
): (value: T) => Promise<string | true> {
  let timeoutId: NodeJS.Timeout;

  return (value: T) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await validationFn(value);
        resolve(result);
      }, delay);
    });
  };
}

/**
 * Combines multiple validators
 * @param validators - Array of validation functions
 * @returns Combined validation function
 */
export function combineValidators<T>(
  ...validators: Array<(value: T) => string | true>
): (value: T) => string | true {
  return (value: T) => {
    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };
}

/**
 * Normalizes form data by trimming strings and removing empty values
 * @param data - Form data object
 * @returns Normalized form data
 */
export function normalizeFormData<T extends Record<string, unknown>>(data: T): T {
  const normalized = { ...data };

  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];

    if (typeof value === 'string') {
      normalized[key] = value.trim() as T[Extract<keyof T, string>];
    }

    if (value === '' || value === null || value === undefined) {
      delete normalized[key];
    }
  });

  return normalized;
}

/**
 * Converts form data to FormData object for multipart uploads
 * @param data - Plain object data
 * @returns FormData object
 */
export function toFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, String(item));
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
}

/**
 * Validates file type
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Error message or true if valid
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): string | true {
  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`;
  }
  return true;
}

/**
 * Validates file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in megabytes
 * @returns Error message or true if valid
 */
export function validateFileSize(file: File, maxSizeMB: number): string | true {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }
  return true;
}
