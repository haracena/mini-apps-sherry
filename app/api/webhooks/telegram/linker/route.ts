import { NextRequest } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";

function extractGroupId(text: string): string | null {
  const parts = text.split(" ");
  if (parts.length !== 2) return null;
  return parts[1];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;

    console.log("Full message object:", JSON.stringify(message, null, 2));

    if (!message || message.from?.is_bot) {
      return new Response("Ignored", { status: 200 });
    }
    const chat = message.chat;
    const text = message.text;
    const userId = message.from?.id;

    // just process /linkgroup messages
    if (chat.type === "supergroup" && text?.startsWith("/linkgroup")) {
      const groupId = extractGroupId(text);
      if (!groupId) {
        return new Response("Invalid command format. Use: /linkgroup <id>", {
          status: 200,
        });
      }

      const { data, error } = await supabaseServiceRole
        .from("telegram_invitation_configs")
        .insert([
          {
            telegram_group_id: chat.id.toString(),
            telegram_group_name: chat.title,
            telegram_user_id: userId?.toString(),
            group_id: groupId,
          },
        ])
        .select();

      if (error) {
        console.error("Error inserting data:", error);
        return new Response("Error linking group", { status: 500 });
      }

      return new Response("Group linked ✅", { status: 200 });
    }

    return new Response("Ignored", { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
