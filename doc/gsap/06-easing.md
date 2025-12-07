# GSAP Easing

![GSAP Easing Functions](../seo/gsap-easing.jpg)

---

## What Is Easing?

**Easing** is the mathematical function that controls the **rate of change** during an animation. It determines how fast or slow different parts of your animation move.

Think of it like this:

- 🚗 A car starting from a stoplight — it accelerates gradually
- 🏀 A basketball bouncing — it decelerates at the top, speeds up on the way down
- 🚀 A rocket launching — starts slow, then exponentially faster

**Without easing**, animations feel robotic and lifeless. **With proper easing**, they feel natural, smooth, and professional.

---

## Why Easing Matters

### Without Easing (linear):

```tsx
gsap.to('.box', { x: 200, duration: 1, ease: 'none' });
// Moves at constant speed — feels mechanical 🤖
```

### With Easing:

```tsx
gsap.to('.box', { x: 200, duration: 1, ease: 'power2.out' });
// Starts fast, slows down naturally — feels alive ✨
```

### Real-World Impact:

- ✅ **UI feels responsive** — fast starts make interfaces snappy
- ✅ **Natural motion** — mimics real-world physics
- ✅ **Professional polish** — the difference between amateur and pro animations
- ✅ **User perception** — proper easing makes wait times feel shorter

---

## The Three Ease Types

Every ease in GSAP has three variations: `.in`, `.out`, and `.inOut`.

### Understanding the Types:

| Type     | Behavior              | Use Case                         |
| -------- | --------------------- | -------------------------------- |
| `.in`    | Start slow → end fast | Elements leaving the screen      |
| `.out`   | Start fast → end slow | Elements entering (most common!) |
| `.inOut` | Slow → fast → slow    | Back-and-forth, looping motions  |

### Visual Metaphors:

```tsx
// .in — like a heavy object falling (accelerates)
ease: 'power2.in';

// .out — like a rolling ball coming to a stop (decelerates)
ease: 'power2.out';

// .inOut — like a car accelerating then braking
ease: 'power2.inOut';
```

> 💡 **Pro Tip:** Use `.out` eases for UI transitions — they feel snappy because they start fast, making your interface feel responsive!

---

## Core Eases (Built-in)

GSAP includes these eases in the core — no extra imports needed:

### Power Eases (Most Common)

The "power" number indicates intensity:

| Ease     | Intensity | Feel                        |
| -------- | --------- | --------------------------- |
| `power1` | Subtle    | Gentle, barely noticeable   |
| `power2` | Moderate  | Natural, balanced (default) |
| `power3` | Strong    | Noticeable acceleration     |
| `power4` | Dramatic  | Very pronounced curve       |

```tsx
// Subtle entrance
gsap.from('.card', { y: 30, opacity: 0, ease: 'power1.out' });

// Standard UI transition (GSAP default)
gsap.from('.modal', { scale: 0.9, opacity: 0, ease: 'power2.out' });

// Dramatic hero animation
gsap.from('.hero', { y: 100, opacity: 0, ease: 'power3.out' });

// Impactful landing
gsap.from('.title', { y: 200, opacity: 0, ease: 'power4.out' });
```

### Other Core Eases

| Ease   | Character              | Best For                        |
| ------ | ---------------------- | ------------------------------- |
| `none` | Linear (no easing)     | Progress bars, scrub animations |
| `sine` | Very smooth, wave-like | Floating, breathing effects     |
| `circ` | Circular motion feel   | Rotation, arc movements         |
| `expo` | Extreme (exponential)  | Dramatic reveals, impacts       |

```tsx
// No easing (constant speed)
gsap.to('.progress', { width: '100%', ease: 'none' });

// Gentle wave motion
gsap.to('.float', { y: 20, ease: 'sine.inOut', repeat: -1, yoyo: true });

// Smooth circular
gsap.to('.rotate', { rotation: 360, ease: 'circ.out' });

// Dramatic entrance
gsap.from('.splash', { scale: 0, opacity: 0, ease: 'expo.out' });
```

---

## Expressive Eases (Special Effects)

These eases create unique motion that can't be achieved with CSS!

### `elastic` — Springy Overshoot

Creates a spring-like effect that **overshoots** and oscillates before settling.

```tsx
// Default elastic
gsap.to('.box', { scale: 1.2, ease: 'elastic.out(1, 0.3)' });
```

**Configuration:** `elastic.out(amplitude, period)`

- **amplitude** (default: 1) — how far it overshoots
- **period** (default: 0.3) — oscillation frequency (smaller = more wiggles)

