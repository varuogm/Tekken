"use client";

import { useQuery } from "@tanstack/react-query";
import type { LeagueStats } from "@/lib/types";

async function fetchStats(): Promise<LeagueStats> {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export function useLeagueStats() {
  return useQuery({
    queryKey: ["league-stats"],
    queryFn: fetchStats,
  });
}
