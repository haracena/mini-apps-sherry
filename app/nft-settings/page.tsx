"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { Wallet, DollarSign, TrendingUp, Package, Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useNFTOwner } from "@/hooks/useNFTOwner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";

export default function NFTSettingsPage() {
  const { isConnected } = useAccount();
  const [newPrice, setNewPrice] = useState("");
  const [lastWithdrawSuccess, setLastWithdrawSuccess] = useState(false);
  const [lastPriceUpdateSuccess, setLastPriceUpdateSuccess] = useState(false);

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

  // Read total supply
  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "totalSupply",
  });

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) return;

    try {
      const priceInWei = parseEther(newPrice);
      await setMintPrice(priceInWei);
      setNewPrice("");
      setLastPriceUpdateSuccess(true);
      toast.success("Mint price updated", {
        description: `New price: ${newPrice} AVAX`
      });
    } catch (error) {
      console.error("Error updating price:", error);
      toast.error("Failed to update price", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw();
      setLastWithdrawSuccess(true);
      toast.success("Withdrawal successful", {
        description: `${contractBalance ? formatEther(contractBalance.value) : "0"} AVAX withdrawn`
      });
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error("Withdrawal failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Reset success states after a delay
  useEffect(() => {
    if (lastWithdrawSuccess) {
      const timer = setTimeout(() => setLastWithdrawSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastWithdrawSuccess]);

  useEffect(() => {
    if (lastPriceUpdateSuccess) {
      const timer = setTimeout(() => setLastPriceUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastPriceUpdateSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="NFT Settings"
          description="Manage your NFT contract settings"
        />

        <div className="max-w-4xl mx-auto mt-8">
          {!isConnected ? (
            <EmptyState
              icon={Wallet}
              title="Wallet Not Connected"
              description="Please connect your wallet to access NFT contract settings."
            />
          ) : !isOwner ? (
            <EmptyState
              icon={Wallet}
              title="Access Denied"
              description="Only the contract owner can access these settings. Please connect with the owner wallet."
            />
          ) : (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Supply */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Package className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-sm text-white/70">Total Supply</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {totalSupply?.toString() || "0"}
                  </p>
                </div>

                {/* Current Mint Price */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-sm text-white/70">Mint Price</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {mintPrice ? `${formatEther(mintPrice)} AVAX` : "..."}
                  </p>
                </div>

                {/* Contract Balance */}
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-green-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-sm text-white/70">Balance</p>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {contractBalance ? `${formatEther(contractBalance.value)} AVAX` : "..."}
                  </p>
                </div>
              </div>

              {/* Withdraw Section */}
              {contractBalance && (
                <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Download className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Withdraw Funds</h3>
                      <p className="text-sm text-white/60">Transfer contract balance to owner wallet</p>
                    </div>
                  </div>
                  <button
                    onClick={handleWithdraw}
                    disabled={isWithdrawing || contractBalance.value === 0n}
                    className="w-full py-3 px-6 bg-green-600 hover:bg-green-700
                             disabled:bg-gray-600 disabled:cursor-not-allowed
                             text-white font-semibold rounded-lg
                             transition-all hover:scale-[1.02]
                             shadow-lg shadow-green-500/20"
                  >
                    {isWithdrawing ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        Withdrawing...
                      </span>
                    ) : (
                      `Withdraw ${formatEther(contractBalance.value)} AVAX`
                    )}
                  </button>
                </div>
              )}

              {/* Mint Price Settings */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-purple-500/20 rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Update Mint Price</h3>
                    <p className="text-sm text-white/60">Set a new price for minting NFTs</p>
                  </div>
                </div>

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
