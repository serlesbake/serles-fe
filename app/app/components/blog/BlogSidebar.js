import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.scss';
import BlogSearchForm from './BlogSearchForm';
import { blogPostPath, blogCategoryPath, blogTagPath, formatPostDate, safeImageUrl } from '../../utils/blog';

/**
 * Shared blog sidebar: search, categories, recent posts, tags and a shop CTA.
 * Data is fetched once per route by `getSidebarData()` and passed in, so this
 * stays a plain server component.
 */
export default function BlogSidebar({ categories = [], tags = [], recentPosts = [], searchTerm = '' }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBlock}>
        <BlogSearchForm initialValue={searchTerm} />
      </div>

      {categories.length > 0 && (
        <div className={styles.sidebarBlock}>
          <h5 className={styles.sidebarHeading}>Categories</h5>
          <ul className={styles.linkList}>
            {categories.map((category) => (
              <li key={category.id ?? category.slug}>
                <Link href={blogCategoryPath(category.slug)}>
                  {category.name}
                  {typeof category.posts_count === 'number' && <span>({category.posts_count})</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className={styles.sidebarBlock}>
          <h5 className={styles.sidebarHeading}>Recent Posts</h5>
          {recentPosts.map((post) => (
            <Link key={post.id ?? post.slug} href={blogPostPath(post.slug)} className={styles.recentItem}>
              <Image
                src={safeImageUrl(post.cover_image?.url)}
                alt={post.cover_image?.alt_text || post.title || 'Blog post'}
                width={72}
                height={72}
              />
              <div>
                <h4>{post.title}</h4>
                {post.published_at && (
                  <span>
                    <time dateTime={post.published_at}>{formatPostDate(post.published_at)}</time>
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {tags.length > 0 && (
        <div className={styles.sidebarBlock}>
          <h5 className={styles.sidebarHeading}>Tags</h5>
          <div className={styles.tagCloud}>
            {tags.map((tag) => (
              <Link key={tag.id ?? tag.slug} href={blogTagPath(tag.slug)} className={styles.tagPill}>
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className={styles.sidebarBlock}>
        <div className={styles.sidebarCta}>
          <h5>Craving something sweet?</h5>
          <p>Fresh, homemade cakes baked to order in Tenkasi — birthdays, weddings and everything between.</p>
          <Link href="/cakes">Browse Our Cakes</Link>
        </div>
      </div>
    </aside>
  );
}
