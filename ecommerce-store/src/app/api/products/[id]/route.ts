import { requireAdmin } from "@/lib/auth";
import { deleteProduct, getProduct, updateProduct } from "@/lib/data";
import { json, slugify } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return json({ error: "Product not found." }, 404);
  return json({ product });
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
    const product = await updateProduct(id, {
      name: body.name,
      slug: body.slug ? slugify(body.slug) : undefined,
      description: body.description,
      price: Number(body.price),
      compareAtPrice: Number(body.compareAtPrice || 0),
      category: body.category,
      images: Array.isArray(body.images) ? body.images : [],
      stock: Number(body.stock || 0),
      featured: Boolean(body.featured),
      active: body.active !== false,
    });
    if (!product) return json({ error: "Product not found." }, 404);
    return json({ product });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not update product." }, 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const { id } = await params;
  await deleteProduct(id);
  return json({ ok: true });
}
