"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Wheel } from "@/components/Wheel";
import { StreakCounter } from "@/components/StreakCounter";
import { PointsDisplay } from "@/components/PointsDisplay";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import { calculateWinRotation } from "@/config/wheel-prizes";
import { Loader2, Wallet } from "lucide-react";

export default function DailyStreakPage() {
  const { isConnected } = useAccount();
  const {
    totalPoints,
    currentStreak,
    canSpin,
    timeUntilNextSpin,
    hasActiveStreak,
    spin,
    isSpinning,
    transactionHash,
    refetch,
  } = useDailyStreak();

  const [rotation, setRotation] = useState(0);
  const [wonPoints, setWonPoints] = useState<number | null>(null);

  const handleSpin = async () => {
    if (!canSpin || isSpinning) return;

    try {
      await spin();

      // Refetch data after spin
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Spin failed:", error);
    }
  };

  // Simulate winning animation when transaction is confirmed
  const simulateWin = (points: number) => {
    const targetRotation = calculateWinRotation(points);
    setRotation(targetRotation);
    setWonPoints(points);

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
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Daily Streak Wheel</h1>
          <p className="text-muted-foreground">
            Spin once every 24 hours to earn points and build your streak!
          </p>
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
            <CountdownTimer seconds={timeUntilNextSpin} onComplete={refetch} />
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
          {transactionHash && (
            <Alert className="max-w-md">
              <AlertDescription className="text-xs">
                Transaction: {transactionHash.slice(0, 10)}...
                {transactionHash.slice(-8)}
              </AlertDescription>
            </Alert>
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
          </ul>
        </div>
      </div>
    </div>
  );
}
