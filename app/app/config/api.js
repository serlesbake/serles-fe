// API Configuration
export const runtime = 'edge';
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shop.serlesbake.in',
  PRODUCTS_ENDPOINT: process.env.NEXT_PUBLIC_PRODUCTS_ENDPOINT || '/api/products/?format=json',
  CATEGORIES_ENDPOINT: process.env.NEXT_PUBLIC_CATEGORIES_ENDPOINT || '/api/categories/?format=json',
  PRODUCT_DETAIL_ENDPOINT: '/api/products/{id}/?format=json',
  BANNERS_ENDPOINT: '/api/banners/?format=json',
  TAGS_ENDPOINT: '/api/tags/?format=json',
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