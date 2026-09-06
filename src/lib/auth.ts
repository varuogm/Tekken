import { NextRequest } from "next/server";

export function isAdminSecretConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET);
}

export function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  return header.slice("Bearer ".length) === secret;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function misconfiguredResponse() {
  return Response.json(
    { error: "Server misconfigured: ADMIN_SECRET is not set" },
    { status: 503 },
  );
}
