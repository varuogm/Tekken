import { NextRequest } from "next/server";
import {
  isAdminSecretConfigured,
  isAuthorized,
  misconfiguredResponse,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!isAdminSecretConfigured()) {
    return misconfiguredResponse();
  }
  if (!isAuthorized(request)) {
    return Response.json({ ok: false }, { status: 401 });
  }
  return Response.json({ ok: true });
}
