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

// Fetch all data from APIs
export async function fetchSitemapData() {
  try {
    const [productsData, categoriesData, tagsData] = await Promise.all([
      apiCache.fetchWithCache(getProductsUrl()),
      apiCache.fetchWithCache(getCategoriesUrl()),
      apiCache.fetchWithCache(getTagsUrl())
    ]);

    const products = Array.isArray(productsData?.results) ? productsData.results : Array.isArray(productsData) ? productsData : [];
    const categories = Array.isArray(categoriesData?.results) ? categoriesData.results : Array.isArray(categoriesData) ? categoriesData : [];
    const tags = Array.isArray(tagsData?.results) ? tagsData.results : Array.isArray(tagsData) ? tagsData : [];

    return { products, categories, tags };
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return { products: [], categories: [], tags: [] };
  }
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