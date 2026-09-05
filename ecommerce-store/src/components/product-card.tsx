import Link from "next/link";
import { formatMoney } from "@/lib/utils";

type ProductCardProps = {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    category?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-[#efe6db]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#8a7d6e]">
            No image
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#8a7d6e]">{product.category}</p>
          <h3 className="mt-1 font-serif text-xl text-[#1c1915]">{product.name}</h3>
        </div>
        <div className="text-right text-sm">
          <p>{formatMoney(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="text-[#8a7d6e] line-through">{formatMoney(product.compareAtPrice)}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
