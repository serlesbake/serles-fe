import { SITE_URL, stripHtml } from './blog.js';

function text(value, limit = Number.MAX_SAFE_INTEGER) {
  return typeof value === 'string' ? stripHtml(value, limit) : '';
}

function imageUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim(), SITE_URL);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

// CMS SEO fields are editorial overrides. Only body-copy fallbacks are shortened;
// an editor's separately written search/social descriptions stay intact.
export function buildProductMetadata(product = {}, categorySlug, productSlug) {
  const meta = product.meta_data || {};
  const name = text(product.name) || text((productSlug || 'cake').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  const withLocation = `${name} in Tenkasi | Serle's Bake`;
  const title = text(meta.meta_title) || (withLocation.length <= 60 ? withLocation : `${name} | Serle's Bake`);
  const description = text(meta.meta_description)
    || text(product.short_description, 160)
    || text(product.description, 160)
    || `Explore ${name} from Serle's Bake in Tenkasi. Ask us on WhatsApp about available weights, designs and delivery for your occasion.`;
  const image = imageUrl(product.featured_image?.url)
    || imageUrl(product.images?.[0]?.url)
    || `${SITE_URL}/img/logo.png`;
  const ogImage = imageUrl(meta.og_image_url) || image;
  const pageUrl = `${SITE_URL}/cakes/${categorySlug}/${productSlug}`;

  return {
    title,
    description,
    openGraph: {
      title: text(meta.og_title) || title,
      description: text(meta.og_description) || description,
      type: 'website',
      url: pageUrl,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: text(meta.twitter_title) || text(meta.og_title) || title,
      description: text(meta.twitter_description) || text(meta.og_description) || description,
      images: [imageUrl(meta.twitter_image_url) || ogImage],
    },
    alternates: { canonical: pageUrl },
  };
}
