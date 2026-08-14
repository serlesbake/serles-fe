import Link from 'next/link';
import styles from '../components/blog/blog.module.scss';

export const metadata = {
  title: "Article not found | Serle's Bake",
  robots: { index: false, follow: true },
};

export default function BlogNotFound() {
  return (
    <section className="blog spad pt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className={styles.emptyState}>
              <h4>We couldn&apos;t find that article</h4>
              <p>It may have been moved, renamed, or is no longer published.</p>
              <Link href="/blog" className="btn btn-primary">
                Back to the Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
