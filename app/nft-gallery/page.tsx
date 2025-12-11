"use client";

import { PageHeader } from "@/components/PageHeader";
import { NFTGallery } from "@/components/nft/NFTGallery";
import { PageTransition } from "@/components/PageTransition";
import { NetworkSelector, useNetworkSelector } from "@/components/NetworkSelector";

export default function NFTGalleryPage() {
  const { network } = useNetworkSelector();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <PageHeader
            title="My NFT Collection"
            description="View all your minted NFTs"
          />
        </PageTransition>

        {/* Network Selector */}
        <PageTransition delay={50}>
          <div className="flex justify-center mb-6">
            <NetworkSelector />
          </div>
        </PageTransition>

        <PageTransition delay={100}>
          <div className="mt-8">
            <NFTGallery network={network} />
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
