# useGSAP Hook & Context

![useGSAP Hook React Integration](../seo/gsap-usegasap-hook.jpg)

---

## Core Concept

**`useGSAP`** context is GSAP's React integration that creates a **scoped animation context**. It gives you:

- **`context.selector`**: A scoped query function that only finds elements inside your component
- **`context.revert()`**: Automatic cleanup that kills all animations/tweens created in the context
- **`{ scope: ref }`**: Tells GSAP which element to scope animations to

Think of it as **sandboxing your animations** — they stay isolated to your component and clean up automatically when the component unmounts.

---

## Why Use Context?

### Without Context (manual queries, no cleanup):

```tsx
useEffect(() => {
  const title = document.querySelector('.heroTitle'); // Global query
  const buttons = document.querySelectorAll('.heroButton'); // Can select wrong elements

  gsap.from(title, { y: 50, opacity: 0 });
  gsap.from(buttons, { y: 20, opacity: 0, stagger: 0.1 });

  // ⚠️ Need manual cleanup
  return () => {
    gsap.killTweensOf(title);
    gsap.killTweensOf(buttons);
  };
}, []);
```

### With Context (scoped, auto-cleanup):

```tsx
useGSAP(
  ctx => {
    const q = ctx.selector!; // Scoped to heroSectionRef
    const title = q('.heroTitle')[0];
    const buttons = q('.heroButton');

    gsap.from(title, { y: 50, opacity: 0 });
    gsap.from(buttons, { y: 20, opacity: 0, stagger: 0.1 });

    return () => ctx.revert(); // ✅ Kills all animations in this context
  },
  { scope: heroSectionRef }
);
```

### Benefits:

- ✅ **Scoped queries** — Only selects elements inside your ref
- ✅ **Automatic cleanup** — `ctx.revert()` kills everything
- ✅ **No cross-component pollution** — Animations stay isolated
- ✅ **SSR-safe** — Works with React's lifecycle
- ✅ **Cleaner code** — No manual `querySelector` or `killTweensOf`

---

## Basic Syntax

```tsx
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(
  context => {
    // context.selector = scoped query function
    const q = context.selector!;
    const elements = q('.className'); // Only inside containerRef

    gsap.from(elements, { opacity: 0, y: 50, stagger: 0.2 });

    return () => context.revert(); // Cleanup
  },
  { scope: containerRef } // Scope to this ref
);
```

---

## context.selector Explained

### What it does:

- Returns a **scoped selector function** that queries only inside the scoped ref
- Similar to `ref.current.querySelectorAll()`, but GSAP-managed
- Automatically cleaned up when `context.revert()` is called

### Syntax:

```tsx
const q = context.selector!;
const title = q('.heroTitle')[0]; // First match
const cards = q('.card'); // Array of all matches
```

### Important:

- `q('.class')` returns an **array** of elements (like `querySelectorAll`)
- For a single element, use `q('.class')[0]`
- Always guard with `if (!element) return;` to avoid null errors

---

## When to Use Context

| Scenario                       | Use Context? | Why                                  |
| ------------------------------ | ------------ | ------------------------------------ |
| Animating multiple class-based | ✅ Yes       | `context.selector` scopes queries    |
| Single ref animation           | Optional     | Can just use `ref.current`           |
| Component with many animations | ✅ Yes       | Single `context.revert()` cleans all |
| Reusable component             | ✅ Yes       | Prevents cross-component conflicts   |
| Timeline with multiple targets | ✅ Yes       | Cleaner to scope all queries         |
| SSR (Next.js, Remix)           | ✅ Yes       | React-safe lifecycle                 |

---

## Context Cleanup

### Why it matters:

- Animations continue running even after a component unmounts (memory leak)
- GSAP tweens reference DOM nodes (prevents garbage collection)
- `context.revert()` kills all tweens, timelines, and selectors created in the context

### Pattern:

```tsx
useGSAP(
  ctx => {
    // Your animations here
    gsap.from('.card', { opacity: 0, y: 50 });

    return () => ctx.revert(); // ✅ Cleanup on unmount
  },
  { scope: containerRef }
);
```

---

## Watch Out For

- **Don't forget `{ scope: ref }`** — without it, `context.selector` won't work correctly
- **`context.selector` returns an array** — use `[0]` for single elements
- **Always add cleanup** — return `() => ctx.revert()` from the callback
- **Guard against null** — check if elements exist before animating
- **Don't use `document.querySelector` inside context** — defeats the purpose of scoping

---

## Context vs Manual Queries

| Feature          | Manual Queries        | Context                 |
| ---------------- | --------------------- | ----------------------- |
| Scoping          | Global (whole page)   | Local (scoped ref)      |
| Cleanup          | Manual `killTweensOf` | Auto `context.revert()` |
| SSR Safety       | Can break             | React-safe              |
| Multi-component  | Risk of conflicts     | Isolated                |
| Code cleanliness | Verbose               | Clean                   |

---

## Full Example

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    ctx => {
      // Scoped selector (only inside heroRef)
      const q = ctx.selector!;
      const title = q('.heroTitle')[0];
      const subtitle = q('.heroSubtitle')[0];
      const buttons = q('.heroButton');

      // Guard against null
      if (!title || !subtitle || buttons.length < 2) return;

      // Create and store timeline
      const tl = gsap.timeline({
        defaults: { y: 50, opacity: 0, duration: 0.7, ease: 'power2.inOut' },
      });

      tl.from(title, {})
        .from(subtitle, {}, '<0.3')
        .from(buttons[0], {}, '+=0.1')
        .from(buttons[1], {}, '<');

      timelineRef.current = tl;

      // Cleanup: revert kills all animations in this context
      return () => ctx.revert();
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="flex h-screen flex-col items-center justify-center gap-4"
    >
      <h1 className="heroTitle text-5xl font-bold">Welcome</h1>
      <p className="heroSubtitle text-xl text-gray-600">
        Your journey starts here
      </p>
      <div className="flex gap-4">
        <button className="heroButton rounded-md bg-blue-600 px-6 py-3 text-white">
          Get Started
        </button>
        <button className="heroButton rounded-md bg-gray-200 px-6 py-3 text-gray-800">
          Learn More
        </button>
      </div>
    </section>
  );
}
```

---

## Key Takeaways

- **`useGSAP((ctx) => {...}, { scope: ref })`** creates a scoped animation context
- **`ctx.selector`** queries elements only inside the scoped ref
- **`ctx.revert()`** kills all animations and cleans up automatically
- Always return `() => ctx.revert()` from the callback for proper cleanup
- Use context whenever you have multiple animations or class-based selectors
- Context prevents cross-component conflicts and memory leaks
