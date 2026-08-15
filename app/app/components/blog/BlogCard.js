import Link from 'next/link';
import Image from 'next/image';
import { FaRegClock, FaRegCalendar } from 'react-icons/fa';
import styles from './blog.module.scss';
import { blogPostPath, formatPostDate, formatReadingTime, safeImageUrl } from '../../utils/blog';

/**
 * Post card used on /blog and the archive pages.
 *
 * @param {object}  props.post      Post list payload from /api/blog/posts/
 * @param {boolean} props.priority  Eager-load the cover (above-the-fold only)
 */
export default function BlogCard({ post, priority = false }) {
  if (!post?.slug) return null;

  const href = blogPostPath(post.slug);
  const cover = safeImageUrl(post.cover_image?.url);
  const publishedOn = formatPostDate(post.published_at);
  const readingTime = formatReadingTime(post.reading_time);

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.cardPic} aria-label={post.title}>
        <Image
          src={cover}
          alt={post.cover_image?.alt_text || post.title || 'Serles Bake blog post'}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
          priority={priority}
        />
        {post.category?.name && <span className={styles.cardLabel}>{post.category.name}</span>}
      </Link>

      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
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

        <h3 className={styles.cardTitle}>
          <Link href={href}>{post.title}</Link>
        </h3>

        {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}

        <Link href={href} className={styles.cardLink}>
          Read More
        </Link>
      </div>
    </article>
  );
}
