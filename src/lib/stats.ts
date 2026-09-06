import { CHARACTERS, getCharacterName, TROPHY_CONFIG } from "@/lib/constants";
import type {
  FunStats,
  HeadToHead,
  LeaderboardEntry,
  LeagueStats,
  MatchWithPlayers,
  Player,
  PlayerStats,
} from "@/lib/types";

function chronological(matches: MatchWithPlayers[]): MatchWithPlayers[] {
  return [...matches].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

function reverseChronological(matches: MatchWithPlayers[]): MatchWithPlayers[] {
  return [...matches].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

export function computePlayerStats(
  players: Player[],
  matches: MatchWithPlayers[],
): PlayerStats[] {
  const ordered = chronological(matches);

  return players.map((player) => {
    let trophies = TROPHY_CONFIG.startingTrophies;
    let wins = 0;
    let losses = 0;
    let currentStreak = 0;
    let longestWinStreak = 0;
    let longestLoseStreak = 0;
    let runningWin = 0;
    let runningLose = 0;
    const recentForm: ("W" | "L")[] = [];
    const charMap = new Map<string, { matches: number; wins: number }>();

    for (const match of ordered) {
      const isP1 = match.player1_id === player.id;
      const isP2 = match.player2_id === player.id;
      if (!isP1 && !isP2) continue;

      const won = match.winner_id === player.id;
      const character = isP1 ? match.player1_character : match.player2_character;
      const usage = charMap.get(character) ?? { matches: 0, wins: 0 };
      usage.matches += 1;
      if (won) usage.wins += 1;
      charMap.set(character, usage);

      if (won) {
        wins += 1;
        trophies += TROPHY_CONFIG.winDelta;
        runningWin += 1;
        runningLose = 0;
        longestWinStreak = Math.max(longestWinStreak, runningWin);
        recentForm.push("W");
      } else {
        losses += 1;
        trophies += TROPHY_CONFIG.lossDelta;
        runningLose += 1;
        runningWin = 0;
        longestLoseStreak = Math.max(longestLoseStreak, runningLose);
        recentForm.push("L");
      }
    }

    currentStreak =
      runningWin > 0 ? runningWin : runningLose > 0 ? -runningLose : 0;

    const total = wins + losses;
    const characterUsage = [...charMap.entries()]
      .map(([id, stats]) => ({
        id,
        name: getCharacterName(id),
        matches: stats.matches,
        wins: stats.wins,
        winRate: stats.matches ? (stats.wins / stats.matches) * 100 : 0,
      }))
      .sort((a, b) => b.matches - a.matches);

    const favoriteCharacter = characterUsage[0]?.id ?? null;
    const bestCharacter =
      characterUsage
        .filter((c) => c.matches >= 3)
        .sort((a, b) => b.winRate - a.winRate || b.matches - a.matches)[0] ??
      characterUsage
        .filter((c) => c.matches >= 1)
        .sort((a, b) => b.winRate - a.winRate || b.matches - a.matches)[0] ??
      null;

    return {
      playerId: player.id,
      name: player.name,
      trophies,
      wins,
      losses,
      matches: total,
      winRate: total ? (wins / total) * 100 : 0,
      currentStreak,
      longestWinStreak,
      longestLoseStreak,
      recentForm: recentForm.slice(-5).reverse(),
      favoriteCharacter,
      bestCharacter: bestCharacter
        ? {
            id: bestCharacter.id,
            winRate: bestCharacter.winRate,
            matches: bestCharacter.matches,
          }
        : null,
      characterUsage,
    };
  });
}

export function buildLeaderboard(stats: PlayerStats[]): LeaderboardEntry[] {
  return [...stats]
    .sort((a, b) => {
      if (b.trophies !== a.trophies) return b.trophies - a.trophies;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return a.name.localeCompare(b.name);
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function computeHeadToHead(
  players: Player[],
  matches: MatchWithPlayers[],
): HeadToHead[] {
  const map = new Map<
    string,
    {
      playerAId: string;
      playerBId: string;
      playerAWins: number;
      playerBWins: number;
      results: { winnerId: string }[];
    }
  >();

  for (const match of chronological(matches)) {
    const key = pairKey(match.player1_id, match.player2_id);
    const [aId, bId] = [match.player1_id, match.player2_id].sort();
    const entry = map.get(key) ?? {
      playerAId: aId,
      playerBId: bId,
      playerAWins: 0,
      playerBWins: 0,
      results: [],
    };

    if (match.winner_id === entry.playerAId) entry.playerAWins += 1;
    else entry.playerBWins += 1;
    entry.results.push({ winnerId: match.winner_id });
    map.set(key, entry);
  }

  const byId = new Map(players.map((p) => [p.id, p.name]));

  return [...map.values()]
    .map((entry) => {
      const total = entry.playerAWins + entry.playerBWins;
      const recent = entry.results.slice(-5);
      return {
        playerA: byId.get(entry.playerAId) ?? "Unknown",
        playerB: byId.get(entry.playerBId) ?? "Unknown",
        playerAId: entry.playerAId,
        playerBId: entry.playerBId,
        matches: total,
        playerAWins: entry.playerAWins,
        playerBWins: entry.playerBWins,
        playerAWinRate: total ? (entry.playerAWins / total) * 100 : 0,
        playerBWinRate: total ? (entry.playerBWins / total) * 100 : 0,
        playerAForm: recent
          .map((r) => (r.winnerId === entry.playerAId ? "W" : "L"))
          .reverse() as ("W" | "L")[],
        playerBForm: recent
          .map((r) => (r.winnerId === entry.playerBId ? "W" : "L"))
          .reverse() as ("W" | "L")[],
      };
    })
    .sort((a, b) => b.matches - a.matches);
}

function computeBiggestClimber(
  players: Player[],
  matches: MatchWithPlayers[],
): FunStats["biggestClimber"] {
  const recent = reverseChronological(matches).slice(0, 10);
  if (recent.length === 0) return null;

  const deltas = new Map<string, number>();
  for (const match of recent) {
    deltas.set(
      match.winner_id,
      (deltas.get(match.winner_id) ?? 0) + TROPHY_CONFIG.winDelta,
    );
    deltas.set(
      match.loser_id,
      (deltas.get(match.loser_id) ?? 0) + TROPHY_CONFIG.lossDelta,
    );
  }

  let best: FunStats["biggestClimber"] = null;
  for (const player of players) {
    const delta = deltas.get(player.id) ?? 0;
    if (!best || delta > best.delta) {
      best = { name: player.name, delta };
    }
  }
  return best && best.delta > 0 ? best : null;
}

export function computeFunStats(
  leaderboard: LeaderboardEntry[],
  headToHead: HeadToHead[],
  matches: MatchWithPlayers[],
  players: Player[],
): FunStats {
  const withMatches = leaderboard.filter((p) => p.matches > 0);

  const kingOfTheArena =
    [...withMatches]
      .filter((p) => p.matches >= 10)
      .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins)[0] ?? null;

  const onFire =
    [...withMatches]
      .filter((p) => p.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)[0] ?? null;

  const mostWins = [...withMatches].sort((a, b) => b.wins - a.wins)[0] ?? null;
  const mostLosses =
    [...withMatches].sort((a, b) => b.losses - a.losses)[0] ?? null;
  const mostActive =
    [...withMatches].sort((a, b) => b.matches - a.matches)[0] ?? null;
  const biggestLosingStreak =
    [...withMatches]
      .filter((p) => p.longestLoseStreak > 0)
      .sort((a, b) => b.longestLoseStreak - a.longestLoseStreak)[0] ?? null;

  let characterMaster: FunStats["characterMaster"] = null;
  for (const player of withMatches) {
    for (const usage of player.characterUsage) {
      if (usage.matches < 5) continue;
      if (
        !characterMaster ||
        usage.winRate > characterMaster.winRate ||
        (usage.winRate === characterMaster.winRate &&
          usage.matches > characterMaster.matches)
      ) {
        characterMaster = {
          player: player.name,
          character: usage.name,
          winRate: usage.winRate,
          matches: usage.matches,
        };
      }
    }
  }

  return {
    kingOfTheArena: kingOfTheArena
      ? {
          name: kingOfTheArena.name,
          winRate: kingOfTheArena.winRate,
          matches: kingOfTheArena.matches,
        }
      : null,
    onFire: onFire
      ? { name: onFire.name, streak: onFire.currentStreak }
      : null,
    mostWins: mostWins ? { name: mostWins.name, wins: mostWins.wins } : null,
    mostLosses: mostLosses
      ? { name: mostLosses.name, losses: mostLosses.losses }
      : null,
    mostPlayedRivalry: headToHead[0] ?? null,
    mostActive: mostActive
      ? { name: mostActive.name, matches: mostActive.matches }
      : null,
    biggestLosingStreak: biggestLosingStreak
      ? {
          name: biggestLosingStreak.name,
          streak: biggestLosingStreak.longestLoseStreak,
        }
      : null,
    characterMaster,
    biggestClimber: computeBiggestClimber(players, matches),
  };
}

export function computeLeagueStats(
  players: Player[],
  matches: MatchWithPlayers[],
): LeagueStats {
  const playerStats = computePlayerStats(players, matches);
  const leaderboard = buildLeaderboard(playerStats);
  const headToHead = computeHeadToHead(players, matches);

  const charCounts = new Map<string, number>();
  for (const match of matches) {
    charCounts.set(
      match.player1_character,
      (charCounts.get(match.player1_character) ?? 0) + 1,
    );
    charCounts.set(
      match.player2_character,
      (charCounts.get(match.player2_character) ?? 0) + 1,
    );
  }

  const characterUsage = CHARACTERS.map((c) => ({
    id: c.id,
    name: c.name,
    matches: charCounts.get(c.id) ?? 0,
  }))
    .filter((c) => c.matches > 0)
    .sort((a, b) => b.matches - a.matches);

  return {
    totalMatches: matches.length,
    totalPlayers: players.length,
    leaderboard,
    headToHead,
    characterUsage,
    fun: computeFunStats(leaderboard, headToHead, matches, players),
    recentMatches: reverseChronological(matches).slice(0, 20),
  };
}

export function findNemesis(
  playerId: string,
  matches: MatchWithPlayers[],
): { name: string; losses: number } | null {
  const losses = new Map<string, { name: string; losses: number }>();
  for (const match of matches) {
    if (match.loser_id !== playerId) continue;
    const current = losses.get(match.winner_id) ?? {
      name: match.winner.name,
      losses: 0,
    };
    current.losses += 1;
    losses.set(match.winner_id, current);
  }
  return [...losses.values()].sort((a, b) => b.losses - a.losses)[0] ?? null;
}
