"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { DEFAULT_CITY, DEFAULT_COUNTRY, FREE_SHIPPING_MIN, PAYMENT_METHOD, STANDARD_SHIPPING } from "@/lib/commerce";
import { formatMoney } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const shipping = subtotal >= FREE_SHIPPING_MIN || subtotal === 0 ? 0 : STANDARD_SHIPPING;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          city: form.get("city"),
          country: form.get("country"),
        },
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod: PAYMENT_METHOD,
        notes: form.get("notes"),
      }),
    });
    const payload = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(payload.error || "Could not place the order.");
      return;
    }
    clear();
    router.push(`/checkout/success?order=${payload.order.orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <p className="mt-4 text-[#5d5348]">Your bag is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-serif text-5xl">Checkout</h1>
        <input name="name" required placeholder="Full name" className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        <input name="phone" placeholder="Phone or WhatsApp" className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        <input name="address" required placeholder="Street address" className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="city" required defaultValue={DEFAULT_CITY} placeholder="City" className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
          <input name="country" defaultValue={DEFAULT_COUNTRY} className="rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        </div>
        <textarea name="notes" placeholder="Delivery notes (estate gate, landmark, preferred time)" className="h-28 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3" />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button disabled={busy} className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white">
          {busy ? "Placing order..." : "Place order · Pay on delivery"}
        </button>
      </form>
      <aside className="h-fit rounded-3xl bg-white p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <div className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatMoney(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
        </p>
        <p className="mt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>{formatMoney(subtotal + shipping)}</span>
        </p>
      </aside>
    </div>
  );
}
