# Lumen Store

Next.js 16 ecommerce storefront with a MongoDB-backed admin dashboard for products, sales, logo, hero, and site pages.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS 4)
- MongoDB + Mongoose
- JWT admin sessions

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) or start it with Docker:

```bash
docker compose up -d
```

2. Copy environment variables if needed (`\.env.local` is already set for local development):

```
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce-store
JWT_SECRET=change-this-to-a-long-random-secret
ADMIN_EMAIL=admin@lumen.store
ADMIN_PASSWORD=Admin123!
```

3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

This project is already imported with **Root Directory** set to `ecommerce-store`. Keep that setting.

### 1. Create MongoDB Atlas (from Vercel)

1. Open [MongoDB Atlas in the Vercel Marketplace](https://vercel.com/marketplace/mongodbatlas/atlas).
2. Click **Install** → **Accept and Create**.
3. Choose **Free** cluster, a region close to your deploy (e.g. Washington `iad1`), and name it `ecommerce-store`.
4. Click **Create MongoDB Atlas Cluster** and wait until it shows **Available**.
5. Connect the store to the **ecommerce-store** project (Production + Preview).

Vercel will set `MONGODB_URI` automatically.

### 2. Add the remaining env vars

In the Vercel project → **Settings** → **Environment Variables**, add:

```
JWT_SECRET=a-long-random-secret
ADMIN_EMAIL=admin@lumen.store
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Store Admin
```

Do **not** set `USE_FILE_DB` on Vercel (that forces the local JSON file store).

### 3. Redeploy

Redeploy from the Vercel dashboard (or push a commit) so the new env vars apply.

## Admin dashboard

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@lumen.store`
- Password: `Admin123!`

The first login seeds sample products, pages, a demo sale, and default site settings.

### What you can manage

- **Products** — create, edit, upload images, stock, featured flag
- **Sales** — incoming orders and fulfillment status
- **Site settings** — logo, favicon, announcement bar, hero section, homepage copy, footer
- **Pages** — About, Contact, Shipping, or any custom page at `/p/[slug]`
