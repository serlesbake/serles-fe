# Blog API Guide — Serle's Bake

The `blog` app adds an SEO-first content module. Every post ships its own meta title,
description, OpenGraph/Twitter tags and Schema.org JSON-LD through the same generic
`MetaData` system already used by products, categories and tags
(see [SEO_META_DATA_GUIDE.md](SEO_META_DATA_GUIDE.md)).

All endpoints are **public and read-only**. Content is authored in Django admin
under **Blog**. Base path: `/api/blog/`.

---

## Endpoints

### Posts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blog/posts/` | All published posts (list payload) |
| GET | `/api/blog/posts/<slug>/` | Single post with full body, SEO meta and internal links |
| GET | `/api/blog/posts/featured/` | Featured posts only |
| GET | `/api/blog/posts/latest/?limit=5` | Most recent posts |
| GET | `/api/blog/posts/popular/?limit=5` | Most-read posts |
| GET | `/api/blog/posts/<slug>/related/` | Posts in the same category, else sharing tags |
| GET | `/api/blog/posts/sitemap/` | Slugs + `lastmod` for generating `sitemap.xml` |

Detail lookup accepts a slug (`/api/blog/posts/best-birthday-cakes-in-tenkasi-flavours-prices-delivery/`)
or a numeric id. Unknown or draft slugs return **404**. Retrieving a post increments `views_count`.

**List query params** (combinable):

| Param | Values | Example |
|---|---|---|
| `search` | free text over title, excerpt, body, keyword, tag, category | `?search=wedding` |
| `category` | blog category slug | `?category=cake-buying-guides` |
| `tag` | blog tag slug | `?tag=tenkasi` |
| `featured` | `true` / `1` / `yes` | `?featured=true` |
| `sort` | `date` (default), `title`, `views` | `?sort=views` |
| `order` | `desc` (default), `asc` | `?sort=title&order=asc` |
| `limit` | integer | `?limit=3` |

### Categories

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blog/categories/` | Active blog categories with post counts |
| GET | `/api/blog/categories/<slug>/` | Single category with its own SEO meta |
| GET | `/api/blog/categories/<slug>/posts/` | Published posts in that category |

### Tags

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blog/tags/` | Active blog tags with post counts |
| GET | `/api/blog/tags/<slug>/` | Single tag |
| GET | `/api/blog/tags/<slug>/posts/` | Published posts carrying that tag |

---

## Detail response shape

```jsonc
{
  "id": 3,
  "title": "Wedding & Engagement Tier Cakes in Tenkasi: A Planning Guide",
  "slug": "wedding-and-engagement-tier-cakes-in-tenkasi-guide",
  "excerpt": "How many tiers you need, which flavours survive a long reception...",
  "content": "<p>A wedding cake has one job...</p>",   // HTML, render with v-html / dangerouslySetInnerHTML
  "category": { "id": 2, "name": "Celebration Ideas", "slug": "celebration-ideas", "meta_data": {...} },
  "tags": [ { "name": "Wedding Cakes", "slug": "wedding-cakes", "posts_count": 1 } ],
  "tags_list": ["Wedding Cakes", "Tier Cakes", "Tenkasi", "Homemade Cakes"],
  "cover_image": { "url": "https://cdn.serlesbake.in/blog/...", "alt_text": "Three tier wedding cake..." },
  "author_name": "Serle's Bake",
  "focus_keyword": "wedding cake in Tenkasi",
  "canonical_url": "",
  "url": "/blog/wedding-and-engagement-tier-cakes-in-tenkasi-guide/",
  "reading_time": 4,
  "word_count": 740,
  "views_count": 12,
  "published_at": "2026-08-11T09:00:00+05:30",
  "meta_data": {
    "meta_title": "Wedding Cakes in Tenkasi | Serle's Bake",
    "meta_description": "Planning a wedding cake in Tenkasi? Tier sizes, guest counts...",
    "og_title": "...", "og_description": "...", "og_image_url": "...",
    "twitter_title": "...", "twitter_description": "...", "twitter_image_url": "...",
    "schema_json": { "@context": "https://schema.org", "@graph": [ { "@type": "BlogPosting" }, { "@type": "FAQPage" } ] }
  },
  "related_products":   [ { "name": "Two Tier Cake", "url": "/category/tier-cake/two-tier-cake/", "price_range": "₹999", "image_url": "..." } ],
  "related_categories": [ { "name": "Tier Cakes", "url": "/category/tier-cake/" } ],
  "related_posts":      [ { "title": "...", "slug": "...", "excerpt": "..." } ]
}
```

`related_products` / `related_categories` are the editor-chosen internal links used for
in-article product cards — they keep link equity flowing into shop pages.

---

## Frontend SEO checklist

1. Render `meta_data.meta_title` / `meta_description` into `<title>` and `<meta name="description">`.
2. Render the `og_*` and `twitter_*` values into their respective tags.
3. Inject `meta_data.schema_json` as `<script type="application/ld+json">`. The seeded posts
   ship a `@graph` with both **BlogPosting** and **FAQPage** — the FAQ block is what earns
   rich results in Google for the questions at the bottom of each post.
4. Add `<link rel="canonical">` using `canonical_url` when set, else the post URL.
5. Build `sitemap.xml` from `/api/blog/posts/sitemap/` and reference it in `robots.txt`.
6. Post URLs should be `/blog/<slug>/` to match `url` and the JSON-LD.

If a post has no `MetaData` row, the API auto-generates one on the fly (headline + brand,
excerpt-based description, `BlogPosting` schema), so the SEO tags are never empty.

---

## Authoring in admin

**Blog > Blog Posts** → write the post, then:

- **Focus keyword** — the phrase the post targets; feeds the JSON-LD `keywords`.
- **Search preview** — read-only field showing the exact title/description Google will see,
  with character counts against the 60/160 limits.
- **Create meta data** action — generates the `MetaData` row; fine-tune it under **App > Meta Data**.
- **Internal Linking** — pick related products/categories to render as in-article cards.
- Posts are `draft` until published; drafts are invisible to the API. `published_at` is
  stamped automatically the first time a post goes live.

---

## Seeding the launch posts

```bash
python manage.py seed_blog_posts                     # create/refresh the 3 launch posts
python manage.py seed_blog_posts --overwrite-content # also reset body copy edited in admin
```

Idempotent (matched on slug). Product links inside the copy are written as
`{product:<slug>}` / `{category:<slug>}` placeholders and resolved against the database at
seed time, so a product moving to a different shop category cannot break the article's
internal links.

Seeded content:

| Post | Focus keyword | Category |
|---|---|---|
| Best Birthday Cakes in Tenkasi: Flavours, Prices & Same-Day Delivery | birthday cake in Tenkasi | Cake Buying Guides |
| Custom & Photo Cakes in Tenkasi: How to Order Yours | custom cake in Tenkasi | Cake Buying Guides |
| Wedding & Engagement Tier Cakes in Tenkasi: A Planning Guide | wedding cake in Tenkasi | Celebration Ideas |
