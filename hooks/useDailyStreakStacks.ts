'use client';

import { useState, useCallback } from 'react';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
} from '@stacks/transactions';
import { useStacksWallet } from './useStacksWallet';
import { getContractAddress } from '@/config/stacks';

/**
 * Daily Streak Stacks Hook
 *
 * Interacts with daily-streak.clar contract using @stacks/transactions
 */

export function useDailyStreakStacks() {
  const { address, isConnected, userSession, getNetwork } = useStacksWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Call spin function on contract
   */
  const spin = useCallback(async () => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsSpinning(true);
      setError(null);

      const network = getNetwork();
      const contractAddress = getContractAddress('dailyStreak');
      const [contractAddr, contractName] = contractAddress.split('.');

      const txOptions = {
        contractAddress: contractAddr,
        contractName: contractName,
        functionName: 'spin',
        functionArgs: [],
        senderKey: userSession.loadUserData().appPrivateKey,
        network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const result = await broadcastTransaction(transaction, network);

      setIsSpinning(false);
      return result;
    } catch (err: any) {
      console.error('Spin error:', err);
      setError(err.message || 'Failed to spin');
      setIsSpinning(false);
      return null;
    }
  }, [isConnected, address, userSession, getNetwork]);

  /**
   * Get player info from contract (read-only)
   */
  const getPlayerInfo = useCallback(
    async (playerAddress?: string) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('dailyStreak');
        const [contractAddr, contractName] = contractAddress.split('.');
        const targetAddress = playerAddress || address;

        if (!targetAddress) return null;

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'get-player-info',
          functionArgs: [standardPrincipalCV(targetAddress)],
          network,
          senderAddress: targetAddress,
        });

        return cvToJSON(result);
      } catch (err) {
        console.error('Get player info error:', err);
        return null;
      }
    },
    [address, getNetwork]
  );

  /**
   * Check if player can spin today (read-only)
   */
  const canSpinToday = useCallback(
    async (playerAddress?: string) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('dailyStreak');
        const [contractAddr, contractName] = contractAddress.split('.');
        const targetAddress = playerAddress || address;

        if (!targetAddress) return false;

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'can-spin-today',
          functionArgs: [standardPrincipalCV(targetAddress)],
          network,
          senderAddress: targetAddress,
        });

        return cvToJSON(result).value;
      } catch (err) {
        console.error('Can spin check error:', err);
        return false;
      }
    },
    [address, getNetwork]
  );

  /**
   * Get player streak (read-only)
   */
  const getStreak = useCallback(
    async (playerAddress?: string) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('dailyStreak');
        const [contractAddr, contractName] = contractAddress.split('.');
        const targetAddress = playerAddress || address;

        if (!targetAddress) return null;

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'get-streak',
          functionArgs: [standardPrincipalCV(targetAddress)],
          network,
          senderAddress: targetAddress,
        });

        return cvToJSON(result);
      } catch (err) {
        console.error('Get streak error:', err);
        return null;
      }
    },
    [address, getNetwork]
  );

  return {
    spin,
    getPlayerInfo,
    canSpinToday,
    getStreak,
    isSpinning,
    error,
    isConnected,
  };
}
