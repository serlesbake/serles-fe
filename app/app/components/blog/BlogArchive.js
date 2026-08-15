import Link from 'next/link';
import Breadcrumb from '../Breadcrumb';
import BlogCard from './BlogCard';
import BlogSidebar from './BlogSidebar';
import JsonLd from './JsonLd';
import styles from './blog.module.scss';
import { absoluteUrl, blogPostPath, buildBreadcrumbSchema } from '../../utils/blog';

/**
 * Shared layout for the category and tag archives.
 *
 * @param {string} props.eyebrow      Small label above the title
 * @param {string} props.title        Archive heading (also the <h1>)
 * @param {string} props.description  Intro copy
 * @param {Array}  props.posts        Posts in this archive
 * @param {object} props.sidebar      `getSidebarData()` result
 * @param {Array}  props.breadcrumb   Trail after Home > Blog: [{name, path}]
 */
export default function BlogArchive({
  eyebrow,
  title,
  description,
  posts = [],
  sidebar = {},
  breadcrumb = [],
}) {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: absoluteUrl(breadcrumb[breadcrumb.length - 1]?.path || '/blog'),
    ...(description ? { description } : {}),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(blogPostPath(post.slug)),
        name: post.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={[collectionSchema, buildBreadcrumbSchema(breadcrumb)]} />

      <Breadcrumb
        title={title}
        items={[
          { label: 'Blog', href: '/blog' },
          ...breadcrumb.slice(0, -1).map((crumb) => ({ label: crumb.name, href: crumb.path })),
          { label: title },
        ]}
      />

      <section className="blog spad pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                <h1 className={styles.pageTitle}>{title}</h1>
                {description && <p className={styles.pageIntro}>{description}</p>}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              {posts.length === 0 ? (
                <div className={styles.emptyState}>
                  <h4>No posts here yet</h4>
                  <p>We haven&apos;t published anything under this heading so far.</p>
                  <Link href="/blog" className="btn btn-primary">
                    Back to the Blog
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {posts.map((post, index) => (
                    <div className="col-12 col-md-6" key={post.id ?? post.slug}>
                      <BlogCard post={post} priority={index === 0} />
                    </div>
                  ))}
                </div>
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
