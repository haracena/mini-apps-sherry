"use client";

import { Package, DollarSign, Clock, Award } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, iconColor }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 ${iconColor} rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-sm text-white/70">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white truncate">{value}</p>
    </div>
  );
}

interface StatsCardsProps {
  totalNFTs: number;
  totalValueSpent: string;
  mostRecentMint?: {
    name: string;
    tokenId: bigint;
    timestamp?: number;
  };
  rarestTrait?: {
    trait: string;
    count: number;
    total: number;
  };
}

export function StatsCards({
  totalNFTs,
  totalValueSpent,
  mostRecentMint,
  rarestTrait,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total NFTs */}
      <StatCard
        icon={Package}
        label="Total NFTs Owned"
        value={totalNFTs}
        iconColor="bg-purple-500/20 text-purple-400"
      />

      {/* Total Value Spent */}
      <StatCard
        icon={DollarSign}
        label="Total Value Spent"
        value={`${totalValueSpent} AVAX`}
        iconColor="bg-green-500/20 text-green-400"
      />

      {/* Most Recent Mint */}
      <StatCard
        icon={Clock}
        label="Most Recent Mint"
        value={mostRecentMint ? `#${mostRecentMint.tokenId.toString()}` : "N/A"}
        iconColor="bg-blue-500/20 text-blue-400"
      />

      {/* Rarest Trait */}
      <StatCard
        icon={Award}
        label="Rarest Attribute"
        value={
          rarestTrait
            ? `${rarestTrait.trait} (${rarestTrait.count})`
            : "No attributes"
        }
        iconColor="bg-yellow-500/20 text-yellow-400"
      />
    </div>
  );
}
