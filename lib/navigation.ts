import { BookOpen, Layers, Sparkles, type LucideIcon } from 'lucide-react';

// Single source of truth for all documentation pages
// Add new pages here — they'll automatically appear in sidebar & navigation
export const docOrder = [
  { slug: ['getting-started'], title: 'Getting Started', category: null },
  { slug: ['gsap', 'basics'], title: 'Basics', category: 'gsap' },
  { slug: ['gsap', 'usegasap-hook'], title: 'useGSAP Hook', category: 'gsap' },
  { slug: ['gsap', 'from-method'], title: 'from() Method', category: 'gsap' },
  {
    slug: ['gsap', 'fromto-method'],
    title: 'fromTo() Method',
    category: 'gsap',
  },
  { slug: ['gsap', 'timeline-method'], title: 'Timeline', category: 'gsap' },
  { slug: ['gsap', 'easing'], title: 'Easing', category: 'gsap' },
  {
    slug: ['framer-motion', 'introduction'],
    title: 'Introduction',
    category: 'framer-motion',
  },
] as const;

// Category metadata (icons, display names)
export const categories: Record<string, { title: string; icon: LucideIcon }> = {
  gsap: { title: 'GSAP', icon: Layers },
  'framer-motion': { title: 'Framer Motion', icon: Sparkles },
};

// Standalone pages (no category)
export const standaloneIcon: LucideIcon = BookOpen;

export type DocOrderItem = (typeof docOrder)[number];

// Build navigation structure for sidebar
export function buildNavigation() {
  const nav: Array<{
    title: string;
    icon: LucideIcon;
    href?: string;
    children?: Array<{ title: string; href: string }>;
  }> = [];

  const categoryGroups: Record<
    string,
    Array<{ title: string; href: string }>
  > = {};

  for (const doc of docOrder) {
    const href = `/learn/${doc.slug.join('/')}`;

    if (!doc.category) {
      // Standalone page (like Getting Started)
      nav.push({
        title: doc.title,
        icon: standaloneIcon,
        href,
      });
    } else {
      // Grouped under category
      if (!categoryGroups[doc.category]) {
        categoryGroups[doc.category] = [];
      }
      categoryGroups[doc.category].push({ title: doc.title, href });
    }
  }

  // Add category groups to nav
  for (const [categoryKey, children] of Object.entries(categoryGroups)) {
    const meta = categories[categoryKey];
    if (meta) {
      nav.push({
        title: meta.title,
        icon: meta.icon,
        children,
      });
    }
  }

  return nav;
}
