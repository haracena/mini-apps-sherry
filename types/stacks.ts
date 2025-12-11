/**
 * Stacks TypeScript Type Definitions
 *
 * Type definitions for Stacks blockchain integration
 */

// Network types
export type StacksNetwork = 'mainnet' | 'testnet';

// Player data structure from daily-streak.clar
export interface StacksPlayerData {
  points: number;
  'last-spin-day': number;
  'current-streak': number;
  'total-spins': number;
}

// Spin result from daily-streak.clar
export interface StacksSpinResult {
  prize: number;
  streak: number;
  'total-points': number;
}

// NFT metadata structure from nft-collection.clar
export interface StacksNFTMetadata {
  uri: string;
  name: string;
  'created-at': number;
}

// Transaction response
export interface StacksTransactionResponse {
  txId: string;
  error?: string;
}

// Contract call options
export interface StacksContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: StacksNetwork;
}

// Wallet connection state
export interface StacksWalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  userData: any;
  network: StacksNetwork;
}

// Contract addresses map
export interface StacksContractAddresses {
  dailyStreak: {
    testnet: string;
    mainnet: string;
  };
  nftCollection: {
    testnet: string;
    mainnet: string;
  };
}

// Clarity value types
export type ClarityValue =
  | { type: 'uint'; value: string }
  | { type: 'int'; value: string }
  | { type: 'bool'; value: boolean }
  | { type: 'principal'; value: string }
  | { type: 'buffer'; value: string }
  | { type: 'string-ascii'; value: string }
  | { type: 'string-utf8'; value: string }
  | { type: 'optional'; value: ClarityValue | null }
  | { type: 'response'; value: { ok: ClarityValue } | { error: ClarityValue } }
  | { type: 'list'; value: ClarityValue[] }
  | { type: 'tuple'; value: Record<string, ClarityValue> };

// Contract read result
export interface StacksReadResult<T = any> {
  success: boolean;
  data: T;
  error?: string;
}

// NFT token data
export interface StacksNFTToken {
  tokenId: number;
  owner: string;
  metadata: StacksNFTMetadata;
  uri: string;
}
