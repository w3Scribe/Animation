import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { docOrder } from './navigation';

const DOCS_PATH = path.join(process.cwd(), 'doc');

export type Doc = {
  slug: string[];
  title: string;
  description?: string;
  content: string;
  toc: { id: string; text: string; level: number }[];
};

export type NavLink = {
  title: string;
  href: string;
} | null;

function getFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map(dirent => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

export function getAllDocSlugs() {
  const files = getFiles(DOCS_PATH);
  return files
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .map(file => {
      const relativePath = path.relative(DOCS_PATH, file);
      const slug = relativePath
        .replace(/\.mdx?$/, '')
        .split(path.sep)
        .map(segment => segment.replace(/^\d+-/, '')); // Strip numbers
      return slug;
    });
}

export function getDocBySlug(slug: string[]): Doc | null {
  const files = getFiles(DOCS_PATH);
  const matchedFile = files.find(file => {
    const relativePath = path.relative(DOCS_PATH, file);
    const fileSlug = relativePath
      .replace(/\.mdx?$/, '')
      .split(path.sep)
      .map(segment => segment.replace(/^\d+-/, ''));
    return JSON.stringify(fileSlug) === JSON.stringify(slug);
  });

  if (!matchedFile) return null;

  const fileContent = fs.readFileSync(matchedFile, 'utf8');
  const { data, content } = matter(fileContent);

  // Extract TOC
  const toc = content
    .split('\n')
    .filter(line => line.match(/^#{2,3}\s/))
    .map(line => {
      const level = line.match(/^#+/)?.[0].length || 2;
      const text = line.replace(/^#+\s/, '');
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      return { id, text, level };
    });

  return {
    slug,
    title: data.title || slug[slug.length - 1],
    description: data.description,
    content,
    toc,
  };
}

export function getDocNavigation(slug: string[]): {
  prev: NavLink;
  next: NavLink;
} {
  const currentIndex = docOrder.findIndex(
    doc => JSON.stringify(doc.slug) === JSON.stringify(slug)
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev =
    currentIndex > 0
      ? {
          title: docOrder[currentIndex - 1].title,
          href: `/learn/${docOrder[currentIndex - 1].slug.join('/')}`,
        }
      : null;

  const next =
    currentIndex < docOrder.length - 1
      ? {
          title: docOrder[currentIndex + 1].title,
          href: `/learn/${docOrder[currentIndex + 1].slug.join('/')}`,
        }
      : null;

  return { prev, next };
}
