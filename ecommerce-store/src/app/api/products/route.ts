import { requireAdmin } from "@/lib/auth";
import { createProduct, listProducts } from "@/lib/data";
import { json, slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  if (all && !(await requireAdmin())) {
    return json({ error: "Unauthorized" }, 401);
  }
  const products = await listProducts({
    all,
    featured: searchParams.get("featured") === "1",
    category: searchParams.get("category") || undefined,
  });
  return json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name || body.price == null) {
    return json({ error: "Name and price are required." }, 400);
  }

  try {
    const product = await createProduct({
      name,
      slug: slugify(body.slug || name),
      description: body.description || "",
      price: Number(body.price),
      compareAtPrice: Number(body.compareAtPrice || 0),
      category: body.category || "General",
      images: Array.isArray(body.images) ? body.images : [],
      stock: Number(body.stock || 0),
      featured: Boolean(body.featured),
      active: body.active !== false,
    });
    return json({ product }, 201);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not save product." }, 400);
  }
}
