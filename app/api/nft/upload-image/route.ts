import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
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
      const error = await pinataResponse.text();
      console.error("Pinata upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image to IPFS" },
        { status: 500 }
      );
    }

    const pinataData = await pinataResponse.json();

    return NextResponse.json({
      ipfsHash: pinataData.IpfsHash,
      pinSize: pinataData.PinSize,
      timestamp: pinataData.Timestamp,
      imageUrl: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
