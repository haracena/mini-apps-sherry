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
          // groupId puede ser un objeto Indexed, lo convertimos a string
          const groupId = decoded.groupId.toString();
          // buyer puede venir con mayúsculas, normalizamos a minúsculas
          const buyer = decoded.buyer.toLowerCase();
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

          // Busca la invitación pendiente en Supabase (siempre en minúsculas)
          const { data: invitation, error } = await supabaseServiceRole
            .from("telegram_invitations")
            .select()
            .eq("group_id", groupId)
            .eq("payer_address", buyer)
            .eq("status", "PENDING")
            .single();
          if (error) {
            console.log("❌ Error buscando invitación:", error);
            continue;
          }
          if (invitation) {
            // Llama al API interno para enviar la invitación por email
            try {
              const sendRes = await fetch(
                `${
                  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                }/api/telegram-invitation/send`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    group_id: groupId,
                    email: invitation.email,
                    payer_address: buyer, // ya en minúsculas
                  }),
                }
              );
              const sendData = await sendRes.json();
              console.log("✉️ Resultado envío invitación:", sendData);

              if (sendRes.ok && sendData.success && sendData.invitation_url) {
                // Email enviado correctamente, update a COMPLETED y guarda el link
                const { error: updateError } = await supabaseServiceRole
                  .from("telegram_invitations")
                  .update({
                    status: "COMPLETED",
                    telegram_invitation_url: sendData.invitation_url,
                  })
                  .eq("id", invitation.id);
                if (updateError) {
                  console.log(
                    "❌ Error actualizando a COMPLETED:",
                    updateError
                  );
                } else {
                  console.log("✅ Invitación marcada como COMPLETED");
                }
              } else {
                // Falló el envío, update a FAILED
                const { error: failError } = await supabaseServiceRole
                  .from("telegram_invitations")
                  .update({ status: "FAILED" })
                  .eq("id", invitation.id);
                if (failError) {
                  console.log("❌ Error actualizando a FAILED:", failError);
                } else {
                  console.log(
                    "❌ Invitación marcada como FAILED (envío fallido)"
                  );
                }
              }
            } catch (err) {
              // Error en el fetch/email, update a FAILED
              console.error("❌ Error enviando invitación:", err);
              const { error: failError } = await supabaseServiceRole
                .from("telegram_invitations")
                .update({ status: "FAILED" })
                .eq("id", invitation.id);
              if (failError) {
                console.log("❌ Error actualizando a FAILED:", failError);
              } else {
                console.log(
                  "❌ Invitación marcada como FAILED (error en fetch)"
                );
              }
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
