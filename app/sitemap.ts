import { getAllDocSlugs } from '@/lib/docs';
import { getBaseUrl } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const slugs = getAllDocSlugs();

  // Generate sitemap entries for all doc pages
  const docs = slugs.map(slug => ({
    url: `${baseUrl}/learn/${slug.join('/')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // All documentation pages
    ...docs,
  ];
}
