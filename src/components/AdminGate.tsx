"use client";

import { useEffect, useState } from "react";
import {
  clearAdminSecret,
  getAdminSecret,
  setAdminSecret,
} from "@/lib/api-client";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getAdminSecret();
    if (!existing) {
      setReady(true);
      return;
    }
    fetch("/api/auth/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${existing}` },
    })
      .then((res) => {
        setUnlocked(res.ok);
        if (!res.ok) clearAdminSecret();
      })
      .finally(() => setReady(true));
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!res.ok) {
        setError(
          res.status === 503
            ? "Server misconfigured — restart the app after setting ADMIN_SECRET"
            : "Wrong secret",
        );
        return;
      }
      setAdminSecret(secret);
      setUnlocked(true);
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-[var(--muted)]">
        Checking access…
      </div>
    );
  }

  if (!unlocked) {
    return (
      <form
        onSubmit={unlock}
        className="mx-auto mt-8 max-w-sm rounded-2xl border border-white/10 bg-[#12121c] p-5"
      >
        <h2 className="display text-center text-xl text-[var(--gold)]">
          Unlock Match Entry
        </h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Enter the league admin secret to save matches. It stays in this
          browser session only.
        </p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Admin secret"
          className="mt-4 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 outline-none focus:border-[var(--gold)]"
          autoComplete="current-password"
        />
        {error ? (
          <p className="mt-2 text-center text-sm text-[var(--lose)]">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading || !secret}
          className="mt-4 w-full rounded-xl bg-[var(--gold)] py-3 font-bold text-black disabled:opacity-50"
        >
          {loading ? "Checking…" : "Unlock"}
        </button>
      </form>
    );
  }

  return <>{children}</>;
}
