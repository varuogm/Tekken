import { NextRequest } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/auth";
import { CHARACTERS } from "@/lib/constants";
import { fetchPlayers, findPlayerBySlug } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { CreateMatchPayload } from "@/lib/types";

const characterIds = new Set<string>(CHARACTERS.map((c) => c.id));

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Response.json({ matches: data ?? [] });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = (await request.json()) as CreateMatchPayload;
    const {
      player1,
      player2,
      player1Character,
      player2Character,
      winner,
      loser,
      comment,
    } = body;

    if (
      !player1 ||
      !player2 ||
      !player1Character ||
      !player2Character ||
      !winner ||
      !loser
    ) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (player1.toLowerCase() === player2.toLowerCase()) {
      return Response.json(
        { error: "Players must be different" },
        { status: 400 },
      );
    }

    if (
      !characterIds.has(player1Character) ||
      !characterIds.has(player2Character)
    ) {
      return Response.json({ error: "Invalid character" }, { status: 400 });
    }

    const players = await fetchPlayers();
    const p1 = findPlayerBySlug(players, player1);
    const p2 = findPlayerBySlug(players, player2);
    const win = findPlayerBySlug(players, winner);
    const lose = findPlayerBySlug(players, loser);

    if (!p1 || !p2 || !win || !lose) {
      return Response.json({ error: "Unknown player" }, { status: 400 });
    }

    if (
      !(win.id === p1.id || win.id === p2.id) ||
      !(lose.id === p1.id || lose.id === p2.id) ||
      win.id === lose.id
    ) {
      return Response.json({ error: "Invalid winner/loser" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("matches")
      .insert({
        player1_id: p1.id,
        player2_id: p2.id,
        player1_character: player1Character,
        player2_character: player2Character,
        winner_id: win.id,
        loser_id: lose.id,
        comment: comment?.trim() || null,
      })
      .select("id, created_at")
      .single();

    if (error) throw error;

    return Response.json({ match: data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create match" }, { status: 500 });
  }
}
