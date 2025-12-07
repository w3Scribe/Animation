import { CodeBlock } from '@/components/CodeBlock';
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mt-10 mb-4 scroll-m-24 text-2xl font-bold text-white first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-6 mb-3 scroll-m-24 text-xl font-semibold text-white/90"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-6 leading-8 text-white/85">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-8 list-disc space-y-2 pl-6 text-white/80">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-8 list-decimal space-y-2 pl-6 text-white/80">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start leading-7">
      <span className="flex-1">{children}</span>
    </li>
  ),
  pre: CodeBlock,
  // Inline code styling handled by CSS (:not(pre) > code in globals.css)
  // Don't style <code> here as it breaks code blocks (code inside pre)
  table: ({ children }) => (
    <div className="my-8 overflow-hidden rounded-lg">
      <table className="w-full border-collapse bg-white/2">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-white/10 px-4 py-3 text-left font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-white/8 px-4 py-3 text-[#cccccc]">
      {children}
    </td>
  ),
  hr: () => <hr className="my-12 border-white/10" />,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-[#6D43FF] pl-4 text-white/70 italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-[#6D43FF] underline decoration-[#6D43FF]/30 underline-offset-2 transition-colors hover:decoration-[#6D43FF]"
    >
      {children}
    </a>
  ),
};
