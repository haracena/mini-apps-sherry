import { NextRequest, NextResponse } from "next/server";
import type { NFTMetadata } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body as NFTMetadata;

    if (!name || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, image" },
        { status: 400 }
      );
    }

    // Create metadata object following ERC721 standard
    const metadata: NFTMetadata = {
      name,
      description,
      image,
      attributes: body.attributes || [],
    };

    // Upload metadata JSON to Pinata
    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `${name}-metadata.json`,
          },
        }),
      }
    );

    if (!pinataResponse.ok) {
      const error = await pinataResponse.text();
      console.error("Pinata metadata upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload metadata to IPFS" },
        { status: 500 }
      );
    }

    const pinataData = await pinataResponse.json();

    return NextResponse.json({
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp,
      metadataUrl: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
      tokenURI: `ipfs://${pinataData.IpfsHash}`,
    });
  } catch (error) {
    console.error("Metadata upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
