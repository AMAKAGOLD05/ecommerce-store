"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/utils";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  active: boolean;
  images?: string[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/products?all=1");
    const payload = await response.json();
    if (!response.ok) {
      setError(payload.error || "Could not load products.");
      return;
    }
    setProducts(payload.products);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Catalog</p>
          <h1 className="mt-2 font-serif text-4xl">Products</h1>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-[#1c1915] px-5 py-2 text-sm text-white">
          Upload product
        </Link>
      </div>
      {error ? <p className="mt-6 text-red-700">{error}</p> : null}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#efe6db] text-xs uppercase tracking-[0.14em] text-[#8a7d6e]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-[#efe6db]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt="" className="h-12 w-10 object-cover" />
                    ) : (
                      <div className="h-12 w-10 bg-[#efe6db]" />
                    )}
                    {product.name}
                  </div>
                </td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{formatMoney(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">{product.active ? "Live" : "Hidden"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product._id}`} className="mr-3 underline">
                    Edit
                  </Link>
                  <button type="button" onClick={() => remove(product._id)} className="underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
