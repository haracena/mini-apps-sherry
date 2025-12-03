"use client";

import { PageHeader } from "@/components/PageHeader";
import { NFTGallery } from "@/components/nft/NFTGallery";
import { PageTransition } from "@/components/PageTransition";

export default function NFTGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <PageHeader
            title="My NFT Collection"
            description="View all your minted NFTs"
          />
        </PageTransition>

        <PageTransition delay={100}>
          <div className="mt-8">
            <NFTGallery />
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
