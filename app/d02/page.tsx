'use client';

import { Maximize2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

export default function Page() {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <div className="grid h-screen w-full place-items-center bg-slate-50">
      {/* Card */}
      <div className="relative h-96 w-80 overflow-hidden rounded-lg bg-white shadow-md">
        {/* Header */}
        <div className="relative grid h-[45%] w-full place-items-center overflow-hidden rounded-t-lg">
          <Maximize2
            size={16}
            className="absolute top-2 right-2 z-10 cursor-pointer text-white drop-shadow-md"
            onClick={() => setIsCardOpen(true)}
          />
          <h1 className="z-10 block text-center text-2xl font-semibold text-white uppercase drop-shadow-lg">
            Health
          </h1>
          <motion.img
            layoutId="health-image"
            src="/heath.jpg"
            alt="Health"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Body */}
        <div className="h-auto p-4 px-5">
          <p className="text-base text-balance">
            Health is a state of complete physical, mental, and social
            well-being, not just the absence of disease. It is a vital resource
            that enables people to achieve their potential and is influenced by
            factors like diet, exercise, and mental well-being.
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isCardOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCardOpen(false)}
            />

            {/* Expanded Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 50,
                duration: 0.3,
              }}
              className="fixed inset-0 z-50 m-auto flex h-[80vh] w-[90vw] max-w-4xl items-center justify-center"
            >
              <X
                size={24}
                className="absolute top-4 right-4 z-50 cursor-pointer text-white drop-shadow-lg transition-transform hover:scale-110"
                onClick={() => setIsCardOpen(false)}
              />
              <motion.img
                layoutId="health-image"
                src="/heath.jpg"
                alt="Health"
                className="h-full w-full rounded-lg object-cover shadow-2xl"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
