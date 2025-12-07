'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export type DemoProps = {
  code: string;
  runKey: number; // increment to trigger re-run
};

export const FramerMotionBasicDemo: React.FC<DemoProps> = ({ runKey }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Reset animation when runKey changes
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [runKey]);

  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-6">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={runKey}
            className="flex gap-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
              exit: {
                transition: { staggerChildren: 0.1, staggerDirection: -1 },
              },
            }}
          >
            {['violet', 'emerald', 'sky'].map((color, i) => (
              <motion.div
                key={color}
                className={`h-12 w-12 rounded-lg shadow-lg ${
                  color === 'violet'
                    ? 'bg-violet-500 shadow-violet-500/30'
                    : color === 'emerald'
                      ? 'bg-emerald-500 shadow-emerald-500/30'
                      : 'bg-sky-500 shadow-sky-500/30'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    },
                  },
                  exit: {
                    opacity: 0,
                    y: -40,
                    scale: 0.8,
                    transition: { duration: 0.2 },
                  },
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  transition: { type: 'spring', stiffness: 400 },
                }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="text-sm text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Hover or tap the boxes!
      </motion.p>
    </div>
  );
};

export default FramerMotionBasicDemo;
