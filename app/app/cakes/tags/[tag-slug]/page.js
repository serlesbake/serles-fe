import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductsUrl, getCategoriesUrl, getTagsUrl } from "../../../config/api";
import apiCache from "../../../utils/cache";
import JsonLd from "../../../components/blog/JsonLd";
import TagPageClient from "./TagPageClient";

const SITE = "https://www.serlesbake.in";

// Server-rendered, so without this it would be prerendered once and never pick up
// newly tagged products. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

const titleCase = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Most tag slugs already end in "cake(s)" — don't produce "Birthday Cakes Cakes". */
const tagHeading = (name = "") => (/cakes?$/i.test(name) ? name : `${name} Cakes`);

/** Everything the route needs, fetched once on the server. */
async function getTagData(tagSlug) {
  try {
    const [categoriesData, productsData, tagsData] = await Promise.all([
      apiCache.fetchWithCache(getCategoriesUrl()),
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getTagsUrl()),
    ]);

    const allProducts = asList(productsData);
    const tags = asList(tagsData);

    return {
      categories: asList(categoriesData),
      tags,
      tag: tags.find((t) => t.slug === tagSlug) ?? null,
      products: allProducts.filter(
        (p) => Array.isArray(p.tags) && p.tags.some((t) => t.slug === tagSlug)
      ),
      tagsLoaded: tags.length > 0,
    };
  } catch (error) {
    console.error("Error loading tag page:", error);
    return { categories: [], tags: [], tag: null, products: [], tagsLoaded: false };
  }
}

/**
 * SEO for a tag page.
 *
 * This route used to be a client component declaring its tags through next/head,
 * which the App Router ignores — so every tag page emitted the homepage title and
 * inherited `canonical: '/'`, telling Google each one was a duplicate of the
 * homepage. Resolved server-side now, with the tag's real name when the API knows
 * it and a title-cased slug when it doesn't.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const tagSlug = resolvedParams["tag-slug"];
  const pageUrl = `${SITE}/cakes/tags/${tagSlug}`;

  let name = titleCase(tagSlug);
  try {
    const tag = asList(await apiCache.fetchWithCache(getTagsUrl())).find((t) => t.slug === tagSlug);
    if (tag?.name) name = tag.name;
  } catch (error) {
    console.error("Error generating tag metadata:", error);
  }

  const title = `${tagHeading(name)} in Tenkasi | Serle's Bake`;
  const description = `${tagHeading(name)} from Serle's Bake — homemade, baked to order in Tenkasi with delivery across the district. Browse the range and order today.`;

  return {
    title,
    description,
    keywords: `${name.toLowerCase()}, ${name.toLowerCase()} Tenkasi, homemade cakes, Serle's Bake, cakes near me, cake delivery Tenkasi`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl,
      siteName: "Serle's Bake",
      images: [`${SITE}/img/logo.png`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE}/img/logo.png`],
    },
  };
}

export default async function TagPage({ params }) {
  const resolvedParams = await params;
  const tagSlug = resolvedParams["tag-slug"];

  const { categories, tags, tag, products, tagsLoaded } = await getTagData(tagSlug);

  // Only 404 when the tag list actually loaded and has no such tag — a failed
  // fetch would otherwise turn a live tag page into a 404.
  if (tagsLoaded && !tag) {
    notFound();
  }

  const name = tag?.name || titleCase(tagSlug);
  const pageUrl = `${SITE}/cakes/tags/${tagSlug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: tagHeading(name),
    isPartOf: { "@id": `${SITE}/#website` },
    provider: { "@id": `${SITE}/#business` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Cakes", item: `${SITE}/cakes` },
        { "@type": "ListItem", position: 3, name: "Tags", item: `${SITE}/cakes/tags` },
        { "@type": "ListItem", position: 4, name, item: pageUrl },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${SITE}/cakes/${product.category?.slug ?? "cakes"}/${product.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={schema} />
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <TagPageClient
          params={resolvedParams}
          initialProducts={products}
          initialCategories={categories}
          initialTags={tags}
        />
      </Suspense>
    </>
  );
}
