'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type NavLink = {
  title: string;
  href: string;
} | null;

interface DocsNavigationProps {
  prev: NavLink;
  next: NavLink;
}

export function DocsNavigation({ prev, next }: DocsNavigationProps) {
  return (
    <nav className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 px-4 py-6 pt-6 md:mt-16 md:flex-row md:gap-4 md:px-5 md:py-4 md:pt-8">
      {/* Previous */}
      {prev ? (
        <Link href={prev.href} className="group w-full md:flex-1">
          <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/2 px-5 py-3 transition-colors duration-200 hover:border-[#6D43FF]/40 hover:bg-[#6D43FF]/5 md:h-auto md:py-4">
            <ArrowLeft
              size={18}
              className="shrink-0 text-[#6b7280] transition-colors group-hover:text-[#6D43FF]"
            />
            <div className="flex min-w-0 flex-col">
              <span className="text-[11px] tracking-wider text-[#6b7280] uppercase">
                Previous
              </span>
              <span className="truncate text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                {prev.title}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="w-full md:flex-1" />
      )}

      {/* Next */}
      {next ? (
        <Link href={next.href} className="group w-full md:flex-1">
          <div className="flex h-12 items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/2 px-5 py-3 text-right transition-colors duration-200 hover:border-[#6D43FF]/40 hover:bg-[#6D43FF]/5 md:h-auto md:py-4">
            <div className="flex min-w-0 flex-col">
              <span className="text-[11px] tracking-wider text-[#6b7280] uppercase">
                Next
              </span>
              <span className="truncate text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                {next.title}
              </span>
            </div>
            <ArrowRight
              size={18}
              className="shrink-0 text-[#6b7280] transition-colors group-hover:text-[#6D43FF]"
            />
          </div>
        </Link>
      ) : (
        <div className="w-full md:flex-1" />
      )}
    </nav>
  );
}
