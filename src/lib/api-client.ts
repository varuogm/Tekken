const STORAGE_KEY = "tekken-admin-secret";

export function getAdminSecret(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminSecret(secret: string) {
  sessionStorage.setItem(STORAGE_KEY, secret);
}

export function clearAdminSecret() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const secret = getAdminSecret();
  if (secret) headers.set("Authorization", `Bearer ${secret}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers, cache: "no-store" });
}
