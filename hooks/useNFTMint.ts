"use client";

import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from "wagmi";
import { parseEther } from "viem";
import imageCompression from "browser-image-compression";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";
import type { NFTFormData, MintedNFT } from "@/types";

export function useNFTMint() {
  const { address } = useAccount();
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mintedNFT, setMintedNFT] = useState<MintedNFT | null>(null);

  // Read mint price from contract
  const { data: mintPrice, isLoading: isPriceLoading } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "mintPrice",
  });

  // Mint function
  const { writeContract, isPending: isMinting } = useWriteContract();

  // Watch for NFT minted events
  useWatchContractEvent({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    eventName: "NFTMinted",
    onLogs(logs) {
      const log = logs[0];
      if (log && log.args.owner === address) {
        setMintedNFT({
          tokenId: log.args.tokenId!,
          tokenURI: log.args.tokenURI!,
          owner: log.args.owner!,
          transactionHash: log.transactionHash,
          timestamp: log.args.timestamp!,
        });
      }
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    setIsCompressing(true);

    // Compress image before upload
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: file.type as string,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      setIsCompressing(false);

      const formData = new FormData();
      formData.append("file", compressedFile, file.name);

      const response = await fetch("/api/nft/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      setIsCompressing(false);
      throw error;
    }
  };

  const uploadMetadata = async (
    name: string,
    description: string,
    imageUrl: string
  ): Promise<string> => {
    const response = await fetch("/api/nft/upload-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        image: imageUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to upload metadata");
    }

    const data = await response.json();
    return data.tokenURI;
  };

  const mint = async (formData: NFTFormData) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setMintedNFT(null);

      if (!formData.image) {
        throw new Error("No image provided");
      }

      // Upload image to IPFS
      const imageUrl = await uploadImage(formData.image);

      // Upload metadata to IPFS
      const tokenURI = await uploadMetadata(
        formData.name,
        formData.description,
        imageUrl
      );

      setIsUploading(false);

      // Mint NFT with the token URI
      writeContract({
        address: CONTRACTS.MINTABLE_NFT,
        abi: MintableNFTABI,
        functionName: "mint",
        args: [tokenURI],
        value: mintPrice || parseEther("0.0001"),
      });
    } catch (error) {
      setIsUploading(false);
      setUploadError(
        error instanceof Error ? error.message : "Failed to mint NFT"
      );
    }
  };

  return {
    mint,
    mintPrice,
    isPriceLoading,
    isMinting,
    isUploading,
    isCompressing,
    uploadError,
    mintedNFT,
  };
}
