export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.serlesbake.in/sitemap.xml

# Disallow admin or private areas (if any)
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Allow important pages
Allow: /cakes/
Allow: /blog/
Allow: /contact
Allow: /about
Allow: /privacy-policy
Allow: /terms-conditions
Allow: /site-map

# Crawl delay (optional)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 