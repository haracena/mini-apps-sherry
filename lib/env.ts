import { z } from 'zod';

/**
 * Environment variables validation schema
 * Ensures all required environment variables are present and valid at runtime
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),

  // Telegram
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: z.string().min(1, 'Telegram bot username is required'),

  // WalletConnect
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, 'WalletConnect project ID is required'),

  // App URLs
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Client-side environment variables schema (only NEXT_PUBLIC_* variables)
 */
const clientEnvSchema = envSchema.pick({
  NEXT_PUBLIC_SUPABASE_URL: true,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: true,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: true,
  NEXT_PUBLIC_BASE_URL: true,
  NODE_ENV: true,
});

/**
 * Validates and returns typed environment variables
 * This should only be called on the server side
 */
export function getServerEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Invalid environment variables:\n${missingVars}`);
    }
    throw error;
  }
}

/**
 * Validates and returns typed client-side environment variables
 * Safe to use in browser
 */
export function getClientEnv() {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_TELEGRAM_BOT_USERNAME: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
      throw new Error(`Invalid client environment variables:\n${missingVars}`);
    }
    throw error;
  }
}

export type ServerEnv = z.infer<typeof envSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
