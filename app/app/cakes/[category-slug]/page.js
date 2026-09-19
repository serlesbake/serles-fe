import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductsUrl, getCategoriesUrl, getTagsUrl } from "../../config/api";
import CategoryPageClient from "./CategoryPageClient";
import JsonLd from "../../components/blog/JsonLd";
import apiCache from "../../utils/cache";
import { copyForCategory } from "../categoryCopy";

/**
 * Category titles ran 62-66 chars because of the
 * "- Serle's Bake | From Our Oven to Your Heart" suffix, past the ~60 Google
 * shows. This trades the tagline for "in Tenkasi", which is shorter *and* carries
 * the geo keyword the page needs to rank. "Cakes" is only appended when the
 * category name doesn't already end in it — otherwise "Flavoured Cakes" became
 * "Flavoured Cakes Cakes".
 */
function categoryTitle(name) {
  const subject = /cakes?$/i.test(name) ? name : `${name} Cakes`;
  return `${subject} in Tenkasi | Serle's Bake`;
}

// Server-rendered, so without this it would be prerendered once and never pick up
// new products. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

// Generate metadata for the category page
export async function generateMetadata({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const categorySlug = resolvedParams["category-slug"];
  
  try {
    // Fetch data for metadata
    const [categoriesData, productsData, tagsData] = await Promise.all([
      apiCache.fetchWithCache(getCategoriesUrl()),
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getTagsUrl())
    ]);

    const allCategories = Array.isArray(categoriesData?.results) ? categoriesData.results : Array.isArray(categoriesData) ? categoriesData : [];
    const allProducts = Array.isArray(productsData?.results) ? productsData.results : Array.isArray(productsData) ? productsData : [];
    const allTags = Array.isArray(tagsData?.results) ? tagsData.results : Array.isArray(tagsData) ? tagsData : [];

    // Find current category
    const currentCategory = allCategories.find(c => c.slug === categorySlug);
    
    if (!currentCategory) {
      return {
        title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
        description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        keywords: `homemade cakes, ${categorySlug?.replace(/-/g, ' ')} cakes, Serle's Bake, Tenkasi cakes, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery`,
        openGraph: {
          title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
          description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
          type: 'website',
          url: `https://www.serlesbake.in/cakes/${categorySlug}`,
          images: ['https://www.serlesbake.in/img/logo.png'],
        },
        twitter: {
          card: 'summary_large_image',
          title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
          description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
          images: ['https://www.serlesbake.in/img/logo.png'],
        },
        alternates: {
          canonical: `https://www.serlesbake.in/cakes/${categorySlug}`,
        },
      };
    }

    return {
      title: categoryTitle(currentCategory.name),
      description: currentCategory.description || `Discover our collection of ${currentCategory.name} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect ${currentCategory.name.toLowerCase()} cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
      keywords: `homemade cakes, ${currentCategory.name.toLowerCase()} cakes, Serle's Bake, Tenkasi cakes, ${currentCategory.name.toLowerCase()}, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery${currentCategory.tags ? `, ${currentCategory.tags.join(', ')}` : ''}`,
      openGraph: {
        title: categoryTitle(currentCategory.name),
        description: currentCategory.description || `Discover our collection of ${currentCategory.name} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect ${currentCategory.name.toLowerCase()} cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        type: 'website',
        url: `https://www.serlesbake.in/cakes/${categorySlug}`,
        images: [currentCategory.image?.url || 'https://www.serlesbake.in/img/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: categoryTitle(currentCategory.name),
        description: currentCategory.description || `Discover our collection of ${currentCategory.name} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect ${currentCategory.name.toLowerCase()} cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        images: [currentCategory.image?.url || 'https://www.serlesbake.in/img/logo.png'],
      },
      alternates: {
        canonical: `https://www.serlesbake.in/cakes/${categorySlug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
      description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
      keywords: `homemade cakes, ${categorySlug?.replace(/-/g, ' ')} cakes, Serle's Bake, Tenkasi cakes, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery`,
      openGraph: {
        title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
        description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        type: 'website',
        url: `https://www.serlesbake.in/cakes/${categorySlug}`,
        images: ['https://www.serlesbake.in/img/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: categoryTitle(categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Cakes'),
        description: `Discover our collection of ${categorySlug?.replace(/-/g, ' ')} cakes at Serle's Bake. From Black Forest to Red Velvet, Choco Truffle to Custom Cakes, find the perfect cake for your celebration. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        images: ['https://www.serlesbake.in/img/logo.png'],
      },
      alternates: {
        canonical: `https://www.serlesbake.in/cakes/${categorySlug}`,
      },
    };
  }
}

const SITE = "https://www.serlesbake.in";

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

/**
 * CollectionPage + ItemList for the category, so the listing page itself is
 * eligible for rich results rather than only the individual products. References
 * the WebSite/Bakery nodes declared once in the root layout.
 */
function buildCategorySchema(category, products, categorySlug) {
  const pageUrl = `${SITE}/cakes/${categorySlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: `${category.name} Cakes`,
    description:
      category.description ||
      `${category.name} cakes from Serle's Bake, baked to order in Tenkasi with delivery across the district.`,
    isPartOf: { "@id": `${SITE}/#website` },
    provider: { "@id": `${SITE}/#business` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Cakes", item: `${SITE}/cakes` },
        { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 30).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `${SITE}/cakes/${categorySlug}/${product.slug}`,
      })),
    },
  };
}

export default async function CategoryPage({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const categorySlug = resolvedParams["category-slug"];

  // Fetched here rather than in the client component so the product grid is in
  // the HTML crawlers receive. CategoryPageClient used to fetch this in a
  // useEffect, which left the server response an empty page.
  let categories = [];
  let products = [];
  let tags = [];

  try {
    const [categoriesData, productsData, tagsData] = await Promise.all([
      apiCache.fetchWithCache(getCategoriesUrl()),
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getTagsUrl()),
    ]);
    categories = asList(categoriesData);
    products = asList(productsData);
    tags = asList(tagsData);
  } catch (error) {
    console.error("Error loading category page:", error);
  }

  const category = categories.find((c) => c.slug === categorySlug);

  // Only 404 when the catalog actually loaded and has no such category — a failed
  // fetch would otherwise turn a live category into a 404.
  if (categories.length > 0 && !category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category?.slug === categorySlug);

  return (
    <>
      {category ? <JsonLd data={buildCategorySchema(category, categoryProducts, categorySlug)} /> : null}
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <CategoryPageClient
          params={resolvedParams}
          initialProducts={categoryProducts}
          initialCategories={categories}
          initialTags={tags}
          initialCategory={category ?? null}
        />
      </Suspense>

      {/* Category pages were ~200 words. This copy is written per category in
          categoryCopy.js rather than templated, because the same paragraphs with
          the name swapped would be duplicate content across six URLs. Rendered on
          the server, below the grid, so it adds substance without pushing the
          products down. */}
      {category ? <CategoryCopy slug={categorySlug} name={category.name} /> : null}
    </>
  );
}

function CategoryCopy({ slug, name }) {
  const { heading, paragraphs } = copyForCategory(slug, name);

  return (
    <section className="spad pt-0">
      <div className="container">
        <div className="row">
          <div className="col-lg-10">
            <h2>{heading}</h2>
            {paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
