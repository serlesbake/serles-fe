// API Configuration
export const runtime = 'edge';
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://serlesbackend.vercel.app',
  PRODUCTS_ENDPOINT: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT || '/api/products/?format=json',
  CATEGORIES_ENDPOINT: process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT || '/api/categories/?format=json',
  PRODUCT_DETAIL_ENDPOINT: '/api/products/{id}/?format=json',
  BANNERS_ENDPOINT: '/api/banners/?format=json',
  TAGS_ENDPOINT: process.env.NEXT_PUBLIC_TAGS_ENDPOINT || '/api/tags/?format=json',
};

export const getProductsUrl = (page = 1, pageSize = 100) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}&page=${page}&page_size=${pageSize}`;
};

export const getProductDetailUrl = (id) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCT_DETAIL_ENDPOINT.replace('{id}', id)}`;
}; 

export const getCategoriesUrl = () => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.CATEGORIES_ENDPOINT}`;
};

export const getBannersUrl = () => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.BANNERS_ENDPOINT}`;
};

export const getTagsUrl = () => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.TAGS_ENDPOINT}`;
};
// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------
// All blog endpoints are public + read-only. See BLOG_API_GUIDE.md at the repo
// root for the full contract.
export const BLOG_CONFIG = {
  BASE_PATH: process.env.NEXT_PUBLIC_BLOG_BASE_PATH || '/api/blog',
};

const blogUrl = (path, query) => {
  const url = `${API_CONFIG.BASE_URL}${BLOG_CONFIG.BASE_PATH}${path}`;
  const qs = query ? buildQuery(query) : '';
  return qs ? `${url}?${qs}` : url;
};

// Drops null/undefined/'' so callers can pass sparse filter objects.
const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.append(key, String(value));
  });
  return search.toString();
};

export const getBlogPostsUrl = (params = {}) => blogUrl('/posts/', params);
export const getBlogPostUrl = (slug) => blogUrl(`/posts/${slug}/`);
export const getBlogRelatedPostsUrl = (slug) => blogUrl(`/posts/${slug}/related/`);
export const getBlogFeaturedPostsUrl = () => blogUrl('/posts/featured/');
export const getBlogLatestPostsUrl = (limit = 5) => blogUrl('/posts/latest/', { limit });
export const getBlogPopularPostsUrl = (limit = 5) => blogUrl('/posts/popular/', { limit });
export const getBlogSitemapUrl = () => blogUrl('/posts/sitemap/');

export const getBlogCategoriesUrl = () => blogUrl('/categories/');
export const getBlogCategoryUrl = (slug) => blogUrl(`/categories/${slug}/`);
export const getBlogCategoryPostsUrl = (slug) => blogUrl(`/categories/${slug}/posts/`);

export const getBlogTagsUrl = () => blogUrl('/tags/');
export const getBlogTagUrl = (slug) => blogUrl(`/tags/${slug}/`);
export const getBlogTagPostsUrl = (slug) => blogUrl(`/tags/${slug}/posts/`);
