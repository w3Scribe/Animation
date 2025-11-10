'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

type Shade = 0 | 5 | 15 | 25 | 35 | 40 | 45 | 50;

interface OverlayBackdropProps {
  zIndex?: number; // z-index via style to avoid dynamic Tailwind class
  className?: string;
  shadeOpacity?: Shade; // choose from supported set
  ctrFn: () => void;
}

const opacityClass: Record<Shade, string> = {
  0: 'bg-black/0',
  5: 'bg-black/5',
  15: 'bg-black/15',
  25: 'bg-black/25',
  35: 'bg-black/35',
  40: 'bg-black/40',
  45: 'bg-black/45',
  50: 'bg-black/50',
};

const OverlayBackdrop = ({
  ctrFn,
  shadeOpacity = 50,
  zIndex = 9999,
  className,
}: OverlayBackdropProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      console.log('[OverlayBackdrop] mounted');
    }
  }, []);

  const node = (
    <div
      role="presentation"
      aria-hidden
      className={twMerge(
        'fixed inset-0 backdrop-blur-md select-none',
        opacityClass[shadeOpacity],
        className
      )}
      style={{ zIndex }}
      onClick={ctrFn}
    />
  );

  if (!mounted || typeof window === 'undefined') return null;
  return createPortal(node, document.body);
};

export default OverlayBackdrop;
