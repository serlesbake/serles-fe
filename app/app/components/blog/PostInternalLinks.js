import Link from 'next/link';
import Image from 'next/image';
import styles from './blog.module.scss';
import { toSiteUrl, safeImageUrl } from '../../utils/blog';

/**
 * Editor-chosen product/category cards rendered inside an article. These are the
 * links that keep link equity flowing from posts into shop pages, so they are
 * real crawlable <a> elements, not JS-driven cards.
 */
export default function PostInternalLinks({ products = [], categories = [] }) {
  if (products.length === 0 && categories.length === 0) return null;

  return (
    <section className={styles.internalLinks} aria-label="Related cakes from our shop">
      <h2 className={styles.internalHeading}>Order these from our shop</h2>

      {products.length > 0 && (
        <div className="row g-3">
          {products.map((product) => (
            <div className="col-lg-6" key={product.url || product.name}>
              <Link href={toSiteUrl(product.url)} className={styles.productCard}>
                <Image
                  src={safeImageUrl(product.image_url)}
                  alt={product.name || 'Cake'}
                  width={64}
                  height={64}
                />
                <div>
                  <div className={styles.productName}>{product.name}</div>
                  {product.price_range && (
                    <div className={styles.productPrice}>
                      {String(product.price_range).replace(/\$/g, '₹')}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className={styles.categoryLinks}>
          {categories.map((category) => (
            <Link key={category.url || category.name} href={toSiteUrl(category.url)} className={styles.tagPill}>
              {category.name}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
