import { requireAdmin } from "@/lib/auth";
import { listOrders, listProducts } from "@/lib/data";
import { json } from "@/lib/utils";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);

  const [orders, products] = await Promise.all([listOrders(), listProducts({ all: true })]);
  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const units = orders.reduce(
    (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
    0,
  );

  return json({
    stats: {
      revenue,
      orders: orders.length,
      products: products.length,
      units,
    },
    recentOrders: orders.slice(0, 6),
  });
}
