import React from "react";
import {
  cfImage,
  cfSrcSet,
  RESPONSIVE_WIDTHS,
  type CloudflareImageOptions,
} from "@/lib/cloudflare-image";

export interface ResponsiveImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  /** Predefined width sets or custom widths array */
  widths?: readonly number[] | keyof typeof RESPONSIVE_WIDTHS;
  /** Sizes attribute for responsive images (e.g., "(max-width: 768px) 100vw, 50vw") */
  sizes?: string;
  /** Cloudflare image options */
  options?: CloudflareImageOptions;
  /** Use pixel density (x) instead of width (w) descriptors */
  density?: boolean;
  /** Densities for retina displays (default: [1, 2]) */
  densities?: number[];
  /** Lazy load the image (default: true) */
  lazy?: boolean;
  /** Priority load (eager) - for above-the-fold images */
  priority?: boolean;
  /** Fallback to original image if Cloudflare transformations fail */
  fallback?: boolean;
}

/**
 * ResponsiveImage - Image component with Cloudflare CDN transformations
 *
 * Automatically generates srcset with multiple sizes for optimal loading.
 * Uses Cloudflare's /cdn-cgi/image/ endpoint for on-the-fly resizing and
 * format conversion (AVIF/WebP/JPEG based on browser support).
 *
 * @example
 * <ResponsiveImage
 *   src="/images/hero/truck.avif"
 *   alt="Truck"
 *   widths="hero"
 *   sizes="100vw"
 *   priority
 * />
 */
export default function ResponsiveImage({
  src,
  alt,
  widths = "full",
  sizes,
  options = {},
  density = false,
  densities = [1, 2],
  lazy = true,
  priority = false,
  fallback = true,
  className,
  style,
  ...props
}: ResponsiveImageProps) {
  // Resolve widths
  const widthArray =
    typeof widths === "string" ? RESPONSIVE_WIDTHS[widths] : widths;

  // Generate srcset
  const srcSet = density
    ? undefined // Will use density-based srcset
    : cfSrcSet(src, [...widthArray], options);

  // Generate default src (middle size for good balance)
  const defaultWidth = widthArray[Math.floor(widthArray.length / 2)] || 960;
  const imgSrc = cfImage(src, { ...options, width: defaultWidth });

  // For density-based (retina) images
  const densitySrcSet = density
    ? densities
        .map((d) => `${cfImage(src, { ...options, dpr: d })} ${d}x`)
        .join(", ")
    : undefined;

  // Default sizes if not provided
  const defaultSizes =
    sizes ||
    (density
      ? undefined
      : `(max-width: 640px) 100vw, (max-width: 1024px) 80vw, ${defaultWidth}px`);

  return (
    <img
      src={imgSrc}
      srcSet={density ? densitySrcSet : srcSet}
      sizes={defaultSizes}
      alt={alt}
      loading={priority ? "eager" : lazy ? "lazy" : "eager"}
      decoding="async"
      className={className}
      style={style}
      onError={
        fallback
          ? (e) => {
              // Fallback to original image if Cloudflare transformation fails
              const target = e.target as HTMLImageElement;
              if (target.src.includes("/cdn-cgi/image/")) {
                target.src = src;
                target.srcset = "";
              }
            }
          : undefined
      }
      {...props}
    />
  );
}

/**
 * Picture component with Cloudflare transformations for art direction
 * Allows different images for different breakpoints
 */
export interface ResponsivePictureSource {
  src: string;
  media?: string;
  widths?: readonly number[] | keyof typeof RESPONSIVE_WIDTHS;
  options?: CloudflareImageOptions;
}

export interface ResponsivePictureProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  src: string;
  alt: string;
  sources?: ResponsivePictureSource[];
  widths?: readonly number[] | keyof typeof RESPONSIVE_WIDTHS;
  sizes?: string;
  options?: CloudflareImageOptions;
  lazy?: boolean;
  priority?: boolean;
}

export function ResponsivePicture({
  src,
  alt,
  sources = [],
  widths = "full",
  sizes,
  options = {},
  lazy = true,
  priority = false,
  className,
  style,
  ...props
}: ResponsivePictureProps) {
  const widthArray =
    typeof widths === "string" ? RESPONSIVE_WIDTHS[widths] : widths;
  const defaultWidth = widthArray[Math.floor(widthArray.length / 2)] || 960;

  return (
    <picture>
      {sources.map((source, i) => {
        const sourceWidths =
          typeof source.widths === "string"
            ? RESPONSIVE_WIDTHS[source.widths]
            : source.widths || widthArray;
        return (
          <source
            key={i}
            srcSet={cfSrcSet(source.src, [...sourceWidths], source.options)}
            media={source.media}
            sizes={sizes}
          />
        );
      })}
      <img
        src={cfImage(src, { ...options, width: defaultWidth })}
        srcSet={cfSrcSet(src, [...widthArray], options)}
        sizes={sizes || `(max-width: 640px) 100vw, ${defaultWidth}px`}
        alt={alt}
        loading={priority ? "eager" : lazy ? "lazy" : "eager"}
        decoding="async"
        className={className}
        style={style}
        {...props}
      />
    </picture>
  );
}
