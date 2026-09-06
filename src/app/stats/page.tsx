"use client";

import { useMemo, useState } from "react";
import { MatchScorecard } from "@/components/MatchScorecard";
import { useLeagueStats } from "@/hooks/useLeagueStats";
import { getCharacterName } from "@/lib/constants";
import type { MatchWithPlayers } from "@/lib/types";

function FormDots({ form }: { form: ("W" | "L")[] }) {
  return (
    <div className="flex gap-1">
      {form.map((r, i) => (
        <span
          key={`${r}-${i}`}
          className={`h-3 w-3 rounded-full ${
            r === "W" ? "bg-[var(--win)]" : "bg-[var(--lose)]"
          }`}
        />
      ))}
      {form.length === 0 ? (
        <span className="text-xs text-[var(--muted)]">No matches</span>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="panel rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted)]">
        {title}
      </p>
      <p className="display mt-2 text-2xl text-[var(--gold-soft)]">{value}</p>
      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function StatsPage() {
  const { data, isLoading, error } = useLeagueStats();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<MatchWithPlayers | null>(
    null,
  );

  const player = useMemo(() => {
    if (!data?.leaderboard.length) return null;
    const name = selectedPlayer || data.leaderboard[0].name;
    return data.leaderboard.find((p) => p.name === name) ?? data.leaderboard[0];
  }, [data, selectedPlayer]);

  const nemesis = useMemo(() => {
    if (!data || !player) return null;
    let best: { name: string; losses: number } | null = null;
    for (const h of data.headToHead) {
      if (h.playerAId === player.playerId) {
        const losses = h.playerBWins;
        if (!best || losses > best.losses) best = { name: h.playerB, losses };
      } else if (h.playerBId === player.playerId) {
        const losses = h.playerAWins;
        if (!best || losses > best.losses) best = { name: h.playerA, losses };
      }
    }
    return best && best.losses > 0 ? best : null;
  }, [data, player]);

  if (isLoading) {
    return (
      <main className="page-shell mx-auto max-w-lg px-4 pt-6">
        <p className="text-center text-[var(--muted)]">Crunching stats…</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="page-shell mx-auto max-w-lg px-4 pt-6">
        <p className="text-center text-[var(--lose)]">Failed to load stats.</p>
      </main>
    );
  }

  const { fun } = data;

  return (
    <main className="page-shell mx-auto max-w-lg space-y-8 px-4 pb-4">
      <header className="text-center">
        <h1 className="display text-3xl text-[var(--gold)]">Stats</h1>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatCard title="Total Matches" value={String(data.totalMatches)} />
        <StatCard title="Total Players" value={String(data.totalPlayers)} />
      </section>

      <section className="space-y-3">
        <h2 className="display text-lg text-white">Fun Facts</h2>
        <div className="grid gap-3">
          {fun.mostWins ? (
            <StatCard
              title="🐐 Most Wins"
              value={fun.mostWins.name}
              subtitle={`${fun.mostWins.wins} wins`}
            />
          ) : null}
          {fun.onFire ? (
            <StatCard
              title="🔥 On Fire"
              value={fun.onFire.name}
              subtitle={`${fun.onFire.streak} win streak`}
            />
          ) : null}
          {fun.mostLosses ? (
            <StatCard
              title="💀 Most Losses"
              value={fun.mostLosses.name}
              subtitle={`${fun.mostLosses.losses} losses`}
            />
          ) : null}
          {fun.mostPlayedRivalry ? (
            <StatCard
              title="⚔️ Most Played"
              value={`${fun.mostPlayedRivalry.playerA} vs ${fun.mostPlayedRivalry.playerB}`}
              subtitle={`${fun.mostPlayedRivalry.matches} matches`}
            />
          ) : null}
          {fun.kingOfTheArena ? (
            <StatCard
              title="👑 King of the Arena"
              value={fun.kingOfTheArena.name}
              subtitle={`${fun.kingOfTheArena.winRate.toFixed(1)}% · ${fun.kingOfTheArena.matches} matches`}
            />
          ) : null}
          {fun.characterMaster ? (
            <StatCard
              title="🎮 Character Master"
              value={`${fun.characterMaster.player}`}
              subtitle={`${fun.characterMaster.character} · ${fun.characterMaster.winRate.toFixed(1)}%`}
            />
          ) : null}
          {fun.mostActive ? (
            <StatCard
              title="🥊 Most Active"
              value={fun.mostActive.name}
              subtitle={`${fun.mostActive.matches} matches`}
            />
          ) : null}
          {fun.biggestLosingStreak ? (
            <StatCard
              title="📉 Biggest Losing Streak"
              value={fun.biggestLosingStreak.name}
              subtitle={`${fun.biggestLosingStreak.streak} losses`}
            />
          ) : null}
          {fun.biggestClimber ? (
            <StatCard
              title="📈 Biggest Climber"
              value={fun.biggestClimber.name}
              subtitle={`+${fun.biggestClimber.delta} trophies recently`}
            />
          ) : null}
        </div>
      </section>

      {player ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="display text-lg">Player Stats</h2>
            <select
              value={player.name}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="rounded-lg border border-white/15 bg-[#12121c] px-3 py-2 text-sm uppercase"
            >
              {data.leaderboard.map((p) => (
                <option key={p.playerId} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="panel rounded-2xl p-5">
            <p className="display text-2xl">{player.name}</p>
            <p className="mt-1 text-xl text-[var(--gold)]">{player.trophies} 🏆</p>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {player.wins} W · {player.losses} L · {player.winRate.toFixed(1)}%
              win rate
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-[var(--muted)]">Current streak</p>
                <p className="font-semibold">
                  {player.currentStreak > 0
                    ? `🔥 ${player.currentStreak}`
                    : player.currentStreak < 0
                      ? `💀 ${Math.abs(player.currentStreak)}`
                      : "—"}
                </p>
              </div>
              <div>
                <p className="text-[var(--muted)]">Longest win streak</p>
                <p className="font-semibold">🔥 {player.longestWinStreak}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-[var(--muted)]">
                Recent form
              </p>
              <FormDots form={player.recentForm} />
            </div>
            {nemesis ? (
              <p className="mt-4 text-sm text-[var(--muted)]">
                💀 Nemesis:{" "}
                <span className="text-white">
                  {nemesis.name} ({nemesis.losses} losses)
                </span>
              </p>
            ) : null}

            {player.bestCharacter ? (
              <p className="mt-3 text-sm text-[var(--muted)]">
                Best character:{" "}
                <span className="text-white">
                  {getCharacterName(player.bestCharacter.id)} (
                  {player.bestCharacter.winRate.toFixed(0)}%)
                </span>
              </p>
            ) : null}
          </div>

          {player.characterUsage.length > 0 ? (
            <div className="panel rounded-2xl p-4">
              <h3 className="display text-base text-[var(--gold)]">
                🎮 Character Usage
              </h3>
              <ul className="mt-3 space-y-2">
                {player.characterUsage.slice(0, 6).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{c.name}</span>
                    <span className="text-[var(--muted)]">
                      {c.matches} · {c.winRate.toFixed(0)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="display text-lg">🎮 Most Used Characters</h2>
        <div className="panel rounded-2xl p-4">
          {data.characterUsage.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No character data yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.characterUsage.slice(0, 8).map((c, i) => (
                <li key={c.id} className="flex items-center justify-between">
                  <span className="display text-base">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}{" "}
                    {c.name}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {c.matches} matches
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="display text-lg">⚔️ Head-to-Head</h2>
        {data.headToHead.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No rivalries yet.</p>
        ) : (
          data.headToHead.map((h) => (
            <div
              key={`${h.playerAId}-${h.playerBId}`}
              className="panel rounded-2xl p-4"
            >
              <p className="display text-lg">
                {h.playerA} vs {h.playerB}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {h.matches} matches · {h.playerAWins}–{h.playerBWins}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-semibold">{h.playerA}</p>
                  <p className="text-[var(--muted)]">
                    {h.playerAWinRate.toFixed(1)}%
                  </p>
                  <FormDots form={h.playerAForm} />
                </div>
                <div>
                  <p className="font-semibold">{h.playerB}</p>
                  <p className="text-[var(--muted)]">
                    {h.playerBWinRate.toFixed(1)}%
                  </p>
                  <FormDots form={h.playerBForm} />
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="display text-lg">Recent Battles</h2>
        {data.recentMatches.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No battles recorded.</p>
        ) : (
          <div className="space-y-2">
            {data.recentMatches.map((match, idx) => (
              <button
                key={match.id}
                type="button"
                onClick={() => setSelectedMatch(match)}
                className="panel flex w-full flex-col rounded-2xl p-4 text-left transition active:scale-[0.99]"
              >
                <p className="font-semibold">
                  ⚔️ {match.winner.name} defeated {match.loser.name}
                </p>
                <p className="mt-1 text-sm capitalize text-[var(--muted)]">
                  {getCharacterName(match.player1_character)} vs{" "}
                  {getCharacterName(match.player2_character)}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Battle #{data.totalMatches - idx}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedMatch ? (
        <MatchScorecard
          match={selectedMatch}
          indexLabel={`#${
            data.totalMatches -
            data.recentMatches.findIndex((m) => m.id === selectedMatch.id)
          }`}
          onClose={() => setSelectedMatch(null)}
        />
      ) : null}

      <footer className="pt-4 pb-2 text-center">
        <a
          href="https://github.com/varuogm/Tekken"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--muted)] underline-offset-2 hover:text-[var(--gold)] hover:underline"
        >
          github.com/varuogm/Tekken
        </a>
      </footer>
    </main>
  );
}
