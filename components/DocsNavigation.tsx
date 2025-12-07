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
    <nav className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
      {/* Previous */}
      {prev ? (
        <Link href={prev.href} className="group flex-1">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/2 px-5 py-4 transition-colors duration-200 hover:border-[#6D43FF]/40 hover:bg-[#6D43FF]/5">
            <ArrowLeft
              size={18}
              className="text-[#6b7280] transition-colors group-hover:text-[#6D43FF]"
            />
            <div className="flex flex-col">
              <span className="text-[11px] tracking-wider text-[#6b7280] uppercase">
                Previous
              </span>
              <span className="text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                {prev.title}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {/* Next */}
      {next ? (
        <Link href={next.href} className="group flex-1">
          <div className="flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/2 px-5 py-4 text-right transition-colors duration-200 hover:border-[#6D43FF]/40 hover:bg-[#6D43FF]/5">
            <div className="flex flex-col">
              <span className="text-[11px] tracking-wider text-[#6b7280] uppercase">
                Next
              </span>
              <span className="text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                {next.title}
              </span>
            </div>
            <ArrowRight
              size={18}
              className="text-[#6b7280] transition-colors group-hover:text-[#6D43FF]"
            />
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
