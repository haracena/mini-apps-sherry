"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utc-helpers";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  seconds: bigint;
  onComplete?: () => void;
}

export function CountdownTimer({ seconds, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(Number(seconds));

  useEffect(() => {
    setTimeLeft(Number(seconds));
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) {
          onComplete?.();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  if (timeLeft <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
      <Clock className="w-4 h-4" />
      <span>Next spin available in: {formatCountdown(timeLeft)}</span>
    </div>
  );
}
