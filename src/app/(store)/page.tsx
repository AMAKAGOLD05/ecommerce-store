import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { ProductCard } from "@/components/product-card";
import { emptySettings } from "@/lib/data";
import { getActiveProducts, getSettings, type SerializedSettings, type StoreProduct } from "@/lib/store";

export default async function HomePage() {
  let settings: SerializedSettings = emptySettings();
  let products: StoreProduct[] = [];

  try {
    settings = await getSettings();
    products = await getActiveProducts({ featured: true });
    if (products.length === 0) {
      products = await getActiveProducts();
    }
  } catch {
    settings = emptySettings();
  }

  return (
    <>
      <HeroSection hero={settings.hero} />
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Collection</p>
            <h2 className="mt-2 font-serif text-4xl">{settings.featured?.heading}</h2>
            <p className="mt-3 max-w-xl text-[#5d5348]">{settings.featured?.subheading}</p>
          </div>
          <Link href="/shop" className="hidden text-sm underline underline-offset-4 md:inline">
            View all
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
      <section className="border-y border-[#e4d9cc] bg-[#efe6db]">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="font-serif text-4xl">{settings.newsletter?.heading}</h2>
          <p className="mt-3 text-[#5d5348]">{settings.newsletter?.subheading}</p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 rounded-full border border-[#d8cbbb] bg-white px-5 py-3"
            />
            <button type="button" className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
              Join
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
