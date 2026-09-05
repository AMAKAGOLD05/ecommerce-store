import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { json } from "@/lib/utils";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return json({ error: "Unauthorized" }, 401);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return json({ error: "Choose a file to upload." }, 400);
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return json({ error: "Upload a JPG, PNG, WEBP, GIF, or SVG image." }, 400);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > 6 * 1024 * 1024) {
    return json({ error: "File must be under 6MB." }, 400);
  }

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);

  return json({ url: `/uploads/${filename}` });
}
