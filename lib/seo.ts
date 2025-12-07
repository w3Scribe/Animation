// SEO helper for base URL
// Works with free Vercel URL - no custom domain required

export function getBaseUrl(): string {
  // 1) Use explicit env var if set in Vercel Project Settings
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '');
  }

  // 2) Use Vercel's auto-generated URL in production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3) Fallback for local development
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: 'Animation Learn Hub',
  description:
    'Interactive documentation for mastering GSAP and Framer Motion with React & Next.js.',
  author: 'W3Scribe',
  twitterHandle: '@w3scribe',
};

// Resolve an SEO image for a given doc slug.
// slugParts like ['gsap', 'basics'] become 'gsap-basics'.
// We assume images live in /public/seo and are referenced as /seo/{name}.jpg|png.
export function resolveSeoImage(
  slugParts: string[] | undefined,
  title?: string
) {
  const baseAlt = title || siteConfig.name;

  // Build a simple filename from the slug array: "gsap-basics"
  const slugName = slugParts?.join('-') || 'default';

  // Prefer JPG, then PNG (you can change this based on your real files)
  const jpgPath = `/seo/${slugName}.jpg`;
  const pngPath = `/seo/${slugName}.png`;

  // We can't check the filesystem from the browser, so we simply
  // follow the naming convention. In dev you can watch 404s or
  // extend this with a server-side check if needed.
  const imagePath = jpgPath; // or pngPath depending on what you use

  return {
    url: imagePath,
    width: 1200,
    height: 630,
    alt: baseAlt,
  };
}
