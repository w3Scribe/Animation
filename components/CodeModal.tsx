'use client';

import gsap from 'gsap';
import { Check, Copy, Play, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  exampleId: string;
  code: string;
  previewHTML: string | null;
  language?: string;
}

// Extract GSAP animation code from full code
function extractGSAPCode(code: string): string {
  // Remove preview markers section
  let cleanCode = code
    .replace(/\/\/ @preview-start[\s\S]*?\/\/ @preview-end\n?/g, '')
    .trim();

  // Remove imports, exports, and React-specific code
  cleanCode = cleanCode
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/export\s+(default\s+)?/g, '')
    .replace(/const\s+\w+Ref\s*=.*?;/g, '')
    .replace(/useGSAP\s*\(\s*\(\)\s*=>\s*\{/g, '') // Remove useGSAP wrapper
    .replace(/\}\s*,\s*\[\s*\]\s*\)\s*;?/g, '') // Remove closing of useGSAP
    .replace(/useRef.*?\n/g, '')
    .replace(/useEffect\s*\(\s*\(\)\s*=>\s*\{/g, '') // Remove useEffect wrapper
    .replace(/if\s*\(!.*?Ref\.current\).*?\n/g, '')
    .replace(/ref={.*?}/g, '')
    .replace(/\breturn\s*\(/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();

  return cleanCode;
}

export function CodeModal({
  isOpen,
  onClose,
  exampleId,
  code,
  previewHTML,
  language,
}: CodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const gsapContextRef = useRef<gsap.Context | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cleanup GSAP context when modal closes
  useEffect(() => {
    if (!isOpen && gsapContextRef.current) {
      gsapContextRef.current.revert();
      gsapContextRef.current = null;
    }
    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
        gsapContextRef.current = null;
      }
    };
  }, [isOpen]);

  const handleRunPreview = () => {
    const container = previewContainerRef.current;
    if (!container) return;

    // Check if preview HTML is available
    if (!previewHTML) {
      setPreviewError('No live preview available for this code snippet.');
      return;
    }

    setIsRunning(true);
    setPreviewError(null);

    // Cleanup previous animation
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
      gsapContextRef.current = null;
    }

    // Clear container and inject preview HTML
    container.innerHTML = '';

    try {
      // Create a wrapper for the preview content
      const previewWrapper = document.createElement('div');
      previewWrapper.className = 'preview-content flex flex-col items-center justify-center gap-4 p-4';
      previewWrapper.innerHTML = previewHTML;

      // Sanitize: Remove any script tags for safety
      const scripts = previewWrapper.querySelectorAll('script');
      scripts.forEach(script => script.remove());

      container.appendChild(previewWrapper);

      // Extract and execute GSAP code
      const gsapCode = extractGSAPCode(code);

      if (gsapCode.includes('gsap')) {
        // Create GSAP context scoped to preview container
        gsapContextRef.current = gsap.context(() => {
          try {
            // eslint-disable-next-line no-new-func
            const executeCode = new Function('gsap', gsapCode);
            executeCode(gsap);
          } catch (innerErr) {
            console.error('[GSAP Execution Error]:', innerErr);
          }
        }, container);
      }

      setTimeout(() => setIsRunning(false), 300);
    } catch (err) {
      console.error('[Preview Error]:', err);
      container.innerHTML = '';
      setPreviewError('⚠ Failed to render preview');
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get display code (remove preview markers for cleaner display)
  const displayCode = code
    .replace(/\/\/ @preview-start[\s\S]*?\/\/ @preview-end\n?/g, '')
    .trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-[90vh] w-[90%] max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl"
          >
            {/* Toolbar - Sticky Top */}
            <div className="sticky top-0 z-50 flex shrink-0 items-center justify-between border-b border-[#222] bg-[#111] p-3">
              <div className="flex items-center gap-2">
                {/* Run Preview Button */}
                <button
                  onClick={handleRunPreview}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 rounded-md bg-purple-600/20 px-3 py-1.5 text-sm font-medium text-purple-300 transition-colors hover:bg-purple-600/30 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Run Preview"
                >
                  <Play size={14} className="fill-current" />
                  <span className="hidden sm:inline">
                    {isRunning ? 'Running...' : 'Run Preview'}
                  </span>
                  <span className="sm:hidden">{isRunning ? '...' : 'Run'}</span>
                </button>

                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white/90"
                  title={copied ? 'Copied!' : 'Copy code'}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span className="hidden sm:inline">
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-[#0b0b0b] p-4">
              {/* Preview Container */}
              <div
                ref={previewContainerRef}
                id="preview-container"
                className="relative mb-4 flex min-h-[200px] w-full items-center justify-center overflow-hidden rounded-md border border-neutral-700 bg-neutral-900"
              >
                {previewError ? (
                  <p className="text-sm text-red-400">{previewError}</p>
                ) : (
                  <p className="text-xs text-neutral-500 opacity-60">
                    Click "Run Preview" to see animation
                  </p>
                )}
              </div>

              {/* Code Display */}
              {language && (
                <div className="mb-2 text-xs font-medium tracking-wider text-[#5c6370] uppercase">
                  {language}
                </div>
              )}
              <pre className="max-h-[40vh] overflow-auto rounded-md bg-[#0a0a0a] p-4 font-mono text-sm leading-relaxed text-purple-300">
                <code>{displayCode}</code>
              </pre>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
