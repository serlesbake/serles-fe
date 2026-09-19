import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "../../../config/api";
import ProductDetailPageClient from "./ProductDetailPageClient";
import JsonLd from "../../../components/blog/JsonLd";
import apiCache from "../../../utils/cache";

const SITE = "https://www.serlesbake.in";

// Server-rendered, so without this it would be prerendered once and never pick up
// price or description edits. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

const asList = (payload) =>
  Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

// Generate metadata for the product detail page
export async function generateMetadata({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const categorySlug = resolvedParams["category-slug"];
  const productSlug = resolvedParams["product-slug"];
  
  try {
    // Fetch data for metadata
    const [productsData, categoriesData] = await Promise.all([
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getCategoriesUrl())
    ]);

    const allProducts = Array.isArray(productsData?.results) ? productsData.results : Array.isArray(productsData) ? productsData : [];
    const allCategories = Array.isArray(categoriesData?.results) ? categoriesData.results : Array.isArray(categoriesData) ? categoriesData : [];

    // Find the specific product from the list
    const foundProductFromList = allProducts.find(p => 
      p.slug === productSlug && p.category?.slug === categorySlug
    );

    if (!foundProductFromList) {
      return {
        title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
        description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        keywords: `homemade cakes, ${productSlug?.replace(/-/g, ' ')}, Serle's Bake, Tenkasi cakes, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery`,
        openGraph: {
          title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
          description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
          type: 'website',
          url: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
          images: ['https://www.serlesbake.in/img/logo.png'],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
          description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
          images: ['https://www.serlesbake.in/img/logo.png'],
        },
        alternates: {
          canonical: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
        },
      };
    }

    // Fetch individual product data to get complete information using proper API URL
    const individualProductData = await apiCache.fetchWithCache(getProductDetailUrl(foundProductFromList.id));

    return {
      title: `${individualProductData.name} - Serle's Bake | From Our Oven to Your Heart`,
      description: individualProductData.description || individualProductData.short_description || `Discover our delicious ${individualProductData.name} at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
      keywords: `homemade cakes, ${individualProductData.name.toLowerCase()}, Serle's Bake, Tenkasi cakes, ${individualProductData.category?.name?.toLowerCase() || 'cake'}, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery${individualProductData.tags ? `, ${individualProductData.tags.map(tag => tag.name).join(', ')}` : ''}`,
      openGraph: {
        title: `${individualProductData.name} - Serle's Bake | From Our Oven to Your Heart`,
        description: individualProductData.description || individualProductData.short_description || `Discover our delicious ${individualProductData.name} at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        type: 'website',
        url: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
        images: [individualProductData.featured_image?.url || individualProductData.images?.[0]?.url || 'https://www.serlesbake.in/img/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${individualProductData.name} - Serle's Bake | From Our Oven to Your Heart`,
        description: individualProductData.description || individualProductData.short_description || `Discover our delicious ${individualProductData.name} at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        images: [individualProductData.featured_image?.url || individualProductData.images?.[0]?.url || 'https://www.serlesbake.in/img/logo.png'],
      },
      alternates: {
        canonical: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
      description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
      keywords: `homemade cakes, ${productSlug?.replace(/-/g, ' ')}, Serle's Bake, Tenkasi cakes, birthday cakes, wedding cakes, custom cakes, Tamil Nadu bakery, fresh cakes delivery`,
      openGraph: {
        title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
        description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        type: 'website',
        url: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
        images: ['https://www.serlesbake.in/img/logo.png'],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${productSlug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - Serle's Bake | From Our Oven to Your Heart`,
        description: `Discover our delicious ${productSlug?.replace(/-/g, ' ')} cake at Serle's Bake. Fresh homemade cake crafted with care and passion. Perfect for birthdays, weddings, and special celebrations. Fresh cakes delivered in Tenkasi, Tamil Nadu.`,
        images: ['https://www.serlesbake.in/img/logo.png'],
      },
      alternates: {
        canonical: `https://www.serlesbake.in/cakes/${categorySlug}/${productSlug}`,
      },
    };
  }
}

/**
 * Product structured data.
 *
 * The API already builds valid Product JSON-LD (with an Offer, price and
 * availability) in `meta_data.schema_json` — it was simply never rendered, so
 * product pages shipped no structured data at all. We render what the backend
 * emits and add only what it cannot know: the page's own URL, and the link to the
 * sitewide Bakery node declared in the root layout, so the product is attributed
 * to the business rather than floating free.
 *
 * Falls back to a minimal Product built from the list payload when an editor has
 * not created a MetaData row for the product.
 */
function buildProductSchema(product, categorySlug, productSlug) {
  const pageUrl = `${SITE}/cakes/${categorySlug}/${productSlug}`;

  try {
    if (!product) return null;

    const apiSchema = product.meta_data?.schema_json;
    const base =
      apiSchema && typeof apiSchema === 'object' && Object.keys(apiSchema).length > 0
        ? apiSchema
        : {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || product.short_description || undefined,
            brand: { '@type': 'Brand', name: "Serle's Bake" },
          };

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Cakes', item: `${SITE}/cakes` },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category?.name || categorySlug,
          item: `${SITE}/cakes/${categorySlug}`,
        },
        { '@type': 'ListItem', position: 4, name: product.name, item: pageUrl },
      ],
    };

    return [
      {
        ...base,
        '@id': `${pageUrl}#product`,
        url: pageUrl,
        // Anchor the offer to this URL so Google knows where the product is sold.
        ...(base.offers
          ? { offers: { ...base.offers, url: pageUrl, seller: { '@id': `${SITE}/#business` } } }
          : {}),
      },
      breadcrumb,
    ];
  } catch (error) {
    console.error('Error building product schema:', error);
    return null;
  }
}

