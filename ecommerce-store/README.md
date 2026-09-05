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
