import { getCategoriesUrl, getProductsUrl, getTagsUrl } from "../config/api";
import apiCache from "../utils/cache";
import JsonLd from "../components/blog/JsonLd";
import CakesPageClient from "./CakesPageClient";

const SITE = "https://www.serlesbake.in";
const PAGE_URL = `${SITE}/cakes`;

// Kept under ~60 chars so Google doesn't truncate it. The previous value was 79
// and, because it was declared through next/head in a client component, was never
// emitted at all — the page inherited the homepage title from the root layout.
const TITLE = "Cakes in Tenkasi | Birthday & Custom Cakes – Serle's Bake";

// The page is server-rendered, so without this it would be prerendered once at
// build time and serve that HTML until the next deploy — new products would never
// appear. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

/** Catalog data for both the metadata and the page body. */
async function getCatalog() {
  const [categoriesData, productsData, tagsData] = await Promise.all([
    apiCache.fetchWithCache(getCategoriesUrl()),
    apiCache.fetchWithCache(getProductsUrl()),
    apiCache.fetchWithCache(getTagsUrl()),
  ]);

  return {
    categories: asList(categoriesData),
    products: asList(productsData),
    tags: asList(tagsData),
  };
}

function buildDescription(categories) {
  const names = categories.slice(0, 3).map((c) => c.name).join(", ");
  const flavours = names || "Black Forest, Red Velvet and Choco Truffle";
  return `Order homemade cakes in Tenkasi from Serle's Bake — ${flavours} and more. Fresh-baked birthday, photo and custom cakes with same-day delivery.`;
}

export async function generateMetadata() {
  let categories = [];
  try {
    ({ categories } = await getCatalog());
  } catch (error) {
    console.error("Error generating /cakes metadata:", error);
  }

  const description = buildDescription(categories);

  return {
    title: TITLE,
    description,
    keywords: `cakes in Tenkasi, cakes near me, homemade cakes, Serle's Bake${
      categories.length > 0 ? `, ${categories.map((c) => c.name.toLowerCase()).join(", ")}` : ", black forest cake, red velvet cake, choco truffle cake"
    }, birthday cakes, custom cakes, photo cakes, cake delivery Tenkasi`,
    // The root layout sets `canonical: '/'`, which every page that doesn't
    // override it inherits. /cakes is the main commercial page; without this it
    // told Google it was a duplicate of the homepage.
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: TITLE,
      description,
      type: "website",
      url: PAGE_URL,
      siteName: "Serle's Bake",
      images: [`${SITE}/img/logo.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description,
      images: [`${SITE}/img/logo.png`],
    },
  };
}

export default async function CakesIndexPage() {
  let categories = [];
  let products = [];

  try {
    ({ categories, products } = await getCatalog());
  } catch (error) {
    console.error("Error loading /cakes:", error);
  }

  // A CollectionPage + ItemList so the category page itself is eligible for rich
  // results, not just the individual products.
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Cakes in Tenkasi",
    description: buildDescription(categories),
    // References the WebSite/Bakery nodes declared once in the root layout rather
    // than redefining them per page.
    isPartOf: { "@id": `${SITE}/#website` },
    provider: { "@id": `${SITE}/#business` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Cakes", item: PAGE_URL },
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

      <CakesPageClient products={products} categories={categories} />

      {/* The page was 147 words, against ~1,200 for a blog post — thin for the URL
          that has to rank for the commercial keywords. This copy is rendered on
          the server, below the grid, so it adds substance without pushing the
          products down the page. */}
      <section className="spad pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              <h2>Freshly Baked Cakes, Made to Order in Tenkasi</h2>
              <p>
                Every cake at Serle&apos;s Bake is baked to order in our own kitchen in
                Tenkasi — never pulled from a display fridge. We bake in small
                batches, which is why the sponge is still soft on the day it
                reaches you and why we can adjust sweetness, filling and finish to
                what you actually want. Choose a weight, tell us the occasion, and
                we bake it fresh for your date.
              </p>

              <h2>Cakes for Every Occasion</h2>
              <p>
                Birthdays are what we bake most: layered sponges with a name and a
                message piped on top, ready the same day when you order early
                enough. Photo cakes carry an edible print of your own picture —
                popular for first birthdays and retirements. Custom and theme cakes
                are sculpted to a brief, so send a reference picture and we will
                tell you honestly what is possible at what weight. For weddings,
                engagements and anniversaries we bake tiered cakes to order, and we
                also make brownies and jar desserts when you need something smaller
                than a whole cake.
              </p>

              <h2>Flavours We Bake</h2>
              <p>
                Black Forest with cherries and dark chocolate shavings, Red Velvet
                with cream cheese frosting, Choco Truffle for anyone who wants it
                properly rich, plus butterscotch, pineapple, vanilla and
                seasonal fruit. Not sure which travels best for a large gathering or
                which holds up in Tenkasi&apos;s heat? Ask us — we would rather
                recommend the right cake than sell you the wrong one.
              </p>

              <h2>Delivery and Ordering in Tenkasi</h2>
              <p>
                We deliver across Tenkasi and the surrounding area, and same-day
                delivery is usually possible on standard cakes when you order in the
                morning. Custom designs and tiered cakes need at least a day&apos;s
                notice so the bake and the decoration are not rushed. Pick a cake
                above, or message us on WhatsApp with your occasion, date and rough
                weight and we will confirm the price and the timing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
