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
              name: "subscription_time",
              label: "Subscription time",
              type: "radio",
              options: [
                {
                  label: "1 month",
                  value: 1,
                },
                {
                  label: "3 months",
                  value: 3,
                },
                {
                  label: "1 year",
                  value: 12,
                },
              ],
            },
            {
              name: "discord_id",
              label: "Discord ID",
              type: "text",
              required: true,
              description: "Enter your Discord ID not username",
            },
            {
              name: "message",
              label: "Message (optional)",
              type: "text",
              required: false,
              description: "Send your greeting message",
            },
            {
              name: "referral_address",
              label: "Referral address (optional)",
              type: "address",
              required: false,
              description: "Enter the referral address",
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
    const discordId = searchParams.get("discord_id");
    const subscriptionTime = searchParams.get("subscription_time");
    const message = searchParams.get("message");
    const referralAddress = searchParams.get("referral_address");
    console.log(discordId, subscriptionTime, message, referralAddress);
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
