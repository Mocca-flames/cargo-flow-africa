/**
 * WebGL capability probe for Ch5.
 *
 * The landing docs require Ch5 to fall back to "a static exploded-view
 * render" wherever the 3D cannot run — reduced motion and no-WebGL are the
 * two cases, and they resolve to the same component (`LoadsStatic`). This is
 * the only capability check in the codebase; every other chapter is CSS or
 * SVG and cannot fail this way.
 */

let cached: boolean | null = null;

export function supportsWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof document === "undefined") {
    cached = false;
    return cached;
  }
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? null;
    /* Release the probe context immediately: browsers cap how many live
       contexts a page may hold, and Ch5 is about to open a real one. */
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    cached = gl !== null;
  } catch {
    cached = false;
  }
  return cached;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}