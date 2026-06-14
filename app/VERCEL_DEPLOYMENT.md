# Vercel Deployment Guide for Serles Bake

This guide will help you deploy your Serles Bake frontend to Vercel with all the necessary configurations.

## 🚀 Quick Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Select the `app` folder as the root directory

### 2. Environment Variables Setup

In your Vercel project settings, add these environment variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://serlesbackend.vercel.app
NEXT_PUBLIC_PRODUCTS_ENDPOINT=/api/products/?format=json
NEXT_PUBLIC_CATEGORIES_ENDPOINT=/api/categories/?format=json
NEXT_PUBLIC_TAGS_ENDPOINT=/api/tags/?format=json

# Website Configuration
NEXT_PUBLIC_SITE_URL=https://www.serlesbake.in
NEXT_PUBLIC_SITE_NAME=Serles Bake

# Contact Information
NEXT_PUBLIC_PHONE=+916383070725
NEXT_PUBLIC_EMAIL=serlesbake@gmail.com
NEXT_PUBLIC_ADDRESS=Tenkasi - Sengottai Main Road, Ilanji, Tenkasi, Tamil Nadu

# Social Media
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/serles_bake
NEXT_PUBLIC_FACEBOOK=https://www.facebook.com/serlesbake
NEXT_PUBLIC_WHATSAPP=https://wa.me/916383070725

# Vercel-specific settings
NEXT_PUBLIC_VERCEL_ENV=production
```

### 3. Build Settings

Configure these build settings in Vercel:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x or higher

### 4. Domain Configuration

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain: `serlesbake.in`
4. Configure DNS records as instructed by Vercel

## 📁 Project Structure

```
serles-fe/
└── app/
    ├── app/                    # Next.js app directory
    ├── public/                 # Static assets
    ├── scripts/               # Build scripts
    ├── next.config.mjs        # Next.js configuration
    ├── vercel.json           # Vercel configuration
    ├── package.json          # Dependencies and scripts
    └── README.md             # Project documentation
```

## ⚙️ Configuration Files

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/sitemap.xml/route.js": {
      "maxDuration": 30
    },
    "app/robots.txt/route.js": {
      "maxDuration": 10
    }
  }
}
```

### next.config.mjs
- Optimized for Vercel deployment
- Image optimization enabled
- Security headers configured
- Performance optimizations

## 🔧 Build Process

### Automatic Deployment
- Every push to `main` branch triggers deployment
- Vercel automatically builds and deploys
- Preview deployments for pull requests

### Manual Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Generate sitemap
npm run generate-sitemap

# Build with sitemap
npm run build-with-sitemap
```

## 🌐 Domain & SSL

### Custom Domain Setup
1. **Add Domain**: In Vercel project settings
2. **DNS Configuration**: Update your domain's DNS records
3. **SSL Certificate**: Automatically provisioned by Vercel
4. **Redirects**: Configure www to non-www redirects

### DNS Records
```
Type    Name    Value
A       @       76.76.19.34
CNAME   www     cname.vercel-dns.com
```

## 📊 Performance Optimization

### Vercel Edge Network
- Global CDN for static assets
- Edge functions for API routes
- Automatic image optimization
- Caching strategies

### Build Optimizations
- Tree shaking enabled
- Code splitting
- Bundle analysis
- Performance monitoring

## 🔍 Monitoring & Analytics

### Vercel Analytics
- Real-time performance metrics
- Core Web Vitals tracking
- Error monitoring
- User analytics

### SEO Monitoring
- Sitemap validation
- Robots.txt verification
- Meta tag optimization
- Page speed insights

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   # Verify Node.js version
   # Check environment variables
   ```

2. **API Connection Issues**
   ```bash
   # Verify API_BASE_URL
   # Check CORS settings
   # Test API endpoints
   ```

3. **Image Loading Issues**
   ```bash
   # Check image domains in next.config.mjs
   # Verify image URLs
   # Check CDN configuration
   ```

### Debug Commands
```bash
# Local development
npm run dev

# Production build test
npm run build

# Sitemap generation test
npm run generate-sitemap

# Linting
npm run lint
```

## 🔄 Continuous Deployment

### GitHub Integration
- Automatic deployments on push
- Preview deployments for PRs
- Branch protection rules
- Deployment status checks

### Environment Management
- Production environment
- Preview environments
- Development environment
- Environment-specific variables

## 📈 Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test API connections
- [ ] Validate sitemap generation
- [ ] Check robots.txt
- [ ] Test contact forms
- [ ] Verify image loading
- [ ] Check mobile responsiveness
- [ ] Test performance metrics
- [ ] Validate SEO elements
- [ ] Monitor error logs

## 🎯 Performance Targets

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 📞 Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs
3. Verify environment variables
4. Test locally first
5. Contact Vercel support if needed

---

**Deployment URL**: https://serlesbake.vercel.app (or your custom domain)
**Status**: ✅ Ready for production deployment 