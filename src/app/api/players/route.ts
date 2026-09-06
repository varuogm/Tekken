import { fetchPlayers } from "@/lib/data";

export async function GET() {
  try {
    const players = await fetchPlayers();
    return Response.json({ players });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch players" }, { status: 500 });
  }
}
