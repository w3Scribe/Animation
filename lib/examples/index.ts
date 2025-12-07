import type { ComponentType } from 'react';

export type DemoProps = {
  code: string;
  runKey: number;
};

export type ExampleConfig = {
  id: string;
  title: string;
  description?: string;
  initialCode: string;
  Demo: ComponentType<DemoProps>;
};

// Lazy load demo components to avoid loading all demos upfront
import { FramerMotionBasicDemo } from './framer-motion-demo';
import { GsapTimelineDemo } from './gsap-timeline-demo';

export const EXAMPLES: Record<string, ExampleConfig> = {
  'gsap-timeline-basic': {
    id: 'gsap-timeline-basic',
    title: 'Basic GSAP Timeline',
    description:
      'A timeline sequences multiple animations with precise timing control.',
    initialCode: `import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

function TimelineDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Create a timeline with default settings
    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: 'power2.out' }
    });

    // Chain animations with position parameters
    tl.to('.box1', { x: 120, rotate: 360 })
      .to('.box2', { x: 120, rotate: -360 }, '-=0.3')  // overlap by 0.3s
      .to('.box3', { x: 120, rotate: 360 }, '-=0.3')
      .to('.box1', { y: 40, scale: 1.2 }, '+=0.2')     // gap of 0.2s
      .to('.box2', { y: -40, scale: 0.8 }, '<')        // same start time
      .to('.box3', { y: 40, scale: 1.2 }, '<')
      .to(['.box1', '.box2', '.box3'], {
        x: 0, y: 0, scale: 1, rotate: 0,
        stagger: 0.1,
        duration: 0.5
      });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex gap-4">
      <div className="box1 w-12 h-12 bg-violet-500 rounded-lg" />
      <div className="box2 w-12 h-12 bg-emerald-500 rounded-lg" />
      <div className="box3 w-12 h-12 bg-sky-500 rounded-lg" />
    </div>
  );
}`,
    Demo: GsapTimelineDemo,
  },

  'framer-motion-basic': {
    id: 'framer-motion-basic',
    title: 'Framer Motion Basics',
    description:
      'Declarative animations with variants, stagger, and gesture handlers.',
    initialCode: `import { motion, AnimatePresence } from 'motion/react';

function MotionDemo() {
  return (
    <motion.div
      className="flex gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      {['violet', 'emerald', 'sky'].map((color) => (
        <motion.div
          key={color}
          className={\`w-12 h-12 rounded-lg bg-\${color}-500\`}
          variants={{
            hidden: { opacity: 0, y: 40, scale: 0.8 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
              }
            }
          }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        />
      ))}
    </motion.div>
  );
}`,
    Demo: FramerMotionBasicDemo,
  },
};

export function getExample(id: string): ExampleConfig | undefined {
  return EXAMPLES[id];
}

export function hasExample(id: string): boolean {
  return id in EXAMPLES;
}
