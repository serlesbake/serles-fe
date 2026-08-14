'use client';

import { useState } from 'react';
import { FaFacebookF, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import styles from './blog.module.scss';

/**
 * Share row for a blog post. URLs are built from the canonical post URL passed
 * in by the server, so sharing works even before hydration finishes.
 */
export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable (insecure context / denied permission) — the
      // share links above still work, so fail quietly.
    }
  };

  return (
    <div className={styles.share}>
      <strong>Share</strong>

      <a
        className={`${styles.shareBtn} ${styles.shareFacebook}`}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <FaFacebookF />
      </a>

      <a
        className={`${styles.shareBtn} ${styles.shareTwitter}`}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <FaXTwitter />
      </a>

      <a
        className={`${styles.shareBtn} ${styles.shareWhatsapp}`}
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      <button
        type="button"
        className={`${styles.shareBtn} ${styles.shareCopy}`}
        onClick={handleCopy}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? <FaCheck /> : <FaLink />}
      </button>
    </div>
  );
}
