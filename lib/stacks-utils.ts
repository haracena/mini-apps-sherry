/**
 * Stacks Utility Functions
 *
 * Helper functions for Stacks blockchain operations
 */

import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { principalCV, cvToJSON } from '@stacks/transactions';

/**
 * Convert microSTX to STX
 */
export function microStxToStx(microStx: number | string): number {
  const amount = typeof microStx === 'string' ? parseInt(microStx) : microStx;
  return amount / 1_000_000;
}

/**
 * Convert STX to microSTX
 */
export function stxToMicroStx(stx: number): number {
  return Math.floor(stx * 1_000_000);
}

/**
 * Format STX amount with symbol
 */
export function formatStx(microStx: number | string, decimals = 2): string {
  const stx = microStxToStx(microStx);
  return `${stx.toFixed(decimals)} STX`;
}

/**
 * Shorten Stacks address
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Validate Stacks address format
 */
export function isValidStacksAddress(address: string): boolean {
  // Mainnet addresses start with SP
  // Testnet addresses start with ST
  const regex = /^(SP|ST)[0-9A-Z]{38,41}$/;
  return regex.test(address);
}

/**
 * Get network from address prefix
 */
export function getNetworkFromAddress(
  address: string
): 'mainnet' | 'testnet' | 'unknown' {
  if (address.startsWith('SP')) return 'mainnet';
  if (address.startsWith('ST')) return 'testnet';
  return 'unknown';
}

/**
 * Get network object
 */
export function getNetwork(network: 'mainnet' | 'testnet') {
  return network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
}

/**
 * Get explorer URL for transaction
 */
export function getTxExplorerUrl(
  txId: string,
  network: 'mainnet' | 'testnet'
): string {
  const baseUrl =
    network === 'mainnet'
      ? 'https://explorer.stacks.co'
      : 'https://explorer.hiro.so';
  return `${baseUrl}/txid/${txId}?chain=${network}`;
}

/**
 * Get explorer URL for address
 */
export function getAddressExplorerUrl(
  address: string,
  network: 'mainnet' | 'testnet'
): string {
  const baseUrl =
    network === 'mainnet'
      ? 'https://explorer.stacks.co'
      : 'https://explorer.hiro.so';
  return `${baseUrl}/address/${address}?chain=${network}`;
}

/**
 * Get explorer URL for contract
 */
export function getContractExplorerUrl(
  contractId: string,
  network: 'mainnet' | 'testnet'
): string {
  const baseUrl =
    network === 'mainnet'
      ? 'https://explorer.stacks.co'
      : 'https://explorer.hiro.so';
  return `${baseUrl}/txid/${contractId}?chain=${network}`;
}

/**
 * Parse contract ID
 */
export function parseContractId(contractId: string): {
  address: string;
  name: string;
} | null {
  const parts = contractId.split('.');
  if (parts.length !== 2) return null;

  return {
    address: parts[0],
    name: parts[1],
  };
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
  txId: string,
  network: 'mainnet' | 'testnet',
  maxAttempts = 30
): Promise<boolean> {
  const networkObj = getNetwork(network);
  const url = `${networkObj.coreApiUrl}/extended/v1/tx/${txId}`;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.tx_status === 'success') {
          return true;
        }
        if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          return false;
        }
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
    }

    // Wait 2 seconds before next attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return false;
}

/**
 * Get current block height
 */
export async function getCurrentBlockHeight(
  network: 'mainnet' | 'testnet'
): Promise<number | null> {
  try {
    const networkObj = getNetwork(network);
    const url = `${networkObj.coreApiUrl}/v2/info`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.stacks_tip_height;
    }
  } catch (error) {
    console.error('Error fetching block height:', error);
  }

  return null;
}

/**
 * Format block time to human readable
 */
export function formatBlockTime(blockHeight: number): string {
  // Stacks blocks are ~10 minutes
  const minutes = blockHeight * 10;
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ago`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
  return `${minutes}m ago`;
}

/**
 * Convert Clarity value to JSON
 */
export function clarityValueToJson(cv: any): any {
  return cvToJSON(cv);
}

/**
 * Check if transaction is pending
 */
export async function isTransactionPending(
  txId: string,
  network: 'mainnet' | 'testnet'
): Promise<boolean> {
  try {
    const networkObj = getNetwork(network);
    const url = `${networkObj.coreApiUrl}/extended/v1/tx/${txId}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.tx_status === 'pending';
    }
  } catch (error) {
    console.error('Error checking transaction status:', error);
  }

  return false;
}
