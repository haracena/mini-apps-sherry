'use client';

import { useState, useEffect } from 'react';
import { getTxExplorerUrl, waitForTransaction } from '@/lib/stacks-utils';

/**
 * Stacks Transaction Status Tracker
 *
 * Monitor and display transaction confirmation status
 */

interface TransactionStatusProps {
  txId: string;
  network?: 'mainnet' | 'testnet';
  onSuccess?: () => void;
  onError?: () => void;
  className?: string;
}

type TxStatus = 'pending' | 'success' | 'failed' | 'unknown';

export function StacksTransactionStatus({
  txId,
  network = 'testnet',
  onSuccess,
  onError,
  className = '',
}: TransactionStatusProps) {
  const [status, setStatus] = useState<TxStatus>('pending');
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    if (!txId) return;

    const checkStatus = async () => {
      try {
        const success = await waitForTransaction(txId, network, 1);

        if (success) {
          setStatus('success');
          setConfirmations(1);
          onSuccess?.();
        } else {
          // Keep checking if still pending
          setConfirmations((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Transaction check error:', error);
        setStatus('failed');
        onError?.();
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    // Stop after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === 'pending') {
        setStatus('unknown');
      }
    }, 300000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [txId, network, status, onSuccess, onError]);

  const statusConfig = {
    pending: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      icon: '⏳',
      label: 'Pending',
    },
    success: {
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      icon: '✅',
      label: 'Confirmed',
    },
    failed: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      icon: '❌',
      label: 'Failed',
    },
    unknown: {
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500/50',
      icon: '❓',
      label: 'Unknown',
    },
  };

  const config = statusConfig[status];
  const explorerUrl = getTxExplorerUrl(txId, network);

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}
    >
      {/* Status info */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <div className={`font-medium ${config.color}`}>{config.label}</div>
          <div className="text-xs text-gray-400 font-mono">
            {txId.slice(0, 8)}...{txId.slice(-8)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {status === 'pending' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span>Checking...</span>
          </div>
        )}

        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          View on Explorer
        </a>
      </div>
    </div>
  );
}

/**
 * Mini version for inline display
 */
export function StacksTransactionStatusMini({
  txId,
  network = 'testnet',
}: {
  txId: string;
  network?: 'mainnet' | 'testnet';
}) {
  const [status, setStatus] = useState<TxStatus>('pending');

  useEffect(() => {
    const checkStatus = async () => {
      const success = await waitForTransaction(txId, network, 1);
      setStatus(success ? 'success' : 'pending');
    };

    checkStatus();
  }, [txId, network]);

  const icons = {
    pending: '⏳',
    success: '✅',
    failed: '❌',
    unknown: '❓',
  };

  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span>{icons[status]}</span>
      <span className="font-mono">{txId.slice(0, 6)}...</span>
    </span>
  );
}
