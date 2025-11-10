'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function Page() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerEffect({
      name: 'fade',
      effect: (
        target: HTMLElement,
        // use a proper config type; make properties optional so defaults apply
        config: gsap.TweenVars & { opacity?: number; duration?: number }
      ) => {
        return gsap.to(target, {
          opacity: config.opacity,
          duration: config.duration,
          repeat: 1,
          yoyo: true,
        });
      },

      defaults: { opacity: 0, duration: 1 },
      extendTimeline: true,
    });
  }, []);

  useGSAP(() => {
    if (boxRef.current)
      (gsap.effects as any).fade(boxRef.current, { opacity: 0.5, duration: 1 });
  });

  return (
    <div className="h-screen bg-zinc-900 p-4">
      <div className="size-20 rounded-md bg-teal-600" ref={boxRef}></div>
    </div>
  );
}
