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
