import { DocsLayout } from '@/components/DocsLayout';
import { mdxComponents } from '@/components/mdx-components';
import { getAllDocSlugs, getDocBySlug, getDocNavigation } from '@/lib/docs';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const doc = getDocBySlug(resolvedParams.slug);
  const navigation = getDocNavigation(resolvedParams.slug);

  if (!doc) {
    notFound();
  }

  return (
    <DocsLayout toc={doc.toc} prev={navigation.prev} next={navigation.next}>
      <MDXRemote
        source={doc.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor'],
                  },
                },
              ],
              [
                rehypePrettyCode,
                {
                  theme: 'one-dark-pro',
                  keepBackground: false,
                },
              ],
            ],
          },
        }}
      />
    </DocsLayout>
  );
}
