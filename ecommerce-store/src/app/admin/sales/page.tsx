"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatMoney } from "@/lib/utils";

type Order = {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; email: string };
};

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Could not load sales.");
        setOrders(payload.orders);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Commerce</p>
      <h1 className="mt-2 font-serif text-4xl">Sales</h1>
      <p className="mt-3 text-[#5d5348]">
        {orders.length} orders · {formatMoney(revenue)} recorded
      </p>
      {error ? <p className="mt-6 text-red-700">{error}</p> : null}
      <div className="mt-8 overflow-hidden rounded-3xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#efe6db] text-xs uppercase tracking-[0.14em] text-[#8a7d6e]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t border-[#efe6db]">
                <td className="px-4 py-3">
                  <Link href={`/admin/sales/${order._id}`} className="underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {order.customer.name}
                  <div className="text-[#8a7d6e]">{order.customer.email}</div>
                </td>
                <td className="px-4 py-3">{formatMoney(order.total)}</td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
