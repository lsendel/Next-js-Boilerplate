/**
 * Cloudflare Images Loader for Next.js
 *
 * This loader uses Cloudflare's image optimization service to automatically
 * resize, optimize, and serve images from the edge.
 *
 * Benefits:
 * - Automatic format conversion (WebP, AVIF)
 * - Responsive image sizing
 * - Edge caching for fast delivery
 * - Bandwidth savings
 *
 * @see https://developers.cloudflare.com/images/
 */

export interface CloudflareImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Cloudflare Images loader function
 *
 * Transforms image URLs to use Cloudflare's image optimization service.
 *
 * @param src - Source image URL
 * @param width - Desired image width
 * @param quality - Image quality (1-100, default: 75)
 * @returns Optimized image URL
 */
export default function cloudflareImageLoader({
  src,
  width,
  quality = 75,
}: CloudflareImageLoaderProps): string {
  // If the image is already a full URL (external), return as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // For local images, use Cloudflare's image resizing
  // Format: /cdn-cgi/image/width=<width>,quality=<quality>,format=auto/<src>
  const params = [`width=${width}`, `quality=${quality}`, "format=auto"];

  // Remove leading slash from src if present
  const normalizedSrc = src.startsWith("/") ? src.slice(1) : src;

  return `/cdn-cgi/image/${params.join(",")}/${normalizedSrc}`;
}

/**
 * Alternative: Use Cloudflare Images product (requires setup)
 *
 * If you're using Cloudflare Images (paid product), use this loader instead:
 *
 * @example
 * ```typescript
 * export default function cloudflareImagesLoader({
 *   src,
 *   width,
 *   quality = 75,
 * }: CloudflareImageLoaderProps): string {
 *   // Your Cloudflare Images account hash
 *   const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;
 *
 *   if (!accountHash) {
 *     console.warn('NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH not set');
 *     return src;
 *   }
 *
 *   // Extract image ID from src
 *   const imageId = src.replace(/^\//, '');
 *
 *   // Cloudflare Images URL format
 *   return `https://imagedelivery.net/${accountHash}/${imageId}/w=${width},q=${quality}`;
 * }
 * ```
 */