/**
 * Everything the page needs, fetched once on the server.
 *
 * ProductDetailPageClient used to fetch all of this in a useEffect, so the server
 * response was a bare "Loading..." — crawlers saw no product name, description,
 * price or image. The individual detail call is what carries `weight_options`,
 * which the list payload omits, so it is made here too.
 */
async function getProductData(categorySlug, productSlug) {
  const empty = { product: null, categories: [], related: [], listProduct: null };

  try {
    const [productsData, categoriesData] = await Promise.all([
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getCategoriesUrl()),
    ]);

    const allProducts = asList(productsData);
    const categories = asList(categoriesData);

    const listProduct = allProducts.find(
      (p) => p.slug === productSlug && p.category?.slug === categorySlug
    );
    if (!listProduct) return { ...empty, categories, catalogLoaded: allProducts.length > 0 };

    const detail = await apiCache.fetchWithCache(getProductDetailUrl(listProduct.id));

    const related = allProducts
      .filter((p) => p.category?.slug === categorySlug && p.id !== listProduct.id)
      .slice(0, 4);

    return {
      product: detail ?? listProduct,
      listProduct,
      categories,
      related,
      catalogLoaded: true,
    };
  } catch (error) {
    console.error('Error loading product page:', error);
    return empty;
  }
}

export default async function ProductDetailPage({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const categorySlug = resolvedParams['category-slug'];
  const productSlug = resolvedParams['product-slug'];

  const { product, listProduct, categories, related, catalogLoaded } =
    await getProductData(categorySlug, productSlug);

  // Only 404 when the catalog actually loaded and has no such product — a failed
  // fetch would otherwise turn a live product into a 404.
  if (catalogLoaded && !listProduct) {
    notFound();
  }

  // The schema reads meta_data.schema_json, which the list payload carries.
  const schema = buildProductSchema(listProduct ?? product, categorySlug, productSlug);

  return (
    <>
      <JsonLd data={schema} />
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <ProductDetailPageClient
          params={resolvedParams}
          initialProduct={product}
          initialCategories={categories}
          initialRelatedProducts={related}
        />
      </Suspense>
    </>
  );
}
