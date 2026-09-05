import { seedStore } from "@/lib/data";
import { json } from "@/lib/utils";

export async function POST() {
  try {
    return json(await seedStore());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed.";
    return json({ error: message }, 500);
  }
}
