# Maison Voile — Luxury Perfume Decant E-Commerce

**Modules 1–3** are complete and verified with `npm install` + `next build` (55 routes,
all typecheck and generate cleanly — font fetching aside, see note below).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · React Hook Form + Zod ·
Prisma + PostgreSQL · JWT auth · Razorpay + COD · Cloudinary · Vercel · Zustand (client state)

## Getting started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, Cloudinary + Razorpay keys
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000.

> **Note on this sandbox:** the environment this was built in only allows npm/GitHub
> network access, so `prisma generate` (needs binaries.prisma.sh) and `next/font` (needs
> fonts.googleapis.com) couldn't reach out here. Both work normally the moment you run
> this locally or deploy to Vercel — verified with a full `next build` using stubbed fonts.

## What's built so far

### Module 1 — Foundation
Project setup, Tailwind design tokens, Prisma schema, global layout, sticky glass
Navbar, Footer, full homepage.

### Module 2 — Storefront
Shop (filters/sort/search/pagination), Product Details (gallery, size selector,
fragrance profile), Collections, Brands, Cart, Wishlist, static/legal pages, custom 404.

### Fragrance Profile update
Product data model extended with `topNotes`/`heartNotes`/`baseNotes`/`mainAccords`.
Product page shows a Fragrantica-style accord bar visualization and a Fragrance
Pyramid. Editable from `/admin/products/[id]/edit`.

### Module 3 — Authentication
- **Register / Login / Forgot Password** (`/register`, `/login`, `/forgot-password`) —
  React Hook Form + Zod validation, matching the site's glass/gold aesthetic
- **Profile** (`/profile`) — edit name/email/phone, manage saved addresses (add/edit/
  delete, set default)
- **Order History** (`/orders`) — empty state until the checkout module creates real orders
- **Logout** — from the account sidebar
- **Route protection** — `/profile` and `/orders` redirect to `/login` if not signed in
- **Navbar** — account icon and mobile drawer link to Profile when signed in, Login otherwise

> **Scope note:** this is a fully working *client-side* auth system (Zustand store
> persisted to `localStorage`, obfuscated — not hashed — passwords) so the whole flow
> is testable today. It becomes real JWT + bcrypt + Postgres auth via `/api/auth/*`
> routes once the backend module (item 4 below) is wired — the store's method
> signatures (`register`, `login`, `logout`, `updateProfile`, address CRUD) are already
> shaped to make that swap a drop-in replacement rather than a rewrite.

## Design system

| Token | Value |
|---|---|
| Background | `#090909` |
| Gold | `#C8A45D` |
| Gold light (accent) | `#F3E6C5` |
| White | `#FFFFFF` |
| Light gray | `#D8D8D8` |

Display type is **Fraunces**, body is **Inter**. Signature motion element: the
**scent trail** (`src/components/home/ScentTrail.tsx`).

### Module 4 — Checkout
- **Checkout** (`/checkout`, auth-guarded) — select or add a shipping address, contact
  details, payment method (Razorpay or COD), live order summary
