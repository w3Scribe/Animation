'use client';

import type { ExampleConfig } from '@/lib/examples';
import { Check, Copy, Play, RotateCcw, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

type CodePlaygroundModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  example: ExampleConfig | null;
};

export function CodePlaygroundModal({
  isOpen,
  onCloseAction,
  example,
}: CodePlaygroundModalProps) {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize code when example changes
  useEffect(() => {
    if (example) {
      setCode(example.initialCode);
      setRunKey(0);
    }
  }, [example]);

  // Focus trap and escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAction();
      }

      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus close button when modal opens
    setTimeout(() => closeButtonRef.current?.focus(), 100);

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCloseAction]);

  const handleRun = useCallback(() => {
    setRunKey(k => k + 1);
  }, []);

  const handleReset = useCallback(() => {
    if (example) {
      setCode(example.initialCode);
      setRunKey(k => k + 1);
    }
  }, [example]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  if (!example) return null;

  const { Demo } = example;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={e => {
            if (e.target === e.currentTarget) onCloseAction();
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050508] shadow-2xl shadow-black/60 md:mx-8 md:h-[85vh]"
            role="dialog"
            aria-modal="true"
            aria-label={`Interactive example: ${example.title}`}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3 md:px-6 md:py-4">
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-semibold text-white md:text-xl">
                  {example.title}
                </h2>
                {example.description && (
                  <p className="mt-0.5 truncate text-sm text-white/50">
                    {example.description}
                  </p>
                )}
              </div>

              {/* Desktop controls */}
              <div className="ml-4 hidden shrink-0 items-center gap-2 md:flex">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw size={16} />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleRun}
                  className="flex items-center gap-1.5 rounded-lg bg-violet-500/90 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-400"
                >
                  <Play size={16} className="fill-current" />
                  <span>Run</span>
                </button>
                <button
                  ref={closeButtonRef}
                  onClick={onCloseAction}
                  className="ml-2 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white md:hidden"
                  aria-label="Close playground"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile close button */}
              <button
                ref={closeButtonRef}
                onClick={onCloseAction}
                className="ml-2 rounded-lg p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white md:hidden"
                aria-label="Close playground"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              {/* Code editor */}
              <div className="flex min-h-0 flex-1 flex-col border-b border-white/10 md:border-r md:border-b-0">
                <div className="shrink-0 border-b border-white/5 px-4 py-2">
                  <span className="text-xs font-medium tracking-wider text-white/40 uppercase">
                    Code
                  </span>
                </div>
                <div className="relative min-h-0 flex-1 overflow-auto bg-[#111217]">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="h-full w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed text-white/90 outline-none placeholder:text-white/30"
                    spellCheck={false}
                    placeholder="// Edit your code here..."
                  />
                </div>
              </div>

              {/* Preview area */}
              <div className="flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-white/5 px-4 py-2">
                  <span className="text-xs font-medium tracking-wider text-white/40 uppercase">
                    Preview
                  </span>
                </div>
                <div className="min-h-[200px] flex-1 overflow-auto bg-[#05060a] p-4">
                  <Demo code={code} runKey={runKey} />
                </div>
              </div>
            </div>

            {/* Mobile controls */}
            <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-4 py-3 md:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-2.5 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-lg p-2.5 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Reset code"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              <button
                onClick={handleRun}
                className="flex items-center gap-2 rounded-lg bg-violet-500/90 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-400"
              >
                <Play size={18} className="fill-current" />
                <span>Run</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CodePlaygroundModal;
