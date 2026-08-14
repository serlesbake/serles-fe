import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaRegClock, FaRegCalendar, FaRegUser } from 'react-icons/fa';
import Breadcrumb from '../../components/Breadcrumb';
import BlogCard from '../../components/blog/BlogCard';
import BlogSidebar from '../../components/blog/BlogSidebar';
import JsonLd from '../../components/blog/JsonLd';
import PostInternalLinks from '../../components/blog/PostInternalLinks';
import ShareButtons from '../../components/blog/ShareButtons';
import styles from '../../components/blog/blog.module.scss';
import { getPost, getRelatedPosts, getSidebarData, getPostsForSitemap } from '../../utils/blogData';
import {
  absoluteUrl,
  blogPostPath,
  blogCategoryPath,
  blogTagPath,
  buildBreadcrumbSchema,
  buildMetadata,
  formatPostDate,
  formatReadingTime,
  prepareContent,
  safeImageUrl,
  stripHtml,
  SITE_NAME,
} from '../../utils/blog';

// Next requires a literal here; mirrors BLOG_DETAIL_REVALIDATE in utils/blog.js.
export const revalidate = 600;

/**
 * Pre-render the known posts at build time; anything published later is
 * rendered on first request and then cached (dynamicParams defaults to true).
 */
export async function generateStaticParams() {
  const entries = await getPostsForSitemap();
  return entries.filter((entry) => entry?.slug).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: `Post not found | ${SITE_NAME}`,
      robots: { index: false, follow: false },
    };
  }

  const meta = post.meta_data || {};

  return buildMetadata({
    meta,
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt || stripHtml(post.content),
    path: blogPostPath(post.slug),
    canonicalOverride: post.canonical_url || null,
    image: post.cover_image?.url,
    type: 'article',
    publishedTime: post.published_at,
    keywords: post.focus_keyword || (post.tags_list || []).join(', '),
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  // Drafts and unknown slugs both 404 on the API.
  if (!post) notFound();

  const [relatedFromApi, sidebar] = await Promise.all([getRelatedPosts(slug), getSidebarData()]);

  const relatedPosts = relatedFromApi.length > 0 ? relatedFromApi : post.related_posts || [];
  const postUrl = absoluteUrl(blogPostPath(post.slug));
  const publishedOn = formatPostDate(post.published_at);
  const readingTime = formatReadingTime(post.reading_time);
  const body = prepareContent(post.content);

  const breadcrumbTrail = post.category?.slug
    ? [
        { name: post.category.name, path: blogCategoryPath(post.category.slug) },
        { name: post.title, path: blogPostPath(post.slug) },
      ]
    : [{ name: post.title, path: blogPostPath(post.slug) }];

  return (
    <>
      {/* The backend ships a @graph with BlogPosting + FAQPage; the FAQ block is
          what earns rich results for the questions at the bottom of each post. */}
      <JsonLd data={[post.meta_data?.schema_json, buildBreadcrumbSchema(breadcrumbTrail)]} />

      <Breadcrumb
        title={post.category?.name || 'Blog'}
        items={[
          { label: 'Blog', href: '/blog' },
          ...(post.category?.slug
            ? [{ label: post.category.name, href: blogCategoryPath(post.category.slug) }]
            : []),
        ]}
      />

      <section className="blog-details spad pt-4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <article>
                <header className={styles.postHeader}>
                  {post.category?.slug && (
                    <Link href={blogCategoryPath(post.category.slug)} className={styles.eyebrow}>
                      {post.category.name}
                    </Link>
                  )}

                  <h1 className={styles.postTitle}>{post.title}</h1>

                  <div className={styles.postMeta}>
                    {post.author_name && (
                      <span>
                        <FaRegUser aria-hidden="true" />
                        {post.author_name}
                      </span>
                    )}
                    {publishedOn && (
                      <span>
                        <FaRegCalendar aria-hidden="true" />
                        <time dateTime={post.published_at}>{publishedOn}</time>
                      </span>
                    )}
                    {readingTime && (
                      <span>
                        <FaRegClock aria-hidden="true" />
                        {readingTime}
                      </span>
                    )}
                  </div>
                </header>

                {post.cover_image?.url && (
                  <div className={styles.postCover}>
                    <Image
                      src={safeImageUrl(post.cover_image.url)}
                      alt={post.cover_image.alt_text || post.title}
                      fill
                      sizes="(max-width: 991px) 100vw, 66vw"
                      priority
                    />
                  </div>
                )}

                {post.excerpt && <p className={styles.postExcerpt}>{post.excerpt}</p>}

                {/* Body is admin-authored HTML, hardened in prepareContent(). */}
                <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: body }} />

                <PostInternalLinks
                  products={post.related_products || []}
                  categories={post.related_categories || []}
                />

                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    <strong>Tags</strong>
                    {post.tags.map((tag) => (
                      <Link key={tag.slug} href={blogTagPath(tag.slug)} className={styles.tagPill}>
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                <ShareButtons url={postUrl} title={post.title} />
              </article>

              {relatedPosts.length > 0 && (
                <section className={styles.relatedSection}>
                  <h2 className={styles.internalHeading}>Keep reading</h2>
                  <div className="row g-4">
                    {relatedPosts.slice(0, 2).map((related) => (
                      <div className="col-md-6" key={related.id ?? related.slug}>
                        <BlogCard post={related} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="col-lg-4 mt-5 mt-lg-0">
              <BlogSidebar {...sidebar} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
