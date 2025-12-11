'use client';

import { useState } from 'react';

/**
 * Network Selector Component
 *
 * Allows users to switch between Avalanche and Stacks blockchains
 */

export type NetworkType = 'avalanche' | 'stacks';

interface NetworkSelectorProps {
  currentNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
  className?: string;
}

export function NetworkSelector({
  currentNetwork,
  onNetworkChange,
  className = '',
}: NetworkSelectorProps) {
  const networks = [
    {
      id: 'avalanche' as NetworkType,
      name: 'Avalanche',
      icon: '🔺',
      color: 'bg-red-500',
    },
    {
      id: 'stacks' as NetworkType,
      name: 'Stacks',
      icon: '₿',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className={`inline-flex rounded-lg border border-gray-700 bg-gray-800 p-1 ${className}`}>
      {networks.map((network) => (
        <button
          key={network.id}
          onClick={() => onNetworkChange(network.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              currentNetwork === network.id
                ? `${network.color} text-white shadow-lg`
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }
          `}
        >
          <span className="text-lg">{network.icon}</span>
          <span>{network.name}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Hook to manage network selection
 */
export function useNetworkSelector() {
  const [network, setNetwork] = useState<NetworkType>('avalanche');

  return {
    network,
    setNetwork,
    isAvalanche: network === 'avalanche',
    isStacks: network === 'stacks',
  };
}
