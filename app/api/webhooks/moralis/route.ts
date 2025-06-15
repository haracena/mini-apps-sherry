import { supabaseServiceRole } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { TelegramGroupInvitationABI } from "@/abi/TelegramGroupInvitation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 Moralis webhook received:", JSON.stringify(body, null, 2));

    // Moralis suele enviar los logs en body.logs
    const logs = body?.logs || [];
    console.log("📑 Logs recibidos:", logs.length);

    // Prepara el iface de ethers para decodificar
    const iface = new ethers.Interface(TelegramGroupInvitationABI);
    // Hash del evento InvitationBought
    const invitationBoughtTopic =
      "0x46ca3e9f0f6442eff3abf5cd075c4db9cb36733d9f78f8df98a7653790214469";

    for (const log of logs) {
      if (log.topic0 === invitationBoughtTopic) {
        try {
          // Decodifica el log
          const decoded = iface.decodeEventLog("InvitationBought", log.data, [
            log.topic0,
            log.topic1,
            log.topic2,
            log.topic3,
          ]);
          // decoded es un objeto con las propiedades del evento
          const groupId = decoded.groupId;
          const buyer = decoded.buyer;
          const referrer = decoded.referrer;
          const amount = decoded.amount;
          const commission = decoded.commission;
          const platformFee = decoded.platformFee;

          console.log("🎯 Decoded InvitationBought:", {
            groupId,
            buyer,
            referrer,
            amount: amount.toString(),
            commission: commission.toString(),
            platformFee: platformFee.toString(),
          });

          // Busca la invitación pendiente en Supabase
          const { data: invitation, error } = await supabaseServiceRole
            .from("telegram_invitations")
            .select()
            .eq("group_id", groupId)
            .eq("payer_address", buyer)
            .eq("status", "PENDING")
            .single();
          if (error) {
            console.log("❌ Error buscando invitación:", error);
          }
          if (invitation) {
            // Marca como completada
            const { error: updateError } = await supabaseServiceRole
              .from("telegram_invitations")
              .update({ status: "COMPLETED" })
              .eq("id", invitation.id);
            if (updateError) {
              console.log("❌ Error actualizando invitación:", updateError);
            } else {
              console.log(
                `✅ Invitación COMPLETED para group_id=${groupId}, payer_address=${buyer}`
              );
            }
          } else {
            console.log(
              `ℹ️ No se encontró invitación pendiente para group_id=${groupId}, payer_address=${buyer}`
            );
          }
        } catch (err) {
          console.error("❌ Error decoding log:", err);
        }
      } else {
        console.log("ℹ️ Log ignorado, no es InvitationBought");
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error in Moralis webhook:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
