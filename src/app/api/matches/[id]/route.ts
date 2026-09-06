import { NextRequest } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to delete match" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    const updates: Record<string, unknown> = {};
    if (typeof body.comment === "string") updates.comment = body.comment.trim() || null;
    if (typeof body.player1Character === "string")
      updates.player1_character = body.player1Character;
    if (typeof body.player2Character === "string")
      updates.player2_character = body.player2Character;

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "No updates provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("matches")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return Response.json({ match: data });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to update match" }, { status: 500 });
  }
}
