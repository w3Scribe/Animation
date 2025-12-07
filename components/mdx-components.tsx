import { CodeBlock } from '@/components/CodeBlock';
import { InteractiveCodeBlock } from '@/components/InteractiveCodeBlock';
import type { MDXComponents } from 'mdx/types';

// Custom pre component that detects interactive code blocks
function PreComponent(props: React.ComponentProps<'pre'>) {
  // Check for interactive meta attribute from rehype-pretty-code
  const meta = (props as { 'data-meta'?: string })['data-meta'] || '';
  const interactiveMatch = meta.match(/interactive="([^"]+)"/);

  // Use InteractiveCodeBlock when interactive attribute is present
  // Preview button visibility is controlled by @preview-start/@preview-end markers in the code
  if (interactiveMatch) {
    const exampleId = interactiveMatch[1];
    return <InteractiveCodeBlock exampleId={exampleId} {...props} />;
  }

  return <CodeBlock {...props} />;
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:mb-6 md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mt-8 mb-4 scroll-m-24 border-b border-white/5 pb-6 text-2xl font-bold text-white first:mt-0 md:mt-10 md:text-2xl"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-6 mb-3 scroll-m-24 text-lg font-semibold text-white/90 md:mt-8 md:mb-4 md:text-xl"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-6 mb-4 text-base leading-relaxed text-white/85 md:mt-8 md:mb-6 md:leading-8">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-6 mb-6 list-disc space-y-2 pl-5 text-base text-white/80 md:mt-8 md:mb-8 md:pl-6 md:text-inherit">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-6 mb-6 list-decimal space-y-2 pl-5 text-base text-white/80 md:mt-8 md:mb-8 md:pl-6 md:text-inherit">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="mb-2 flex items-start leading-relaxed md:leading-7">
      <span className="flex-1">{children}</span>
    </li>
  ),
  pre: PreComponent,
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
