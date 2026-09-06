export type Player = {
  id: string;
  name: string;
  created_at?: string;
};

export type Match = {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_character: string;
  player2_character: string;
  winner_id: string;
  loser_id: string;
  comment: string | null;
  created_at: string;
};

export type MatchWithPlayers = Match & {
  player1: Player;
  player2: Player;
  winner: Player;
  loser: Player;
};

export type CreateMatchPayload = {
  player1: string;
  player2: string;
  player1Character: string;
  player2Character: string;
  winner: string;
  loser: string;
  comment?: string;
};

export type PlayerStats = {
  playerId: string;
  name: string;
  trophies: number;
  wins: number;
  losses: number;
  matches: number;
  winRate: number;
  currentStreak: number;
  longestWinStreak: number;
  longestLoseStreak: number;
  recentForm: ("W" | "L")[];
  favoriteCharacter: string | null;
  bestCharacter: { id: string; winRate: number; matches: number } | null;
  characterUsage: { id: string; name: string; matches: number; wins: number; winRate: number }[];
};

export type LeaderboardEntry = PlayerStats & {
  rank: number;
};

export type HeadToHead = {
  playerA: string;
  playerB: string;
  playerAId: string;
  playerBId: string;
  matches: number;
  playerAWins: number;
  playerBWins: number;
  playerAWinRate: number;
  playerBWinRate: number;
  playerAForm: ("W" | "L")[];
  playerBForm: ("W" | "L")[];
};

export type CharacterUsageStat = {
  id: string;
  name: string;
  matches: number;
};

export type FunStats = {
  kingOfTheArena: { name: string; winRate: number; matches: number } | null;
  onFire: { name: string; streak: number } | null;
  mostWins: { name: string; wins: number } | null;
  mostLosses: { name: string; losses: number } | null;
  mostPlayedRivalry: HeadToHead | null;
  mostActive: { name: string; matches: number } | null;
  biggestLosingStreak: { name: string; streak: number } | null;
  characterMaster: { player: string; character: string; winRate: number; matches: number } | null;
  biggestClimber: { name: string; delta: number } | null;
};

export type LeagueStats = {
  totalMatches: number;
  totalPlayers: number;
  leaderboard: LeaderboardEntry[];
  headToHead: HeadToHead[];
  characterUsage: CharacterUsageStat[];
  fun: FunStats;
  recentMatches: MatchWithPlayers[];
};
