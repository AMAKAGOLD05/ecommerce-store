import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Page } from "@/models/Page";
import { Product } from "@/models/Product";
import { SiteSettings } from "@/models/SiteSettings";
import { User } from "@/models/User";
import { samplePages, sampleProducts } from "@/lib/catalog";

type FileUser = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin";
};

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

const filePath = path.join(process.cwd(), ".data", "store.json");

let mongoAvailable: boolean | null = null;

function asJson<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function serialize<T>(value: T): T {
  return asJson<T>(value);
}

function withStringId<T extends { _id?: unknown }>(value: T) {
  return asJson<T & { _id: string }>({ ...value, _id: String(value._id ?? "") });
}

export function emptySettings() {
  return {
    siteName: "Lumen Lagos",
    tagline: "Nigerian design for everyday living",
    logoUrl: "",
    faviconUrl: "",
    announcement: {
      enabled: true,
      text: "Free nationwide shipping on orders over ₦80,000 · Pay on delivery available",
    },
    hero: {
      enabled: true,
      eyebrow: "Made in Nigeria",
      title: "Quiet luxury, from Lagos to your door",
      subtitle:
        "Adire, aso-oke, and home objects from Nigerian makers — delivered across the country, pay on delivery.",
      ctaText: "Shop the collection",
      ctaHref: "/shop",
      secondaryCtaText: "Our story",
      secondaryCtaHref: "/p/about",
      imageUrl:
        "https://images.unsplash.com/photo-1618828665347-d870c38c95c7?auto=format&fit=crop&w=1800&q=80",
      overlay: 40,
    },
    featured: {
      heading: "This week in the studio",
      subheading: "New pieces from Lagos, Abeokuta, and Benin City.",
    },
    newsletter: {
      heading: "Join the list",
      subheading: "Early access to drops, restocks, and private sales.",
    },
    contact: {
      email: "hello@lumen.ng",
      phone: "+234 809 441 2288",
      address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    },
    social: { instagram: "https://instagram.com", twitter: "https://x.com" },
    footer: {
      blurb: "A Lagos shop for considered Nigerian clothing, objects, and gifts. We deliver nationwide.",
      copyright: "Lumen Lagos. All rights reserved.",
    },
  };
}

export type StoreSettings = ReturnType<typeof emptySettings>;

type FileDB = {
  users: FileUser[];
  products: FileProduct[];
  orders: FileOrder[];
  pages: FilePage[];
  settings: StoreSettings;
};

function readFileDb(): FileDB {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as FileDB;
  } catch {
    return {
      users: [],
      products: [],
      orders: [],
      pages: [],
      settings: emptySettings(),
    };
  }
}

function writeFileDb(db: FileDB) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(db, null, 2));
}

function nid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export async function canUseMongo() {
  if (process.env.USE_FILE_DB === "1") return false;
  if (mongoAvailable !== null) return mongoAvailable;
  try {
    await connectDB();
    mongoAvailable = true;
  } catch {
    mongoAvailable = false;
  }
  return mongoAvailable;
}

export async function seedStore() {
  const email = (process.env.ADMIN_EMAIL || "admin@lumen.store").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Store Admin";

  if (await canUseMongo()) {
    await connectDB();
    if (!(await User.findOne({ email }))) {
      await User.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "admin",
      });
    }
    if ((await SiteSettings.countDocuments()) === 0) await SiteSettings.create({});
    if ((await Product.countDocuments()) === 0) await Product.insertMany(sampleProducts);
    if ((await Page.countDocuments()) === 0) await Page.insertMany(samplePages);
    if ((await Order.countDocuments()) === 0) {
      const products = await Product.find().limit(3);
      await Order.create({
        orderNumber: "LM-1001",
        customer: {
          name: "Adaeze Okonkwo",
          email: "adaeze@example.com",
          phone: "0809 441 1102",
          address: "12 Bourdillon Road",
          city: "Ikoyi",
          country: "Nigeria",
        },
        items: products.map((product, index) => ({
          productId: String(product._id),
          name: product.name,
          price: product.price,
          quantity: index === 0 ? 2 : 1,
          image: product.images[0] || "",
        })),
        subtotal: products.reduce((sum, product, index) => sum + product.price * (index === 0 ? 2 : 1), 0),
        shipping: 0,
        total: products.reduce((sum, product, index) => sum + product.price * (index === 0 ? 2 : 1), 0),
        status: "paid",
        paymentMethod: "Pay on delivery",
      });
    }
    return { adminEmail: email, seeded: true, storage: "mongodb" as const };
  }

  const db = readFileDb();
  if (!db.users.some((user) => user.email === email)) {
    db.users.push({
      _id: nid(),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "admin",
    });
  }
  if (!db.settings || Object.keys(db.settings).length === 0) {
    db.settings = emptySettings();
  }
  if (db.products.length === 0) {
    db.products = sampleProducts.map((product) => ({
      ...product,
      _id: nid(),
      createdAt: new Date().toISOString(),
    }));
  }
  if (db.pages.length === 0) {
    db.pages = samplePages.map((page) => ({ ...page, _id: nid() }));
  }
  if (db.orders.length === 0 && db.products.length) {
    const products = db.products.slice(0, 3);
    const items = products.map((product, index) => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: index === 0 ? 2 : 1,
      image: product.images[0] || "",
    }));
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    db.orders.push({
      _id: nid(),
      orderNumber: "LM-1001",
      customer: {
        name: "Adaeze Okonkwo",
        email: "adaeze@example.com",
        phone: "0809 441 1102",
        address: "12 Bourdillon Road",
        city: "Ikoyi",
        country: "Nigeria",
      },
      items,
      subtotal: total,
      shipping: 0,
      total,
      status: "paid",
      paymentMethod: "Pay on delivery",
      notes: "",
      createdAt: new Date().toISOString(),
    });
  }
  writeFileDb(db);
  return { adminEmail: email, seeded: true, storage: "file" as const };
}

