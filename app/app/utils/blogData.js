// Server-side blog access. Optional lists are fail-soft; article details and
// sitemap data distinguish real 404s from failures that should preserve ISR data.

import {
  getBlogPostsUrl,
  getBlogPostUrl,
  getBlogRelatedPostsUrl,
  getBlogFeaturedPostsUrl,
  getBlogLatestPostsUrl,
  getBlogPopularPostsUrl,
  getBlogSitemapUrl,
  getBlogCategoriesUrl,
  getBlogCategoryUrl,
  getBlogCategoryPostsUrl,
  getBlogTagsUrl,
  getBlogTagUrl,
  getBlogTagPostsUrl,
} from '../config/api.js';
import { fetchBlog, toList, BLOG_DETAIL_REVALIDATE } from './blog.js';

/**
 * @param {{search?: string, category?: string, tag?: string, featured?: string,
 *          sort?: string, order?: string, limit?: number}} filters
 */
export async function getPosts(filters = {}) {
  return toList(await fetchBlog(getBlogPostsUrl(filters)));
}

export async function getPost(slug) {
  if (!slug) return null;
  return fetchBlog(getBlogPostUrl(slug), { revalidate: BLOG_DETAIL_REVALIDATE, required: true });
}

export async function getRelatedPosts(slug) {
  if (!slug) return [];
  return toList(await fetchBlog(getBlogRelatedPostsUrl(slug), { revalidate: BLOG_DETAIL_REVALIDATE }));
}

export async function getFeaturedPosts() {
  return toList(await fetchBlog(getBlogFeaturedPostsUrl()));
}

export async function getLatestPosts(limit = 5) {
  return toList(await fetchBlog(getBlogLatestPostsUrl(limit)));
}

export async function getPopularPosts(limit = 5) {
  return toList(await fetchBlog(getBlogPopularPostsUrl(limit)));
}

export async function getCategories(options = {}) {
  return toList(await fetchBlog(getBlogCategoriesUrl(), options));
}

export async function getCategory(slug) {
  if (!slug) return null;
  return fetchBlog(getBlogCategoryUrl(slug));
}

export async function getCategoryPosts(slug) {
  if (!slug) return [];
  return toList(await fetchBlog(getBlogCategoryPostsUrl(slug)));
}

export async function getTags(options = {}) {
  return toList(await fetchBlog(getBlogTagsUrl(), options));
}

export async function getTag(slug) {
  if (!slug) return null;
  return fetchBlog(getBlogTagUrl(slug));
}

export async function getTagPosts(slug) {
  if (!slug) return [];
  return toList(await fetchBlog(getBlogTagPostsUrl(slug)));
}

/** Slugs + lastmod, used by sitemap.xml and generateStaticParams. */
export async function getPostsForSitemap() {
  const payload = await fetchBlog(getBlogSitemapUrl(), { required: true, allowNotFound: false });
  if (!Array.isArray(payload) && !Array.isArray(payload?.results)) throw new Error('Invalid blog sitemap response');
  return toList(payload);
}

/** Sidebar data in one round trip — shared by every blog route. */
export async function getSidebarData() {
  const [categories, tags, recentPosts] = await Promise.all([
    getCategories(),
    getTags(),
    getLatestPosts(4),
  ]);

  return { categories, tags, recentPosts };
}
