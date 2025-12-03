import { NextRequest, NextResponse } from "next/server";
import type { NFTMetadata } from "@/types";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate Pinata JWT is configured
    if (!process.env.PINATA_JWT) {
      console.error("[Upload Metadata] PINATA_JWT environment variable not configured");
      return NextResponse.json(
        { error: "Server configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, description, image } = body as NFTMetadata;

    console.log(`[Upload Metadata] Processing metadata for NFT: "${name}"`);

    // Validate required fields
    if (!name || !description || !image) {
      const missing = [];
      if (!name) missing.push("name");
      if (!description) missing.push("description");
      if (!image) missing.push("image");

      console.warn(`[Upload Metadata] Missing required fields: ${missing.join(", ")}`);

      return NextResponse.json(
        {
          error: "Missing required fields",
          missing,
          required: ["name", "description", "image"]
        },
        { status: 400 }
      );
    }

    // Validate field types
    if (typeof name !== "string" || typeof description !== "string" || typeof image !== "string") {
      console.warn("[Upload Metadata] Invalid field types");
      return NextResponse.json(
        { error: "Name, description, and image must be strings" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      console.warn(`[Upload Metadata] Name too long: ${name.length} characters`);
      return NextResponse.json(
        { error: "Name must be 100 characters or less", length: name.length },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      console.warn(`[Upload Metadata] Description too long: ${description.length} characters`);
      return NextResponse.json(
        { error: "Description must be 1000 characters or less", length: description.length },
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
      const errorText = await pinataResponse.text();
      console.error(`[Upload Metadata] Pinata API error (${pinataResponse.status}):`, errorText);

      let errorMessage = "Failed to upload metadata to IPFS";
      if (pinataResponse.status === 401) {
        errorMessage = "Invalid Pinata API credentials";
      } else if (pinataResponse.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorText,
          status: pinataResponse.status
        },
        { status: 500 }
      );
    }

    const pinataData = await pinataResponse.json();
    const duration = Date.now() - startTime;

    console.log(`[Upload Metadata] Success! IPFS Hash: ${pinataData.IpfsHash} (${duration}ms)`);

    return NextResponse.json({
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp,
      metadataUrl: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
      tokenURI: `ipfs://${pinataData.IpfsHash}`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Upload Metadata] Unexpected error after ${duration}ms:`, error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
