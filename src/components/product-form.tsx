"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";

type ProductFormValues = {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
};

const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  compareAtPrice: 0,
  category: "Apparel",
  images: [],
  stock: 0,
  featured: false,
  active: true,
};

export function ProductForm({ initial }: { initial?: ProductFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial || emptyProduct);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const endpoint = values._id ? `/api/products/${values._id}` : "/api/products";
    const response = await fetch(endpoint, {
      method: values._id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Could not save product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <input
        required
        value={values.name}
        onChange={(event) => update("name", event.target.value)}
        placeholder="Product name"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <input
        value={values.slug}
        onChange={(event) => update("slug", event.target.value)}
        placeholder="Slug (optional)"
        className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <textarea
        value={values.description}
        onChange={(event) => update("description", event.target.value)}
        placeholder="Description"
        className="h-32 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="number"
          min={0}
          step="0.01"
          value={values.price}
          onChange={(event) => update("price", Number(event.target.value))}
          placeholder="Price"
          className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        <input
          type="number"
          min={0}
          step="0.01"
          value={values.compareAtPrice}
          onChange={(event) => update("compareAtPrice", Number(event.target.value))}
          placeholder="Compare-at price"
          className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        <input
          value={values.category}
          onChange={(event) => update("category", event.target.value)}
          placeholder="Category"
          className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        <input
          type="number"
          min={0}
          value={values.stock}
          onChange={(event) => update("stock", Number(event.target.value))}
          placeholder="Stock"
          className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
      </div>
      <ImageUpload
        label="Product image"
        hint="Upload a photo or paste an image URL. Add more images below if needed."
        value={values.images[0] || ""}
        onChange={(url) => update("images", url ? [url, ...values.images.slice(1)] : values.images.slice(1))}
      />
      <ImageUpload
        label="Second image"
        value={values.images[1] || ""}
        onChange={(url) => {
          const next = [...values.images];
          if (url) next[1] = url;
          else next.splice(1, 1);
          update("images", next.filter(Boolean));
        }}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.featured} onChange={(event) => update("featured", event.target.checked)} />
        Featured on homepage
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.active} onChange={(event) => update("active", event.target.checked)} />
        Visible in shop
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button disabled={busy} className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
        {busy ? "Saving..." : values._id ? "Update product" : "Upload product"}
      </button>
    </form>
  );
}
