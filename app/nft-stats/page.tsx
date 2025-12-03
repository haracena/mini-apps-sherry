"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import { Wallet, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatsCards } from "@/components/nft/StatsCards";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import { fetchFromIPFS } from "@/utils/ipfs";
import type { NFTMetadata } from "@/types";

interface NFTWithMetadata {
  tokenId: bigint;
  metadata: NFTMetadata | null;
}

export default function NFTStatsPage() {
  const { address, isConnected } = useAccount();
  const [nftMetadata, setNftMetadata] = useState<NFTWithMetadata[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const { data: tokenIds, isLoading } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const { data: mintPrice } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "mintPrice",
  });

  // Fetch metadata for all NFTs
  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) {
      setNftMetadata([]);
      return;
    }

    const fetchAllMetadata = async () => {
      setIsLoadingMetadata(true);
      const metadataPromises = tokenIds.map(async (tokenId) => {
        try {
          const response = await fetch(
            `/api/nft/token-uri?tokenId=${tokenId.toString()}`
          );
          if (!response.ok) throw new Error("Failed to fetch token URI");

          const { tokenURI } = await response.json();
          const metadata = await fetchFromIPFS<NFTMetadata>(tokenURI);

          return { tokenId, metadata };
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error);
          return { tokenId, metadata: null };
        }
      });

      const results = await Promise.all(metadataPromises);
      setNftMetadata(results);
      setIsLoadingMetadata(false);
    };

    fetchAllMetadata();
  }, [tokenIds]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalNFTs = nftMetadata.length;

    // Total value spent (number of NFTs * mint price)
    const totalValueSpent =
      mintPrice && totalNFTs > 0
        ? (Number(formatEther(mintPrice)) * totalNFTs).toFixed(4)
        : "0";

    // Most recent mint (highest token ID)
    const mostRecentMint =
      nftMetadata.length > 0
        ? nftMetadata.reduce((max, nft) =>
            nft.tokenId > max.tokenId ? nft : max
          )
        : undefined;

    // Find rarest trait (trait that appears least often)
    const traitCounts = new Map<string, number>();
    nftMetadata.forEach((nft) => {
      if (nft.metadata?.attributes) {
        nft.metadata.attributes.forEach((attr) => {
          const key = `${attr.trait_type}: ${attr.value}`;
          traitCounts.set(key, (traitCounts.get(key) || 0) + 1);
        });
      }
    });

    let rarestTrait: { trait: string; count: number; total: number } | undefined;
    if (traitCounts.size > 0) {
      const [trait, count] = Array.from(traitCounts.entries()).reduce((min, entry) =>
        entry[1] < min[1] ? entry : min
      );
      rarestTrait = { trait, count, total: totalNFTs };
    }

    return {
      totalNFTs,
      totalValueSpent,
      mostRecentMint: mostRecentMint
        ? {
            name: mostRecentMint.metadata?.name || "Unknown",
            tokenId: mostRecentMint.tokenId,
          }
        : undefined,
      rarestTrait,
    };
  }, [nftMetadata, mintPrice]);

  // Calculate attribute distribution for chart
  const attributeDistribution = useMemo(() => {
    const distribution = new Map<string, number>();

    nftMetadata.forEach((nft) => {
      if (nft.metadata?.attributes) {
        nft.metadata.attributes.forEach((attr) => {
          const key = attr.trait_type || "Unknown";
          distribution.set(key, (distribution.get(key) || 0) + 1);
        });
      }
    });

    return Array.from(distribution.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 attributes
  }, [nftMetadata]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <PageTransition>
            <PageHeader
              title="NFT Statistics"
              description="View your NFT collection analytics and insights"
            />
          </PageTransition>

          <PageTransition delay={100}>
            <div className="max-w-6xl mx-auto mt-8">
              <EmptyState
                icon={Wallet}
                title="Wallet Not Connected"
                description="Please connect your wallet to view your NFT statistics."
              />
            </div>
          </PageTransition>
        </div>
      </div>
    );
  }

  if (isLoading || isLoadingMetadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <PageTransition>
            <PageHeader
              title="NFT Statistics"
              description="View your NFT collection analytics and insights"
            />
          </PageTransition>

          <PageTransition delay={100}>
            <div className="max-w-6xl mx-auto mt-8">
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-white/60">Loading statistics...</p>
                </div>
              </div>
            </div>
          </PageTransition>
        </div>
      </div>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <PageTransition>
            <PageHeader
              title="NFT Statistics"
              description="View your NFT collection analytics and insights"
            />
          </PageTransition>

          <PageTransition delay={100}>
            <div className="max-w-6xl mx-auto mt-8">
              <EmptyState
                icon={TrendingUp}
                title="No NFTs to Analyze"
                description="You don't have any NFTs yet. Start minting to see your statistics!"
                actionLabel="Mint Your First NFT"
                actionHref="/nft-mint"
              />
            </div>
          </PageTransition>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <PageHeader
            title="NFT Statistics"
            description="View your NFT collection analytics and insights"
          />
        </PageTransition>

        <div className="max-w-6xl mx-auto mt-8 space-y-8">
          {/* Stats Cards */}
          <PageTransition delay={100}>
            <StatsCards
              totalNFTs={stats.totalNFTs}
              totalValueSpent={stats.totalValueSpent}
              mostRecentMint={stats.mostRecentMint}
              rarestTrait={stats.rarestTrait}
            />
          </PageTransition>

          {/* Attribute Distribution */}
          {attributeDistribution.length > 0 && (
            <PageTransition delay={150}>
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">
                  Top Attribute Types
                </h3>
                <div className="space-y-4">
                  {attributeDistribution.map((attr, index) => {
                    const percentage = (attr.value / stats.totalNFTs) * 100;
                    return (
                      <div key={attr.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/70">{attr.name}</span>
                          <span className="text-sm font-medium text-white">
                            {attr.value} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              transitionDelay: `${index * 100}ms`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </PageTransition>
          )}
        </div>
      </div>
    </div>
  );
}
