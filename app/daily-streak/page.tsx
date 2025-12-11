"use client";

import { useState, useEffect } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { Wheel } from "@/components/Wheel";
import { StreakCounter } from "@/components/StreakCounter";
import { PointsDisplay } from "@/components/PointsDisplay";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Confetti } from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import { useDailyStreakStacks } from "@/hooks/useDailyStreakStacks";
import { useStacksWallet } from "@/hooks/useStacksWallet";
import { NetworkSelector, useNetworkSelector } from "@/components/NetworkSelector";
import { StacksTransactionStatus } from "@/components/StacksTransactionStatus";
import { calculateWinRotation } from "@/config/wheel-prizes";
import { DailyStreakABI } from "@/abi/DailyStreak";
import { CONTRACTS } from "@/config/contracts";
import { Loader2, Wallet } from "lucide-react";

export default function DailyStreakPage() {
  // Network selection
  const { network, setNetwork } = useNetworkSelector();
  const isAvalanche = network === "avalanche";
  const isStacks = network === "stacks";

  // Avalanche state
  const { isConnected: isAvalancheConnected, address: avalancheAddress } = useAccount();
  const {
    totalPoints: avalancheTotalPoints,
    currentStreak: avalancheCurrentStreak,
    canSpin: avalancheCanSpin,
    timeUntilNextSpin: avalancheTimeUntilNextSpin,
    hasActiveStreak: avalancheHasActiveStreak,
    spin: avalancheSpin,
    isSpinning: avalancheIsSpinning,
    transactionHash: avalancheTransactionHash,
    refetch: avalancheRefetch,
  } = useDailyStreak();

  // Stacks state
  const {
    address: stacksAddress,
    isConnected: isStacksConnected,
  } = useStacksWallet();

  const {
    totalPoints: stacksTotalPoints,
    currentStreak: stacksCurrentStreak,
    canSpin: stacksCanSpin,
    timeUntilNextSpin: stacksTimeUntilNextSpin,
    hasActiveStreak: stacksHasActiveStreak,
    spin: stacksSpin,
    isSpinning: stacksIsSpinning,
    transactionHash: stacksTransactionHash,
    refetch: stacksRefetch,
  } = useDailyStreakStacks();

  // Unified state based on selected network
  const isConnected = isAvalanche ? isAvalancheConnected : isStacksConnected;
  const address = isAvalanche ? avalancheAddress : stacksAddress;
  const totalPoints = isAvalanche ? avalancheTotalPoints : stacksTotalPoints;
  const currentStreak = isAvalanche ? avalancheCurrentStreak : stacksCurrentStreak;
  const canSpin = isAvalanche ? avalancheCanSpin : stacksCanSpin;
  const timeUntilNextSpin = isAvalanche ? avalancheTimeUntilNextSpin : stacksTimeUntilNextSpin;
  const hasActiveStreak = isAvalanche ? avalancheHasActiveStreak : stacksHasActiveStreak;
  const isSpinning = isAvalanche ? avalancheIsSpinning : stacksIsSpinning;
  const transactionHash = isAvalanche ? avalancheTransactionHash : stacksTransactionHash;

  const [rotation, setRotation] = useState(0);
  const [wonPoints, setWonPoints] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Watch for SpinCompleted event (Avalanche only)
  useWatchContractEvent({
    address: CONTRACTS.DAILY_STREAK,
    abi: DailyStreakABI,
    eventName: "SpinCompleted",
    enabled: isAvalanche,
    onLogs(logs) {
      logs.forEach((log) => {
        if (log.args.player?.toLowerCase() === avalancheAddress?.toLowerCase()) {
          const points = Number(log.args.points);
          simulateWin(points);
        }
      });
    },
  });

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    try {
      if (isAvalanche) {
        await avalancheSpin();
        // Refetch data after spin
        setTimeout(() => {
          avalancheRefetch();
        }, 2000);
      } else {
        await stacksSpin();
        // Refetch data after spin
        setTimeout(() => {
          stacksRefetch();
        }, 2000);
      }
    } catch (error) {
      console.error("Spin failed:", error);
    }
  };

  // Simulate winning animation when transaction is confirmed
  const simulateWin = (points: number) => {
    const targetRotation = calculateWinRotation(points);
    setRotation(targetRotation);
    setWonPoints(points);
    setShowConfetti(true);

    setTimeout(() => {
      setWonPoints(null);
    }, 5000);
  };

  if (!isConnected) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Daily Streak Wheel</h1>
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to play the daily streak wheel
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Daily Streak Wheel</h1>
          <p className="text-muted-foreground">
            Spin once every 24 hours to earn points and build your streak!
          </p>

          {/* Network Selector */}
          <div className="flex justify-center">
            <NetworkSelector />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StreakCounter streak={currentStreak} isActive={hasActiveStreak} />
          <PointsDisplay points={totalPoints} animated={wonPoints !== null} />
        </div>

        {/* Wheel Section */}
        <div className="flex flex-col items-center gap-6">
          <Wheel rotation={rotation} isSpinning={isSpinning} />

          {/* Countdown or Spin Button */}
          {!canSpin && timeUntilNextSpin > BigInt(0) && (
            <CountdownTimer
              seconds={timeUntilNextSpin}
              onComplete={isAvalanche ? avalancheRefetch : stacksRefetch}
            />
          )}

          {canSpin && (
            <Button
              size="lg"
              onClick={handleSpin}
              disabled={isSpinning}
              className="px-12 py-6 text-lg font-semibold"
            >
              {isSpinning ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Spinning...
                </>
              ) : (
                "Spin Now!"
              )}
            </Button>
          )}

          {/* Transaction Info */}
          {isAvalanche && transactionHash && (
            <Alert className="max-w-md">
              <AlertDescription className="text-xs">
                Transaction: {transactionHash.slice(0, 10)}...
                {transactionHash.slice(-8)}
              </AlertDescription>
            </Alert>
          )}

          {/* Stacks Transaction Status */}
          {isStacks && transactionHash && (
            <StacksTransactionStatus txId={transactionHash} />
          )}
        </div>

        {/* Win Notification */}
        {wonPoints !== null && (
          <Alert className="max-w-md mx-auto bg-green-500/10 border-green-500">
            <AlertDescription className="text-center text-lg font-bold text-green-500">
              🎉 You won {wonPoints} points!
            </AlertDescription>
          </Alert>
        )}

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Spin the wheel once every 24 hours (resets at 12:00 UTC)</li>
            <li>• Win between 10-150 points per spin</li>
            <li>• Build your streak by playing consecutive days</li>
            <li>• Missing a day will reset your streak to 0</li>
            <li>• Points and streaks are stored on-chain</li>
            <li>
              • Multi-chain support: Play on{" "}
              <span className="font-semibold text-foreground">Avalanche</span> or{" "}
              <span className="font-semibold text-foreground">Stacks</span>
            </li>
            {isStacks && (
              <li>
                • Stacks blockchain: Data secured by Bitcoin, powered by Clarity smart contracts
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Confetti */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
