"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useReadContract, useAccount } from "wagmi";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Package, User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import { fetchFromIPFS, getIPFSImageUrl } from "@/utils/ipfs";
import type { NFTMetadata } from "@/types";

export default function NFTDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const tokenId = params.tokenId as string;

  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch token URI
  const { data: tokenURI } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokenURI",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  // Fetch owner
  const { data: owner } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "ownerOf",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  // Fetch metadata from IPFS
  useEffect(() => {
    if (!tokenURI) return;

    const loadMetadata = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFromIPFS<NFTMetadata>(tokenURI);
        setMetadata(data);

        if (data.image) {
          const workingImageUrl = await getIPFSImageUrl(data.image);
          setImageUrl(workingImageUrl);
        }
      } catch (error) {
        console.error("Error loading metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetadata();
  }, [tokenURI]);

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();
  const explorerUrl = `https://testnet.snowtrace.io/address/${CONTRACTS.MINTABLE_NFT}?tab=inventory`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <PageTransition>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Gallery</span>
          </button>
        </PageTransition>

        {isLoading ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <Skeleton className="aspect-square rounded-xl" />

              {/* Info Skeleton */}
              <div className="space-y-6">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* NFT Image */}
              <PageTransition delay={100}>
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl overflow-hidden">
                  <div className="relative aspect-square">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={metadata?.name || `NFT #${tokenId}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        <Package className="w-20 h-20 text-white/20" />
                      </div>
                    )}
                  </div>
                </div>
              </PageTransition>

              {/* NFT Details */}
              <div className="space-y-6">
                {/* Title and Token ID */}
                <PageTransition delay={150}>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">
                        {metadata?.name || "Unnamed NFT"}
                      </h1>
                      {isOwner && (
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                          You own this
                        </span>
                      )}
                    </div>
                    <p className="text-white/60">Token ID: #{tokenId}</p>
                  </div>
                </PageTransition>

                {/* Description */}
                {metadata?.description && (
                  <PageTransition delay={200}>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                      <h3 className="text-sm font-medium text-white/70 mb-2">
                        Description
                      </h3>
                      <p className="text-white/90 leading-relaxed">
                        {metadata.description}
                      </p>
                    </div>
                  </PageTransition>
                )}

                {/* Attributes */}
                {metadata?.attributes && metadata.attributes.length > 0 && (
                  <PageTransition delay={250}>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                      <h3 className="text-sm font-medium text-white/70 mb-4">
                        Attributes
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {metadata.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className="bg-white/5 border border-purple-500/20 rounded-lg p-3"
                          >
                            <p className="text-xs text-white/50 mb-1">
                              {attr.trait_type || "Attribute"}
                            </p>
                            <p className="text-sm font-medium text-white">
                              {attr.value?.toString() || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PageTransition>
                )}

                {/* Owner Info */}
                <PageTransition delay={300}>
                  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-white/70 mb-3">
                      Owner
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <User className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-white truncate">
                          {owner || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </PageTransition>

                {/* Links */}
                <PageTransition delay={350}>
                  <div className="flex gap-3">
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3
                               bg-white/5 hover:bg-white/10 border border-purple-500/30
                               text-white/70 hover:text-white rounded-lg
                               transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm font-medium">View on Explorer</span>
                    </a>
                  </div>
                </PageTransition>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
