import type { ImageLoaderProps } from "next/image";

/**
 * Next.js Custom Image Loader for Cloudflare Image Transformations
 *
 * @see https://developers.cloudflare.com/images/get-started/introduction/
 * @see https://developers.cloudflare.com/images/optimization/transformations/overview/
 */

const CLOUDflareLoader = ({
  src,
  width,
  quality,
}: ImageLoaderProps): string => {
  const params: string[] = [`width=${width}`];

  if (quality) {
    params.push(`quality=${quality}`);
  }

  // Use format=auto to serve AVIF/WebP/JPEG based on browser support
  params.push("format=auto");

  // Default quality
  const defaultQuality = quality || 85;
  if (defaultQuality !== 85) {
    params.push(`quality=${defaultQuality}`);
  }

  const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;
  return `/cdn-cgi/image/${params.join(",")}/${normalizedSrc}`;
};

/**
 * Production loader (absolute URL for external requests)
 */
export const cloudflareProductionLoader =
  process.env.NODE_ENV === "production"
    ? ({ src, width, quality }: ImageLoaderProps): string => {
        const params: string[] = [`width=${width}`];

        if (quality) {
          params.push(`quality=${quality}`);
        }

        params.push("format=auto");

        const domain =
          process.env.NEXT_PUBLIC_CDN_DOMAIN || "cargo-flow-africa.pages.dev";
        const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;
        return `https://${domain}/cdn-cgi/image/${params.join(",")}/${normalizedSrc}`;
      }
    : CLOUDflareLoader;

/**
 * For local development - use relative paths
 */
export const cloudflareLoader = CLOUDflareLoader;

export default cloudflareLoader;