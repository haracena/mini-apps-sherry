/**
 * Stacks Helper Functions
 * Utility functions for working with Stacks blockchain data
 */

/**
 * Format Stacks address for display
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (!address) return "";
  if (address.length <= chars * 2) return address;

  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format transaction ID for display
 */
export function formatTxId(txId: string, chars: number = 8): string {
  if (!txId) return "";
  // Remove 0x prefix if present
  const cleanTxId = txId.startsWith("0x") ? txId.slice(2) : txId;
  if (cleanTxId.length <= chars * 2) return cleanTxId;

  return `0x${cleanTxId.slice(0, chars)}...${cleanTxId.slice(-chars)}`;
}

/**
 * Convert microSTX to STX
 */
export function microStxToStx(microStx: number | string | bigint): number {
  const amount = typeof microStx === "bigint" ? Number(microStx) : Number(microStx);
  return amount / 1_000_000;
}

/**
 * Convert STX to microSTX
 */
export function stxToMicroStx(stx: number | string): bigint {
  const amount = typeof stx === "string" ? parseFloat(stx) : stx;
  return BigInt(Math.floor(amount * 1_000_000));
}

/**
 * Format STX amount with proper decimals
 */
export function formatStx(microStx: number | string | bigint, decimals: number = 6): string {
  const stx = microStxToStx(microStx);
  return stx.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format STX with currency symbol
 */
export function formatStxWithSymbol(microStx: number | string | bigint): string {
  return `${formatStx(microStx)} STX`;
}

/**
 * Get network from address prefix
 */
export function getNetworkFromAddress(address: string): "mainnet" | "testnet" | "unknown" {
  if (address.startsWith("SP")) return "mainnet";
  if (address.startsWith("ST")) return "testnet";
  return "unknown";
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerTxUrl(txId: string, network: "mainnet" | "testnet" = "testnet"): string {
  return `https://explorer.stacks.co/txid/${txId}?chain=${network}`;
}

/**
 * Get explorer URL for address
 */
export function getExplorerAddressUrl(
  address: string,
  network: "mainnet" | "testnet" = "testnet"
): string {
  return `https://explorer.stacks.co/address/${address}?chain=${network}`;
}

/**
 * Get explorer URL for contract
 */
export function getExplorerContractUrl(
  contractId: string,
  network: "mainnet" | "testnet" = "testnet"
): string {
  return `https://explorer.stacks.co/txid/${contractId}?chain=${network}`;
}

/**
 * Parse contract identifier
 */
export function parseContractId(contractId: string): {
  address: string;
  contractName: string;
} | null {
  const parts = contractId.split(".");
  if (parts.length !== 2) return null;

  return {
    address: parts[0],
    contractName: parts[1],
  };
}

/**
 * Format contract identifier
 */
export function formatContractId(address: string, contractName: string): string {
  return `${address}.${contractName}`;
}

/**
 * Calculate time until next block (approximate)
 */
export function timeToNextBlock(currentBlockHeight: number, targetBlockHeight: number): number {
  const blocksRemaining = targetBlockHeight - currentBlockHeight;
  const avgBlockTime = 600; // 10 minutes in seconds
  return blocksRemaining * avgBlockTime * 1000; // Convert to milliseconds
}

/**
 * Format block height with commas
 */
export function formatBlockHeight(height: number | string): string {
  return Number(height).toLocaleString();
}

/**
 * Get transaction status color
 */
export function getTxStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "success":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "failed":
    case "abort_by_response":
    case "abort_by_post_condition":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Get transaction status label
 */
export function getTxStatusLabel(status: string): string {
  switch (status.toLowerCase()) {
    case "success":
      return "Confirmed";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    case "abort_by_response":
      return "Aborted (Response)";
    case "abort_by_post_condition":
      return "Aborted (Post Condition)";
    default:
      return status;
  }
}

/**
 * Calculate transaction fee in STX
 */
export function calculateFeeInStx(feeRate: string | number): number {
  return microStxToStx(feeRate);
}

/**
 * Format timestamp to human readable
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

/**
 * Get relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Check if running on testnet
 */
export function isTestnet(network?: string): boolean {
  return network === "testnet" || process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet";
}

/**
 * Check if running on mainnet
 */
export function isMainnet(network?: string): boolean {
  return network === "mainnet" || process.env.NEXT_PUBLIC_STACKS_NETWORK === "mainnet";
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTx(
  txId: string,
  checkInterval: number = 5000,
  timeout: number = 300000
): Promise<boolean> {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        // TODO: Implement actual transaction status check
        // For now, just timeout
        if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error("Transaction confirmation timeout"));
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, checkInterval);
  });
}
