/**
 * Stacks Blockchain Constants
 *
 * Centralized constants for Stacks integration
 */

/**
 * Network URLs
 */
export const STACKS_NETWORK_URLS = {
  mainnet: {
    api: 'https://stacks-node-api.mainnet.stacks.co',
    explorer: 'https://explorer.stacks.co',
  },
  testnet: {
    api: 'https://stacks-node-api.testnet.stacks.co',
    explorer: 'https://explorer.hiro.so',
  },
} as const;

/**
 * Block times (approximate)
 */
export const STACKS_BLOCK_TIME = {
  SECONDS: 600, // ~10 minutes
  MINUTES: 10,
  BLOCKS_PER_DAY: 144,
  BLOCKS_PER_WEEK: 1008,
} as const;

/**
 * STX denomination
 */
export const STX_DECIMALS = 6;
export const MICRO_STX_PER_STX = 1_000_000;

/**
 * Transaction fees (approximate in microSTX)
 */
export const TRANSACTION_FEES = {
  MIN: 1000, // 0.001 STX
  LOW: 5000, // 0.005 STX
  MEDIUM: 10000, // 0.01 STX
  HIGH: 50000, // 0.05 STX
} as const;

/**
 * Address prefixes
 */
export const ADDRESS_PREFIX = {
  MAINNET: 'SP',
  TESTNET: 'ST',
} as const;

/**
 * Contract name constraints
 */
export const CONTRACT_CONSTRAINTS = {
  MAX_NAME_LENGTH: 128,
  NAME_PATTERN: /^[a-z]([a-z0-9]|-)*$/,
} as const;

/**
 * Clarity value types
 */
export const CLARITY_TYPES = {
  INT: 'int',
  UINT: 'uint',
  BOOL: 'bool',
  PRINCIPAL: 'principal',
  BUFFER: 'buffer',
  STRING_ASCII: 'string-ascii',
  STRING_UTF8: 'string-utf8',
  OPTIONAL: 'optional',
  RESPONSE: 'response',
  LIST: 'list',
  TUPLE: 'tuple',
} as const;

/**
 * Transaction status types
 */
export const TX_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ABORT_BY_RESPONSE: 'abort_by_response',
  ABORT_BY_POST_CONDITION: 'abort_by_post_condition',
} as const;

/**
 * Default gas limits
 */
export const GAS_LIMITS = {
  CONTRACT_DEPLOY: 100000,
  CONTRACT_CALL: 50000,
  TOKEN_TRANSFER: 10000,
} as const;

/**
 * Wallet types
 */
export const WALLET_TYPES = {
  LEATHER: 'leather',
  XVERSE: 'xverse',
  ASIGNA: 'asigna',
} as const;

/**
 * Supported wallet URLs
 */
export const WALLET_URLS = {
  [WALLET_TYPES.LEATHER]: 'https://leather.io',
  [WALLET_TYPES.XVERSE]: 'https://xverse.app',
  [WALLET_TYPES.ASIGNA]: 'https://asigna.io',
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Contract errors
  NOT_AUTHORIZED: 100,
  ALREADY_SPUN_TODAY: 101,
  INVALID_PRIZE: 102,
  OWNER_ONLY: 100,
  NOT_TOKEN_OWNER: 101,
  INVALID_PRICE: 102,
  INSUFFICIENT_FUNDS: 103,
  TOKEN_EXISTS: 104,
  METADATA_FROZEN: 105,

  // Frontend errors
  WALLET_NOT_CONNECTED: 1000,
  NETWORK_ERROR: 1001,
  TRANSACTION_FAILED: 1002,
  INVALID_ADDRESS: 1003,
} as const;

/**
 * Prize tiers for daily streak
 */
export const PRIZE_TIERS = [
  { min: 10, max: 20, probability: 0.4 }, // 40%
  { min: 30, max: 40, probability: 0.3 }, // 30%
  { min: 50, max: 70, probability: 0.2 }, // 20%
  { min: 80, max: 100, probability: 0.08 }, // 8%
  { min: 120, max: 150, probability: 0.02 }, // 2%
] as const;

/**
 * NFT metadata standards
 */
export const NFT_METADATA_STANDARDS = {
  SIP009: 'sip-009',
  SIP016: 'sip-016',
} as const;

/**
 * IPFS gateways (in order of preference)
 */
export const IPFS_GATEWAYS = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
] as const;

/**
 * Stacks epochs
 */
export const STACKS_EPOCHS = {
  '2.0': 'Stacks 2.0',
  '2.05': 'Stacks 2.05',
  '2.1': 'Stacks 2.1 (Pox-2)',
  '2.2': 'Stacks 2.2',
  '2.3': 'Stacks 2.3',
  '2.4': 'Stacks 2.4 (Nakamoto Prep)',
  '2.5': 'Stacks 2.5 (Nakamoto)',
  '3.0': 'Stacks 3.0 (Nakamoto)',
} as const;

/**
 * API rate limits
 */
export const API_RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 50,
  REQUESTS_PER_HOUR: 500,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'stacks_wallet_address',
  NETWORK: 'stacks_network',
  LAST_TX_ID: 'stacks_last_tx_id',
  USER_DATA: 'stacks_user_data',
} as const;
