/**
 * Stacks-specific toast notification utilities
 */

import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

export interface StacksToastOptions {
  network?: "mainnet" | "testnet";
  duration?: number;
}

/**
 * Show transaction pending toast
 */
export function showTransactionPending(txId: string, options?: StacksToastOptions) {
  const network = options?.network || "testnet";

  return toast.loading("Transaction pending...", {
    description: `Transaction ID: ${txId.slice(0, 8)}...${txId.slice(-8)}`,
    duration: options?.duration || 10000,
    action: {
      label: "View",
      onClick: () => {
        window.open(`https://explorer.stacks.co/txid/${txId}?chain=${network}`, "_blank");
      },
    },
  });
}

/**
 * Show transaction success toast
 */
export function showTransactionSuccess(txId: string, message?: string, options?: StacksToastOptions) {
  const network = options?.network || "testnet";

  return toast.success(message || "Transaction confirmed!", {
    description: `View on explorer`,
    duration: options?.duration || 5000,
    action: {
      label: "View",
      onClick: () => {
        window.open(`https://explorer.stacks.co/txid/${txId}?chain=${network}`, "_blank");
      },
    },
  });
}

/**
 * Show transaction error toast
 */
export function showTransactionError(error: string | Error, txId?: string, options?: StacksToastOptions) {
  const network = options?.network || "testnet";
  const errorMessage = error instanceof Error ? error.message : error;

  return toast.error("Transaction failed", {
    description: errorMessage,
    duration: options?.duration || 7000,
    action: txId
      ? {
          label: "View",
          onClick: () => {
            window.open(`https://explorer.stacks.co/txid/${txId}?chain=${network}`, "_blank");
          },
        }
      : undefined,
  });
}

/**
 * Show wallet connection success
 */
export function showWalletConnected(address: string) {
  return toast.success("Wallet connected!", {
    description: `Address: ${address.slice(0, 8)}...${address.slice(-8)}`,
    duration: 3000,
  });
}

/**
 * Show wallet disconnection
 */
export function showWalletDisconnected() {
  return toast.info("Wallet disconnected", {
    duration: 2000,
  });
}

/**
 * Show contract call success
 */
export function showContractCallSuccess(functionName: string, txId: string, options?: StacksToastOptions) {
  const network = options?.network || "testnet";

  return toast.success(`${functionName} successful!`, {
    description: "Transaction confirmed on chain",
    duration: options?.duration || 5000,
    action: {
      label: "View",
      onClick: () => {
        window.open(`https://explorer.stacks.co/txid/${txId}?chain=${network}`, "_blank");
      },
    },
  });
}

/**
 * Show NFT minted success
 */
export function showNFTMinted(tokenId: number | string, txId: string, options?: StacksToastOptions) {
  const network = options?.network || "testnet";

  return toast.success("NFT minted successfully!", {
    description: `Token ID: #${tokenId}`,
    duration: options?.duration || 6000,
    action: {
      label: "View",
      onClick: () => {
        window.open(`https://explorer.stacks.co/txid/${txId}?chain=${network}`, "_blank");
      },
    },
  });
}

/**
 * Show network switch success
 */
export function showNetworkSwitched(network: "mainnet" | "testnet") {
  return toast.info(`Switched to ${network}`, {
    description: `Now using Stacks ${network}`,
    duration: 2000,
  });
}

/**
 * Show balance update
 */
export function showBalanceUpdated(balance: string, currency: string = "STX") {
  return toast.info("Balance updated", {
    description: `New balance: ${balance} ${currency}`,
    duration: 3000,
  });
}

/**
 * Show generic Stacks info
 */
export function showStacksInfo(title: string, message: string, duration?: number) {
  return toast.info(title, {
    description: message,
    duration: duration || 4000,
  });
}

/**
 * Show generic Stacks warning
 */
export function showStacksWarning(title: string, message: string, duration?: number) {
  return toast.warning(title, {
    description: message,
    duration: duration || 5000,
  });
}
