"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { ImageUpload } from "./ImageUpload";
import { MintSuccessModal } from "./MintSuccessModal";
import { useNFTMint } from "@/hooks/useNFTMint";
import type { NFTFormData } from "@/types";

export function MintForm() {
  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    image: null,
  });

  const {
    mint,
    mintPrice,
    isPriceLoading,
    isMinting,
    isUploading,
    isCompressing,
    uploadError,
    mintedNFT,
  } = useNFTMint();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return;
    await mint(formData);
  };

  const handleCloseModal = () => {
    // Reset form after successful mint
    setFormData({
      name: "",
      description: "",
      image: null,
    });
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.image !== null;

  const isLoading = isMinting || isUploading || isCompressing;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NFT Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          NFT Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter NFT name"
          className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg
                   text-white placeholder:text-white/40
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50
                   transition-all duration-200"
          disabled={isLoading}
        />
      </div>

      {/* NFT Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-white"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter NFT description"
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg
                   text-white placeholder:text-white/40
                   focus:outline-none focus:ring-2 focus:ring-purple-500/50
                   transition-all duration-200 resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          NFT Image
        </label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => setFormData({ ...formData, image })}
        />
      </div>

      {/* Mint Price Display */}
      {!isPriceLoading && mintPrice && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-white/70">Mint Price</p>
          <p className="text-2xl font-bold text-white">
            {formatEther(mintPrice)} AVAX
          </p>
        </div>
      )}

      {/* Error Display */}
      {uploadError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{uploadError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600
                 text-white font-semibold rounded-lg
                 hover:from-purple-700 hover:to-pink-700
                 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                 transition-all duration-200
                 shadow-lg shadow-purple-500/20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            {isCompressing
              ? "Compressing image..."
              : isUploading
              ? "Uploading to IPFS..."
              : "Minting NFT..."}
          </span>
        ) : (
          "Mint NFT"
        )}
      </button>

      {/* Success Modal */}
      <MintSuccessModal nft={mintedNFT} onClose={handleCloseModal} />
    </form>
  );
}
