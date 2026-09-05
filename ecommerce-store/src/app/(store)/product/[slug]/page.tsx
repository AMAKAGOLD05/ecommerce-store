import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { getProductBySlug } from "@/lib/data";
import { formatMoney } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
      <div className="overflow-hidden bg-[#efe6db]">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-[#8a7d6e]">No image</div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">{product.category}</p>
        <h1 className="mt-3 font-serif text-5xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-3 text-lg">
          <span>{formatMoney(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-[#8a7d6e] line-through">{formatMoney(product.compareAtPrice)}</span>
          ) : null}
        </div>
        <p className="mt-6 leading-7 text-[#5d5348]">{product.description}</p>
        <p className="mt-4 text-sm text-[#8a7d6e]">{product.stock} in stock</p>
        <div className="mt-8">
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
