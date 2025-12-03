"use client";

import { PageHeader } from "@/components/PageHeader";
import { NFTGallery } from "@/components/nft/NFTGallery";

export default function NFTGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="My NFT Collection"
          description="View all your minted NFTs"
        />

        <div className="mt-8">
          <NFTGallery />
        </div>
      </div>
    </div>
  );
}
