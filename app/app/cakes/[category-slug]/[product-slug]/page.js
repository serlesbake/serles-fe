import { Suspense } from "react";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "../../../config/api";
import ProductDetailPageClient from "./ProductDetailPageClient";
import JsonLd from "../../../components/blog/JsonLd";
import apiCache from "../../../utils/cache";

const SITE = "https://www.serlesbake.in";

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
async function buildProductSchema(categorySlug, productSlug) {
  const pageUrl = `${SITE}/cakes/${categorySlug}/${productSlug}`;

  try {
    const productsData = await apiCache.fetchWithCache(getProductsUrl());
    const allProducts = Array.isArray(productsData?.results)
      ? productsData.results
      : Array.isArray(productsData)
        ? productsData
        : [];

    const product = allProducts.find(
      (p) => p.slug === productSlug && p.category?.slug === categorySlug
    );
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

export default async function ProductDetailPage({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;

  const schema = await buildProductSchema(
    resolvedParams['category-slug'],
    resolvedParams['product-slug']
  );

  return (
    <>
      <JsonLd data={schema} />
      <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <ProductDetailPageClient params={resolvedParams} />
      </Suspense>
    </>
  );
}
