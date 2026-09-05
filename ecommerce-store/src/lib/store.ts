import { getPageBySlug, getProductBySlug, getSettings, listPages, listProducts } from "@/lib/data";

export { getSettings };

export async function getPublishedPages() {
  return listPages(false);
}

export async function getActiveProducts(filter: Record<string, unknown> = {}) {
  return listProducts({
    featured: Boolean(filter.featured),
    category: typeof filter.category === "string" ? filter.category : undefined,
  });
}

export async function getStoreProduct(slug: string) {
  return getProductBySlug(slug);
}

export async function getStorePage(slug: string) {
  return getPageBySlug(slug);
}

export type StoreProduct = Awaited<ReturnType<typeof getActiveProducts>>[number];
export type SerializedSettings = Awaited<ReturnType<typeof getSettings>>;
export type SerializedPage = Awaited<ReturnType<typeof getPublishedPages>>[number];
export type SerializedProduct = StoreProduct;
