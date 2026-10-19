# Cloudflare Image Optimization for Static Sites

This document explains how to optimize image delivery for this Next.js static export using Cloudflare's built-in CDN and image transformation features.

## Current State

- **Image Format**: AVIF (already optimized, ~90% smaller than PNG)
- **Hosting**: Cloudflare Pages with CDN enabled by default
- **Static Export**: `next export` → `out/` directory

## Cloudflare Optimization Options

### Option 1: Cloudflare Polish (Automatic) ✅ Already Active

Polish is enabled by default on Cloudflare Pages and automatically:
- Strips metadata from images
- Compresses images (lossy or lossless)
- No configuration needed

**Note**: Polish doesn't convert to AVIF/WebP automatically - it compresses the original format.

### Option 2: Cloudflare Image Transformations (Optional)

Enable for responsive images and format optimization (AVIF/WebP auto-selection).

#### Prerequisites

1. Cloudflare account with paid plan (Business or Enterprise)
2. Zone subscription (not Zone:Free)
3. 5,000 free transformations/month

#### Enable Image Transformations

1. Go to Cloudflare Dashboard → Images → Transformations
2. Select your zone (`cargo-flow-africa.pages.dev`)
3. Click "Enable transformations"

#### Usage

Transform images via URL:

```
Original:  /images/hero/truck.avif
Transformed: /cdn-cgi/image/width=800,format=auto,quality=85/images/hero/truck.avif
```

#### Format Auto-detection

`format=auto` automatically serves:
- AVIF for modern browsers (Chrome, Firefox, Edge, Safari 16+)
- WebP as fallback (Chrome, Firefox, Edge, Safari 14+)
- JPEG for older browsers

#### Responsive Images (srcset)

```html
<img
  src="/cdn-cgi/image/width=960,format=auto/images/hero/truck.avif"
  srcset="
    /cdn-cgi/image/width=320,format=auto/images/hero/truck.avif 320w,
    /cdn-cgi/image/width=640,format=auto/images/hero/truck.avif 640w,
    /cdn-cgi/image/width=960,format=auto/images/hero/truck.avif 960w,
    /cdn-cgi/image/width=1280,format=auto/images/hero/truck.avif 1280w,
    /cdn-cgi/image/width=1920,format=auto/images/hero/truck.avif 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Truck image"
/>
```

### Option 3: Cloudflare R2 (For Large Image Libraries)

Store original images in R2, serve through Cloudflare CDN:

1. Create R2 bucket: `npx wrangler r2 bucket create cfa-images`
2. Connect custom domain: `npx wrangler r2 bucket domain add cfa-images --domain=images.cargoflowafrica.co.za`
3. Upload images: `npx wrangler r2 object put cfa-images/images/hero.png --file ./hero.png`

Benefits:
- Zero egress fees within Cloudflare network
- Unlimited storage capacity
- Better for large image libraries

## Image URLs After Conversion

All images are now AVIF format. The following paths are now active:

| Original PNG | New AVIF |
|--------------|----------|
| `/logo-desktop.png` | `/logo-desktop.avif` |
| `/logo-mobile.png` | `/logo-mobile.avif` |
| `/southern-africa.png` | `/southern-africa.avif` |
| `/southern-africa-wide.png` | `/southern-africa-wide.avif` |
| `/fleet/*.png` | `/fleet/*.avif` |
| `/images/hero/*.png` | `/images/hero/*.avif` |
| `/images/services/*.png` | `/images/services/*.avif` |
| `/images/portfolio/*.png` | `/images/portfolio/*.avif` |
| `/images/premise/*.png` | `/images/premise/*.avif` |

## Testing Image Delivery

Check if transformations are working:

```bash
# Check if CDN is serving
curl -I https://cargo-flow-africa.pages.dev/logo-desktop.avif

# Check response headers for Cloudflare cache info
curl -I "https://cargo-flow-africa.pages.dev/cdn-cgi/image/width=400,format=auto/logo-desktop.avif"
```

## Custom Domain (Optional)

To use a custom domain for images:

1. Add DNS record pointing to your domain:
   ```
   CNAME images.cargoflowafrica.co.za → cargo-flow-africa.pages.dev
   ```

2. Configure in Cloudflare Pages settings

3. Use custom domain in image URLs:
   ```
   https://images.cargoflowafrica.co.za/cdn-cgi/image/width=400/images/hero.avif
   ```

## Performance Checklist

- [x] Images converted to AVIF (90% smaller)
- [x] Deployed to Cloudflare Pages (CDN enabled)
- [ ] Enable Image Transformations (optional, for responsive images)
- [ ] Set up custom domain for images (optional)
- [ ] Add Cache-Control headers for images (optional)

## Cache Headers for Images

Add to `next.config.ts` or Cloudflare Page Rules:

```typescript
// Cache images for 1 year
{
  source: '/images/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  ],
}
```

## References

- [Cloudflare Images Introduction](https://developers.cloudflare.com/images/get-started/introduction/)
- [Image Transformations Overview](https://developers.cloudflare.com/images/optimization/transformations/overview/)
- [Next.js Image Integration](https://developers.cloudflare.com/images/optimization/transformations/integrate-with-frameworks/)
- [Make Responsive Images](https://developers.cloudflare.com/images/transform-images/make-responsive-images/)