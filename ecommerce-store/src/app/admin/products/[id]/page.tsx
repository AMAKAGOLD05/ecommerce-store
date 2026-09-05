import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { getProduct } from "@/lib/data";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Catalog</p>
      <h1 className="mt-2 mb-8 font-serif text-4xl">Edit product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
