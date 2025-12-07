'use client';

import { Check, Copy, Play } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { CodeModal } from './CodeModal';

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

// Preview marker constants
const PREVIEW_START = '// @preview-start';
const PREVIEW_END = '// @preview-end';

// Extract preview HTML from code using markers
function extractPreviewHTML(code: string): string | null {
  const startIndex = code.indexOf(PREVIEW_START);
  const endIndex = code.indexOf(PREVIEW_END);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return null;
  }

  const previewContent = code
    .substring(startIndex + PREVIEW_START.length, endIndex)
    .trim();

  // Return null if content is empty
  if (!previewContent) {
    return null;
  }

  return previewContent;
}

// Remove preview markers from display code (optional - keeps code cleaner)
function getDisplayCode(code: string): string {
  return code
    .replace(/\/\/ @preview-start[\s\S]*?\/\/ @preview-end\n?/g, '')
    .trim();
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

  const codeText = extractTextContent(children);

  // Extract language from data attribute
  const dataLanguage = (props as { 'data-language'?: string })['data-language'];
  const language = dataLanguage || '';

  // Extract preview HTML if markers exist
  const previewHTML = useMemo(() => extractPreviewHTML(codeText), [codeText]);

  // Show preview button ONLY when preview markers with content exist
  const showPreview = previewHTML !== null;

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(codeText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeText]);

  const openPlayground = useCallback(() => {
    setIsModalOpen(true);
  }, []);

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
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {/* Run Preview button - visible ONLY with preview markers */}
          {showPreview && (
            <button
              onClick={openPlayground}
              className="flex items-center gap-1.5 rounded-md bg-purple-600/20 px-2.5 py-1.5 text-xs font-medium text-purple-300 transition-colors hover:bg-purple-600/30 hover:text-purple-200"
              title="Run Preview"
            >
              <Play size={14} className="fill-current" />
              <span className="hidden sm:inline">Run Preview</span>
              <span className="sm:hidden">Run</span>
            </button>
          )}

          {/* Copy button - always visible */}
          <button
            onClick={onCopy}
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            aria-label="Copy code"
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

      {/* Code Modal - only rendered when preview is available */}
      {showPreview && (
        <CodeModal
          isOpen={isModalOpen}
          onClose={closePlayground}
          exampleId={exampleId}
          code={codeText}
          previewHTML={previewHTML}
          language={language}
        />
      )}
    </>
  );
}

export default InteractiveCodeBlock;
