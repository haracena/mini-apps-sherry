import { StacksMainnet, StacksTestnet } from '@stacks/network';

/**
 * Stacks Network Configuration
 *
 * Manages network settings for Stacks blockchain integration
 */

export const STACKS_NETWORKS = {
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
} as const;

export type StacksNetworkType = keyof typeof STACKS_NETWORKS;

// Default network for development
export const DEFAULT_STACKS_NETWORK: StacksNetworkType =
  process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

/**
 * Stacks Contract Addresses
 *
 * NOTE: These are placeholder addresses. Update after deploying contracts.
 */
export const STACKS_CONTRACTS = {
  dailyStreak: {
    testnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.daily-streak',
    mainnet: '', // TODO: Deploy to mainnet
  },
  nftCollection: {
    testnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-collection',
    mainnet: '', // TODO: Deploy to mainnet
  },
} as const;

/**
 * Get contract address for current network
 */
export function getContractAddress(
  contractName: keyof typeof STACKS_CONTRACTS,
  network: StacksNetworkType = DEFAULT_STACKS_NETWORK
): string {
  return STACKS_CONTRACTS[contractName][network];
}

/**
 * Stacks Explorer URLs
 */
export const STACKS_EXPLORER = {
  mainnet: 'https://explorer.stacks.co',
  testnet: 'https://explorer.hiro.so',
} as const;

/**
 * Get explorer URL for transaction or address
 */
export function getExplorerUrl(
  type: 'tx' | 'address' | 'contract',
  value: string,
  network: StacksNetworkType = DEFAULT_STACKS_NETWORK
): string {
  const baseUrl = STACKS_EXPLORER[network];
  return `${baseUrl}/${type}/${value}?chain=${network}`;
}

/**
 * App Configuration
 */
export const STACKS_APP_CONFIG = {
  name: 'Social Triggers',
  icon: '/icon.png',
  network: DEFAULT_STACKS_NETWORK,
} as const;
