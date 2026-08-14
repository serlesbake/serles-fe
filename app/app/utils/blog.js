// Blog helpers: fetching, URL mapping, HTML hardening and SEO metadata.
//
// The blog API is public + read-only (see BLOG_API_GUIDE.md). Everything here is
// deliberately fail-soft: if the blog module is not deployed on the backend yet,
// list pages render an empty state and detail pages 404 instead of throwing.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.serlesbake.in';
export const SITE_NAME = "Serle's Bake";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/logo.png`;

// Revalidate windows (seconds). Posts change rarely; lists a little more often.
export const BLOG_LIST_REVALIDATE = 300;
export const BLOG_DETAIL_REVALIDATE = 600;

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

/**
 * Fetch JSON from the blog API using Next's data cache (ISR).
 * Returns `null` on any failure so callers can degrade gracefully.
 */
export async function fetchBlog(url, { revalidate = BLOG_LIST_REVALIDATE, tags = ['blog'] } = {}) {
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate, tags },
    });

    if (!response.ok) {
      if (response.status !== 404) {
        console.error(`Blog API ${response.status} for ${url}`);
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Blog API request failed for ${url}:`, error?.message || error);
    return null;
  }
}

/** DRF endpoints return either a bare array or `{ results: [...] }`. */
export function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

// ---------------------------------------------------------------------------
// URLs
// ---------------------------------------------------------------------------

export const blogPostPath = (slug) => `/blog/${slug}`;
export const blogCategoryPath = (slug) => `/blog/categories/${slug}`;
export const blogTagPath = (slug) => `/blog/tags/${slug}`;

/** Turn a site-relative path into an absolute canonical URL. */
export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return normalizeInternalUrl(path);
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${stripTrailingSlash(path)}`;
}

function stripTrailingSlash(value) {
  if (!value || value === '/') return value;
  return value.replace(/\/+$/, '');
}

/**
 * The backend emits shop links as `/category/<cat>/<product>/`, but this site
 * serves them from `/cakes/<cat>/<product>`. Also drops trailing slashes to
 * match `trailingSlash: false` in next.config.mjs.
 */
export function toSiteUrl(url) {
  if (!url) return '/';

  // Absolute URLs on our own domain get the same treatment; anything else is
  // left alone.
  if (/^https?:\/\//i.test(url)) {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith('serlesbake.in')) return url;
      return `${SITE_URL}${toSiteUrl(parsed.pathname + parsed.search)}`;
    } catch {
      return url;
    }
  }

  if (!url.startsWith('/')) return url;

  const mapped = url
    .replace(/^\/category\//, '/cakes/')
    .replace(/^\/categories\//, '/cakes/');

  return stripTrailingSlash(mapped);
}

function normalizeInternalUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('serlesbake.in')) return url;
    return `${SITE_URL}${toSiteUrl(parsed.pathname)}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}

// ---------------------------------------------------------------------------
// HTML content
// ---------------------------------------------------------------------------

const BLOCK_TAGS = 'script|style|iframe|object|embed|form|noscript';
const VOID_TAGS = 'link|meta|base';

/**
 * Harden admin-authored HTML before it reaches dangerouslySetInnerHTML, and
 * rewrite internal shop links onto this site's routes.
 *
 * Content is authored by staff in Django admin, so this is defence in depth
 * rather than a full untrusted-input sanitizer: it removes active content
 * (scripts, embeds, inline event handlers, `javascript:` URLs) that could turn
 * a compromised admin account into stored XSS.
 */
