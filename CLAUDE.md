# Serle's Bake — Frontend (Next.js)

Storefront for a homemade cake shop in **Tenkasi, Tamil Nadu**.
Live at `https://www.serlesbake.in`. The Django API is a separate repo
(`../serlesbackend`) served from `https://shop.serlesbake.in`.

## Layout

Git root is `serles-fe/`; the Next app lives in `app/`. **Run npm commands from
`serles-fe/app`.** Note the doubled path: `app/app/` is the App Router directory.

```bash
cd app
npm run dev
npm run build            # always run this before claiming a change is safe
npm run generate-sitemap
```

Stack: **Next.js 15.4.10, React 18.3.1, App Router, plain JS (no TypeScript), SCSS.**
Deployed on Vercel.

## The most important thing to understand

This is a **jQuery/Bootstrap HTML template wrapped in Next.js**, not an idiomatic Next app.
`app/public/css` (12 stylesheets, ~328 KB) and `app/public/js` (9 files, ~307 KB of jQuery
plugins) are loaded globally from `app/app/layout.js`. Menus, carousels, popups and the
preloader are all jQuery, initialised in an inline script at the bottom of `layout.js`.

Consequences when editing:

- The template scripts carry `defer`, which **preserves execution order** — jQuery loads
  before its plugins and `main.js`. Don't switch them to `async`; order would break.
- Plugin init runs on `window.load`. It used to wait a further 1000 ms; that's now 0
  because `defer` guarantees the scripts have run.
- Removing a stylesheet means checking its classes are genuinely unused.
  `flaticon.css` was removed after verifying zero `flaticon-` references.
- `next.config.mjs` no longer has a webpack rule for images. It referenced `url-loader`
  and `file-loader`, **neither of which is installed** — it would have failed the build on
  the first `import x from './y.png'`. Next 15 handles static image imports natively.

## Performance decisions already made

- Third-party scripts go through `next/script`: GA and the Meta Pixel at
  `afterInteractive`, the Noupe chat widget at `lazyOnload`. Previously all three were
  blocking `<script>` tags — the chat widget sat mid-`<body>` and blocked parsing of the
  footer. **Verified: zero blocking scripts in `<head>`.**
- `Open Sans` was dropped from the Google Fonts request — it was downloaded on every page
  load and referenced by no stylesheet. Only Oswald and Pacifico are used
  (`Inter` comes from `next/font`).
- `minimumCacheTTL` is 7 days (was 60 s). Trade-off: replacing a file in place under
  `public/img` with the same name can serve stale for a week. CMS images are timestamped,
  so they're unaffected.
- Images are fine — 22 `next/image` usages vs 3 raw `<img>`. The 4.2 MB in `public/img` is
  source weight; Vercel resizes and serves WebP/AVIF.
- Don't bother hand-minifying the template CSS/JS: `compress: true` means Vercel serves it
  brotli-compressed already.

## SEO: what was wrong, and what is fixed

The six problems audited on the live site have been addressed. The **root cause of most
of them was the same**, and it is the thing to watch for when adding a page:

> **`next/head` does nothing in the App Router.** `/cakes`, `/cakes/tags` and
> `/cakes/tags/[tag-slug]` were client components (`"use client"`) declaring their
> title, description, canonical and OG tags inside a `<Head>` block. All of it was
> silently discarded, so those pages served the root layout's homepage title and
> `canonical: '/'`. Worse, they fetched products in `useEffect`, so crawlers got an
> empty grid. Declare SEO with `export const metadata` / `generateMetadata()` in a
> **server** `page.js`; never `next/head`.

Fixed:

1. **Canonicals.** `/cakes`, `/about` and `/contact` now set their own. `/contact` was a
   separate bug: its `twitter` and `alternates` blocks were nested *inside* `openGraph`,
   where Next ignores them. `/cakes/tags` and `/cakes/tags/[tag-slug]` got canonicals for
   the first time.
2. **www vs non-www.** `SITE_URL` in `app/utils/blog.js` now forces the `www` host through
   `canonicalSiteUrl()`. The cause was environmental (`NEXT_PUBLIC_SITE_URL` set without
   `www` in Vercel), so normalising in code makes it stick regardless of the env var.
3. **Structured data.** `app/components/LocalBusinessJsonLd.js` emits a sitewide
   `Bakery` + `WebSite` graph from the root layout — NAP taken from the Footer and contact
   page. Product pages render the API's `meta_data.schema_json` (enriched with `url`,
   `@id` and a `seller` reference), plus a `BreadcrumbList`. `/cakes` emits
   `CollectionPage` + `ItemList`.
   ⚠️ The Bakery node deliberately omits `postalCode`, `geo` and
   `openingHoursSpecification` — they could not be verified from the repo, and wrong hours
   or coordinates are worse than none. Fill them from the Google Business Profile.
4. **H1s.** The logo in `Header.js` is no longer an `<h1>` (it keeps the `h1` class, so
   nothing moved visually). `Breadcrumb` now renders the page `<h1>` by default and takes
   `headingLevel="h2"` on pages that already have their own (blog, contact, legal). The
   homepage's `<h1>` is the first heading in `components/home/category.js`.
   **Verified: every prerendered page has exactly one H1.**
5. **Thin commercial pages.** `/cakes` gained ~350 words of server-rendered copy below the
   grid. Product pages are still thin — that is the main content work left.
6. **Titles.** Homepage, `/cakes`, `/menu`, `/contact`, the legal pages and `/testimonial`
   trimmed to ~60 chars or under.

`/cakes` is now a server component (`revalidate = 60`, matching the API's CDN window) with
the interactive filters split into `cakes/CakesPageClient.js`. Verified in the build
output: correct title and canonical, one H1, **14 products present in the server HTML**.

### Still open

- **Category, product and tag pages still fetch their content client-side.**
  `CategoryPageClient`, `ProductDetailPageClient`, `TagsPageClient` and `TagPageClient` get
  their metadata, canonical, `<h1>` and (on product pages) JSON-LD from the server, but the
  product grid and product detail still load in `useEffect`, so the raw HTML has no product
  content. Their loading branches now render the breadcrumb so the heading is at least
  present. Same fix as `/cakes`: fetch on the server, pass the data in as props. **This is
  the highest-value work remaining in this repo.**
- **Product pages are ~145 words.** They need real copy.
- Blog JSON-LD is **valid** (`BlogPosting` + `FAQPage`, correctly escaped in `JsonLd.js`).
  All 9 posts and their category/tag pages are live and in the sitemap (62 URLs total).

Bigger than any of the above for a local bakery: an active **Google Business Profile**.

## API integration

`sitemap.xml` and blog/product pages fetch from the Django API at `shop.serlesbake.in`,
with a static fallback if the API fails (`app/app/sitemap.xml/route.js`).

Public API responses are CDN-cached for 60 s with a 10-minute stale-while-revalidate
window, so **content edits can take up to a minute to appear** — that's expected, not a bug.

Blog post routes are `/blog/<slug>/`, which must match the `url` and JSON-LD the API emits.

## Gotchas

- Two lockfiles exist (`package-lock.json` at the git root and in `app/`); the build warns
  about it and picks the root one.
- `out/` and `.next/` are build artifacts — the app is **not** a static export.
- The live site returns **403 to unknown user-agents** — pass a browser UA when fetching
  pages for auditing.
