import { requireAdmin } from "@/lib/auth";
import { deletePage, getPage, updatePage } from "@/lib/data";
import { json, slugify } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) return json({ error: "Page not found." }, 404);
  return json({ page });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const { id } = await params;
  const body = await request.json();
  try {
    const page = await updatePage(id, {
      title: body.title,
      slug: body.slug ? slugify(body.slug) : undefined,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      published: body.published !== false,
      showInFooter: Boolean(body.showInFooter),
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    });
    if (!page) return json({ error: "Page not found." }, 404);
    return json({ page });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not update page." }, 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const { id } = await params;
  await deletePage(id);
  return json({ ok: true });
}
