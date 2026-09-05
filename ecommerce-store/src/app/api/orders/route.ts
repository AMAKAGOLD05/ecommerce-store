import { requireAdmin } from "@/lib/auth";
import { adjustStock, createOrder, getProduct, listOrders } from "@/lib/data";
import { DEFAULT_COUNTRY, FREE_SHIPPING_MIN, PAYMENT_METHOD, STANDARD_SHIPPING } from "@/lib/commerce";
import { json } from "@/lib/utils";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  return json({ orders: await listOrders() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    if (!body.customer?.name || !body.customer?.email || !body.customer?.address || items.length === 0) {
      return json({ error: "Customer details and at least one item are required." }, 400);
    }

    const normalized = [];
    for (const item of items as Array<{ productId: string; quantity: number }>) {
      const product = await getProduct(item.productId);
      if (!product) {
        throw new Error("One or more products are no longer available.");
      }
      normalized.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: Math.max(1, Number(item.quantity || 1)),
        image: product.images[0] || "",
      });
    }

    const subtotal = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : STANDARD_SHIPPING;
    const order = await createOrder({
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone || "",
        address: body.customer.address,
        city: body.customer.city || "",
        country: body.customer.country || DEFAULT_COUNTRY,
      },
      items: normalized,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "pending",
      paymentMethod: body.paymentMethod || PAYMENT_METHOD,
      notes: body.notes || "",
    });

    for (const item of normalized) {
      await adjustStock(item.productId, -item.quantity);
    }

    return json({ order }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not place the order.";
    return json({ error: message }, 400);
  }
}
