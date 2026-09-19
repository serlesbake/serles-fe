import { getProductsUrl, getCategoriesUrl, getTagsUrl } from '../config/api.js';
import apiCache from './cache.js';
import { getPostsForSitemap, getCategories as getBlogCategories, getTags as getBlogTags } from './blogData.js';

// Base URL for the website
const BASE_URL = 'https://www.serlesbake.in';

// Static pages configuration
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/menu', priority: '0.9', changefreq: 'weekly' },
  { path: '/testimonial', priority: '0.7', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms-conditions', priority: '0.3', changefreq: 'yearly' },
  { path: '/site-map', priority: '0.4', changefreq: 'monthly' },
];

/**
 * Catalog data for the sitemap.
 *
 * Uses `fetchWithRetry` rather than `fetchWithCache`: a single slow response — a
 * cold serverless function, say — used to be enough to drop every product and
 * category out of the sitemap. Observed in a real build, which produced 10 urls
 * instead of 62.
 *
 * It then **throws** when the catalog comes back empty instead of returning empty
 * arrays. That is the important part. `fetchWithCache` answers a failed
 * `/products` call with `{ results: [] }`, so the old code could not tell "the
 * shop has no products" from "the request failed", and `generateXMLSitemap` would
 * happily succeed with a near-empty sitemap. The route's error fallback never
 * fired, because nothing had errored. A sitemap that silently loses 52 urls and is
 * then cached for an hour is worse than one that fails loudly.
 */
export async function fetchSitemapData() {
  const [productsData, categoriesData, tagsData] = await Promise.all([
    apiCache.fetchWithRetry(getProductsUrl()),
    apiCache.fetchWithRetry(getCategoriesUrl()),
    apiCache.fetchWithRetry(getTagsUrl()),
  ]);

  const asList = (payload) =>
    Array.isArray(payload?.results) ? payload.results : Array.isArray(payload) ? payload : [];

  const products = asList(productsData);
  const categories = asList(categoriesData);
  const tags = asList(tagsData);

  // Tags can legitimately be empty; products and categories cannot. If both are
  // empty the catalog did not load, whatever the individual responses said.
  if (products.length === 0 && categories.length === 0) {
    throw new Error('Sitemap: catalog fetch returned no products and no categories');
  }

  return { products, categories, tags };
}

// Generate XML sitemap
export async function generateXMLSitemap() {
  const { products, categories, tags } = await fetchSitemapData();
  const currentDate = new Date().toISOString();

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add static pages
  STATIC_PAGES.forEach(page => {
    sitemap += `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Add main cakes page
  sitemap += `
  <url>
    <loc>${BASE_URL}/cakes</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // Add category pages
  categories.forEach(category => {
    if (category.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/cakes/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  });

  // Add product detail pages
  products.forEach(product => {
    if (product.slug && product.category?.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/cakes/${product.category.slug}/${product.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  });

  // Add tags page
  sitemap += `
  <url>
    <loc>${BASE_URL}/cakes/tags</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;

  // Add individual tag pages
  tags.forEach(tag => {
    if (tag.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/cakes/tags/${tag.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  });

  // Blog: posts carry a real `lastmod` from the API, so they get accurate dates
  // rather than the build timestamp used above.
  const [blogPosts, blogCategories, blogTags] = await Promise.all([
    getPostsForSitemap(),
    getBlogCategories(),
    getBlogTags(),
  ]);

  blogPosts.forEach(post => {
    if (post.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.lastmod || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  });

  blogCategories.forEach(category => {
    if (category.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/blog/categories/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
  });

  blogTags.forEach(tag => {
    if (tag.slug) {
      sitemap += `
  <url>
    <loc>${BASE_URL}/blog/tags/${tag.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
    }
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Generate structured data for visual sitemap
export async function generateSitemapData() {
  const { products, categories, tags } = await fetchSitemapData();

  // Group products by category
  const productsByCategory = {};
  categories.forEach(category => {
    productsByCategory[category.slug] = products.filter(
      product => product.category?.slug === category.slug
    );
  });

  // Get unique product names (for variants)
  const uniqueProductNames = [...new Set(products.map(p => p.name))];

  return {
    staticPages: STATIC_PAGES,
    categories: categories.map(category => ({
      ...category,
      productCount: productsByCategory[category.slug]?.length || 0,
      products: productsByCategory[category.slug] || []
    })),
    tags: tags.map(tag => ({
      ...tag,
      productCount: products.filter(product => 
        product.tags && Array.isArray(product.tags) && 
        product.tags.some(t => t.slug === tag.slug)
      ).length
    })),
    stats: {
      totalProducts: products.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      uniqueProductNames: uniqueProductNames.length
    }
  };
}

// Helper function to format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Default export for the sitemap utility
const sitemapUtils = {
  fetchSitemapData,
  generateXMLSitemap,
  generateSitemapData,
  formatDate
};

export default sitemapUtils; 