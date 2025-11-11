'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';


gsap.registerPlugin(useGSAP)

// 1️⃣ Define interface for better type safety & reusability
interface SpinnerEffectVars extends gsap.TweenVars {
  isInfinite?: boolean;
}

// 2️⃣ Register effect at module scope (runs once)
gsap.registerEffect({
  name: 'spinner',
  effect: (target: gsap.TweenTarget, config: SpinnerEffectVars = {}) => {
    // 3️⃣ Use gsap.TweenTarget (supports string selectors, arrays, etc.)
    return gsap.to(target, {
      ...config,
      repeat: config.isInfinite ? -1 : 0,
      yoyo: config.isInfinite ?? false, // 4️⃣ Fix typo: yo → yoyo
      ease: 'linear',
    });
  },
  defaults: { isInfinite: true, duration: 1, rotate: 360 },
  extendTimeline: true,
});

// 5️⃣ Optional: Augment types for IntelliSense (add to types/gsap-effects.d.ts)
declare module 'gsap' {
  interface GSAPEffects {
    spinner(
      target: gsap.TweenTarget,
      vars?: SpinnerEffectVars
    ): gsap.core.Tween;
  }
}

export default function Page() {
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 6️⃣ Remove null check (useGSAP scope handles it)
      gsap.effects.spinner(boxRef.current!, { isInfinite: false });
    },
    { scope: boxRef } // 7️⃣ Add scope for better cleanup
  );

  return (
    <div className="h-screen bg-zinc-900 p-4">
      <div
        ref={boxRef}
        className="grid size-32 place-items-center rounded-md bg-amber-500 font-bold text-black"
      >
        Spinner
      </div>
    </div>
  );
}
