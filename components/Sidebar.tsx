'use client';

import { buildNavigation } from '@/lib/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Build navigation dynamically from the single source of truth
const navigation = buildNavigation();

type NavItem = {
  title: string;
  icon: LucideIcon;
  href?: string;
  children?: Array<{ title: string; href: string }>;
};

function NavLink({
  href,
  title,
  isActive,
  isChild = false,
}: {
  href: string;
  title: string;
  isActive: boolean;
  isChild?: boolean;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll active link into view
  useEffect(() => {
    if (isActive && linkRef.current) {
      linkRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isActive]);

  return (
    <Link
      ref={linkRef}
      href={href}
      className={`group relative flex items-center transition-all duration-150 ${isChild ? 'py-2 pl-3 text-[13px]' : 'py-2.5 pl-5 text-[14px] font-medium'} ${isActive ? 'text-white' : 'text-[#8b8f9e] hover:text-[#a78bfa]'} `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#6D43FF]"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      {/* Active background glow */}
      {isActive && (
        <div className="absolute inset-0 -z-10 rounded-md bg-[#6D43FF]/10" />
      )}

      <span className="relative">{title}</span>
    </Link>
  );
}

function NavSection({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const hasChildren = 'children' in item && item.children;
  const isParentActive = hasChildren
    ? item.children?.some(child => pathname === child.href)
    : pathname === item.href;
  const [isOpen, setIsOpen] = useState(isParentActive);

  // Auto-expand when route matches
  useEffect(() => {
    if (isParentActive) setIsOpen(true);
  }, [isParentActive]);

  const Icon = item.icon;

  // Single link (no children)
  if (!hasChildren) {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href!}
        className={`group relative flex items-center gap-3 py-2.5 pl-5 transition-all duration-150 ${isActive ? 'text-white' : 'text-[#8b8f9e] hover:text-[#a78bfa]'} `}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#6D43FF]"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}

        {/* Active background glow */}
        {isActive && (
          <div className="absolute inset-0 -z-10 rounded-md bg-[#6D43FF]/10" />
        )}

        <Icon
          size={16}
          className={`shrink-0 transition-colors duration-150 ${
            isActive
              ? 'text-[#6D43FF]'
              : 'text-[#6b7280] group-hover:text-[#a78bfa]'
          }`}
        />
        <span className="text-[14px] font-medium">{item.title}</span>
      </Link>
    );
  }

  // Section with children
  return (
    <div className="mt-2 first:mt-0">
      {/* Section header button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex w-full items-center gap-3 py-2.5 pr-2 pl-5 text-left transition-all duration-150 ${isParentActive ? 'text-white' : 'text-[#8b8f9e] hover:text-[#a78bfa]'} `}
      >
        {/* Active section indicator */}
        {isParentActive && (
          <div className="absolute top-1/2 left-0 h-8 w-0.5 -translate-y-1/2 rounded-full bg-[#6D43FF]/40" />
        )}

        <Icon
          size={16}
          className={`shrink-0 transition-colors duration-150 ${
            isParentActive
              ? 'text-[#6D43FF]'
              : 'text-[#6b7280] group-hover:text-[#a78bfa]'
          }`}
        />
        <span className="flex-1 text-[14px] font-medium">{item.title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-[#6b7280]"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      {/* Children accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="relative ml-[27px] space-y-0.5 border-l border-[#1f2229] pl-4">
              {item.children?.map(child => (
                <NavLink
                  key={child.href}
                  href={child.href}
                  title={child.title}
                  isActive={pathname === child.href}
                  isChild
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile sidebar overlay
function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Sidebar panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-72 overflow-y-auto bg-[#0d0e11] px-5 py-6 shadow-2xl lg:hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              title="Close menu"
              className="absolute top-4 right-4 rounded-md p-2 text-[#8b8f9e] transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Logo/Title */}
            <div className="mb-3 pl-5">
              <p className="text-[11px] font-semibold tracking-widest text-[#6b7280] uppercase">
                Documentation
              </p>
              <p className="mt-0.5 text-xs text-[#4b5563]">
                Learn Animation Libraries
              </p>
            </div>

            {/* Navigation */}
            <nav>
              {navigation.map(item => (
                <NavSection key={item.title} item={item} />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile menu trigger button
export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Open menu"
        className="fixed top-4 left-4 z-30 flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#0d0e11] p-3 text-white shadow-lg ring-1 ring-white/10 transition-all hover:ring-[#6D43FF]/50 lg:hidden"
      >
        <Menu size={20} />
      </button>
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

// Desktop sidebar
export function Sidebar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Remember scroll position
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('sidebar-scroll');
    if (savedPosition && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedPosition, 10);
    }

    const handleScroll = () => {
      if (scrollRef.current) {
        sessionStorage.setItem(
          'sidebar-scroll',
          String(scrollRef.current.scrollTop)
        );
      }
    };

    const el = scrollRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="hidden w-[260px] shrink-0 lg:block">
      <div
        ref={scrollRef}
        className="sticky top-0 max-h-screen overflow-y-auto pt-8 pr-4 pb-8"
      >
        {/* Header */}
        <div className="mb-4 pl-5">
          <p className="text-[11px] font-semibold tracking-widest text-[#6b7280] uppercase">
            Documentation
          </p>
          <p className="mt-0.5 text-xs text-[#4b5563]">
            Learn Animation Libraries
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navigation.map(item => (
            <NavSection key={item.title} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