export function prepareContent(html) {
  if (!html || typeof html !== 'string') return '';

  let safe = html
    // Paired dangerous elements, including their contents.
    .replace(new RegExp(`<(${BLOCK_TAGS})\\b[\\s\\S]*?<\\/\\1\\s*>`, 'gi'), '')
    // Unclosed/self-closing variants.
    .replace(new RegExp(`<\\/?(${BLOCK_TAGS}|${VOID_TAGS})\\b[^>]*>`, 'gi'), '')
    // Inline event handlers: onclick=, onerror=, ...
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // javascript:/vbscript: URLs in any attribute.
    .replace(/(href|src|xlink:href)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html)[^"']*\2/gi, '$1="#"');

  // Rewrite anchors: map shop links onto site routes, harden external links.
  safe = safe.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/\shref\s*=\s*(["'])(.*?)\1/i);
    if (!hrefMatch) return match;

    const rawHref = hrefMatch[2];
    const mapped = toSiteUrl(rawHref);
    let nextAttrs = attrs.replace(hrefMatch[0], ` href="${mapped}"`);

    const isExternal = /^https?:\/\//i.test(mapped) && !mapped.startsWith(SITE_URL);
    if (isExternal) {
      if (!/\starget\s*=/i.test(nextAttrs)) nextAttrs += ' target="_blank"';
      if (!/\srel\s*=/i.test(nextAttrs)) nextAttrs += ' rel="noopener noreferrer nofollow"';
    }

    return `<a${nextAttrs}>`;
  });

  // Native lazy-loading for in-body images.
  safe = safe.replace(/<img\b((?:(?!loading=)[^>])*)>/gi, '<img$1 loading="lazy" decoding="async">');

  return safe;
}

/** Rough plain-text extraction, used for description fallbacks. */
export function stripHtml(html, maxLength = 160) {
  if (!html) return '';
  const text = String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

// ---------------------------------------------------------------------------
// Schema.org
// ---------------------------------------------------------------------------

/**
 * The backend ships ready-made JSON-LD, but its URLs use the backend's own
 * conventions (relative paths, `/category/...`, trailing slashes). Rewriting
 * them keeps `@id`/`url` consistent with the canonical tag — Google treats a
 * mismatch as a conflicting signal.
 */
export function normalizeSchema(node) {
  if (typeof node === 'string') {
    const looksLikeUrl = node.startsWith('/') || /^https?:\/\/(www\.)?serlesbake\.in/i.test(node);
    if (!looksLikeUrl) return node;
    return node.startsWith('/') ? absoluteUrl(toSiteUrl(node)) : normalizeInternalUrl(node);
  }

  if (Array.isArray(node)) return node.map(normalizeSchema);

  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node).map(([key, value]) => [key, normalizeSchema(value)])
    );
  }

  return node;
}

/** BreadcrumbList for a blog page, wired to the routes this site actually serves. */
export function buildBreadcrumbSchema(trail = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, ...trail].map(
      (crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })
    ),
  };
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

/**
 * Build a Next.js Metadata object from the API's generic `meta_data` block,
 * falling back to post fields when a field is blank. The backend auto-generates
 * `meta_data` when an editor hasn't filled one in, so this rarely falls all the
 * way through — but list/archive pages have thinner data.
 */
export function buildMetadata({
  meta = {},
  title,
  description,
  path = '/blog',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords,
  canonicalOverride,
} = {}) {
  const resolvedTitle = meta.meta_title || title || `Blog | ${SITE_NAME}`;
  const resolvedDescription = meta.meta_description || description || '';
  const canonical = canonicalOverride
    ? absoluteUrl(toSiteUrl(canonicalOverride))
    : absoluteUrl(path);
  const ogImage = meta.og_image_url || image || DEFAULT_OG_IMAGE;
  const twitterImage = meta.twitter_image_url || ogImage;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: meta.og_title || resolvedTitle,
      description: meta.og_description || resolvedDescription,
      url: canonical,
      siteName: SITE_NAME,
      type,
      images: [{ url: ogImage }],
      locale: 'en_US',
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitter_title || meta.og_title || resolvedTitle,
      description: meta.twitter_description || meta.og_description || resolvedDescription,
      images: [twitterImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatPostDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

export function formatReadingTime(minutes) {
  if (!minutes) return '';
  return `${minutes} min read`;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

// Mirrors the hosts allowed in next.config.mjs. next/image throws at request
// time for an unconfigured host, so CMS-supplied URLs are checked first and
// fall back to a local placeholder rather than breaking the page.
const ALLOWED_IMAGE_HOSTS = [
  'localhost',
  '127.0.0.1',
  'serlesbake.in',
  'www.serlesbake.in',
  'shop.serlesbake.in',
  'cdn.serlesbake.in',
  'serlesbackend.vercel.app',
];

export const BLOG_PLACEHOLDER_IMAGE = '/img/placeholder.jpg';

export function safeImageUrl(url, fallback = BLOG_PLACEHOLDER_IMAGE) {
  if (!url || typeof url !== 'string') return fallback;
  if (url.startsWith('/')) return url;

  try {
    const { hostname } = new URL(url);
    return ALLOWED_IMAGE_HOSTS.includes(hostname) ? url : fallback;
  } catch {
    return fallback;
  }
}
