'use client';

import { useState, useEffect } from 'react';
import { formatStx, getNetwork } from '@/lib/stacks-utils';

/**
 * Stacks Balance Display Component
 *
 * Shows STX balance for connected wallet
 */

interface StacksBalanceProps {
  address: string;
  network?: 'mainnet' | 'testnet';
  showSymbol?: boolean;
  className?: string;
}

export function StacksBalance({
  address,
  network = 'testnet',
  showSymbol = true,
  className = '',
}: StacksBalanceProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const networkObj = getNetwork(network);
        const url = `${networkObj.coreApiUrl}/v2/accounts/${address}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch balance');
        }

        const data = await response.json();
        const microStx = data.balance;

        setBalance(formatStx(microStx, 6));
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error fetching balance:', err);
        setError(err.message || 'Failed to fetch balance');
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [address, network]);

  if (!address) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-400 ${className}`}>
        Error loading balance
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 ${className}`}
    >
      {showSymbol && (
        <span className="text-orange-400 font-bold">₿</span>
      )}
      <span className="font-mono text-sm font-medium text-orange-300">
        {balance}
      </span>
    </div>
  );
}

/**
 * Compact balance display
 */
export function StacksBalanceMini({
  address,
  network = 'testnet',
}: {
  address: string;
  network?: 'mainnet' | 'testnet';
}) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      try {
        const networkObj = getNetwork(network);
        const url = `${networkObj.coreApiUrl}/v2/accounts/${address}`;
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance / 1_000_000); // Convert to STX
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [address, network]);

  if (balance === null) return null;

  return (
    <span className="text-xs font-mono text-gray-400">
      {balance.toFixed(2)} STX
    </span>
  );
}
