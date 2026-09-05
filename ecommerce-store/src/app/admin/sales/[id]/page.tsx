"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/utils";

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  notes?: string;
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  customer: { name: string; email: string; phone?: string; address: string; city: string; country: string };
  items: Array<{ name: string; price: number; quantity: number }>;
};

export default function SaleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((response) => response.json())
      .then((payload) => {
        if (payload.order) {
          setOrder(payload.order);
          setStatus(payload.order.status);
          setNotes(payload.order.notes || "");
        }
      });
  }, [params.id]);

  if (!order) return <p>Loading order...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-4xl">{order.orderNumber}</h1>
      <p className="mt-2 text-[#5d5348]">
        {order.customer.name} · {order.customer.email}
      </p>
      <p className="mt-1 text-sm text-[#8a7d6e]">
        {order.customer.address}, {order.customer.city}, {order.customer.country}
      </p>
      <div className="mt-8 space-y-3 rounded-3xl bg-white p-6 text-sm">
        {order.items.map((item) => (
          <div key={item.name} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatMoney(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-[#efe6db] pt-3">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        >
          {["pending", "paid", "shipped", "delivered", "cancelled"].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="h-28 w-full rounded-xl border border-[#d8cbbb] bg-white px-4 py-3"
        />
        <button
          type="button"
          className="rounded-full bg-[#1c1915] px-6 py-3 text-sm text-white"
          onClick={async () => {
            await fetch(`/api/orders/${order._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status, notes }),
            });
            router.push("/admin/sales");
          }}
        >
          Update sale
        </button>
      </div>
    </div>
  );
}
