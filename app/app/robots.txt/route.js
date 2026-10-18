export async function GET() {
  // `Disallow: /_next/` used to sit in this list, which blocked Googlebot from
  // fetching every JavaScript and CSS bundle on the site. Google renders pages
  // before judging them, so blocking the assets means it sees the markup without
  // the stylesheets - which reads as a broken, unstyled page and undermines the
  // mobile-usability assessment on a site where 91% of visitors are on a phone.
  //
  // `/_next/static/` (the bundles) and `/_next/image` (the image optimiser) are
  // now explicitly allowed. `/_next/data/` stays blocked: it is the JSON payload
  // behind client navigations, it duplicates page content, and there is nothing
  // there for a crawler.
  //
  // Crawl-delay is gone. Google ignores it, and the directive only ever slowed
  // the crawlers that do honour it.
  const robotsTxt = `User-agent: *
Allow: /

# Rendering assets - Google needs these to see the page as a visitor does
Allow: /_next/static/
Allow: /_next/image

# Nothing useful to a crawler
Disallow: /api/
Disallow: /admin/
Disallow: /_next/data/

Sitemap: https://www.serlesbake.in/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
