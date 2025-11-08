'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Page() {
  const [isOn, setIsOn] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="grid h-screen w-full place-items-center bg-slate-900">
      <motion.div
        animate={{
          backgroundColor: isOn
            ? 'rgba(13, 148, 136, 0.3)'
            : 'rgba(13, 148, 136, 0.15)',
        }}
        transition={{ duration: 0.3 }}
        className={twMerge(
          'flex h-10 w-24 items-center rounded-full border border-teal-700 px-1',
          isOn ? 'justify-end' : 'justify-start'
        )}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
      >
        <motion.div
          layout
          animate={{
            rotate: isOn ? 360 : 0,
            scale: isOn ? 1.1 : 1,
            borderColor: isFocused ? 'rgb(20 184 166)' : 'transparent',
          }}
          transition={{
            layout: { type: 'spring', stiffness: 500, damping: 35, mass: 0.7 },
            rotate: { type: 'spring', stiffness: 300, damping: 25 },
            scale: { type: 'spring', stiffness: 400, damping: 20 },
          }}
          whileTap={{ scale: 0.9 }}
          className="size-8 cursor-pointer rounded-full border-2 border-transparent bg-linear-to-br from-teal-500 to-teal-700 shadow-lg"
          onClick={() => setIsOn(!isOn)}
        />
      </motion.div>
    </div>
  );
}
