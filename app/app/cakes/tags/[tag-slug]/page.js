import { Suspense } from "react";
import { getTagsUrl } from "../../../config/api";
import apiCache from "../../../utils/cache";
import TagPageClient from "./TagPageClient";

const SITE = "https://www.serlesbake.in";

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

const titleCase = (slug = "") =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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

  const title = `${name} Cakes in Tenkasi | Serle's Bake`;
  const description = `${name} cakes from Serle's Bake — homemade, baked to order in Tenkasi with delivery across the district. Browse our ${name.toLowerCase()} range and order today.`;

  return {
    title,
    description,
    keywords: `${name.toLowerCase()} cakes, ${name.toLowerCase()} cake Tenkasi, homemade cakes, Serle's Bake, cakes near me, cake delivery Tenkasi`,
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

  return (
    <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
      <TagPageClient params={resolvedParams} />
    </Suspense>
  );
}
