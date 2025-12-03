"use client";

import { PageHeader } from "@/components/PageHeader";
import { MintForm } from "@/components/nft/MintForm";
import { PageTransition } from "@/components/PageTransition";
import { useAccount } from "wagmi";

export default function NFTMintPage() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageTransition>
          <PageHeader
            title="Mint NFT"
            description="Create your unique digital collectible on the blockchain"
          />
        </PageTransition>

        <PageTransition delay={100}>
          <div className="max-w-2xl mx-auto mt-8">
          {!isConnected ? (
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 text-center">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Wallet Connection Required
              </h3>
              <p className="text-white/60">
                Please connect your wallet to start minting NFTs
              </p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 md:p-8">
              <MintForm />
            </div>
          )}
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
