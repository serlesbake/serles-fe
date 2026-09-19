import sitemapUtils from '../utils/sitemap.mjs';

export async function GET() {
  try {
    const sitemap = await sitemapUtils.generateXMLSitemap();
    
    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    // Reached when the catalog fetch fails — fetchSitemapData now throws rather
    // than quietly returning empty arrays, so a degraded sitemap surfaces here
    // instead of being served as if it were complete.
    console.error('Error generating sitemap:', error);
    
    // Fallback to basic sitemap if API fails
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.serlesbake.in/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.serlesbake.in/cakes</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    // Short cache on the fallback. The full sitemap is cached for an hour, which
    // is right when it is complete and wrong when it is this two-url stub — an
    // hour is long enough for Google to fetch it and conclude the site has two
    // pages. A minute lets the next request recover.
    return new Response(fallbackSitemap, {
      status: 503,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Retry-After': '60',
      },
    });
  }
} 