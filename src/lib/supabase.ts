import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase admin client (service role).
 *
 * Preferred keys (match typical Vercel ↔ Supabase integration):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Fallbacks if your project uses alternate names:
 *   URL  → NEXT_PUBLIC_TEKKENSUPABASE_URL (public URL only; safe)
 *   Key  → SUPABASE_SECRET_KEY (service-role alias — never NEXT_PUBLIC_*)
 *
 * Do not use SUPABASE_ANON_KEY / NEXT_PUBLIC_* keys for writes.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_TEKKENSUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase config. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY).",
    );
  }

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return client;
}
