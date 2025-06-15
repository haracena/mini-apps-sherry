import { NextRequest, NextResponse } from "next/server";
// Si no tienes instalado 'resend', ejecuta: npm install resend
import { Resend } from "resend";

// Configuración de Resend (asegúrate de tener la API key en tu .env)
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración del bot de Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function getTelegramInviteLink(group_id: string): Promise<string | null> {
  try {
    // Crea un link único, de un solo uso
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createChatInviteLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: group_id,
          member_limit: 1, // Solo un uso
          creates_join_request: false, // true si quieres que el usuario tenga que ser aprobado
        }),
      }
    );
    const data = await res.json();
    if (data.ok && data.result && data.result.invite_link) {
      return data.result.invite_link;
    }
    console.error("❌ Error creando link único de Telegram:", data);
    return null;
  } catch (err) {
    console.error("❌ Error en getTelegramInviteLink:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { group_id, email, payer_address } = await req.json();
    if (!group_id || !email) {
      return NextResponse.json(
        { success: false, error: "Missing group_id or email" },
        { status: 400 }
      );
    }

    // 1. Obtener el link real de invitación de Telegram
    const invitation_url = await getTelegramInviteLink(group_id);
    if (!invitation_url) {
      return NextResponse.json(
        { success: false, error: "No se pudo obtener el link de Telegram" },
        { status: 500 }
      );
    }

    // 2. Enviar el email usando Resend
    try {
      const { data, error } = await resend.emails.send({
        from: "Telegram Invitations <noreply@colorpocket.app>",
        to: email,
        subject: "Your invitation to the private Telegram group",
        html: `<p>Hello!</p><p>Thank you for your purchase. Here is your invitation link to the private Telegram group:</p><p><a href="${invitation_url}">${invitation_url}</a></p>`,
      });
      if (error) {
        console.error("❌ Error enviando email:", error);
        return NextResponse.json(
          { success: false, error: "No se pudo enviar el email" },
          { status: 500 }
        );
      }
      console.log("✅ Email enviado a:", email);
      return NextResponse.json({ success: true, invitation_url });
    } catch (err) {
      console.error("❌ Error en envío de email:", err);
      return NextResponse.json(
        { success: false, error: "No se pudo enviar el email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error en send invitation:", error);
    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
