'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStacksWallet } from '@/hooks/useStacksWallet';
import { useDailyStreakStacks } from '@/hooks/useDailyStreakStacks';
import { useNFTMintStacks } from '@/hooks/useNFTMintStacks';

/**
 * Stacks Context Provider
 *
 * Centralized state management for Stacks blockchain interactions
 */

interface StacksContextValue {
  // Wallet
  wallet: ReturnType<typeof useStacksWallet>;

  // Daily Streak
  dailyStreak: ReturnType<typeof useDailyStreakStacks>;

  // NFT Minting
  nftMint: ReturnType<typeof useNFTMintStacks>;
}

const StacksContext = createContext<StacksContextValue | undefined>(undefined);

interface StacksProviderProps {
  children: ReactNode;
}

export function StacksProvider({ children }: StacksProviderProps) {
  const wallet = useStacksWallet();
  const dailyStreak = useDailyStreakStacks();
  const nftMint = useNFTMintStacks();

  const value: StacksContextValue = {
    wallet,
    dailyStreak,
    nftMint,
  };

  return (
    <StacksContext.Provider value={value}>
      {children}
    </StacksContext.Provider>
  );
}

/**
 * Hook to access Stacks context
 */
export function useStacks() {
  const context = useContext(StacksContext);

  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }

  return context;
}

/**
 * Hook for wallet only
 */
export function useStacksContext() {
  const { wallet } = useStacks();
  return wallet;
}
