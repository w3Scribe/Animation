'use client';
import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';

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

export function CodeBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false);

  const codeText = extractTextContent(children);

  // Extract language from data attribute or className
  const dataLanguage = (props as { 'data-language'?: string })['data-language'];
  const language = dataLanguage || '';

  const onCopy = () => {
    navigator.clipboard.writeText(codeText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-10 overflow-hidden rounded-lg bg-[#0f0f13] ring-1 ring-white/6">
      {language && (
        <div className="absolute top-3 left-4 z-10 text-xs font-medium tracking-wider text-[#5c6370] uppercase">
          {language}
        </div>
      )}
      <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onCopy}
          className="rounded-md p-2 text-[#5c6370] transition-colors hover:text-white/70"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre
        {...props}
        className="overflow-x-auto p-6 pt-10 font-mono text-sm leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}
