"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Wallet, ImagePlus } from "lucide-react";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import { NFTCard } from "./NFTCard";
import { NFTCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/PageTransition";
import { SearchBar } from "./SearchBar";
import { FilterControls, SortOption } from "./FilterControls";
import { Pagination } from "@/components/ui/Pagination";
import { fetchFromIPFS } from "@/utils/ipfs";
import type { NFTMetadata } from "@/types";

interface NFTWithMetadata {
  tokenId: bigint;
  metadata: NFTMetadata | null;
}

const ITEMS_PER_PAGE = 12;

export function NFTGallery() {
  const { address, isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nftMetadata, setNftMetadata] = useState<NFTWithMetadata[]>([]);

  const { data: tokenIds, isLoading } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Fetch metadata for all NFTs
  useEffect(() => {
    if (!tokenIds || tokenIds.length === 0) {
      setNftMetadata([]);
      return;
    }

    const fetchAllMetadata = async () => {
      const metadataPromises = tokenIds.map(async (tokenId) => {
        try {
          // Fetch tokenURI
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
    };

    fetchAllMetadata();
  }, [tokenIds]);

  // Extract unique attribute types from all NFTs
  const availableAttributes = useMemo(() => {
    const attributeSet = new Set<string>();

    nftMetadata.forEach((nft) => {
      if (nft.metadata?.attributes) {
        nft.metadata.attributes.forEach((attr) => {
          if (attr.trait_type) {
            attributeSet.add(`${attr.trait_type}: ${attr.value}`);
          }
        });
      }
    });

    return Array.from(attributeSet).sort();
  }, [nftMetadata]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedAttributes, sortBy]);

  // Filter and sort NFTs
  const processedNFTs = useMemo(() => {
    let result = [...nftMetadata];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((nft) => {
        if (!nft.metadata) return false;

        const nameMatch = nft.metadata.name?.toLowerCase().includes(query);
        const descMatch = nft.metadata.description?.toLowerCase().includes(query);

        return nameMatch || descMatch;
      });
    }

    // Filter by attributes
    if (selectedAttributes.length > 0) {
      result = result.filter((nft) => {
        if (!nft.metadata?.attributes) return false;

        return selectedAttributes.every((selectedAttr) => {
          return nft.metadata!.attributes!.some((attr) => {
            return `${attr.trait_type}: ${attr.value}` === selectedAttr;
          });
        });
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return Number(b.tokenId) - Number(a.tokenId);
        case "oldest":
          return Number(a.tokenId) - Number(b.tokenId);
        case "name-asc":
          return (a.metadata?.name || "").localeCompare(b.metadata?.name || "");
        case "name-desc":
          return (b.metadata?.name || "").localeCompare(a.metadata?.name || "");
        default:
          return 0;
      }
    });

    return result;
  }, [nftMetadata, searchQuery, selectedAttributes, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(processedNFTs.length / ITEMS_PER_PAGE);
  const paginatedNFTs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedNFTs.slice(startIndex, endIndex);
  }, [processedNFTs, currentPage]);

  // Scroll to top on page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const isLoadingMetadata = nftMetadata.length === 0 && tokenIds.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by name or description..."
        resultCount={processedNFTs.length}
        totalCount={nftMetadata.length}
      />

      {/* Filter and Sort Controls */}
      <FilterControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedAttributes={selectedAttributes}
        onAttributeChange={setSelectedAttributes}
        availableAttributes={availableAttributes}
      />

      {/* Loading state while fetching metadata */}
      {isLoadingMetadata ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokenIds.map((_, i) => (
            <NFTCardSkeleton key={i} />
          ))}
        </div>
      ) : processedNFTs.length === 0 ? (
        /* No results from search/filter */
        <EmptyState
          icon={ImagePlus}
          title="No NFTs Found"
          description={
            searchQuery || selectedAttributes.length > 0
              ? "No NFTs match your search or filter criteria. Try adjusting your filters."
              : "No NFTs to display."
          }
          actionLabel={
            searchQuery || selectedAttributes.length > 0 ? "Clear Filters" : undefined
          }
          onAction={
            searchQuery || selectedAttributes.length > 0
              ? () => {
                  setSearchQuery("");
                  setSelectedAttributes([]);
                }
              : undefined
          }
        />
      ) : (
        /* Display filtered and sorted NFTs */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedNFTs.map((nft, index) => (
              <PageTransition key={nft.tokenId.toString()} delay={index * 50}>
                <NFTCard tokenId={nft.tokenId} />
              </PageTransition>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={processedNFTs.length}
          />
        </>
      )}
    </div>
  );
}
