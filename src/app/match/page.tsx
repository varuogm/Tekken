"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminGate } from "@/components/AdminGate";
import { CharacterSwipe } from "@/components/CharacterSwipe";
import { PlayerPicker } from "@/components/PlayerPicker";
import { apiFetch } from "@/lib/api-client";
import { getCharacterName, PLAYERS } from "@/lib/constants";

type Phase = "pick" | "confirm";

export default function MatchPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [leftPlayer, setLeftPlayer] = useState<string>(PLAYERS[1]);
  const [rightPlayer, setRightPlayer] = useState<string>(PLAYERS[0]);
  const [leftChar, setLeftChar] = useState("kazuya");
  const [rightChar, setRightChar] = useState("jin");
  const [pickerSide, setPickerSide] = useState<"left" | "right" | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [leftWon, setLeftWon] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const winner = useMemo(() => {
    if (leftWon == null) return null;
    return leftWon ? leftPlayer : rightPlayer;
  }, [leftWon, leftPlayer, rightPlayer]);

  const loser = useMemo(() => {
    if (leftWon == null) return null;
    return leftWon ? rightPlayer : leftPlayer;
  }, [leftWon, leftPlayer, rightPlayer]);

  function chooseResult(won: boolean) {
    setLeftWon(won);
    setPhase("confirm");
    setError("");
  }

  async function saveMatch() {
    if (!winner || !loser) return;
    setSaving(true);
    setError("");
    try {
      const res = await apiFetch("/api/matches", {
        method: "POST",
        body: JSON.stringify({
          player1: leftPlayer.toLowerCase(),
          player2: rightPlayer.toLowerCase(),
          player1Character: leftChar,
          player2Character: rightChar,
          winner: winner.toLowerCase(),
          loser: loser.toLowerCase(),
          comment: comment.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }

      await queryClient.invalidateQueries({ queryKey: ["league-stats"] });
      setPhase("pick");
      setLeftWon(null);
      setComment("");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page-shell mx-auto max-w-lg px-0">
      <header className="px-4 pt-2 text-center">
        <h1 className="display text-3xl text-[var(--gold)]">Register Match</h1>
      </header>

      <AdminGate>
        {phase === "pick" ? (
          <div className="mt-3">
            <div className="grid h-[40vh] min-h-[240px] grid-cols-2 border-y border-[var(--line)]">
              <CharacterSwipe
                side="left"
                value={leftChar}
                onChange={setLeftChar}
                priority
              />
              <CharacterSwipe
                side="right"
                value={rightChar}
                onChange={setRightChar}
                priority
              />
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3">
              <button
                type="button"
                onClick={() => setPickerSide("left")}
                className="min-h-[68px] rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3 text-center active:opacity-80"
              >
                <p className="display text-xl leading-none">{leftPlayer}</p>
              </button>

              <div className="display px-1 text-center text-2xl text-[var(--accent)]">
                VS
              </div>

              <button
                type="button"
                onClick={() => setPickerSide("right")}
                className="min-h-[68px] rounded-xl border border-[var(--line)] bg-[var(--bg-elevated)] px-3 py-3 text-center active:opacity-80"
              >
                <p className="display text-xl leading-none">{rightPlayer}</p>
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 px-3">
              <button
                type="button"
                onClick={() => chooseResult(true)}
                className="display min-h-[92px] rounded-2xl bg-[var(--win)] text-3xl text-black active:scale-[0.98]"
              >
                WIN
              </button>
              <button
                type="button"
                onClick={() => chooseResult(false)}
                className="display min-h-[92px] rounded-2xl bg-[var(--lose)] text-3xl text-white active:scale-[0.98]"
              >
                LOSE
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 px-4">
            <div className="panel rounded-2xl p-5 text-center">
              <p className="display text-3xl text-[var(--gold)]">
                {winner} Wins
              </p>
              <div className="mt-5 space-y-2 text-sm uppercase tracking-[0.15em] text-[var(--muted)]">
                <p>
                  {leftPlayer} · {getCharacterName(leftChar)}
                </p>
                <p className="display text-xl text-[var(--accent)]">VS</p>
                <p>
                  {rightPlayer} · {getCharacterName(rightChar)}
                </p>
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment"
                rows={2}
                className="mt-5 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-3 text-left text-sm outline-none focus:border-[var(--gold)]"
              />

              {error ? (
                <p className="mt-3 text-sm text-[var(--lose)]">{error}</p>
              ) : null}

              <button
                type="button"
                disabled={saving}
                onClick={saveMatch}
                className="display mt-5 w-full rounded-2xl bg-[var(--gold)] py-4 text-2xl text-black disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Match"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase("pick");
                  setLeftWon(null);
                }}
                className="mt-2 w-full py-3 text-sm uppercase tracking-wider text-[var(--muted)]"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </AdminGate>

      <PlayerPicker
        open={pickerSide === "left"}
        value={leftPlayer}
        excluded={rightPlayer}
        onClose={() => setPickerSide(null)}
        onSelect={setLeftPlayer}
      />
      <PlayerPicker
        open={pickerSide === "right"}
        value={rightPlayer}
        excluded={leftPlayer}
        onClose={() => setPickerSide(null)}
        onSelect={setRightPlayer}
      />
    </main>
  );
}
