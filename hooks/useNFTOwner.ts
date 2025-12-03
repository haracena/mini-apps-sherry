"use client";

import { useAccount, useReadContract, useWriteContract, useBalance } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";

export function useNFTOwner() {
  const { address } = useAccount();

  // Read contract owner
  const { data: owner, isLoading: isOwnerLoading } = useReadContract({
    address: CONTRACTS.MINTABLE_NFT,
    abi: MintableNFTABI,
    functionName: "owner",
  });

  // Get contract balance
  const { data: contractBalance } = useBalance({
    address: CONTRACTS.MINTABLE_NFT,
  });

  // Withdraw function
  const { writeContract: withdraw, isPending: isWithdrawing } = useWriteContract();

  // Set mint price function
  const { writeContract: setMintPrice, isPending: isSettingPrice } = useWriteContract();

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  const handleWithdraw = () => {
    if (!isOwner) return;

    withdraw({
      address: CONTRACTS.MINTABLE_NFT,
      abi: MintableNFTABI,
      functionName: "withdraw",
    });
  };

  const handleSetMintPrice = (priceInWei: bigint) => {
    if (!isOwner) return;

    setMintPrice({
      address: CONTRACTS.MINTABLE_NFT,
      abi: MintableNFTABI,
      functionName: "setMintPrice",
      args: [priceInWei],
    });
  };

  return {
    owner,
    isOwner,
    isOwnerLoading,
    contractBalance,
    withdraw: handleWithdraw,
    isWithdrawing,
    setMintPrice: handleSetMintPrice,
    isSettingPrice,
  };
}
