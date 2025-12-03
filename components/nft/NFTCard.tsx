"use client";

import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import Image from "next/image";
import { ExternalLink, ImageIcon } from "lucide-react";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import { fetchFromIPFS, getIPFSImageUrl } from "@/utils/ipfs";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import type { NFTMetadata } from "@/types";

interface NFTCardProps {
  tokenId: bigint;
}

export function NFTCard({ tokenId }: NFTCardProps) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageError, setImageError] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Fetch tokenURI for this specific NFT
  const { data: tokenURI } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokenURI",
    args: [tokenId],
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;

      try {
        setIsLoadingMetadata(true);

        // Fetch metadata with automatic gateway fallback
        const data = await fetchFromIPFS<NFTMetadata>(tokenURI);
        setMetadata(data);

        // Get working image URL with gateway fallback
        if (data.image) {
          const workingImageUrl = await getIPFSImageUrl(data.image);
          setImageUrl(workingImageUrl);
        }

        setIsLoadingMetadata(false);
      } catch (error) {
        console.error("Failed to fetch NFT metadata:", error);
        setIsLoadingMetadata(false);
      }
    };

    fetchMetadata();
  }, [tokenURI]);

  if (!metadata || isLoadingMetadata) {
    return <NFTCardSkeleton />;
  }

  return (
    <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20">
      {/* Token ID Badge */}
      <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-purple-500/30">
        <span className="text-xs font-mono text-purple-300">
          #{tokenId.toString()}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {!imageError && imageUrl ? (
          <Image
            src={imageUrl}
            alt={metadata.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-white/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1 truncate group-hover:text-purple-300 transition-colors">
            {metadata.name}
          </h3>
          <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">
            {metadata.description}
          </p>
        </div>

        {/* Attributes */}
        {metadata.attributes && metadata.attributes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {metadata.attributes.slice(0, 3).map((attr, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300"
              >
                <span className="text-white/50">{attr.trait_type}: </span>
                <span className="font-medium">{attr.value}</span>
              </div>
            ))}
            {metadata.attributes.length > 3 && (
              <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300">
                +{metadata.attributes.length - 3} more
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-white/40">Minted</span>
          </div>
          <a
            href={`https://snowtrace.io/token/${CONTRACTS.MINTABLE_NFT}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors group/link"
          >
            <span className="text-xs font-medium">View</span>
            <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0" />
      </div>
    </div>
  );
}
