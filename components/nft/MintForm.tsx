"use client";

import { useState, useEffect } from "react";
import { formatEther } from "viem";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { MintSuccessModal } from "./MintSuccessModal";
import { NFTPreview } from "./NFTPreview";
import { AttributeBuilder } from "./AttributeBuilder";
import { PageTransition } from "@/components/PageTransition";
import { useNFTMint } from "@/hooks/useNFTMint";
import { useNetworkCheck } from "@/hooks/useNetworkCheck";
import type { NFTFormData } from "@/types";

export function MintForm() {
  const [formData, setFormData] = useState<NFTFormData>({
    name: "",
    description: "",
    image: null,
    attributes: [],
  });

  const {
    mint,
    mintPrice,
    isPriceLoading,
    isMinting,
    isUploading,
    isCompressing,
    retryCount,
    uploadError,
    mintedNFT,
  } = useNFTMint();

  const {
    needsNetworkSwitch,
    targetChainName,
    switchToAvalanche,
    isSwitching,
  } = useNetworkCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }
    await mint(formData);
  };

  // Show toast on upload error
  useEffect(() => {
    if (uploadError) {
      toast.error("Upload failed", {
        description: uploadError,
      });
    }
  }, [uploadError]);

  // Show toast on mint success
  useEffect(() => {
    if (mintedNFT && !isUploading && !isMinting) {
      toast.success("NFT minted successfully!", {
        description: `Token ID: #${mintedNFT.tokenId.toString()}`,
      });
    }
  }, [mintedNFT, isUploading, isMinting]);

  const handleCloseModal = () => {
    // Reset form after successful mint
    setFormData({
      name: "",
      description: "",
      image: null,
      attributes: [],
    });
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.image !== null;

  const isLoading = isMinting || isUploading || isCompressing;

  return (
    <div className="space-y-6">
      {/* Network Warning Banner */}
      {needsNetworkSwitch && (
        <PageTransition>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-500 mb-1">
                  Wrong Network
                </h4>
                <p className="text-sm text-white/70 mb-3">
                  Please switch to {targetChainName} to mint NFTs.
                </p>
                <button
                  onClick={switchToAvalanche}
                  disabled={isSwitching}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600
                           disabled:bg-yellow-500/50 disabled:cursor-not-allowed
                           text-black font-medium rounded-lg text-sm
                           transition-all duration-200"
                >
                  {isSwitching ? "Switching..." : `Switch to ${targetChainName}`}
                </button>
              </div>
            </div>
          </div>
        </PageTransition>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
      {/* NFT Name */}
      <PageTransition delay={0}>
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
      </PageTransition>

      {/* NFT Description */}
      <PageTransition delay={50}>
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
      </PageTransition>

      {/* Image Upload */}
      <PageTransition delay={100}>
        <div className="space-y-2">
        <label className="block text-sm font-medium text-white">
          NFT Image
        </label>
        <ImageUpload
          selectedImage={formData.image}
          onImageSelect={(image) => setFormData({ ...formData, image })}
        />
        </div>
      </PageTransition>

      {/* Attributes */}
      <PageTransition delay={150}>
        <AttributeBuilder
          attributes={formData.attributes}
          onChange={(attributes) => setFormData({ ...formData, attributes })}
          disabled={isLoading}
        />
      </PageTransition>

      {/* Mint Price Display */}
      {!isPriceLoading && mintPrice && (
        <PageTransition delay={150}>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-white/70">Mint Price</p>
              <p className="text-2xl font-bold text-white">
                {formatEther(mintPrice)} AVAX
              </p>
            </div>
            <div className="pt-3 border-t border-white/10">
              <p className="text-xs text-white/50">Estimated Gas Fee</p>
              <p className="text-sm text-white/70">~0.001 AVAX</p>
            </div>
          </div>
        </PageTransition>
      )}

      {/* Submit Button */}
      <PageTransition delay={200}>
        <button
        type="submit"
        disabled={!isFormValid || isLoading || needsNetworkSwitch}
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
              ? retryCount > 0
                ? `Uploading to IPFS (attempt ${retryCount + 1}/3)...`
                : "Uploading to IPFS..."
              : "Minting NFT..."}
          </span>
        ) : (
          "Mint NFT"
        )}
        </button>
      </PageTransition>

        {/* Success Modal */}
        <MintSuccessModal nft={mintedNFT} onClose={handleCloseModal} />
      </form>

      {/* Preview Section */}
      <PageTransition delay={100}>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <NFTPreview formData={formData} />
        </div>
      </PageTransition>
      </div>
    </div>
  );
}
