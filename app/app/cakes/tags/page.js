import { Suspense } from "react";
import { getProductsUrl, getTagsUrl } from "../../config/api";
import apiCache from "../../utils/cache";
import JsonLd from "../../components/blog/JsonLd";
import TagsPageClient from "./TagsPageClient";

const SITE = "https://www.serlesbake.in";
const PAGE_URL = `${SITE}/cakes/tags`;

// Server-rendered, so without this it would be prerendered once and never pick up
// new tags. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

// This route used to be a client component declaring its SEO tags through
// next/head, which the App Router ignores — so it emitted no title of its own and
// inherited `canonical: '/'` from the root layout, reporting itself to Google as a
// duplicate of the homepage. Metadata now lives here, on the server.
// Do not list cake types here that are not actual tags. An earlier version of
// this description advertised "eggless" among the browsable types; no eggless
// tag exists, and the shop's own blog only offers to confirm what can be baked
// eggless on request. Promising a filter that does not exist sends people to a
// page that cannot answer them.
const TITLE = "Browse Cakes by Type | Serle's Bake, Tenkasi";
const DESCRIPTION =
  "Browse Serle's Bake cakes by type — chocolate, brownies and more. Homemade cakes baked to order in Tenkasi, with delivery across the district.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "cake types, cake tags, chocolate cakes Tenkasi, brownies, Serle's Bake, cakes near me",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: PAGE_URL,
    siteName: "Serle's Bake",
    images: [`${SITE}/img/logo.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/img/logo.png`],
  },
};

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

/**
 * Attach a product count to each tag and drop the empty ones.
 *
 * Mirrors what TagsPageClient used to compute in the browser. Doing it here means
 * the tag list is in the server HTML instead of appearing only after hydration.
 */
function tagsWithCounts(tags, products) {
  return tags
    .map((tag) => ({
      ...tag,
      productCount: products.filter(
        (product) =>
          Array.isArray(product.tags) && product.tags.some((t) => t.slug === tag.slug)
      ).length,
    }))
    .filter((tag) => tag.productCount > 0);
}

export default async function TagsPage() {
  let tags = [];
  let products = [];

  try {
    const [tagsData, productsData] = await Promise.all([
      apiCache.fetchWithCache(getTagsUrl()),
      apiCache.fetchWithCache(getProductsUrl()),
    ]);
    tags = tagsWithCounts(asList(tagsData), asList(productsData));
    products = asList(productsData);
  } catch (error) {
    console.error("Error loading /cakes/tags:", error);
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Browse Cakes by Type",
    description: DESCRIPTION,
    isPartOf: { "@id": `${SITE}/#website` },
    provider: { "@id": `${SITE}/#business` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Cakes", item: `${SITE}/cakes` },
        { "@type": "ListItem", position: 3, name: "Tags", item: PAGE_URL },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tags.length,
      itemListElement: tags.slice(0, 50).map((tag, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tag.name,
        url: `${SITE}/cakes/tags/${tag.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={schema} />
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <TagsPageClient initialTags={tags} initialProducts={products} />
      </Suspense>
    </>
  );
}
