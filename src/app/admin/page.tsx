"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatMoney } from "@/lib/utils";

type Dashboard = {
  stats: { revenue: number; orders: number; products: number; units: number };
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    customer: { name: string };
  }>;
};

export default function AdminHomePage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Failed to load dashboard");
        setData(payload);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-red-700">{error}. Confirm MongoDB is running and try again.</p>;
  }

  if (!data) return <p>Loading overview...</p>;

  const cards = [
    { label: "Revenue", value: formatMoney(data.stats.revenue) },
    { label: "Orders", value: String(data.stats.orders) },
    { label: "Products", value: String(data.stats.products) },
    { label: "Units sold", value: String(data.stats.units) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7d6e]">Overview</p>
          <h1 className="mt-2 font-serif text-4xl">Sales dashboard</h1>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-[#1c1915] px-5 py-2 text-sm text-white">
          Upload product
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-3xl bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8a7d6e]">{card.label}</p>
            <p className="mt-3 font-serif text-3xl">{card.value}</p>
          </div>
        ))}
      </div>
      <section className="mt-10 rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent sales</h2>
          <Link href="/admin/sales" className="text-sm underline">
            View all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-[#efe6db]">
          {data.recentOrders.map((order) => (
            <Link key={order._id} href={`/admin/sales/${order._id}`} className="flex justify-between py-3 text-sm">
              <span>
                {order.orderNumber} · {order.customer.name}
              </span>
              <span>
                {formatMoney(order.total)} · {order.status} · {formatDate(order.createdAt)}
              </span>
            </Link>
          ))}
          {data.recentOrders.length === 0 ? <p className="py-6 text-[#5d5348]">No sales yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
