"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

type AddToCartProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    stock?: number;
  };
};

export function AddToCart({ product }: AddToCartProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={(product.stock ?? 0) < 1}
      onClick={() => {
        addItem({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
      className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-[#f6f1ea] disabled:opacity-40"
    >
      {(product.stock ?? 0) < 1 ? "Sold out" : added ? "Added to bag" : "Add to bag"}
    </button>
  );
}