export async function findUserByEmail(email: string) {
  await seedStore();
  if (await canUseMongo()) {
    return User.findOne({ email });
  }
  return readFileDb().users.find((user) => user.email === email) || null;
}

export async function listProducts(
  filter: { all?: boolean; featured?: boolean; category?: string } = {},
): Promise<FileProduct[]> {
  await seedStore();
  if (await canUseMongo()) {
    const query: Record<string, unknown> = {};
    if (!filter.all) query.active = true;
    if (filter.featured) query.featured = true;
    if (filter.category && filter.category !== "all") query.category = filter.category;
    return (await Product.find(query).sort({ createdAt: -1 }).lean()).map((product) =>
      asJson<FileProduct>({ ...product, _id: String(product._id) }),
    );
  }
  return readFileDb()
    .products.filter((product) => {
      if (!filter.all && !product.active) return false;
      if (filter.featured && !product.featured) return false;
      if (filter.category && filter.category !== "all" && product.category !== filter.category) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(id: string) {
  await seedStore();
  if (await canUseMongo()) {
    const product = await Product.findById(id).lean();
    return product ? serialize({ ...product, _id: String(product._id) }) : null;
  }
  return readFileDb().products.find((product) => product._id === id) || null;
}

export async function getProductBySlug(slug: string) {
  await seedStore();
  if (await canUseMongo()) {
    const product = await Product.findOne({ slug, active: true }).lean();
    return product ? serialize({ ...product, _id: String(product._id) }) : null;
  }
  return readFileDb().products.find((product) => product.slug === slug && product.active) || null;
}

export async function createProduct(input: Omit<FileProduct, "_id" | "createdAt">) {
  if (await canUseMongo()) {
    const product = await Product.create(input);
    return serialize(product);
  }
  const db = readFileDb();
  if (db.products.some((product) => product.slug === input.slug)) {
    throw new Error("A product with this slug already exists.");
  }
  const product = { ...input, _id: nid(), createdAt: new Date().toISOString() };
  db.products.unshift(product);
  writeFileDb(db);
  return product;
}

export async function updateProduct(id: string, input: Partial<FileProduct>) {
  if (await canUseMongo()) {
    const product = await Product.findByIdAndUpdate(id, input, { new: true });
    return product ? serialize(product) : null;
  }
  const db = readFileDb();
  const index = db.products.findIndex((product) => product._id === id);
  if (index === -1) return null;
  if (input.slug && db.products.some((product) => product.slug === input.slug && product._id !== id)) {
    throw new Error("A product with this slug already exists.");
  }
  db.products[index] = { ...db.products[index], ...input };
  writeFileDb(db);
  return db.products[index];
}

export async function deleteProduct(id: string) {
  if (await canUseMongo()) {
    await Product.findByIdAndDelete(id);
    return;
  }
  const db = readFileDb();
  db.products = db.products.filter((product) => product._id !== id);
  writeFileDb(db);
}

export async function listOrders() {
  await seedStore();
  if (await canUseMongo()) {
    return serialize(await Order.find().sort({ createdAt: -1 }).lean());
  }
  return [...readFileDb().orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string) {
  if (await canUseMongo()) {
    const order = await Order.findById(id).lean();
    return order ? serialize({ ...order, _id: String(order._id) }) : null;
  }
  return readFileDb().orders.find((order) => order._id === id) || null;
}

export async function createOrder(input: Omit<FileOrder, "_id" | "createdAt" | "orderNumber"> & { orderNumber?: string }) {
  if (await canUseMongo()) {
    const count = await Order.countDocuments();
    const order = await Order.create({
      ...input,
      orderNumber: input.orderNumber || `LM-${1001 + count}`,
      status: input.status,
    });
    return serialize(order);
  }
  const db = readFileDb();
  const order: FileOrder = {
    ...input,
    _id: nid(),
    orderNumber: input.orderNumber || `LM-${1001 + db.orders.length}`,
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(order);
  writeFileDb(db);
  return order;
}

export async function updateOrder(id: string, input: Partial<Pick<FileOrder, "status" | "notes">>) {
  if (await canUseMongo()) {
    const order = await Order.findByIdAndUpdate(id, input, { new: true });
    return order ? serialize(order) : null;
  }
  const db = readFileDb();
  const index = db.orders.findIndex((order) => order._id === id);
  if (index === -1) return null;
  db.orders[index] = { ...db.orders[index], ...input };
  writeFileDb(db);
  return db.orders[index];
}

export async function adjustStock(productId: string, delta: number) {
  if (await canUseMongo()) {
    await Product.findByIdAndUpdate(productId, { $inc: { stock: delta } });
    return;
  }
  const db = readFileDb();
  const product = db.products.find((item) => item._id === productId);
  if (product) {
    product.stock += delta;
    writeFileDb(db);
  }
}

export async function getSettings(): Promise<StoreSettings> {
  await seedStore();
  if (await canUseMongo()) {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) settings = (await SiteSettings.create({})).toObject();
    const parsed = asJson<Partial<StoreSettings>>(settings);
    return { ...emptySettings(), ...parsed };
  }
  return { ...emptySettings(), ...readFileDb().settings };
}

export async function updateSettings(input: Record<string, unknown>) {
  if (await canUseMongo()) {
    const settings = await SiteSettings.findOneAndUpdate({}, input, { new: true, upsert: true });
    return serialize(settings);
  }
  const db = readFileDb();
  db.settings = { ...db.settings, ...input };
  writeFileDb(db);
  return db.settings;
}

export async function listPages(all = false) {
  await seedStore();
  if (await canUseMongo()) {
    return (await Page.find(all ? {} : { published: true }).sort({ title: 1 }).lean()).map((page) =>
      asJson<FilePage>({ ...page, _id: String(page._id) }),
    );
  }
  return readFileDb()
    .pages.filter((page) => all || page.published)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getPage(id: string) {
  if (await canUseMongo()) {
    const page = await Page.findById(id).lean();
    return page ? serialize({ ...page, _id: String(page._id) }) : null;
  }
  return readFileDb().pages.find((page) => page._id === id) || null;
}

export async function getPageBySlug(slug: string) {
  await seedStore();
  if (await canUseMongo()) {
    const page = await Page.findOne({ slug, published: true }).lean();
    return page ? serialize(page) : null;
  }
  return readFileDb().pages.find((page) => page.slug === slug && page.published) || null;
}

export async function createPage(input: Omit<FilePage, "_id">) {
  if (await canUseMongo()) {
    return serialize(await Page.create(input));
  }
  const db = readFileDb();
  if (db.pages.some((page) => page.slug === input.slug)) {
    throw new Error("A page with this slug already exists.");
  }
  const page = { ...input, _id: nid() };
  db.pages.push(page);
  writeFileDb(db);
  return page;
}

export async function updatePage(id: string, input: Partial<FilePage>) {
  if (await canUseMongo()) {
    const page = await Page.findByIdAndUpdate(id, input, { new: true });
    return page ? serialize(page) : null;
  }
  const db = readFileDb();
  const index = db.pages.findIndex((page) => page._id === id);
  if (index === -1) return null;
  if (input.slug && db.pages.some((page) => page.slug === input.slug && page._id !== id)) {
    throw new Error("A page with this slug already exists.");
  }
  db.pages[index] = { ...db.pages[index], ...input };
  writeFileDb(db);
  return db.pages[index];
}

export async function deletePage(id: string) {
  if (await canUseMongo()) {
    await Page.findByIdAndDelete(id);
    return;
  }
  const db = readFileDb();
  db.pages = db.pages.filter((page) => page._id !== id);
  writeFileDb(db);
}
