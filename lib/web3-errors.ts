/**
 * Web3 error handling utilities
 * Provides specialized error parsing and user-friendly messages for Web3 operations
 */

import { WalletError, ErrorCode } from './errors';

/**
 * Common Web3 error patterns and their user-friendly messages
 */
const WEB3_ERROR_PATTERNS = {
  USER_REJECTED: /user rejected|user denied|rejected by user|user cancelled/i,
  INSUFFICIENT_FUNDS: /insufficient funds|insufficient balance|exceeds balance/i,
  NETWORK_ERROR: /network|connection|failed to fetch/i,
  INVALID_ADDRESS: /invalid address|address is invalid/i,
  INVALID_PARAMS: /invalid parameters|invalid params|missing parameter/i,
  GAS_ESTIMATION: /gas estimation|cannot estimate gas|gas required exceeds/i,
  NONCE_TOO_LOW: /nonce too low|nonce has already been used/i,
  REPLACEMENT_UNDERPRICED: /replacement transaction underpriced|transaction underpriced/i,
  TIMEOUT: /timeout|timed out/i,
  UNPREDICTABLE_GAS: /unpredictable gas limit|cannot estimate gas/i,
} as const;

/**
 * User-friendly error messages for common Web3 errors
 */
const ERROR_MESSAGES = {
  USER_REJECTED: 'Transaction was rejected. Please try again.',
  INSUFFICIENT_FUNDS: 'Insufficient funds to complete this transaction.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_ADDRESS: 'Invalid wallet address provided.',
  INVALID_PARAMS: 'Invalid transaction parameters.',
  GAS_ESTIMATION: 'Unable to estimate gas for this transaction. Please check the transaction details.',
  NONCE_TOO_LOW: 'Transaction nonce too low. Please refresh and try again.',
  REPLACEMENT_UNDERPRICED: 'Transaction replacement underpriced. Please increase gas price.',
  TIMEOUT: 'Transaction timed out. Please try again.',
  UNPREDICTABLE_GAS: 'Cannot predict gas usage. The transaction may fail.',
  WRONG_NETWORK: 'Please switch to the correct network.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet first.',
  GENERIC: 'Transaction failed. Please try again.',
} as const;

/**
 * Parses Web3 error and returns user-friendly message
 * @param error - Error object from Web3 operation
 * @returns User-friendly error message
 */
export function parseWeb3Error(error: unknown): string {
  const errorMessage = getErrorMessage(error);

  for (const [pattern, message] of Object.entries(WEB3_ERROR_PATTERNS)) {
    if (message.test(errorMessage)) {
      return ERROR_MESSAGES[pattern as keyof typeof ERROR_MESSAGES];
    }
  }

  return ERROR_MESSAGES.GENERIC;
}

/**
 * Extracts error message from various error formats
 */
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    if (err.message) return String(err.message);
    if (err.reason) return String(err.reason);
    if (err.data?.message) return String(err.data.message);
    if (err.error?.message) return String(err.error.message);
  }

  return 'Unknown error occurred';
}

/**
 * Checks if error is a user rejection
 * @param error - Error to check
 * @returns true if error is user rejection
 */
export function isUserRejection(error: unknown): boolean {
  const message = getErrorMessage(error);
  return WEB3_ERROR_PATTERNS.USER_REJECTED.test(message);
}

/**
 * Checks if error is insufficient funds
 * @param error - Error to check
 * @returns true if error is insufficient funds
 */
export function isInsufficientFunds(error: unknown): boolean {
  const message = getErrorMessage(error);
  return WEB3_ERROR_PATTERNS.INSUFFICIENT_FUNDS.test(message);
}

/**
 * Checks if error is network-related
 * @param error - Error to check
 * @returns true if error is network error
 */
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error);
  return WEB3_ERROR_PATTERNS.NETWORK_ERROR.test(message);
}

/**
 * Creates a WalletError from Web3 error
 * @param error - Original error
 * @returns Typed WalletError
 */
export function toWalletError(error: unknown): WalletError {
  const message = getErrorMessage(error);

  if (WEB3_ERROR_PATTERNS.USER_REJECTED.test(message)) {
    return new WalletError(
      ERROR_MESSAGES.USER_REJECTED,
      ErrorCode.WALLET_NOT_CONNECTED,
      { originalError: message }
    );
  }

  if (WEB3_ERROR_PATTERNS.INSUFFICIENT_FUNDS.test(message)) {
    return new WalletError(
      ERROR_MESSAGES.INSUFFICIENT_FUNDS,
      ErrorCode.INSUFFICIENT_FUNDS,
      { originalError: message }
    );
  }

  if (WEB3_ERROR_PATTERNS.NETWORK_ERROR.test(message)) {
    return new WalletError(
      ERROR_MESSAGES.NETWORK_ERROR,
      ErrorCode.WALLET_NOT_CONNECTED,
      { originalError: message }
    );
  }

  if (WEB3_ERROR_PATTERNS.UNPREDICTABLE_GAS.test(message) ||
      WEB3_ERROR_PATTERNS.GAS_ESTIMATION.test(message)) {
    return new WalletError(
      ERROR_MESSAGES.UNPREDICTABLE_GAS,
      ErrorCode.TRANSACTION_FAILED,
      { originalError: message }
    );
  }

  return new WalletError(
    parseWeb3Error(error),
    ErrorCode.TRANSACTION_FAILED,
    { originalError: message }
  );
}

/**
 * Formats transaction hash for display
 * @param hash - Transaction hash
 * @param explorerUrl - Block explorer base URL
 * @returns Formatted transaction URL
 */
export function getTransactionUrl(hash: string, explorerUrl: string = 'https://snowtrace.io'): string {
  return `${explorerUrl}/tx/${hash}`;
}

/**
 * Formats address for display (shortened)
 * @param address - Ethereum address
 * @param startChars - Characters to show at start (default: 6)
 * @param endChars - Characters to show at end (default: 4)
 * @returns Formatted address
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Validates Ethereum address format
 * @param address - Address to validate
 * @returns true if address is valid format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates transaction hash format
 * @param hash - Hash to validate
 * @returns true if hash is valid format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Extracts revert reason from error
 * @param error - Error object
 * @returns Revert reason or null
 */
export function extractRevertReason(error: unknown): string | null {
  const errorObj = error as any;

  if (errorObj?.data?.message) {
    return errorObj.data.message;
  }

  if (errorObj?.error?.data?.message) {
    return errorObj.error.data.message;
  }

  if (errorObj?.reason) {
    return errorObj.reason;
  }

  const message = getErrorMessage(error);
  const revertMatch = message.match(/reverted with reason string ['"](.+?)['"]/);

  if (revertMatch) {
    return revertMatch[1];
  }

  return null;
}

/**
 * Checks if error is due to wrong network
 * @param error - Error to check
 * @param expectedChainId - Expected chain ID
 * @returns true if wrong network error
 */
export function isWrongNetwork(error: unknown, expectedChainId?: number): boolean {
  const message = getErrorMessage(error);

  if (message.toLowerCase().includes('wrong network') ||
      message.toLowerCase().includes('unsupported chain')) {
    return true;
  }

  if (expectedChainId && message.includes(`chain id ${expectedChainId}`)) {
    return false;
  }

  return message.toLowerCase().includes('chain id');
}
