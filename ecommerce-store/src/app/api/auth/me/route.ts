import { getSession } from "@/lib/auth";
import { json } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return json({ user: null }, 401);
  }
  return json({ user: session });
}
