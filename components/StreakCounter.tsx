"use client";

import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StreakCounterProps {
  streak: bigint;
  isActive: boolean;
}

export function StreakCounter({ streak, isActive }: StreakCounterProps) {
  const streakNumber = Number(streak);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-full ${
              isActive
                ? "bg-orange-500/10 text-orange-500"
                : "bg-gray-500/10 text-gray-500"
            }`}
          >
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-3xl font-bold">{streakNumber}</p>
          </div>
        </div>

        {isActive && streakNumber > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center gap-1 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
        )}

        {!isActive && streakNumber > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center gap-1 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-sm font-medium">Lost</span>
            </div>
          </div>
        )}
      </div>

      {streakNumber >= 7 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {streakNumber >= 30
              ? "🔥 Legendary streak! Keep it up!"
              : streakNumber >= 14
              ? "⭐ Amazing consistency!"
              : "✨ Great progress!"}
          </p>
        </div>
      )}
    </Card>
  );
}
