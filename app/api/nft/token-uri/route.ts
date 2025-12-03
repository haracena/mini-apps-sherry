import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { CONTRACTS } from "@/config/contracts";
import { MintableNFTABI } from "@/abi/MintableNFT";

const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    // Fetch tokenURI from contract
    const tokenURI = await publicClient.readContract({
      address: CONTRACTS.MINTABLE_NFT,
      abi: MintableNFTABI,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    return NextResponse.json({ tokenURI });
  } catch (error) {
    console.error("[Token URI] Error fetching token URI:", error);
    return NextResponse.json(
      { error: "Failed to fetch token URI" },
      { status: 500 }
    );
  }
}
