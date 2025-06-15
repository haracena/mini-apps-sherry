import { NextRequest, NextResponse } from "next/server";
import { avalanche } from "viem/chains";
import {
  createMetadata,
  Metadata,
  ValidatedMetadata,
  ExecutionResponse,
  createParameter,
  PARAM_TEMPLATES,
} from "@sherrylinks/sdk";
import { serialize } from "wagmi";
import { encodeFunctionData, TransactionSerializable } from "viem";
import { TelegramGroupInvitationABI } from "@/abi/TelegramGroupInvitation";
import { supabaseServiceRole } from "@/lib/supabase";
import { createPublicClient, http } from "viem";
import { ethers, keccak256, toUtf8Bytes } from "ethers";

const CONTRACT_ADDRESS = "0x9Da5D4De75832CD63666AC738837B88fCf4b3396";

const publicClient = createPublicClient({
  chain: avalanche,
  transport: http("https://api.avax.network/ext/bc/C/rpc"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const group_id = searchParams.get("group_id");
    if (!group_id) {
      return NextResponse.json({ error: "Missing group_id" }, { status: 400 });
    }
    // Buscar el grupo en la base de datos (solo para metadatos)
    const { data, error } = await supabaseServiceRole
      .from("telegram_invitation_configs")
      .select()
      .eq("group_id", group_id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    // Leer precio y comisión on-chain
    const onchainGroup = (await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: TelegramGroupInvitationABI,
      functionName: "getGroup",
      args: [group_id],
    })) as [string, bigint, bigint, boolean];
    const [owner, price, referralCommission, exists] = onchainGroup;
    if (!exists) {
      return NextResponse.json(
        { error: "Group not found on chain" },
        { status: 404 }
      );
    }
    const invitationPriceAvax = price ? (Number(price) / 1e18).toFixed(4) : "-";
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const serverUrl = `${protocol}://${host}`;

    const emailParam = createParameter(PARAM_TEMPLATES.EMAIL, {
      name: "email",
      label: "Your Email Address to receive the invitation",
      required: true,
      description: "Your email address to receive the invitation",
    });

    const payerAddressParam = {
      name: "payer_address",
      label: "Your Wallet Address",
      type: "address",
      value: "sender",
      required: true,
      description: "Your wallet address (auto-filled by Sherry)",
    };

    const params = [emailParam, payerAddressParam];

    if (referralCommission && Number(referralCommission) > 0) {
      params.push({
        name: "referral",
        label: "Referral address (optional)",
        type: "text",
        required: false,
        description: "Dirección del referral (opcional)",
      });
    }

    const metadata: Metadata = {
      url: serverUrl + req.nextUrl.pathname,
      icon: `${serverUrl}/assets/images/mini-app-bg.png`,
      title: data.title || "Telegram Group Invitation",
      baseUrl: serverUrl,
      description:
        (data.description ||
          "Buy your invitation to the private Telegram group.") +
        `\n\nPrice: ${invitationPriceAvax} AVAX`,
      actions: [
        {
          type: "dynamic",
          label: "Buy invitation",
          description: `Invitation to the group: ${
            data.title || group_id
          } (Price: ${invitationPriceAvax} AVAX)`,
          chains: { source: "avalanche" },
          path: `/api/telegram-invitation?group_id=${group_id}`,
          params,
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
    console.error("Error creando metadata:", error);
    return NextResponse.json(
      { error: "Error al crear metadata" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("📥 POST request received");
    const { searchParams } = new URL(req.url);
    const group_id = searchParams.get("group_id");
    const email = searchParams.get("email")
      ? decodeURIComponent(searchParams.get("email")!)
      : null;
    const referral = searchParams.get("referral");
    const payer_address = searchParams.get("payer_address");
    console.log(req.headers);
    console.log("🔍 Query params:", {
      group_id,
      email,
      referral,
      payer_address,
    });

    if (!group_id || !email) {
      console.log("❌ Missing required params:", { group_id, email });
      return NextResponse.json(
        { error: "Missing group_id or email" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Buscar el grupo en la base de datos (solo para metadatos)
    console.log("🔍 Searching group in DB:", group_id);
    const { data, error } = await supabaseServiceRole
      .from("telegram_invitation_configs")
      .select()
      .eq("group_id", group_id)
      .single();

    if (error || !data) {
      console.log("❌ Group not found in DB:", error);
      return NextResponse.json(
        { error: "Group not found" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }
    console.log("✅ Group found in DB:", data);

    // Leer precio y comisión on-chain
    console.log("🔍 Reading on-chain data for group:", group_id);
    const onchainGroup = (await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: TelegramGroupInvitationABI,
      functionName: "getGroup",
      args: [group_id],
    })) as [string, bigint, bigint, boolean];
    const [owner, price, referralCommission, exists] = onchainGroup;
    console.log("📊 On-chain data:", {
      owner,
      price: price.toString(),
      referralCommission: referralCommission.toString(),
      exists,
    });

    if (!exists) {
      console.log("❌ Group not found on chain");
      return NextResponse.json(
        { error: "Group not found on chain" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Obtener el platform fee
    const platformFee = (await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: TelegramGroupInvitationABI,
      functionName: "platformFee",
    })) as bigint;

    console.log("💰 Platform fee:", platformFee.toString());

    // Validar que no exista un registro con el mismo email y group_id
    console.log("🔍 Checking for existing invitation:", { group_id, email });
    const { data: existingInvitation, error: checkError } =
      await supabaseServiceRole
        .from("telegram_invitations")
        .select()
        .eq("group_id", group_id)
        .eq("email", email)
        .single();

    if (existingInvitation) {
      console.log("📊 Existing invitation found:", existingInvitation);
      if (existingInvitation.status === "COMPLETED") {
        console.log("❌ Duplicate completed invitation found");
        return NextResponse.json(
          {
            error:
              "This email already has a completed invitation for this group",
          },
          {
            status: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }
      console.log(
        "✅ Existing invitation is not completed, continuing with flow"
      );
    } else {
      console.log("✅ No existing invitation found, creating new record");
      // Calcular el hash del group_id (Solidity style)
      const group_id_hash = keccak256(toUtf8Bytes(group_id));
      // Crear el registro en la base de datos
      const { error: insertError } = await supabaseServiceRole
        .from("telegram_invitations")
        .insert([
          {
            group_id,
            group_id_hash, // nuevo campo para cruce on-chain
            email,
            payer_address: payer_address?.toLowerCase(),
            referral,
            status: "PENDING",
          },
        ]);

      if (insertError) {
        console.log("❌ Failed to create invitation record:", insertError);
        return NextResponse.json(
          { error: "Failed to create invitation record" },
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }
      console.log("✅ New invitation record created");
    }

    // Codificar los datos de la función del contrato
    console.log("🔧 Encoding contract function data");
    const args = [
      group_id,
      referral || "0x0000000000000000000000000000000000000000",
    ];
    console.log("📝 Contract args:", {
      group_id,
      referral: referral || "0x0000000000000000000000000000000000000000",
      price: price.toString(),
      platformFee: platformFee.toString(),
      total: (price + platformFee).toString(),
    });

    const dataTx = encodeFunctionData({
      abi: TelegramGroupInvitationABI,
      functionName: "buyInvitation",
      args,
    });
    const tx: TransactionSerializable = {
      to: CONTRACT_ADDRESS,
      data: dataTx,
      value: BigInt(price) + BigInt(platformFee),
      chainId: avalanche.id,
      type: "legacy",
    };
    console.log("📦 Transaction data:", {
      to: CONTRACT_ADDRESS,
      value: (price + platformFee).toString(),
      chainId: avalanche.id,
      data: dataTx,
    });

    const serialized = serialize(tx);
    console.log("✅ Transaction serialized");

    const resp: ExecutionResponse = {
      serializedTransaction: serialized,
      chainId: avalanche.name,
    };
    console.log("🚀 Sending response");
    return NextResponse.json(resp, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("❌ Error en petición POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
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
