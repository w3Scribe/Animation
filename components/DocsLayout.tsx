'use client';
import { ReactLenis } from 'lenis/react';
import React from 'react';
import { DocsNavigation } from './DocsNavigation';
import { MobileTableOfContents } from './MobileTableOfContents';
import { PageTransition } from './PageTransition';
import { MobileMenuButton, Sidebar } from './Sidebar';
import { Toc } from './Toc';

type NavLink = {
  title: string;
  href: string;
} | null;

export function DocsLayout({
  children,
  toc,
  prev,
  next,
}: {
  children: React.ReactNode;
  toc: { id: string; text: string; level: number }[];
  prev?: NavLink;
  next?: NavLink;
}) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <div className="min-h-screen bg-[#09090b]">
        {/* Mobile menu button */}
        <MobileMenuButton />

        {/* Mobile Table of Contents FAB */}
        <MobileTableOfContents items={toc} />

        <div className="flex justify-center">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <article
            id="main-content"
            className="w-full max-w-[900px] min-w-[280px] space-y-8 px-5 pt-8 pb-12 leading-relaxed md:space-y-12 md:px-8"
          >
            <div className="rounded-2xl bg-white/2 p-5 pt-6 shadow-xl ring-1 shadow-black/20 ring-white/5 md:p-8">
              <PageTransition>
                {children}
                {(prev || next) && (
                  <DocsNavigation prev={prev ?? null} next={next ?? null} />
                )}
              </PageTransition>
            </div>
          </article>

          {/* TOC */}
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 pt-8 xl:block">
            <Toc items={toc} />
          </aside>
        </div>
      </div>
    </ReactLenis>
  );
}
