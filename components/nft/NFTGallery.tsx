"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import type { NFTMetadata } from "@/types";

interface NFTCardProps {
  tokenId: bigint;
  tokenURI: string;
}

function NFTCard({ tokenId, tokenURI }: NFTCardProps) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Convert ipfs:// to gateway URL
        const gatewayUrl = tokenURI.replace(
          "ipfs://",
          "https://gateway.pinata.cloud/ipfs/"
        );
        const response = await fetch(gatewayUrl);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch NFT metadata:", error);
      }
    };

    fetchMetadata();
  }, [tokenURI]);

  if (!metadata) {
    return (
      <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 animate-pulse">
        <div className="aspect-square bg-white/10 rounded-lg mb-3" />
        <div className="h-4 bg-white/10 rounded mb-2" />
        <div className="h-3 bg-white/10 rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-purple-500/30 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all duration-200 group">
      <div className="relative aspect-square">
        {!imageError ? (
          <Image
            src={metadata.image}
            alt={metadata.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <p className="text-white/50 text-sm">Image not available</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold mb-1 truncate">
          {metadata.name}
        </h3>
        <p className="text-white/60 text-sm mb-2 line-clamp-2">
          {metadata.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-purple-400 text-sm font-mono">
            #{tokenId.toString()}
          </span>
          <a
            href={`https://snowtrace.io/token/${CONTRACTS.MINTABLE_NFT}?a=${tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

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

  const { data: tokenURIs } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokenURI",
    args: tokenIds && tokenIds.length > 0 ? [tokenIds[0]] : undefined,
    query: {
      enabled: !!tokenIds && tokenIds.length > 0,
    },
  });

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-purple-500/30 rounded-lg p-4 animate-pulse"
          >
            <div className="aspect-square bg-white/10 rounded-lg mb-3" />
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-3 bg-white/10 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!tokenIds || tokenIds.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-white/60 mb-2">No NFTs found</p>
        <p className="text-white/40 text-sm">
          Mint your first NFT to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokenIds.map((tokenId, index) => (
        <NFTCard
          key={tokenId.toString()}
          tokenId={tokenId}
          tokenURI={tokenURIs as string}
        />
      ))}
    </div>
  );
}
