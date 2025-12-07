'use client';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Toc({
  items,
}: {
  items: { id: string; text: string; level: number }[];
}) {
  const [activeId, setActiveId] = useState<string>('');

  // Scroll spy - only highlights active link, NO TOC scrolling
  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      // Check if at bottom of page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

      if (isAtBottom && items.length > 0) {
        setActiveId(items[items.length - 1].id);
        return;
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        // Find the entry closest to viewport center
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by position - prefer ones closer to top of viewport
          const sorted = visibleEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items]);

  // Update URL hash when active section changes (no TOC scroll)
  useEffect(() => {
    if (activeId && window.location.hash !== `#${activeId}`) {
      window.history.replaceState(null, '', `#${activeId}`);
    }
  }, [activeId]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="h-fit pl-6">
      {/* Title */}
      <h4 className="pb-3 text-[11px] font-semibold tracking-[0.05em] text-[#6D43FF] uppercase">
        On This Page
      </h4>

      {/* TOC list - static, no internal scroll */}
      <nav>
        <ul className="space-y-0.5 text-[13px]">
          {items.map(item => {
            // Dynamic indentation based on heading level (h2=0, h3=12px, h4=24px)
            const indent =
              item.level === 2 ? '' : item.level === 3 ? 'pl-3' : 'pl-6';
            return (
              <li key={item.id} className={indent}>
                <a
                  href={`#${item.id}`}
                  onClick={e => handleClick(e, item.id)}
                  className={cn(
                    'block py-1.5 transition-all duration-200',
                    activeId === item.id
                      ? 'border-l-2 border-[#6D43FF] pl-3 font-medium text-white'
                      : 'border-l-2 border-transparent pl-3 text-[#8b8f9e] hover:text-white/80'
                  )}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
