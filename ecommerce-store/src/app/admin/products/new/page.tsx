import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Catalog</p>
      <h1 className="mt-2 font-serif text-4xl">Upload product</h1>
      <p className="mt-3 mb-8 text-[#5d5348]">Add photos, pricing, stock, and whether it appears on the homepage.</p>
      <ProductForm />
    </div>
  );
}
