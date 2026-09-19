import { Suspense } from "react";
import TagsPageClient from "./TagsPageClient";

const SITE = "https://www.serlesbake.in";
const PAGE_URL = `${SITE}/cakes/tags`;

// This route used to be a client component declaring its SEO tags through
// next/head, which the App Router ignores — so it emitted no title of its own and
// inherited `canonical: '/'` from the root layout, reporting itself to Google as a
// duplicate of the homepage. Metadata now lives here, on the server.
const TITLE = "Browse Cakes by Type | Serle's Bake, Tenkasi";
const DESCRIPTION =
  "Browse Serle's Bake cakes by type — eggless, photo, custom, tiered, chocolate and more. Homemade cakes baked to order with delivery across Tenkasi.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "cake types, eggless cakes Tenkasi, photo cakes, custom cakes, chocolate cakes, Serle's Bake, cakes near me",
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

export default function TagsPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
      <TagsPageClient />
    </Suspense>
  );
}
