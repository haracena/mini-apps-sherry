'use client';

import { useState, useEffect } from 'react';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

/**
 * Stacks Network Status Indicator
 *
 * Displays current network and connection status
 */

interface NetworkStatusProps {
  network?: 'mainnet' | 'testnet';
  className?: string;
}

export function StacksNetworkStatus({
  network = 'testnet',
  className = '',
}: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useEffect(() => {
    // Check network status
    const checkStatus = async () => {
      try {
        const networkObj =
          network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
        const url = `${networkObj.coreApiUrl}/v2/info`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setBlockHeight(data.stacks_tip_height);
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error('Network status check failed:', error);
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [network]);

  const networkConfig = {
    mainnet: {
      name: 'Mainnet',
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      icon: '🟠',
    },
    testnet: {
      name: 'Testnet',
      color: 'bg-blue-500',
      textColor: 'text-blue-400',
      icon: '🔵',
    },
  };

  const config = networkConfig[network];

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 ${className}`}
    >
      {/* Network indicator */}
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${config.color} ${
            isOnline ? 'animate-pulse' : 'opacity-50'
          }`}
        />
        <span className="text-sm font-medium text-gray-300">
          {config.name}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-gray-700" />

      {/* Block height */}
      {blockHeight && (
        <span className="text-xs text-gray-400">Block: {blockHeight}</span>
      )}

      {/* Offline indicator */}
      {!isOnline && (
        <span className="text-xs text-red-400">● Offline</span>
      )}
    </div>
  );
}
