/**
 * Reusable Zod validation schemas
 * Provides common validation schemas used across the application
 */

import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim();

/**
 * Ethereum address validation schema
 */
export const ethereumAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
  .transform((val) => val.toLowerCase());

/**
 * Transaction hash validation schema
 */
export const txHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format')
  .transform((val) => val.toLowerCase());

/**
 * UUID validation schema
 */
export const uuidSchema = z
  .string()
  .uuid('Invalid UUID format');

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must be less than 2048 characters');

/**
 * Password validation schema with strength requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Username validation schema
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .trim();

/**
 * Phone number validation schema (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

/**
 * Positive number schema
 */
export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number')
  .finite('Must be a finite number');

/**
 * Non-negative number schema
 */
export const nonNegativeNumberSchema = z
  .number()
  .nonnegative('Must be a non-negative number')
  .finite('Must be a finite number');

/**
 * Percentage schema (0-100)
 */
export const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100')
  .finite('Must be a finite number');

/**
 * Crypto amount schema
 */
export const cryptoAmountSchema = z
  .number()
  .positive('Amount must be positive')
  .finite('Must be a finite number')
  .refine((val) => {
    const str = val.toString();
    const decimals = str.split('.')[1];
    return !decimals || decimals.length <= 18;
  }, 'Amount has too many decimal places (max 18)');

/**
 * AVAX amount schema (max 6 decimals for practical use)
 */
export const avaxAmountSchema = z
  .number()
  .positive('AVAX amount must be positive')
  .finite('Must be a finite number')
  .refine((val) => {
    const str = val.toString();
    const decimals = str.split('.')[1];
    return !decimals || decimals.length <= 6;
  }, 'AVAX amount has too many decimal places (max 6)');

/**
 * Date string schema (ISO 8601)
 */
export const dateStringSchema = z
  .string()
  .datetime('Invalid date format')
  .or(z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'));

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

/**
 * Search query schema
 */
export const searchQuerySchema = z
  .string()
  .min(1, 'Search query cannot be empty')
  .max(200, 'Search query is too long')
  .trim();

/**
 * Slug schema (URL-safe identifier)
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug cannot be empty')
  .max(100, 'Slug is too long')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .trim();

/**
 * Hex color schema
 */
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color format');

/**
 * Telegram group configuration schema
 */
export const telegramGroupConfigSchema = z.object({
  group_id: uuidSchema,
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long').trim(),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long').trim(),
  telegram_group_id: z.string().min(1, 'Telegram group ID is required'),
  telegram_group_name: z.string().min(1, 'Telegram group name is required').max(100).trim(),
  telegram_user_id: z.string().min(1, 'Telegram user ID is required'),
  owner_address: ethereumAddressSchema,
  invitation_price: avaxAmountSchema,
  referralCommission: percentageSchema,
});

/**
 * Telegram invitation schema
 */
export const telegramInvitationSchema = z.object({
  id: uuidSchema,
  group_id: uuidSchema,
  group_id_hash: z.string().min(1),
  email: emailSchema,
  payer_address: ethereumAddressSchema,
  referral: ethereumAddressSchema.optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  telegram_invitation_url: urlSchema.optional(),
  created_at: dateStringSchema,
  updated_at: dateStringSchema.optional(),
});

/**
 * Transaction schema
 */
export const transactionSchema = z.object({
  id: uuidSchema,
  group_id: uuidSchema,
  payer_address: ethereumAddressSchema,
  amount: cryptoAmountSchema,
  transaction_hash: txHashSchema,
  block_number: z.number().int().nonnegative(),
  status: z.enum(['PENDING', 'CONFIRMED', 'FAILED']),
  created_at: dateStringSchema,
});

/**
 * File upload schema
 */
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255),
  size: z.number().positive().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().min(1, 'File type is required'),
});

/**
 * Creates a validated string schema with min/max length
 */
export function createStringSchema(
  minLength: number = 1,
  maxLength: number = 255,
  fieldName: string = 'Field'
) {
  return z
    .string()
    .min(minLength, `${fieldName} must be at least ${minLength} characters`)
    .max(maxLength, `${fieldName} must be less than ${maxLength} characters`)
    .trim();
}

/**
 * Creates a validated number schema with min/max values
 */
export function createNumberSchema(
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER,
  fieldName: string = 'Number'
) {
  return z
    .number()
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} must be at most ${max}`)
    .finite('Must be a finite number');
}

/**
 * Creates an optional field schema
 */
export function makeOptional<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional();
}

/**
 * Creates a nullable field schema
 */
export function makeNullable<T extends z.ZodTypeAny>(schema: T) {
  return schema.nullable();
}
