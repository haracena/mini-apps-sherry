"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, TrendingUp, Zap } from "lucide-react";

interface LeaderboardEntry {
  address: string;
  points: number;
  streak: number;
  totalSpins: number;
  rank: number;
}

interface LeaderboardProps {
  limit?: number;
  currentUserAddress?: string;
}

export function Leaderboard({ limit = 10, currentUserAddress }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);

      try {
        // TODO: Fetch actual leaderboard data from contract
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for demonstration
        const mockData: LeaderboardEntry[] = [];
        setEntries(mockData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-32 mb-2" />
                <div className="h-3 bg-muted rounded w-24" />
              </div>
              <div className="h-6 bg-muted rounded w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No leaderboard data available yet</p>
          <p className="text-sm mt-1">Be the first to start playing!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <Badge variant="secondary" className="ml-auto">
          Top {limit}
        </Badge>
      </div>

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.address}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              entry.address === currentUserAddress
                ? "bg-primary/10 border-2 border-primary"
                : "bg-muted/50 hover:bg-muted"
            }`}
          >
            {/* Rank */}
            <div className="w-8 flex items-center justify-center">{getRankIcon(entry.rank)}</div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarFallback>{entry.address.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-sm font-medium truncate">{formatAddress(entry.address)}</code>
                {entry.address === currentUserAddress && (
                  <Badge variant="default" className="text-xs">
                    You
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{entry.streak} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{entry.totalSpins} spins</span>
                </div>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="text-lg font-bold">{entry.points.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        ))}
      </div>

      {currentUserAddress && !entries.some((e) => e.address === currentUserAddress) && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground text-center">
          Your rank will appear here after your first spin
        </div>
      )}
    </Card>
  );
}
