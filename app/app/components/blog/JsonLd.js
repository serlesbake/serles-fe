import { normalizeSchema } from '../../utils/blog';

/**
 * Renders Schema.org JSON-LD. Accepts one object or an array of graphs; the
 * backend ships a `@graph` with BlogPosting + FAQPage per post, and we add a
 * BreadcrumbList on top.
 *
 * Values are normalized (relative → absolute URLs, shop paths → site routes)
 * and `<` is escaped so a stray sequence in the payload cannot break out of the
 * script element.
 */
export default function JsonLd({ data }) {
  if (!data) return null;

  const payload = Array.isArray(data) ? data.filter(Boolean) : [data];
  if (payload.length === 0) return null;

  const json = JSON.stringify(payload.length === 1 ? normalizeSchema(payload[0]) : normalizeSchema(payload))
    .replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
