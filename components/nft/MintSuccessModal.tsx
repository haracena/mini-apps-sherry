"use client";

import { useEffect } from "react";
import { X, ExternalLink, Check } from "lucide-react";
import type { MintedNFT } from "@/types";

interface MintSuccessModalProps {
  nft: MintedNFT | null;
  onClose: () => void;
}

export function MintSuccessModal({ nft, onClose }: MintSuccessModalProps) {
  useEffect(() => {
    if (nft) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [nft]);

  if (!nft) return null;

  const explorerUrl = `https://snowtrace.io/tx/${nft.transactionHash}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          NFT Minted Successfully!
        </h2>
        <p className="text-white/60 text-center mb-6">
          Your NFT has been created on the blockchain
        </p>

        {/* NFT Details */}
        <div className="space-y-4 bg-black/20 rounded-lg p-4 mb-6">
          <div>
            <p className="text-sm text-white/60">Token ID</p>
            <p className="text-white font-mono">#{nft.tokenId.toString()}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Token URI</p>
            <p className="text-white font-mono text-xs break-all">
              {nft.tokenURI}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/60">Transaction</p>
            <p className="text-white font-mono text-xs break-all">
              {nft.transactionHash}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4
                     bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                     transition-colors"
          >
            View on Explorer
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20
                     text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
