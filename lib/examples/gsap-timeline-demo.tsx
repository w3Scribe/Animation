'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export type DemoProps = {
  code: string;
  runKey: number; // increment to trigger re-run
};

export const GsapTimelineDemo: React.FC<DemoProps> = ({ runKey }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        defaults: { duration: 0.6, ease: 'power2.out' },
      });

      tl.to('.box1', { x: 120, rotate: 360 })
        .to('.box2', { x: 120, rotate: -360 }, '-=0.3')
        .to('.box3', { x: 120, rotate: 360 }, '-=0.3')
        .to('.box1', { y: 40, scale: 1.2 }, '+=0.2')
        .to('.box2', { y: -40, scale: 0.8 }, '<')
        .to('.box3', { y: 40, scale: 1.2 }, '<')
        .to(['.box1', '.box2', '.box3'], {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          stagger: 0.1,
          duration: 0.5,
        });
    },
    { scope: containerRef, dependencies: [runKey] }
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      contextRef.current?.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full min-h-[200px] items-center justify-center gap-6"
    >
      <div className="box1 h-12 w-12 rounded-lg bg-violet-500 shadow-lg shadow-violet-500/30" />
      <div className="box2 h-12 w-12 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/30" />
      <div className="box3 h-12 w-12 rounded-lg bg-sky-500 shadow-lg shadow-sky-500/30" />
    </div>
  );
};

export default GsapTimelineDemo;
