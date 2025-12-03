"use client";

import { Coins } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PointsDisplayProps {
  points: bigint;
  animated?: boolean;
}

export function PointsDisplay({ points, animated = false }: PointsDisplayProps) {
  const pointsNumber = Number(points);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
          <Coins className={`w-6 h-6 ${animated ? "animate-bounce" : ""}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-3xl font-bold text-yellow-500">
            {pointsNumber.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Rank</p>
            <p className="font-semibold">
              {pointsNumber >= 1000
                ? "Gold"
                : pointsNumber >= 500
                ? "Silver"
                : pointsNumber >= 100
                ? "Bronze"
                : "Beginner"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Tier</p>
            <p className="font-semibold">
              {pointsNumber >= 1000
                ? "Max"
                : pointsNumber >= 500
                ? `${1000 - pointsNumber}`
                : pointsNumber >= 100
                ? `${500 - pointsNumber}`
                : `${100 - pointsNumber}`}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Progress</p>
            <p className="font-semibold">
              {pointsNumber >= 1000
                ? "100%"
                : pointsNumber >= 500
                ? `${Math.round((pointsNumber / 1000) * 100)}%`
                : pointsNumber >= 100
                ? `${Math.round((pointsNumber / 500) * 100)}%`
                : `${Math.round((pointsNumber / 100) * 100)}%`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
