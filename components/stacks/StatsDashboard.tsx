"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, Award, DollarSign, Activity } from "lucide-react";

interface Stats {
  totalPoints: number;
  totalSpins: number;
  activeUsers: number;
  totalNFTsMinted: number;
  stxPrice: number;
  blockHeight: number;
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    totalSpins: 0,
    activeUsers: 0,
    totalNFTsMinted: 0,
    stxPrice: 0,
    blockHeight: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);

      try {
        // TODO: Fetch actual stats from Stacks API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setStats({
          totalPoints: 0,
          totalSpins: 0,
          activeUsers: 0,
          totalNFTsMinted: 0,
          stxPrice: 0,
          blockHeight: 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Points",
      value: stats.totalPoints.toLocaleString(),
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Spins",
      value: stats.totalSpins.toLocaleString(),
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "NFTs Minted",
      value: stats.totalNFTsMinted.toLocaleString(),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "STX Price",
      value: stats.stxPrice > 0 ? `$${stats.stxPrice.toFixed(2)}` : "-",
      icon: DollarSign,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Block Height",
      value: stats.blockHeight.toLocaleString(),
      icon: Activity,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              {isLoading ? (
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold">{stat.value}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
