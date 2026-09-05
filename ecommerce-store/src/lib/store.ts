import {
  getPageBySlug,
  getProductBySlug,
  getSettings,
  listPages,
  listProducts,
  type FilePage,
  type FileProduct,
  type StoreSettings,
} from "@/lib/data";

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

export type StoreProduct = FileProduct;
export type SerializedSettings = StoreSettings;
export type SerializedPage = FilePage;
export type SerializedProduct = StoreProduct;
