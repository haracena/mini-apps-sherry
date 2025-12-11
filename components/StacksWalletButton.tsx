'use client';

import { useStacksWallet } from '@/hooks/useStacksWallet';

/**
 * Stacks Wallet Button Component
 *
 * Button to connect/disconnect Stacks wallets (Leather, Xverse, etc.)
 */

interface StacksWalletButtonProps {
  className?: string;
}

export function StacksWalletButton({ className = '' }: StacksWalletButtonProps) {
  const { address, isConnected, isLoading, connect, disconnect } = useStacksWallet();

  if (isLoading) {
    return (
      <button
        disabled
        className={`px-4 py-2 rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed ${className}`}
      >
        Loading...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 font-mono text-sm">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className={`px-6 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors ${className}`}
    >
      ₿ Connect Stacks Wallet
    </button>
  );
}
