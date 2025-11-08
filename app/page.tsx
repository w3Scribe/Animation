'use client';

import { motion } from 'motion/react';
import { FC, useCallback, useState } from 'react';

const TABS = ['Home', 'About', 'Contact'] as const;

interface HighlightRect {
  width: number;
  height: number;
  left: number;
  opacity: number;
}

interface TabProps {
  name: (typeof TABS)[number];
  onHover: (rect: HighlightRect) => void;
}

const TabHighlighter: FC<{ rect: HighlightRect }> = ({ rect }) => {
  return (
    <motion.div
      animate={{
        height: rect.height,
        width: rect.width,
        left: rect.left,
        opacity: rect.opacity,
      }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className="pointer-events-none absolute z-0 rounded-full bg-gray-900 opacity-0"
    ></motion.div>
  );
};

const Tab: FC<TabProps> = ({ name, onHover }) => {
  return (
    <div
      onMouseEnter={e => {
        const rectBounding = (
          e.currentTarget as HTMLDivElement
        ).getBoundingClientRect();

        onHover({
          width: rectBounding.width,
          height: rectBounding.height,
          left: e.currentTarget.offsetLeft,
          opacity: 1,
        });
      }}
      className="relative z-10 cursor-pointer px-3 py-1.5 font-semibold text-white uppercase mix-blend-difference select-none"
    >
      {name}
    </div>
  );
};

// Tab navigation container
const TabNav = () => {
  const [rect, setRect] = useState<HighlightRect>({
    width: 0,
    height: 0,
    left: 0,
    opacity: 0,
  });
  const handleHover = useCallback((r: HighlightRect) => setRect(r), []);

  return (
    <div
      className="relative isolate flex items-center gap-x-1 rounded-full border-2 border-gray-700 bg-white p-0.5 shadow-sm"
      onMouseLeave={() => setRect(r => ({ ...r, opacity: 0 }))}
    >
      {TABS.map(name => (
        <Tab key={name} name={name} onHover={handleHover} />
      ))}
      <TabHighlighter rect={rect} />
    </div>
  );
};

export default function Page() {
  return (
    <div className="grid h-screen w-full place-items-center">
      <TabNav />
    </div>
  );
}
