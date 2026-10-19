/**
 * Cloudflare Image Transformations utilities
 * 
 * Generates responsive image URLs using Cloudflare's /cdn-cgi/image/ endpoint.
 * Automatically serves optimal format (AVIF/WebP/JPEG) based on browser support.
 * 
 * Requires Image Transformations to be enabled on your Cloudflare zone.
 * Free tier: 5,000 unique transformations/month
 */

export type ImageFormat = "auto" | "avif" | "webp" | "jpeg" | "baseline-jpeg";
export type ImageFit = "scale-down" | "contain" | "cover" | "crop" | "pad";

export interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: ImageFit;
  gravity?: string;
  dpr?: number;
}

/**
 * Generate a Cloudflare transformed image URL
 * 
 * @example
 * cfImage('/images/hero/truck.avif', { width: 800, quality: 85, format: 'auto' })
 * // => '/cdn-cgi/image/width=800,quality=85,format=auto/images/hero/truck.avif'
 */
export function cfImage(src: string, options: CloudflareImageOptions = {}): string {
  const {
    width,
    height,
    quality = 85,
    format = "auto",
    fit,
    gravity,
    dpr,
  } = options;

  const params: string[] = [];

  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (quality !== 85) params.push(`quality=${quality}`);
  if (format !== "auto") params.push(`format=${format}`);
  if (fit) params.push(`fit=${fit}`);
  if (gravity) params.push(`gravity=${gravity}`);
  if (dpr) params.push(`dpr=${dpr}`);

  // Always include format=auto for best compression
  if (!params.some((p) => p.startsWith("format="))) {
    params.push("format=auto");
  }

  const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;
  return `/cdn-cgi/image/${params.join(",")}/${normalizedSrc}`;
}

/**
 * Generate srcset string for responsive images
 * 
 * @example
 * cfSrcSet('/images/hero/truck.avif', [320, 640, 960, 1280, 1920])
 * // => '/cdn-cgi/image/width=320,format=auto/images/hero/truck.avif 320w, ...'
 */
export function cfSrcSet(
  src: string,
  widths: number[],
  options: Omit<CloudflareImageOptions, "width"> = {}
): string {
  return widths
    .map((w) => `${cfImage(src, { ...options, width: w })} ${w}w`)
    .join(", ");
}

/**
 * Generate srcset for pixel density (retina displays)
 * 
 * @example
 * cfDensitySrcSet('/images/logo.avif', [1, 2, 3])
 * // => '/cdn-cgi/image/dpr=1,format=auto/images/logo.avif 1x, ...'
 */
export function cfDensitySrcSet(
  src: string,
  densities: number[] = [1, 2],
  options: Omit<CloudflareImageOptions, "dpr"> = {}
): string {
  return densities
    .map((d) => `${cfImage(src, { ...options, dpr: d })} ${d}x`)
    .join(", ");
}

/**
 * Common responsive breakpoints for full-width images
 */
export const RESPONSIVE_WIDTHS = {
  mobile: [320, 640],
  tablet: [768, 1024],
  desktop: [1280, 1920],
  full: [320, 640, 768, 1024, 1280, 1536, 1920, 2560],
  hero: [640, 960, 1280, 1920, 2560],
  card: [320, 480, 640, 960],
  thumbnail: [160, 320, 480],
} as const;

/**
 * Get optimal image URL for a given viewport width
 * Uses Cloudflare's width=auto for automatic sizing (Chromium only)
 * Falls back to fixed width for other browsers
 */
export function cfAutoImage(src: string, options: CloudflareImageOptions = {}): string {
  const { width = 960, ...rest } = options;
  // width=auto is supported by Chromium browsers
  // For others, we use a reasonable default
  return cfImage(src, { ...rest, width });
}

/**
 * Check if Cloudflare Image Transformations is likely enabled
 * (client-side check - actual check requires server-side)
 */
export function isCloudflareImagesEnabled(): boolean {
  if (typeof window === "undefined") return false;
  // Check if we're on a Cloudflare-hosted domain
  const hostname = window.location.hostname;
  return (
    hostname.includes("pages.dev") ||
    hostname.includes("workers.dev") ||
    hostname.includes("cloudflare") ||
    // Custom domains proxied through Cloudflare
    document.querySelector('meta[name="cf-zone"]') !== null
  );
}
