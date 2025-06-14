import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 Alchemy webhook received:", JSON.stringify(body, null, 2));

    // Alchemy Notify envía los logs en body.event.data (verifica en el dashboard el formato exacto)
    // Ejemplo de acceso:
    // const logs = body.event.data;
    // for (const log of logs) {
    //   const { groupId, buyer, referrer, amount, commission, platformFee } = log;
    //   // TODO: Buscar el email en tu DB usando groupId y buyer
    //   // TODO: Enviar el correo de invitación
    // }

    // Por ahora solo loguea y responde OK
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error in Alchemy webhook:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
