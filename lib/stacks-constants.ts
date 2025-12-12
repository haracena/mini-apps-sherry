/**
 * Stacks Global Constants
 * Centralized constants for Stacks blockchain integration
 */

// Network Configuration
export const STACKS_NETWORKS = {
  MAINNET: "mainnet",
  TESTNET: "testnet",
} as const;

export type StacksNetwork = (typeof STACKS_NETWORKS)[keyof typeof STACKS_NETWORKS];

// API Endpoints
export const STACKS_API_ENDPOINTS = {
  MAINNET: "https://stacks-node-api.mainnet.stacks.co",
  TESTNET: "https://stacks-node-api.testnet.stacks.co",
} as const;

// Transaction Fees
export const TX_FEES = {
  MINIMUM: 180,
  LOW: 1000,
  MEDIUM: 5000,
  HIGH: 10000,
  DEFAULT: 5000,
} as const;

// Cache TTL
export const CACHE_TTL = {
  BLOCK: 60_000,
  TRANSACTION: 30_000,
  BALANCE: 30_000,
  CONTRACT: 300_000,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAX_ADDRESS_DISPLAY_LENGTH: 12,
  ITEMS_PER_PAGE: 12,
  LEADERBOARD_LIMIT: 10,
} as const;
