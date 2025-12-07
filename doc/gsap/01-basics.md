# GSAP Basics: The `to()` Method

Learn the fundamentals of **GSAP** (GreenSock Animation Platform), starting with the most essential method: `gsap.to()`.

---

## What is GSAP?

GSAP is a powerhouse JavaScript library designed for creating smooth, performant animations. Whether you're building simple UI interactions or complex motion sequences, GSAP handles it with precision and speed.

### Why Choose GSAP?

- **Lightning-fast performance** — Optimized for smooth 60fps animations
- **Pixel-perfect control** — Animate any CSS or DOM property
- **Complete timeline management** — Build complex animation sequences
- **Universal compatibility** — Works across all modern browsers
- **Minimal learning curve** — Intuitive API design

---

## Installation

Install GSAP and the React hook:

```bash
npm install gsap @gsap/react
```

---

## The `to()` Method

**`gsap.to()`** animates elements **from their current state** to the values you specify.

- You define the **target** (end state)
- GSAP animates from wherever the element currently is
- Must set initial CSS state (like `opacity-0` in Tailwind) to control starting point

---

## Common Properties

| Property   | Description                     | Example              |
| ---------- | ------------------------------- | -------------------- |
| `opacity`  | Fade effects (0 to 1)           | `opacity: 1`         |
| `x`, `y`   | Position movement (pixels)      | `x: 100, y: 50`      |
| `scale`    | Size transformation             | `scale: 1.5`         |
| `rotation` | Rotate in degrees               | `rotation: 360`      |
| `duration` | Animation length in seconds     | `duration: 1`        |
| `ease`     | Timing function                 | `ease: 'power2.out'` |
| `delay`    | Wait before starting            | `delay: 0.5`         |
| `stagger`  | Delay between multiple elements | `stagger: 0.1`       |

---

## Basic Syntax

```tsx
gsap.to(target, {
  // Animation properties
  opacity: 1,
  x: 100,
  // Timing properties
  duration: 1,
  ease: 'power2.out',
});
```

---

## Full Example

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function FadeInCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power2.out',
    });
  });

  return (
    <div
      ref={cardRef}
      className="translate-y-20 rounded-lg bg-white p-6 opacity-0 shadow-lg"
    >
      <h2 className="text-lg font-semibold">Animated Card</h2>
      <p className="text-gray-600">Fades in and slides up smoothly!</p>
    </div>
  );
}
```

---

## Common Mistakes

- Forgetting to set initial CSS state (e.g., `opacity-0` in Tailwind) — GSAP animates FROM current state
- Not checking if `ref.current` exists before animating — can cause runtime errors
- Registering `useGSAP` as a plugin (`gsap.registerPlugin(useGSAP)`) — it's a React hook, not a plugin
- Missing cleanup in complex scenarios with multiple animations

---

## Best Practices

- Use `gsap.context()` for better cleanup in reusable components
- Set initial state in CSS/Tailwind to control the starting point
- Use easing functions like `power2.out`, `elastic.out` for smooth, professional motion
- Combine with `useGSAP` dependencies array for reactive animations

---

## Key Takeaways

- `gsap.to()` animates elements **from their current state** to target values
- Key props: `opacity`, `x`, `y`, `rotation`, `scale`, `duration`, `ease`, `delay`, `stagger`
- Works with refs in React — always check if ref exists before animating
- `useGSAP()` hook is the React-specific way to run GSAP animations with automatic cleanup
