'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Link as LinkIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function MobileTableOfContents({
  items,
}: {
  items: { id: string; text: string; level: number }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  if (items.length === 0) return null;

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setIsOpen(false);
      openButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (items.length === 0) return;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        let closestId = '';
        let closestOffset = Number.POSITIVE_INFINITY;
        for (const item of items) {
          const el = document.getElementById(item.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const offset = Math.abs(rect.top - 120);
          if (offset < closestOffset) {
            closestOffset = offset;
            closestId = item.id;
          }
        }
        if (closestId && closestId !== activeId) {
          setActiveId(closestId);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [items]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        openButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* FAB Button */}
      <motion.button
        ref={openButtonRef}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => closeButtonRef.current?.focus(), 0);
        }}
        aria-label="Open table of contents"
        className="fixed right-6 bottom-6 z-40 rounded-full bg-[#6D43FF] p-3 text-white shadow-lg transition-colors hover:bg-[#7d5aff] md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <LinkIcon size={20} />
      </motion.button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                openButtonRef.current?.focus();
              }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              aria-hidden="true"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 bottom-0 left-0 z-50 max-h-[80vh] rounded-t-2xl bg-[#0d0e11] shadow-2xl md:hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="toc-heading"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <h3
                  id="toc-heading"
                  className="text-sm font-semibold text-white"
                >
                  On This Page
                </h3>
                <button
                  ref={closeButtonRef}
                  onClick={() => {
                    setIsOpen(false);
                    openButtonRef.current?.focus();
                  }}
                  aria-label="Close table of contents"
                  className="rounded-lg p-2 text-[#8b8f9e] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* TOC List */}
              <div className="max-h-[calc(80vh-60px)] overflow-y-auto px-5 py-4">
                <nav aria-label="Table of contents">
                  <ul className="space-y-1">
                    {items.map(item => {
                      const indent =
                        item.level === 2
                          ? ''
                          : item.level === 3
                            ? 'pl-4'
                            : 'pl-8';
                      return (
                        <li key={item.id} className={indent}>
                          <button
                            onClick={() => handleScroll(item.id)}
                            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                              activeId === item.id
                                ? 'border-l-2 border-[#6D43FF] bg-[#6D43FF]/10 font-medium text-white'
                                : 'text-[#8b8f9e] hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {item.text}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
