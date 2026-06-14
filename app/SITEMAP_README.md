# Sitemap System Documentation

This document explains the dynamic sitemap system for Serles Bake that automatically fetches data from APIs and generates both XML and visual sitemaps.

## Overview

The sitemap system consists of:

1. **Dynamic XML Sitemap** (`/sitemap.xml`) - Automatically generated from API data
2. **Visual Sitemap Page** (`/site-map`) - User-friendly navigation page
3. **Build Scripts** - For periodic regeneration
4. **API Integration** - Fetches real-time data from your backend

## Features

### ✅ Dynamic Content
- **Categories**: Automatically includes all cake categories from API
- **Products**: Includes all product detail pages with proper URLs
- **Tags**: Includes all tag pages with product counts
- **Statistics**: Real-time counts of products, categories, and tags

### ✅ SEO Optimized
- Proper XML sitemap format for search engines
- Includes `lastmod`, `changefreq`, and `priority` attributes
- Automatic canonical URLs
- Robots.txt integration

### ✅ Performance
- Cached API calls to prevent excessive requests
- Fallback sitemap if API is unavailable
- Optimized for build-time generation

## File Structure

```
app/
├── utils/
│   └── sitemap.js              # Main sitemap utility functions
├── sitemap.xml/
│   └── route.js               # XML sitemap API route
├── site-map/
│   └── page.js                # Visual sitemap page
├── robots.txt/
│   └── route.js               # Robots.txt with sitemap reference
├── scripts/
│   └── generate-sitemap.js    # Build script for sitemap generation
└── package.json               # NPM scripts for sitemap generation
```

## Usage

### 1. Automatic Generation (Recommended)

The sitemap is automatically generated when you visit:
- `/sitemap.xml` - XML sitemap for search engines
- `/site-map` - Visual sitemap for users

### 2. Manual Generation

Generate sitemap manually using npm scripts:

```bash
# Generate sitemap only
npm run generate-sitemap

# Build with sitemap generation
npm run build-with-sitemap
```

### 3. Direct Script Execution

```bash
# Run the script directly
node scripts/generate-sitemap.js
```

## API Integration

The sitemap system fetches data from these endpoints:

- **Products**: `/api/products/?format=json`
- **Categories**: `/api/categories/?format=json`
- **Tags**: `/api/tags/?format=json`

### Configuration

API endpoints are configured in `app/config/api.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://serlesbackend.vercel.app',
  PRODUCTS_ENDPOINT: '/api/products/?format=json',
  CATEGORIES_ENDPOINT: '/api/categories/?format=json',
  TAGS_ENDPOINT: '/api/tags/?format=json',
};
```

## Sitemap Content

### Static Pages
- Home page (`/`)
- About (`/about`)
- Contact (`/contact`)
- Menu & Pricing (`/menu`)
- Testimonials (`/testimonial`)
- Privacy Policy (`/privacy-policy`)
- Terms & Conditions (`/terms-conditions`)
- Site Map (`/site-map`)

### Dynamic Pages
- All Cakes (`/cakes`)
- Category pages (`/cakes/[category-slug]`)
- Product pages (`/cakes/[category-slug]/[product-slug]`)
- Tags page (`/cakes/tags`)
- Individual tag pages (`/cakes/tags/[tag-slug]`)

## SEO Benefits

### XML Sitemap
- **Search Engine Discovery**: Helps search engines find all pages
- **Crawl Efficiency**: Provides priority and change frequency hints
- **Indexing**: Improves page indexing speed

### Visual Sitemap
- **User Experience**: Easy navigation for visitors
- **Internal Linking**: Improves site structure
- **SEO Value**: Additional internal links

## Monitoring & Maintenance

### Check Sitemap Health

1. **XML Sitemap**: Visit `/sitemap.xml` to verify it's generating correctly
2. **Visual Sitemap**: Visit `/site-map` to see the user-friendly version
3. **Statistics**: Check the statistics section on the visual sitemap page

### Periodic Updates

The sitemap automatically updates when:
- New products are added to the API
- New categories are created
- New tags are added
- The site is rebuilt

### Error Handling

The system includes fallback mechanisms:
- If API is unavailable, returns basic sitemap
- Logs errors for debugging
- Continues to function even with partial data

## Customization

### Adding New Page Types

To add new page types to the sitemap:

1. **Update Static Pages** in `app/utils/sitemap.js`:
```javascript
const STATIC_PAGES = [
  // ... existing pages
  { path: '/new-page', priority: '0.7', changefreq: 'monthly' },
];
```

2. **Update Visual Sitemap** in `app/site-map/page.js`:
```javascript
// Add new section to the visual sitemap
```

### Modifying Priorities

Adjust page priorities in the `STATIC_PAGES` array:
- `1.0`: Highest priority (home page)
- `0.9`: Very high priority (main product pages)
- `0.8`: High priority (category pages)
- `0.7`: Medium priority (product detail pages)
- `0.6`: Lower priority (tag pages)
- `0.3`: Low priority (legal pages)

## Troubleshooting

### Common Issues

1. **Empty Sitemap**: Check if API endpoints are accessible
2. **Missing Pages**: Verify all static pages exist
3. **Build Errors**: Ensure all dependencies are installed

### Debug Commands

```bash
# Check sitemap generation
npm run generate-sitemap

# View generated files
ls -la public/sitemap.xml
ls -la public/sitemap-data.json

# Check API connectivity
curl https://serlesbackend.vercel.app/api/products/?format=json
```

## Performance Considerations

- **Caching**: API calls are cached for 5 minutes
- **Build Time**: Sitemap generation adds minimal time to builds
- **File Size**: XML sitemap is optimized for size
- **CDN**: Sitemap can be cached by CDN for better performance

## Future Enhancements

Potential improvements:
- **Image Sitemap**: Include product images in sitemap
- **News Sitemap**: For blog/news content
- **Video Sitemap**: For video content
- **Automated Updates**: Webhook-based regeneration
- **Analytics Integration**: Track sitemap usage

---

For questions or issues, refer to the main project documentation or contact the development team. 