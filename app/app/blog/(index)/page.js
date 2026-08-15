import Link from 'next/link';
import Breadcrumb from '../../components/Breadcrumb';
import BlogCard from '../../components/blog/BlogCard';
import BlogSidebar from '../../components/blog/BlogSidebar';
import JsonLd from '../../components/blog/JsonLd';
import styles from '../../components/blog/blog.module.scss';
import { getPosts, getSidebarData } from '../../utils/blogData';
import {
  absoluteUrl,
  blogCategoryPath,
  blogPostPath,
  buildBreadcrumbSchema,
  buildMetadata,
  SITE_NAME,
} from '../../utils/blog';

// Next requires a literal here; mirrors BLOG_LIST_REVALIDATE in utils/blog.js.
export const revalidate = 300;

const PAGE_TITLE = `Cake Guides & Baking Stories | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Cake buying guides, celebration ideas and baking notes from Serle's Bake — flavours, prices, tier sizes and same-day delivery in Tenkasi.";

export async function generateMetadata({ searchParams }) {
  const params = (await searchParams) || {};
  const search = typeof params.search === 'string' ? params.search : '';

  // Search result pages are thin and near-duplicate — keep them out of the
  // index while still letting crawlers follow through to the posts.
  if (search) {
    return {
      ...buildMetadata({
        title: `Search results for “${search}” | ${SITE_NAME} Blog`,
        description: PAGE_DESCRIPTION,
        path: '/blog',
      }),
      robots: { index: false, follow: true },
    };
  }

  return buildMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    path: '/blog',
    keywords:
      "cake blog, birthday cake Tenkasi, custom cake Tenkasi, wedding cake guide, cake buying guide, Serle's Bake",
  });
}

export default async function BlogIndexPage({ searchParams }) {
  const params = (await searchParams) || {};
  const search = typeof params.search === 'string' ? params.search.trim() : '';
  const category = typeof params.category === 'string' ? params.category : '';

  const [posts, sidebar] = await Promise.all([
    getPosts({ search, category, sort: 'date', order: 'desc' }),
    getSidebarData(),
  ]);

  const isFiltered = Boolean(search || category);
  const activeCategory = sidebar.categories.find((item) => item.slug === category);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: absoluteUrl('/blog'),
    description: PAGE_DESCRIPTION,
    publisher: {
      '@type': 'Bakery',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(blogPostPath(post.slug)),
      datePublished: post.published_at,
      ...(post.excerpt ? { description: post.excerpt } : {}),
    })),
  };

  return (
    <>
      {!isFiltered && <JsonLd data={[blogSchema, buildBreadcrumbSchema()]} />}

      <Breadcrumb title="Blog" items={[{ label: 'Blog' }]} />

      <section className="blog spad pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span className={styles.eyebrow}>From our kitchen</span>
                <h1 className={styles.pageTitle}>
                  {activeCategory ? activeCategory.name : 'Cake Guides & Baking Stories'}
                </h1>
                <p className={styles.pageIntro}>
                  {activeCategory?.description ||
                    'Flavours, prices, tier sizes and delivery timelines — everything we get asked before a celebration, written down.'}
                </p>
              </div>
            </div>
          </div>

          {sidebar.categories.length > 0 && (
            <div className={styles.filterBar}>
              <Link
                href="/blog"
                className={`${styles.filterChip} ${!category ? styles.filterChipActive : ''}`}
              >
                All posts
              </Link>
              {sidebar.categories.map((item) => (
                <Link
                  key={item.id ?? item.slug}
                  href={blogCategoryPath(item.slug)}
                  className={`${styles.filterChip} ${category === item.slug ? styles.filterChipActive : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          <div className="row">
            <div className="col-lg-8">
              {search && (
                <p className={styles.resultCount}>
                  {posts.length} {posts.length === 1 ? 'result' : 'results'} for “{search}”
                </p>
              )}

              {posts.length === 0 ? (
                <div className={styles.emptyState}>
                  <h4>Nothing here yet</h4>
                  <p>
                    {search
                      ? 'No posts matched your search. Try a different keyword.'
                      : 'Our first stories are in the oven. Check back shortly.'}
                  </p>
                  <Link href="/cakes" className="btn btn-primary">
                    Browse Our Cakes
                  </Link>
                </div>
              ) : (
                // One column on mobile, two from the md breakpoint up.
                <div className="row g-4">
                  {posts.map((post, index) => (
                    <div className="col-12 col-md-6" key={post.id ?? post.slug}>
                      <BlogCard post={post} priority={index < 2} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-4 mt-5 mt-lg-0">
              <BlogSidebar {...sidebar} searchTerm={search} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