- **Razorpay** — if `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set, the real Razorpay checkout
  widget opens and completes a genuine test-mode payment flow; if unset, checkout
  clearly labels itself as demo mode and simulates a successful payment so the flow
  stays fully testable either way
- **Cash on Delivery** — places the order immediately, no payment step
- **Order Confirmation** (`/checkout/confirmation`) — order number, items, totals, address
- **Order History** (`/orders`) — now shows real placed orders instead of an empty state

### Module 5 — Admin Dashboard
- **Dashboard** (`/admin`) — real stats: revenue, order count, avg order value,
  customer count, active coupons, recent orders
- **Products** (`/admin/products`) — list + edit; each product's edit page now has
  **Pricing & Inventory** (per-variant price/stock, published toggle) alongside the
  existing fragrance profile editor — both save instantly and reflect on the live
  product page
- **Orders** (`/admin/orders`) — every order across all customers, filterable by
  status, with a status dropdown (Confirmed → Processing → Shipped → Delivered)
- **Customers** (`/admin/customers`) — registered users with address and order counts
- **Coupons** (`/admin/coupons`) — full CRUD (create, enable/disable, delete, usage
  tracking, min order value, max uses); the cart's coupon field now validates
  against these instead of a hardcoded list
- **Add New Perfume** — still intentionally disabled with an explanatory tooltip.
  Reason: product *detail* pages are statically generated at build time
  (`generateStaticParams`), so a perfume created client-side would show up in admin
  lists but 404 on its own page until the backend module makes routing dynamic —
  shipping that half-working would be worse than being upfront about the gap.

## Coming next
1. Backend API routes + Prisma wiring — replaces the mock data layer AND every
   client-side store (auth, cart, wishlist, orders, coupons, admin overrides) with
   real database-backed persistence. This is also what unlocks true product creation
   from the Admin Dashboard, and real Razorpay server-side order creation + signature
   verification.

## Module 6 — Backend API + Prisma (real database layer)

Real API routes backed by your Neon Postgres database, using the Prisma schema that's
been in place since Module 1.

### What's built
- **`src/lib/prisma.ts`** — Prisma client singleton
- **`src/lib/auth-server.ts`** — JWT sessions via `jose` (edge-compatible, used by
  `middleware.ts`), password hashing via `bcryptjs`, httpOnly session cookie helpers
- **`src/middleware.ts`** — real server-side route protection for `/profile`,
  `/orders`, `/checkout`, and `/admin` (role-checked), not just the client-side
  `AuthGuard` used before
- **Auth API** — `POST /api/auth/register`, `/login`, `/logout`, `GET /api/auth/me`,
  `PATCH /api/auth/me` (profile update), `POST /api/auth/forgot-password`
- **Products API** — `GET /api/products` (search/filter/sort/paginate),
  `GET/PATCH/DELETE /api/products/[slug]` (mutations admin-only), `POST /api/products`
  (admin create — this is what finally unlocks real "Add New Perfume")
- **Brands API** — `GET /api/brands`
- **Cart API** — `GET/POST /api/cart`, `PATCH/DELETE /api/cart/[variantId]`
- **Wishlist API** — `GET/POST /api/wishlist`, `DELETE /api/wishlist/[productId]`
- **Addresses API** — `GET/POST /api/addresses`, `PATCH/DELETE /api/addresses/[id]`
- **Coupons API** — admin CRUD at `/api/coupons`, public `POST /api/coupons/validate`
- **Orders API** — `POST /api/orders` (creates Order+OrderItems+Payment in a
  transaction, decrements stock, records coupon use, clears cart server-side),
  `GET /api/orders` (own orders, or `?all=true` for admin), `PATCH /api/orders/[id]`
  (admin status update)
- **Razorpay (real, server-side)** — `POST /api/payments/razorpay/order` creates a
  genuine Razorpay order, `POST /api/payments/razorpay/verify` verifies the payment
  signature server-side with HMAC-SHA256 — this is the secure flow the client-only
  widget in Module 4 couldn't safely do
- **Cloudinary upload** — `POST /api/upload` (admin-only, multipart file upload)
- **`prisma/seed.ts`** — seeds your real database with the same 10-perfume catalog,
  8 brands, and 2 coupons used throughout development, plus a demo admin account

### Setup
```bash
npm install
npx prisma generate
npx prisma db seed
npm run dev
```
Demo admin login (created by the seed script): `admin@maisonvoile.com` / `Admin1234!`
— **change this password after first login**, or remove the seed's admin block once
you have a real admin account flow.

### ⚠️ Important: this module was built without full build verification
Every module before this one was verified end-to-end with `npm install && next build`
in the sandbox this was built in. This one is different: the sandbox's network
allowlist blocks `binaries.prisma.sh` (same restriction you hit with `db pull`/
`migrate`), so `npx prisma generate` cannot run here — and without a generated
client, `@prisma/client`'s types don't exist, which means `next build` cannot
complete in this environment no matter what the route code says.

What I *could* verify: `npx tsc --noEmit` against all new files. It surfaced exactly
8 errors, every one an "implicit any" caused solely by the missing generated types
(e.g. `cart.items.reduce(...)` can't infer `item`'s shape without the client) —
no logic or syntax errors. These will very likely resolve themselves the moment you
run `npx prisma generate`, since real types will flow through. **Please run
`npm run build` on your machine after `prisma generate` and let me know what (if
anything) comes up** — I'd rather you catch a real issue than have me claim
certainty I don't have here.

### ⚠️ Scope boundary: the frontend isn't wired to this yet
This module adds the backend *in parallel* with the existing app — nothing in the
UI calls these new `/api/*` routes yet. The site still runs exactly as it has since
Module 5, on the client-side Zustand stores (`authStore`, `cartStore`, `wishlistStore`,
`orderStore`, `couponStore`, `adminProductStore`), all still backed by `localStorage`.

Swapping each store over to call the real API (and deleting the mock-data fallback
entirely) is real, substantial work I'd rather do carefully in its own focused pass
per domain — auth first, then products/shop, then cart/wishlist/orders/admin — so
each swap can be reasoned about and tested on its own, rather than one giant
all-at-once rewrite. Let me know if you'd like me to start that now.

## Auth wiring update

The frontend auth flow is now wired to the real backend from Module 6:

- `authStore` no longer holds a mock in-browser user database — it fetches
  `GET /api/auth/me` on app load (via `AuthProvider`, mounted in the root layout) and
  calls the real `/api/auth/*` and `/api/addresses/*` routes for every action
  (register, login, logout, profile update, address CRUD)
- Sessions are real httpOnly JWT cookies now, not `localStorage`
- `middleware.ts` (from Module 6) now actually protects `/profile`, `/orders`,
  `/checkout`, and `/admin` server-side; `AuthGuard` is a lighter client-side backstop
  for mid-session cookie expiry, and redirects back to the page you were trying to
  reach after login
- Added `GET /api/admin/users` so the admin Customers page and Dashboard customer
  count read real registered users instead of the old mock bag
- The seeded admin account (`admin@maisonvoile.com` / `Admin1234!`) now works through
  the actual `/login` page

**Still on mock/local stores** (unchanged in this pass): cart, wishlist, orders,
coupons, and admin product/fragrance/inventory overrides. This means, for example,
a real logged-in user's order history and cart are still separate from what the
backend's Order/Cart tables would show — that's the next integration slice.

**Same verification caveat as Module 6:** `npx tsc --noEmit` passes with only the
same Prisma-codegen-related implicit-`any` errors as before (9 now, the new one
being `/api/admin/users`, same root cause). Please run a full `npm run build` after
`prisma generate` and let me know what you see.

## Products wiring update

Shop, Product Details, Collections, Brands, and the Homepage's featured/best-seller/
brand sections now read from the real database instead of `src/lib/mock-data.ts`:

- **`src/lib/serialize.ts`** (new) — maps Prisma's `Product`/`Brand` shape into the
  same frontend `Product` type used throughout the app, so `ProductCard`,
  `MainAccords`, `FragrancePyramid`, `ProductPurchasePanel`, etc. needed **zero**
  changes — only the data source changed
- **Product/Collection/Brand pages** are now `force-dynamic` server components
  querying Prisma directly (idiomatic for Next.js reads) instead of statically
  generated at build time — this is also what finally makes newly-created admin
  products reachable at their own URL, once product creation is wired
- **Shop page** now calls `GET /api/products` client-side with live search/filter/
  sort/pagination params; `/api/products` had a latent bug fixed along the way — it
  referenced `product.rating`/`reviewCount` as if they were real columns, but
  rating/count are computed from reviews, not stored fields
- **`FilterSidebar`** now fetches real brands from `/api/brands` instead of the
  mock brand list, and the API now supports filtering by multiple brands at once
  (was previously single-brand only)

**Still on mock data / local stores** (unchanged): admin product management
(`/admin/products`, `/admin/products/[id]/edit`) still lists and edits from
`mock-data.ts` + the local override store — wiring that to real `PATCH /api/products`
calls is a good next step alongside cart/wishlist. Add-to-cart and wishlist buttons
on these now-real product pages still add to the local mock cart/wishlist, not a
real database cart yet.

**Verification:** `npx tsc --noEmit` — 17 errors, all the same implicit-`any` root
cause as every module since the backend was added (missing generated Prisma types).
No new error categories. As always, please run `npm run build` after
`prisma generate` and let me know what you see.

## Bugfix: admin edits not reflecting on the live site

**Root cause:** after Products got wired to the real database, the admin edit pages
were still reading from `mock-data.ts` — so an edit form for "Baccarat Rouge 540"
was keyed to the *mock* product's id, while the live product page was now reading
the *real* Postgres row, which has a completely different (Prisma-generated) id.
Saving an override under the mock id could never match what the real page looked up.

**Fix:** Admin Products list and Edit page now query Prisma directly (same pattern
as the shop/collection/brand pages), and both `InventoryForm` and
`ProductFragranceForm` now call the real `PATCH /api/products/[slug]` route instead
of writing to a local override store. The now-fully-redundant `adminProductStore.ts`
and all the override-merging logic in `ProductPurchasePanel`/`MainAccords`/
`FragrancePyramid` were removed — the product page is dynamically rendered per
request now, so it always reflects the database directly with no merge step needed.

Net effect: editing price, stock, publish status, description, notes, or accords in
`/admin/products/[id]/edit` now persists to Postgres and shows up immediately on the
real product page — the bug reported (price edit not showing up) is fixed at the
root rather than patched around.

## Add New Perfume — now working

This was disabled since Module 5 because product detail pages were statically
generated at build time — a client-created product would show up in admin lists
but 404 on its own page. That blocker disappeared when Products got wired to the
real database (`force-dynamic` rendering, queried per-request), so it's now built:

- **`/admin/products/new`** — full creation form: name (auto-slugs as you type,
  editable), brand, category, concentration, description, images, sizes/pricing/
  stock, and the same fragrance pyramid + accord builder used for editing
- **Image handling** — "Upload Image" posts to the real `/api/upload` (Cloudinary)
  endpoint; there's also a "paste a URL" fallback for convenience
- Submits to the real `POST /api/products`, then redirects straight into that
  product's edit page

**One real limitation worth knowing:** `next/image` only renders images from
domains explicitly allowed in `next.config.ts` (that's the same restriction that
needed `images.unsplash.com` added early on). Images uploaded via the Upload button
go to `res.cloudinary.com`, which is already allowed — safe. If you paste a URL
from some other site instead, it'll preview fine in the admin form (uses a plain
`<img>` there on purpose) but will break on the actual public product page with the
"hostname not configured" error until that domain is added to
`next.config.ts` → `images.remotePatterns`. The form has an inline note about this.

**Verification:** `npx tsc --noEmit` — same 18 pre-existing Prisma-codegen errors,
nothing new introduced.

## Brand management (new)

Brands could previously only be created via `prisma/seed.ts` — no admin UI existed.
Added full CRUD:

- **`POST /api/brands`** (admin) — create, auto-slugging from the name if no slug
  given, blocking duplicate names/slugs
- **`PATCH/DELETE /api/brands/[id]`** (admin) — edit any field; delete is blocked
  with a clear error if the brand still has products attached (prevents an
  orphaned-products foreign-key crash — you have to reassign or remove those
  products first)
- **`/admin/brands`** — list with product counts per brand, inline add/edit form,
  delete with the same guard rail as above
- Added to the admin sidebar nav and as a Dashboard quick-link card (with a real
  brand count instead of a placeholder)
- The product creation form's Brand dropdown now links directly to "Manage brands"
  so there's an obvious path when the brand you need isn't in the list yet

**Verification:** `npx tsc --noEmit` — same 18 pre-existing Prisma-codegen errors,
nothing new.

## Homepage: editorial landing page (no products)

Removed the Featured Decants and Best Sellers product-grid sections from the
homepage per request — the landing page is now a pure brand/editorial experience,
not a shopping page:

- **New: `BrandStory.tsx`** — an editorial two-column section (image + philosophy
  copy + a couple of trust stats) fills the space those grids left, keeping the
  page from feeling sparse
- Homepage is now: Hero → Brand Story → Shop by Brand → Why Choose Us → Footer
- Deleted the now-unused `FeaturedProducts.tsx` and `BestSellers.tsx` components
- Left **Shop by Brand** in place — it's brand name tiles, not product listings, so
  it fits an editorial landing page without turning it back into a shopping page.
  Say the word if you'd rather that go too.

**Verification:** `npx tsc --noEmit` — 16 errors now (2 fewer than before, since
removing the product queries removed two of the pre-existing implicit-`any` spots
along with them), same root cause as always, nothing new.
