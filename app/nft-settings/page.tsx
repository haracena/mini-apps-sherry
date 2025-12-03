"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { PageHeader } from "@/components/PageHeader";
import { useNFTOwner } from "@/hooks/useNFTOwner";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";

export default function NFTSettingsPage() {
  const { isConnected } = useAccount();
  const [newPrice, setNewPrice] = useState("");

  const {
    isOwner,
    contractBalance,
    withdraw,
    isWithdrawing,
    setMintPrice,
    isSettingPrice,
  } = useNFTOwner();

  // Read current mint price
  const { data: mintPrice } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "mintPrice",
  });

  const handleUpdatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) return;

    try {
      const priceInWei = parseEther(newPrice);
      setMintPrice(priceInWei);
      setNewPrice("");
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="NFT Settings"
          description="Manage your NFT contract settings"
        />

        <div className="max-w-2xl mx-auto mt-8">
          {!isConnected ? (
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8 text-center">
              <p className="text-white/60">
                Please connect your wallet to access settings
              </p>
            </div>
          ) : !isOwner ? (
            <div className="bg-white/5 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 text-center">
              <p className="text-red-400">
                Only the contract owner can access these settings
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Contract Balance */}
              {contractBalance && (
                <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-white/70 mb-1">Contract Balance</p>
                      <p className="text-3xl font-bold text-white">
                        {formatEther(contractBalance.value)} AVAX
                      </p>
                    </div>
                    <button
                      onClick={withdraw}
                      disabled={isWithdrawing || contractBalance.value === 0n}
                      className="py-3 px-6 bg-green-600 hover:bg-green-700
                               disabled:bg-gray-600 disabled:cursor-not-allowed
                               text-white font-semibold rounded-lg
                               transition-all duration-200"
                    >
                      {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                    </button>
                  </div>
                </div>
              )}

              {/* Mint Price Settings */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 md:p-8">
                {/* Current Price Display */}
                {mintPrice && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-white/70 mb-1">Current Mint Price</p>
                    <p className="text-3xl font-bold text-white">
                      {formatEther(mintPrice)} AVAX
                    </p>
                  </div>
                )}

                {/* Update Price Form */}
                <form onSubmit={handleUpdatePrice} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-white"
                    >
                      New Mint Price (AVAX)
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.0001"
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.0001"
                      className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-lg
                               text-white placeholder:text-white/40
                               focus:outline-none focus:ring-2 focus:ring-purple-500/50
                               transition-all duration-200"
                      disabled={isSettingPrice}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newPrice || isSettingPrice}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600
                             text-white font-semibold rounded-lg
                             hover:from-purple-700 hover:to-pink-700
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                             transition-all duration-200
                             shadow-lg shadow-purple-500/20"
                  >
                    {isSettingPrice ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Updating Price...
                      </span>
                    ) : (
                      "Update Mint Price"
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