```tsx
// Subtle spring
gsap.to('.btn', { scale: 1.1, ease: 'elastic.out(1, 0.5)' });

// Bouncy spring (more oscillation)
gsap.to('.ball', { y: 0, ease: 'elastic.out(1.2, 0.2)' });
```

### `back` — Anticipation / Overshoot

Pulls back before moving forward (anticipation) or overshoots the target.

```tsx
// Default back
gsap.from('.popup', { scale: 0, ease: 'back.out(1.7)' });
```

**Configuration:** `back.out(overshoot)`

- **overshoot** (default: 1.7) — how much it overshoots (1 = no overshoot)

```tsx
// Subtle overshoot
gsap.from('.card', { y: 50, ease: 'back.out(1.2)' });

// Dramatic overshoot
gsap.from('.hero', { scale: 0.5, ease: 'back.out(3)' });

// Anticipation (pulls back first)
gsap.to('.swing', { rotation: 45, ease: 'back.in(2)' });
```

### `bounce` — Bouncing Ball

Creates a natural bouncing effect — perfect for landing animations.

```tsx
// Ball dropping and bouncing
gsap.from('.ball', { y: -300, ease: 'bounce.out', duration: 1.5 });

// Notification popping in
gsap.from('.notification', { y: -50, ease: 'bounce.out' });
```

> ⚠️ **Note:** `bounce.in` starts with bounces (unusual), `bounce.out` ends with bounces (natural).

### `steps(n)` — Stepped Animation

Creates frame-by-frame animation effect — perfect for sprite animations.

```tsx
// 5-frame animation
gsap.to('.sprite', { backgroundPosition: '-500px 0', ease: 'steps(5)' });

// Clock second hand
gsap.to('.hand', {
  rotation: 360,
  ease: 'steps(12)',
  duration: 12,
  repeat: -1,
});
```

---

## Setting Default Eases

### Global Default

```tsx
// Change GSAP's default ease for all tweens
gsap.defaults({
  ease: 'power2.out',
  duration: 0.5,
});
```

### Timeline Default

```tsx
// Set defaults for a specific timeline
const tl = gsap.timeline({
  defaults: {
    ease: 'power3.out',
    duration: 0.8,
  },
});

tl.to('.box1', { x: 100 }) // Uses power3.out
  .to('.box2', { y: 50 }) // Uses power3.out
  .to('.box3', { scale: 1.2, ease: 'elastic.out' }); // Override with elastic
```

---

## Ease Selection Guide

### By Use Case:

| Animation Type      | Recommended Ease      |
| ------------------- | --------------------- |
| UI element entering | `power2.out`          |
| Modal appearing     | `back.out(1.7)`       |
| Page transitions    | `power3.inOut`        |
| Dropdown menu       | `power2.out`          |
| Loading spinner     | `none` (linear)       |
| Hover effects       | `power1.out`          |
| Landing impact      | `bounce.out`          |
| Button press        | `power2.out`          |
| Elastic feedback    | `elastic.out(1, 0.5)` |
| Scroll-linked       | `none`                |
| Looping/breathing   | `sine.inOut`          |
| Dramatic reveal     | `expo.out`            |

### Quick Decision Tree:

```
Should it feel...
├── Natural/smooth? → power2.out
├── Snappy/responsive? → power3.out or expo.out
├── Playful/bouncy? → back.out(1.7) or elastic.out
├── Physical/gravity? → bounce.out
├── Mechanical? → none or steps(n)
└── Dreamy/floaty? → sine.inOut
```

---

## Common Mistakes

### ❌ Using Linear for Everything

```tsx
// Feels robotic
gsap.to('.box', { x: 100, ease: 'none' });
```

### ✅ Add Appropriate Easing

```tsx
// Feels natural
gsap.to('.box', { x: 100, ease: 'power2.out' });
```

---

### ❌ Using `.in` for Entrances

```tsx
// Starts slow — feels sluggish
gsap.from('.card', { y: 50, ease: 'power2.in' });
```

### ✅ Use `.out` for Entrances

```tsx
// Starts fast — feels responsive
gsap.from('.card', { y: 50, ease: 'power2.out' });
```

---

### ❌ Overusing Expressive Eases

```tsx
// Too bouncy for UI elements
gsap.to('.submit-btn', { scale: 1.1, ease: 'elastic.out(2, 0.1)' });
```

### ✅ Reserve Bouncy Effects for Appropriate Elements

