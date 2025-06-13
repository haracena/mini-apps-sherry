import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, parseEventLogs, getAbiItem } from "viem";
import { avalancheFuji } from "viem/chains";
import { TelegramGroupInvitationABI } from "@/abi/TelegramGroupInvitation";
import type { AbiEvent } from "viem";

const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(process.env.ALCHEMY_RPC_URL!),
});

const CONTRACT_ADDRESS = "0x6aC5052432CDdb9Ff4F1b39DA03CA133dBCd8DcF";

// TODO: Guarda y recupera el último bloque procesado en tu base de datos para persistencia real
let lastBlock: bigint | null = null;

// Find the event ABI item (asegura que es un evento)
const eventAbi = TelegramGroupInvitationABI.find(
  (item) => item.type === "event" && item.name === "InvitationBought"
) as AbiEvent;

export async function GET(req: NextRequest) {
  // Seguridad: solo acepta requests del cronjob de Vercel
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const latestBlock = await publicClient.getBlockNumber();

    // Si es la primera vez, solo inicializa lastBlock y no procesa nada
    if (!lastBlock) {
      lastBlock = latestBlock;
      return NextResponse.json({ ok: true, message: "Initialized lastBlock" });
    }

    // Busca eventos InvitationBought desde el último bloque procesado
    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS,
      event: eventAbi,
      fromBlock: lastBlock + 1n,
      toBlock: latestBlock,
    });

    for (const log of logs) {
      // TODO: Busca el email en tu DB usando log.args.groupId y log.args.buyer
      // TODO: Envía el link de invitación por email
      console.log("Compra detectada:", log.args);
      // Ejemplo: await sendEmail(email, link);
    }

    lastBlock = latestBlock;

    return NextResponse.json({ ok: true, processed: logs.length });
  } catch (error: any) {
    console.error("Error in cron-listener:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
