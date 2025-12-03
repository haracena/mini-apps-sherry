import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate Pinata JWT is configured
    if (!process.env.PINATA_JWT) {
      console.error("[Upload Image] PINATA_JWT environment variable not configured");
      return NextResponse.json(
        { error: "Server configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.warn("[Upload Image] No file provided in request");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`[Upload Image] Processing file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      console.warn(`[Upload Image] Invalid file type: ${file.type}`);
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed",
          received: file.type,
          allowed: validTypes
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.warn(`[Upload Image] File too large: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      return NextResponse.json(
        {
          error: "File size exceeds 10MB limit",
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          maxSize: "10 MB"
        },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: file.name,
    });
    pinataFormData.append("pinataMetadata", pinataMetadata);

    const pinataResponse = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: pinataFormData,
      }
    );

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error(`[Upload Image] Pinata API error (${pinataResponse.status}):`, errorText);

      let errorMessage = "Failed to upload image to IPFS";
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

    console.log(`[Upload Image] Success! IPFS Hash: ${pinataData.IpfsHash} (${duration}ms)`);

    return NextResponse.json({
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Upload Image] Unexpected error after ${duration}ms:`, error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
