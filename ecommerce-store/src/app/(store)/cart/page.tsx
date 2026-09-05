"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { FREE_SHIPPING_MIN, STANDARD_SHIPPING } from "@/lib/commerce";
import { formatMoney } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_MIN || subtotal === 0 ? 0 : STANDARD_SHIPPING;

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="font-serif text-5xl">Your bag</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-[#5d5348]">
          The bag is empty. <Link href="/shop" className="underline">Continue shopping</Link>
        </p>
      ) : (
        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border-b border-[#e4d9cc] pb-6">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-28 w-24 object-cover" />
              ) : (
                <div className="h-28 w-24 bg-[#efe6db]" />
              )}
              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <h2 className="font-serif text-2xl">{item.name}</h2>
                  <p>{formatMoney(item.price * item.quantity)}</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                    className="w-20 rounded-xl border border-[#d8cbbb] bg-white px-3 py-2"
                  />
                  <button type="button" onClick={() => removeItem(item.productId)} className="text-sm underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Total</span>
              <span>{formatMoney(subtotal + shipping)}</span>
            </div>
          </div>
          <Link href="/checkout" className="inline-flex rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
