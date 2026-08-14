'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import styles from './blog.module.scss';

/**
 * Search box for the blog. Navigates to /blog?search=… so results stay
 * server-rendered, shareable and crawlable rather than living in client state.
 */
export default function BlogSearchForm({ initialValue = '' }) {
  const [term, setTerm] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = term.trim();
    router.push(query ? `/blog?search=${encodeURIComponent(query)}` : '/blog');
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
      <label htmlFor="blog-search" className="visually-hidden">
        Search the blog
      </label>
      <input
        id="blog-search"
        type="search"
        name="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search articles..."
        autoComplete="off"
      />
      <button type="submit" aria-label="Search">
        <FaSearch />
      </button>
    </form>
  );
}
