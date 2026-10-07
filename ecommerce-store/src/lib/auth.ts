import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  sessionCookieOptions,
  signSession,
  verifySessionToken,
  type SessionUser,
} from "@/lib/session-token";

export type { SessionUser };
export { COOKIE_NAME, sessionCookieOptions, signSession, verifySessionToken };

export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  return getSession();
}