```tsx
// Subtle for UI
gsap.to('.submit-btn', { scale: 1.05, ease: 'power2.out' });

// Bouncy for playful elements
gsap.to('.mascot', { y: 0, ease: 'elastic.out(1, 0.3)' });
```

---

### ❌ Forgetting Configuration Values

```tsx
// Missing parameters — using defaults blindly
gsap.from('.box', { scale: 0, ease: 'elastic' });
```

### ✅ Explicitly Configure Special Eases

```tsx
// Clear and intentional
gsap.from('.box', { scale: 0, ease: 'elastic.out(1, 0.5)' });
```

---

## Best Practices

1. **Default to `power2.out`** — It's GSAP's default for a reason!

2. **Match ease to context** — UI = subtle, games/playful = expressive

3. **Use `.out` for entrances, `.in` for exits**

4. **Test with users** — What feels right to you might not feel right to users

5. **Consider duration + ease together** — Short durations need subtle eases

6. **Consistency matters** — Use the same ease family throughout your app

---

## Full Example

<details>
<summary>💻 Interactive Ease Showcase</summary>

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState } from 'react';

const easeExamples = [
  { name: 'power1.out', description: 'Subtle, gentle' },
  { name: 'power2.out', description: 'Natural, balanced' },
  { name: 'power3.out', description: 'Strong, noticeable' },
  { name: 'power4.out', description: 'Dramatic curve' },
  { name: 'back.out(1.7)', description: 'Playful overshoot' },
  { name: 'elastic.out(1, 0.3)', description: 'Springy bounce' },
  { name: 'bounce.out', description: 'Physical bounce' },
  { name: 'expo.out', description: 'Explosive start' },
];

export default function EaseShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEase, setActiveEase] = useState('power2.out');

  const runAnimation = (easeName: string) => {
    setActiveEase(easeName);

    // Reset and animate
    gsap.set('.demo-box', { x: 0 });
    gsap.to('.demo-box', {
      x: 300,
      duration: 1,
      ease: easeName,
    });
  };

  useGSAP(
    () => {
      // Initial animation
      gsap.from('.ease-btn', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-8 p-8">
      <h2 className="text-2xl font-bold">GSAP Ease Visualizer</h2>

      {/* Demo box */}
      <div className="relative h-20 w-full rounded-lg bg-gray-100">
        <div className="demo-box absolute top-1/2 left-4 h-12 w-12 -translate-y-1/2 rounded-lg bg-blue-500" />
      </div>

      {/* Current ease display */}
      <p className="text-center text-lg">
        Active:{' '}
        <code className="rounded bg-gray-200 px-2 py-1">{activeEase}</code>
      </p>

      {/* Ease buttons */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {easeExamples.map(ease => (
          <button
            key={ease.name}
            onClick={() => runAnimation(ease.name)}
            className={`ease-btn rounded-lg p-4 text-left transition-colors ${
              activeEase === ease.name
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-mono text-sm">{ease.name}</div>
            <div className="mt-1 text-xs opacity-70">{ease.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

</details>

---

## Extra Eases (EasePack Plugin)

These require importing from `gsap/EasePack`:

| Ease        | What It Does                  |
| ----------- | ----------------------------- |
| `slow`      | Slow motion in the middle     |
| `rough`     | Random jittery motion         |
| `expoScale` | Exponential scaling for scrub |

```tsx
import { EasePack } from 'gsap/EasePack';
gsap.registerPlugin(EasePack);

gsap.to('.box', { x: 100, ease: 'slow(0.7, 0.7, false)' });
```

---

## Custom Eases (CustomEase Plugin)

For complete control, create your own curves:

```tsx
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

// Create custom ease using SVG path syntax
CustomEase.create('myEase', 'M0,0 C0.25,0.1 0.25,1 1,1');

gsap.to('.box', { x: 100, ease: 'myEase' });
```

---

## Key Takeaways

- **Easing controls the feel** of your animation — it's the difference between amateur and professional
- **Three types:** `.in` (accelerate), `.out` (decelerate), `.inOut` (both)
- **Use `.out` for UI entrances** — fast starts feel responsive
- **Core eases:** `none`, `power1-4`, `sine`, `circ`, `expo`
- **Expressive eases:** `elastic`, `back`, `bounce`, `steps`
- **Match ease to context** — subtle for UI, expressive for playful elements
- **GSAP default is `power1.out`** — override with `gsap.defaults({ ease: 'power2.out' })`
- **Test your animations** — the "right" ease depends on context and user perception
