import { getSupabaseAdmin } from "@/lib/supabase";
import type { MatchWithPlayers, Player } from "@/lib/types";

export async function fetchPlayers(): Promise<Player[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("players")
    .select("id, name, created_at")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function fetchMatches(): Promise<MatchWithPlayers[]> {
  const supabase = getSupabaseAdmin();
  const players = await fetchPlayers();
  const byId = new Map(players.map((p) => [p.id, p]));

  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, player1_id, player2_id, player1_character, player2_character, winner_id, loser_id, comment, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).flatMap((m) => {
    const player1 = byId.get(m.player1_id);
    const player2 = byId.get(m.player2_id);
    const winner = byId.get(m.winner_id);
    const loser = byId.get(m.loser_id);
    if (!player1 || !player2 || !winner || !loser) return [];
    return [
      {
        ...m,
        player1,
        player2,
        winner,
        loser,
      },
    ];
  });
}

export function findPlayerBySlug(
  players: Player[],
  slug: string,
): Player | undefined {
  const normalized = slug.trim().toLowerCase();
  return players.find((p) => p.name.toLowerCase() === normalized);
}
