import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Page } from "@/models/Page";
import { Product } from "@/models/Product";
import { SiteSettings } from "@/models/SiteSettings";
import { User } from "@/models/User";

export type FileProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
};

export type FileOrder = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  items: Array<{ productId: string; name: string; price: number; quantity: number; image: string }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  notes: string;
  createdAt: string;
};

export type FilePage = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  published: boolean;
  showInFooter: boolean;
  seoTitle: string;
  seoDescription: string;
};

function asJson<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function serialize<T>(value: T): T {
  return asJson<T>(value);
}

export function emptySettings() {
  return {
    siteName: "Lumen Lagos",
    tagline: "Nigerian design for everyday living",
    logoUrl: "",
    faviconUrl: "",
    announcement: {
      enabled: false,
      text: "",
    },
    hero: {
      enabled: true,
      eyebrow: "",
      title: "Your store",
      subtitle: "Add products and update this hero from the admin dashboard.",
      ctaText: "Shop",
      ctaHref: "/shop",
      secondaryCtaText: "",
      secondaryCtaHref: "",
      imageUrl: "",
      overlay: 40,
    },
    featured: {
      heading: "Featured",
      subheading: "",
    },
    newsletter: {
      heading: "Join the list",
      subheading: "",
    },
    contact: {
      email: "",
      phone: "",
      address: "",
    },
    social: { instagram: "", twitter: "" },
    footer: {
      blurb: "",
      copyright: "",
    },
  };
}

export type StoreSettings = ReturnType<typeof emptySettings>;

/** Creates/syncs the admin user from env. Avoids hashing on every request. */
export async function ensureAdmin() {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@lumen.store").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Store Admin";

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "admin",
    });
    return email;
  }

  const passwordMatches = await bcrypt.compare(password, existing.passwordHash);
  if (!passwordMatches) {
    existing.passwordHash = await bcrypt.hash(password, 10);
    existing.name = name;
    await existing.save();
  } else if (existing.name !== name) {
    existing.name = name;
    await existing.save();
  }

  return email;
}

/** Ensures Mongo is up, admin exists, and site settings doc exists. */
export async function seedStore() {
  const email = await ensureAdmin();

  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create(emptySettings());
  }

  return { adminEmail: email, seeded: true, storage: "mongodb" as const };
}

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin";
};

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  await ensureAdmin();
  const user = await User.findOne({ email: email.toLowerCase().trim() }).lean();
  if (!user?.passwordHash) return null;
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: "admin",
  };
}

export async function listProducts(
  filter: { all?: boolean; featured?: boolean; category?: string } = {},
): Promise<FileProduct[]> {
  await seedStore();
  const query: Record<string, unknown> = {};
  if (!filter.all) query.active = true;
  if (filter.featured) query.featured = true;
  if (filter.category && filter.category !== "all") query.category = filter.category;
  return (await Product.find(query).sort({ createdAt: -1 }).lean()).map((product) =>
    asJson<FileProduct>({ ...product, _id: String(product._id) }),
  );
}

export async function getProduct(id: string) {
  await seedStore();
  const product = await Product.findById(id).lean();
  return product ? asJson<FileProduct>({ ...product, _id: String(product._id) }) : null;
}

export async function getProductBySlug(slug: string) {
  await seedStore();
  const product = await Product.findOne({ slug, active: true }).lean();
  return product ? asJson<FileProduct>({ ...product, _id: String(product._id) }) : null;
}

export async function createProduct(input: Omit<FileProduct, "_id" | "createdAt">) {
  await connectDB();
  const product = await Product.create(input);
  return asJson<FileProduct>({ ...product.toObject(), _id: String(product._id) });
}

export async function updateProduct(id: string, input: Partial<FileProduct>) {
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, input, { new: true }).lean();
  return product ? asJson<FileProduct>({ ...product, _id: String(product._id) }) : null;
}

export async function deleteProduct(id: string) {
  await connectDB();
  await Product.findByIdAndDelete(id);
}

export async function listOrders(): Promise<FileOrder[]> {
  await seedStore();
  return (await Order.find().sort({ createdAt: -1 }).lean()).map((order) =>
    asJson<FileOrder>({ ...order, _id: String(order._id) }),
  );
}

export async function getOrder(id: string) {
  await connectDB();
  const order = await Order.findById(id).lean();
  return order ? asJson<FileOrder>({ ...order, _id: String(order._id) }) : null;
}

export async function createOrder(
  input: Omit<FileOrder, "_id" | "createdAt" | "orderNumber"> & { orderNumber?: string },
) {
  await connectDB();
  const count = await Order.countDocuments();
  const order = await Order.create({
    ...input,
    orderNumber: input.orderNumber || `LM-${1001 + count}`,
    status: input.status,
  });
  return asJson<FileOrder>({ ...order.toObject(), _id: String(order._id) });
}

export async function updateOrder(id: string, input: Partial<Pick<FileOrder, "status" | "notes">>) {
  await connectDB();
  const order = await Order.findByIdAndUpdate(id, input, { new: true }).lean();
  return order ? asJson<FileOrder>({ ...order, _id: String(order._id) }) : null;
}

export async function adjustStock(productId: string, delta: number) {
  await connectDB();
  await Product.findByIdAndUpdate(productId, { $inc: { stock: delta } });
}

export async function getSettings(): Promise<StoreSettings> {
  await seedStore();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) settings = (await SiteSettings.create(emptySettings())).toObject();
  const parsed = asJson<Partial<StoreSettings>>(settings);
  return { ...emptySettings(), ...parsed };
}

export async function updateSettings(input: Record<string, unknown>) {
  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate({}, input, { new: true, upsert: true });
  return serialize(settings);
}

export async function listPages(all = false): Promise<FilePage[]> {
  await seedStore();
  return (await Page.find(all ? {} : { published: true }).sort({ title: 1 }).lean()).map((page) =>
    asJson<FilePage>({ ...page, _id: String(page._id) }),
  );
}

export async function getPage(id: string) {
  await connectDB();
  const page = await Page.findById(id).lean();
  return page ? asJson<FilePage>({ ...page, _id: String(page._id) }) : null;
}

export async function getPageBySlug(slug: string) {
  await seedStore();
  const page = await Page.findOne({ slug, published: true }).lean();
  return page ? asJson<FilePage>({ ...page, _id: String(page._id) }) : null;
}

export async function createPage(input: Omit<FilePage, "_id">) {
  await connectDB();
  const page = await Page.create(input);
  return asJson<FilePage>({ ...page.toObject(), _id: String(page._id) });
}

export async function updatePage(id: string, input: Partial<FilePage>) {
  await connectDB();
  const page = await Page.findByIdAndUpdate(id, input, { new: true }).lean();
  return page ? asJson<FilePage>({ ...page, _id: String(page._id) }) : null;
}

export async function deletePage(id: string) {
  await connectDB();
  await Page.findByIdAndDelete(id);
}
