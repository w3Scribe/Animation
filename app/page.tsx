'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function Page() {
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    context => {
      const hero = heroSectionRef.current;
      const restartBtn = restartButtonRef.current;
      if (!hero || !restartBtn) return;

      // Scoped selector tied to hero section
      const q = context.selector!;
      const title = q('.heroTitle')[0];
      const subtitle = q('.heroSubtitle')[0];
      const buttons = q('.heroButton');

      if (!title || !subtitle || buttons.length < 2) return;

      // Shared animation defaults
      const defaults = {
        y: 50,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
      } as const;

      // Build timeline and store it for replay
      const tl = gsap.timeline({ defaults });
      tl.from(title, {}) // uses defaults
        .from(subtitle, {}, '<0.3') // starts 0.3s after title starts
        .from(buttons[0], {}, '+=0.1') // after subtitle finishes by 0.1s
        .from(buttons[1], {}, '-=0.5'); // sync with previous button

      timelineRef.current = tl;

      // Wire up restart with latest timeline
      const onRestart = () => timelineRef.current?.restart();
      restartBtn.addEventListener('click', onRestart);

      // Cleanup: kill tweens/listeners on unmount
      return () => {
        restartBtn.removeEventListener('click', onRestart);
        context.revert(); // kills all animations created in this context
        timelineRef.current = null;
      };
    },
    { scope: heroSectionRef } // enables context.selector within this scope
  );

  return (
    <div>
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-2 shadow-2xl">
        <div className="text-2xl font-semibold capitalize">Logo</div>
        <button
          type="button"
          className="rounded-md bg-blue-600 px-3 py-1.5 font-semibold text-white capitalize transition-colors hover:bg-blue-500"
          ref={restartButtonRef}
        >
          Restart
        </button>
      </header>

      {/* Hero section */}
      <section
        className="flex h-svh w-full flex-col items-center justify-center gap-3"
        ref={heroSectionRef}
      >
        <h1 className="heroTitle text-4xl font-bold">Welcome to Our Website</h1>
        <p className="heroSubtitle mt-2 text-lg text-gray-600">
          We're glad to have you here. Explore our features and enjoy your stay!
        </p>
        <div className="mt-4 flex gap-4">
          <button
            type="button"
            className="heroButton rounded-md bg-green-600 px-4 py-2 font-semibold text-white capitalize transition-colors hover:bg-green-500"
          >
            Get Started
          </button>
          <button
            type="button"
            className="heroButton rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-800 capitalize transition-colors hover:bg-gray-300"
          >
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
}
