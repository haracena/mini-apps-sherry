"use client";

import { useEffect } from "react";
import { X, ExternalLink, Check, Image as ImageIcon, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";
import type { MintedNFT } from "@/types";

interface MintSuccessModalProps {
  nft: MintedNFT | null;
  onClose: () => void;
}

export function MintSuccessModal({ nft, onClose }: MintSuccessModalProps) {
  useEffect(() => {
    if (nft) {
      document.body.style.overflow = "hidden";

      // Trigger confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => {
        clearInterval(interval);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
    }
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
      <div className="relative bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-2xl p-8 max-w-md w-full border border-purple-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Success icon with animation */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center animate-in zoom-in duration-500 delay-150">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
              <Check className="w-10 h-10 text-green-400 animate-in zoom-in duration-300 delay-300" />
            </div>
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
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Link
            href="/nft-gallery"
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4
                     bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                     transition-all hover:scale-105 text-sm font-medium"
          >
            <ImageIcon className="w-4 h-4" />
            View Gallery
          </Link>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4
                     bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                     transition-all hover:scale-105 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Explorer
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4
                     bg-green-600 hover:bg-green-700 text-white rounded-lg
                     transition-all hover:scale-105 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Mint Another
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-white/10 hover:bg-white/20
                     text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
