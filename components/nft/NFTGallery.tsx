"use client";

import { useAccount, useReadContract } from "wagmi";
import { Wallet, ImagePlus } from "lucide-react";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/PageTransition";

export function NFTGallery() {
  const { address, isConnected } = useAccount();

  const { data: tokenIds, isLoading } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  if (!isConnected) {
    return (
      <EmptyState
        icon={Wallet}
        title="Wallet Not Connected"
        description="Please connect your wallet to view your NFT collection and manage your digital assets."
        actionLabel="Connect Wallet"
        onAction={() => {
          // Wallet connection is handled by the navbar button
          document.querySelector<HTMLButtonElement>('button[aria-label*="Connect"]')?.click();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <NFTCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <EmptyState
        icon={ImagePlus}
        title="No NFTs Yet"
        description="Your collection is empty. Start building your digital art collection by minting your first NFT!"
        actionLabel="Mint Your First NFT"
        actionHref="/nft-mint"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokenIds.map((tokenId, index) => (
        <PageTransition key={tokenId.toString()} delay={index * 50}>
          <NFTCard tokenId={tokenId} />
        </PageTransition>
      ))}
    </div>
  );
}
