import { NextRequest } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";

function extractGroupId(req: NextRequest) {
  // /api/telegram-invitation-configs/[group_id]
  const pathname = new URL(req.url).pathname;
  // Extrae el último segmento
  return pathname.split("/").pop();
}

export async function GET(req: NextRequest) {
  const group_id = extractGroupId(req);
  if (!group_id) {
    return Response.json({ error: "Missing group_id" }, { status: 400 });
  }
  const { data, error } = await supabaseServiceRole
    .from("telegram_invitation_configs")
    .select()
    .eq("group_id", group_id)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return Response.json({ data: null });
    }
    console.error("Error fetching data:", error);
    return Response.json(
      { error: "Error fetching group config" },
      { status: 500 }
    );
  }
  return Response.json({ data });
}

export async function PATCH(req: NextRequest) {
  try {
    const group_id = extractGroupId(req);
    const body = await req.json();
    const {
      title,
      description,
      owner_address,
      invitation_price,
      referralCommission,
    } = body;

    // Validación básica
    if (!group_id) {
      return Response.json({ error: "Missing group_id" }, { status: 400 });
    }

    // Solo actualiza los campos permitidos
    const updateFields: Record<string, any> = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (owner_address !== undefined) updateFields.owner_address = owner_address;
    if (invitation_price !== undefined)
      updateFields.invitation_price = invitation_price;
    if (referralCommission !== undefined)
      updateFields.referralCommission = referralCommission;

    if (Object.keys(updateFields).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseServiceRole
      .from("telegram_invitation_configs")
      .update(updateFields)
      .eq("group_id", group_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating data:", error);
      return Response.json(
        { error: "Error updating group config" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
