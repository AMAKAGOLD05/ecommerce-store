import { requireAdmin } from "@/lib/auth";
import { getOrder, updateOrder } from "@/lib/data";
import { json } from "@/lib/utils";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return json({ error: "Order not found." }, 404);
  return json({ order });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const { id } = await params;
  const body = await request.json();
  const order = await updateOrder(id, { status: body.status, notes: body.notes });
  if (!order) return json({ error: "Order not found." }, 404);
  return json({ order });
}
