import { NextRequest, NextResponse } from "next/server";
import { avalancheFuji } from "viem/chains";
import {
  createMetadata,
  Metadata,
  ValidatedMetadata,
  ExecutionResponse,
} from "@sherrylinks/sdk";
import { serialize } from "wagmi";
import { encodeFunctionData, TransactionSerializable } from "viem";
// import { abi } from "./blockchain/abi";

export async function GET(req: NextRequest) {
  try {
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const serverUrl = `${protocol}://${host}`;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log(id);

    const metadata: Metadata = {
      url: "https://sherry.social",
      icon: "https://avatars.githubusercontent.com/u/117962315",
      title: "Discord subscription",
      baseUrl: serverUrl,
      description: "Subscribe to the Discord server",
      actions: [
        {
          type: "dynamic",
          label: "Join the Discord server", // mensaje del botón
          description: "Join the Discord server to get the latest updates",
          chains: { source: "fuji" },
          path: `/api/discord`,
          params: [
            {
              name: "discord_token",
              label: "Discord Token",
              type: "text",
              required: true,
              description: "Enter your Discord Token",
            },
            {
              name: "price",
              label: "Invitation price",
              type: "",
              required: true,
              description: "Enter the invitation price",
            },
          ],
        },
      ],
    };

    const validated: ValidatedMetadata = createMetadata(metadata);

    return NextResponse.json(validated, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error creating metadata:", error);
    return NextResponse.json(
      { error: "Error creating metadata" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const discordToken = searchParams.get("discord_token");
    const subscriptionTime = searchParams.get("subscription_time");
    const message = searchParams.get("message");
    const referralAddress = searchParams.get("referral_address");
    console.log(discordToken, subscriptionTime, message, referralAddress);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204, // Sin Contenido
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    },
  });
}
