import { fetchMatches, fetchPlayers } from "@/lib/data";
import { computeLeagueStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [players, matches] = await Promise.all([fetchPlayers(), fetchMatches()]);
    const stats = computeLeagueStats(players, matches);
    return Response.json(stats, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
