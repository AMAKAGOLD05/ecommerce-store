import { cookies } from "next/headers";
import { json } from "@/lib/utils";

export async function POST() {
  const store = await cookies();
  store.delete("admin_session");
  return json({ ok: true });
}
