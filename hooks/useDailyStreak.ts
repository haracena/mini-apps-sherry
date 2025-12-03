import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DailyStreakABI } from '@/abi/DailyStreak';
import { CONTRACTS } from '@/config/contracts';
import type { PlayerData, SpinResult } from '@/types';
import { toastError, toastSuccess } from '@/lib/toast-helpers';
import { parseWeb3Error } from '@/lib/web3-errors';

/**
 * Hook for interacting with DailyStreak contract
 */
export function useDailyStreak() {
  const { address, isConnected } = useAccount();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);

  // Read player data
  const { data: playerData, refetch: refetchPlayerData } = useReadContract({
    address: CONTRACTS.DAILY_STREAK,
    abi: DailyStreakABI,
    functionName: 'getPlayerData',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Check if can spin
  const { data: canSpinData, refetch: refetchCanSpin } = useReadContract({
    address: CONTRACTS.DAILY_STREAK,
    abi: DailyStreakABI,
    functionName: 'canSpin',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Time until next spin
  const { data: timeUntilNextSpin, refetch: refetchTimeUntilNextSpin } = useReadContract({
    address: CONTRACTS.DAILY_STREAK,
    abi: DailyStreakABI,
    functionName: 'timeUntilNextSpin',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Has active streak
  const { data: hasActiveStreak } = useReadContract({
    address: CONTRACTS.DAILY_STREAK,
    abi: DailyStreakABI,
    functionName: 'hasActiveStreak',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Write contract - spin
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Handle spin
  const spin = async () => {
    if (!address || !isConnected) {
      toastError('Please connect your wallet first');
      return;
    }

    if (!canSpinData) {
      toastError('You have already spun today');
      return;
    }

    try {
      setIsSpinning(true);
      setSpinResult(null);

      writeContract({
        address: CONTRACTS.DAILY_STREAK,
        abi: DailyStreakABI,
        functionName: 'spin',
      });
    } catch (error) {
      const message = parseWeb3Error(error);
      toastError(message);
      setIsSpinning(false);
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      // Refetch all data
      refetchPlayerData();
      refetchCanSpin();
      refetchTimeUntilNextSpin();

      toastSuccess('Spin successful!');
      setIsSpinning(false);
    }
  }, [isConfirmed, hash, refetchPlayerData, refetchCanSpin, refetchTimeUntilNextSpin]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      const message = parseWeb3Error(writeError);
      toastError(message);
      setIsSpinning(false);
    }
  }, [writeError]);

  // Parse player data
  const parsedPlayerData: PlayerData | null = playerData
    ? {
        totalPoints: playerData[0],
        currentStreak: playerData[1],
        lastSpinDay: playerData[2],
        lastSpinTimestamp: playerData[3],
      }
    : null;

  return {
    // Player data
    playerData: parsedPlayerData,
    totalPoints: parsedPlayerData?.totalPoints || BigInt(0),
    currentStreak: parsedPlayerData?.currentStreak || BigInt(0),
    lastSpinDay: parsedPlayerData?.lastSpinDay || BigInt(0),
    lastSpinTimestamp: parsedPlayerData?.lastSpinTimestamp || BigInt(0),

    // Spin state
    canSpin: canSpinData || false,
    timeUntilNextSpin: timeUntilNextSpin || BigInt(0),
    hasActiveStreak: hasActiveStreak || false,

    // Spin action
    spin,
    isSpinning: isSpinning || isWritePending || isConfirming,
    spinResult,

    // Transaction state
    transactionHash: hash,
    isConfirmed,

    // Refetch functions
    refetch: () => {
      refetchPlayerData();
      refetchCanSpin();
      refetchTimeUntilNextSpin();
    },
  };
}
