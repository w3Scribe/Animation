'use client';

import { getExample, type ExampleConfig } from '@/lib/examples';
import { Check, Copy, Play } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { CodePlaygroundModal } from './CodePlaygroundModal';

function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractTextContent).join('');
  if (React.isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode }).children;
    return extractTextContent(children);
  }
  return '';
}

type InteractiveCodeBlockProps = {
  exampleId: string;
  children?: React.ReactNode;
} & React.ComponentProps<'pre'>;

export function InteractiveCodeBlock({
  exampleId,
  children,
  ...props
}: InteractiveCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [example, setExample] = useState<ExampleConfig | null>(null);

  const codeText = extractTextContent(children);

  // Extract language from data attribute
  const dataLanguage = (props as { 'data-language'?: string })['data-language'];
  const language = dataLanguage || '';

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeText]);

  const openPlayground = useCallback(() => {
    const exampleConfig = getExample(exampleId);
    if (exampleConfig) {
      setExample(exampleConfig);
      setIsModalOpen(true);
    }
  }, [exampleId]);

  const closePlayground = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div className="group relative mx-3 my-6 overflow-hidden rounded-xl bg-[#0f0f13] shadow-lg ring-1 shadow-black/20 ring-white/6 transition-all duration-200 hover:ring-violet-500/30 md:mx-0 md:my-10">
        {language && (
          <div className="absolute top-3 left-4 z-10 text-xs font-medium tracking-wider text-[#5c6370] uppercase">
            {language}
          </div>
        )}

        {/* Control buttons */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          {/* Play button - always visible for interactive blocks */}
          <button
            onClick={openPlayground}
            className="flex items-center gap-1.5 rounded-md bg-violet-500/20 px-2.5 py-1.5 text-xs font-medium text-violet-400 transition-all hover:bg-violet-500/30 hover:text-violet-300"
            title="Open in Playground"
          >
            <Play size={14} className="fill-current" />
            <span className="hidden sm:inline">Playground</span>
          </button>

          {/* Copy button */}
          <button
            onClick={onCopy}
            className="rounded-md p-2 text-[#5c6370] opacity-0 transition-all group-hover:opacity-100 hover:text-white/70"
            title="Copy code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <pre
          {...props}
          className="overflow-x-auto p-4 pt-10 font-mono text-sm leading-relaxed md:p-6"
        >
          {children}
        </pre>
      </div>

      {/* Playground Modal */}
      {isModalOpen && example && (
        <CodePlaygroundModal
          isOpen={isModalOpen}
          onCloseAction={closePlayground}
          example={example}
        />
      )}
    </>
  );
}

export default InteractiveCodeBlock;
