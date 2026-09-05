import { requireAdmin } from "@/lib/auth";
import { createPage, listPages } from "@/lib/data";
import { json, slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (all && !(await requireAdmin())) {
    return json({ error: "Unauthorized" }, 401);
  }
  return json({ pages: await listPages(all) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const body = await request.json();
  const title = String(body.title || "").trim();
  if (!title) return json({ error: "Title is required." }, 400);

  try {
    const page = await createPage({
      title,
      slug: slugify(body.slug || title),
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || "",
      published: body.published !== false,
      showInFooter: body.showInFooter !== false,
      seoTitle: body.seoTitle || title,
      seoDescription: body.seoDescription || body.excerpt || "",
    });
    return json({ page }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not save page." }, 400);
  }
}
