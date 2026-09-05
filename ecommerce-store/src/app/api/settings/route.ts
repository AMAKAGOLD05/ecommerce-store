import { requireAdmin } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/data";
import { json } from "@/lib/utils";

export async function GET() {
  return json({ settings: await getSettings() });
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const body = await request.json();
  return json({ settings: await updateSettings(body) });
}
