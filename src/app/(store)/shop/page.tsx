import { ProductCard } from "@/components/product-card";
import { getActiveProducts, type StoreProduct } from "@/lib/store";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  let products: StoreProduct[] = [];

  try {
    products = await getActiveProducts(category && category !== "all" ? { category } : {});
  } catch {
    products = [];
  }

  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))];

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Shop Nigeria</p>
      <h1 className="mt-2 font-serif text-5xl">The collection</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <a
            key={item}
            href={item === "all" ? "/shop" : `/shop?category=${encodeURIComponent(item)}`}
            className={`rounded-full px-4 py-2 text-sm ${
              (category || "all") === item
                ? "bg-[#1c1915] text-white"
                : "border border-[#d8cbbb] bg-white"
            }`}
          >
            {item}
          </a>
        ))}
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 ? (
        <p className="mt-16 text-[#5d5348]">No products yet. Add them from the admin dashboard.</p>
      ) : null}
    </div>
  );
}
