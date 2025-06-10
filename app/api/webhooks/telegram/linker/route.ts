// /app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Utilidad para llamar a la API de Telegram
async function getChatMemberStatus(chatId: number, userId: number) {
  const res = await fetch(
    `${TELEGRAM_API}/getChatMember?chat_id=${chatId}&user_id=${userId}`
  );
  const data = await res.json();
  return data.result?.status; // 'creator', 'administrator', 'member', etc.
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verificamos si es el comando correcto
  const message = body?.message;
  const text: string = message?.text;

  if (text?.startsWith("/vincular")) {
    const chatId = message.chat.id;
    const userId = message.from.id;

    const status = await getChatMemberStatus(chatId, userId);

    if (status === "creator" || status === "administrator") {
      // Aquí puedes guardar la vinculación en tu DB
      // por ejemplo: userTelegramId <-> chatId
      console.log(`✅ Grupo ${chatId} vinculado por usuario ${userId}`);

      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Grupo vinculado correctamente. Ya puedes usar tu dashboard. ",
        }),
      });
    } else {
      await fetch(`${TELEGRAM_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "❌ Solo un administrador o creador puede vincular el grupo.",
        }),
      });
    }
  }

  return NextResponse.json({ ok: true });
}
