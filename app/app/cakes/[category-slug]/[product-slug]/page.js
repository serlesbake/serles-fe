import { notFound } from "next/navigation";
import { getProductsUrl, getCategoriesUrl, getProductDetailUrl } from "../../../config/api";
import ProductDetailPageClient from "./ProductDetailPageClient";
import JsonLd from "../../../components/blog/JsonLd";
import { fetchCatalogJson, catalogList } from '../../../utils/catalog';
import { buildProductMetadata } from "../../../utils/productMetadata";

const SITE = "https://www.serlesbake.in";

// Server-rendered, so without this it would be prerendered once and never pick up
// price or description edits. 60s matches the public API's own CDN cache window.
export const revalidate = 60;

// Keep canonical, search and social metadata in the server HTML.
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams['category-slug'];
  const productSlug = resolvedParams['product-slug'];
  try {
    const products = catalogList(await fetchCatalogJson(getProductsUrl()));
    const listedProduct = products.find(product =>
      product.slug === productSlug && product.category?.slug === categorySlug
    );
    if (!listedProduct) return buildProductMetadata({}, categorySlug, productSlug);

    const detail = await fetchCatalogJson(getProductDetailUrl(listedProduct.id));
    // A list-shaped fallback from the legacy cache is not a product detail.
    const product = detail?.name ? detail : listedProduct;
    return buildProductMetadata(product, categorySlug, productSlug);
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return buildProductMetadata({}, categorySlug, productSlug);
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
    const activeWeights = Array.isArray(product.weight_options)
      ? product.weight_options.filter((option) => option?.is_active !== false && Number(option?.price) > 0)
      : [];
    const prices = activeWeights.map((option) => Number(option.price)).sort((a, b) => a - b);
    if (prices.length === 0) {
      const minimum = Number(product.min_price || product.base_price);
      const maximum = Number(product.max_price || minimum);
      if (minimum > 0 && maximum > minimum) prices.push(minimum, maximum);
      else if (minimum > 0) prices.push(minimum);
    }
    const offers = prices.length > 1
      ? {
          '@type': 'AggregateOffer',
          lowPrice: prices[0].toFixed(2),
          highPrice: prices[prices.length - 1].toFixed(2),
          offerCount: prices.length,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        }
      : prices.length === 1
        ? {
            '@type': 'Offer',
            price: prices[0].toFixed(2),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          }
        : null;
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
        ...(offers
          ? { offers: { ...offers, url: pageUrl, seller: { '@id': `${SITE}/#business` } } }
          : base.offers && !Array.isArray(base.offers)
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
      fetchCatalogJson(getProductsUrl()),
      fetchCatalogJson(getCategoriesUrl()),
    ]);

    const allProducts = catalogList(productsData);
    const categories = catalogList(categoriesData);

    const listProduct = allProducts.find(
      (p) => p.slug === productSlug && p.category?.slug === categorySlug
    );
    if (!listProduct) return { ...empty, categories, catalogLoaded: true };

    const detail = await fetchCatalogJson(getProductDetailUrl(listProduct.id));
    if (!detail?.id || detail.slug !== productSlug) throw new Error('Incomplete product detail response');

    const sameCategory = allProducts.filter(
      (p) => p.category?.slug === categorySlug && p.id !== listProduct.id
    );
    const related = [
      ...sameCategory,
      ...allProducts.filter(
        (p) => p.category?.slug !== categorySlug && p.id !== listProduct.id
      ),
    ].slice(0, 4);

    return {
      product: detail ?? listProduct,
      listProduct,
      categories,
      related,
      catalogLoaded: true,
    };
  } catch (error) {
    console.error('Error loading product page:', error);
    throw error;
  }
}

export default async function ProductDetailPage({ params }) {
  // Await params in Next.js 15
  const resolvedParams = await params;
  const categorySlug = resolvedParams['category-slug'];
  const productSlug = resolvedParams['product-slug'];

  const { product, listProduct, categories, related, catalogLoaded } =
    await getProductData(categorySlug, productSlug);

  // Keep related cakes useful on single-item categories; same-category matches
  // are preferred and the server fetch already supplies the wider catalog.

  // Only 404 when the catalog actually loaded and has no such product — a failed
  // fetch would otherwise turn a live product into a 404.
  if (catalogLoaded && !listProduct) {
    notFound();
  }

  // Build from the DETAIL payload, not the list one.
  //
  // The list endpoint returns `meta_data: {}` - building the full meta block for
  // every product in a list would cost a query per row, and this API is latency
  // bound. Only the detail endpoint populates it. Reading the list payload here
  // meant meta_data.schema_json was always undefined, so every product page fell
  // through to the minimal fallback and shipped a Product node with `offers:
  // null` - no price, no availability, so not eligible for a product rich result.
  //
  // Verified live before the fix: offers was null on /cakes/premium-cake/black-forest.
  const schema = buildProductSchema(product ?? listProduct, categorySlug, productSlug);

  return (
    <>
      <JsonLd data={schema} />
      <ProductDetailPageClient
        params={resolvedParams}
        initialProduct={product}
        initialCategories={categories}
        initialRelatedProducts={related}
      />
    </>
  );
}
