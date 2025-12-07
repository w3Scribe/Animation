# GSAP fromTo() Method

![GSAP fromTo Method Control](../seo/gsap-fromto-method.jpg)

---

## Core Concept

**`gsap.fromTo()`** gives you **complete control** over both starting AND ending states.

- You define BOTH the FROM values and TO values
- Independent of current CSS state
- Perfect for predictable, repeatable animations

---

## Syntax

```tsx
gsap.fromTo(
  target,
  {
    /* FROM values */
  },
  {
    /* TO values + timing props */
  }
);
```

**Critical:** `duration`, `ease`, `stagger` go in the **second object** (toVars)!

---

## When to Use Each Method

| Method     | Best For                                 | CSS Dependency |
| ---------- | ---------------------------------------- | -------------- |
| `to()`     | Simple animations from current state     | Depends on CSS |
| `from()`   | Entrance animations, visible by default  | Depends on CSS |
| `fromTo()` | Full control, loops, complex transitions | Independent    |

---

## Important Notes

- Both objects are **required** — can't skip fromVars or toVars
- Timing props (`duration`, `ease`) go in **toVars** (second object)
- Animation ignores current CSS completely
- Great for hover effects and modal transitions

---

## Code Example

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function FromToAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.card',
        {
          // FROM: starting state
          opacity: 0,
          scale: 0.8,
          y: 100,
        },
        {
          // TO: ending state (timing here!)
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
          stagger: 0.15,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="grid gap-6 p-8">
      <div className="card rounded-xl bg-indigo-500 p-8 text-white">Card 1</div>
      <div className="card rounded-xl bg-pink-500 p-8 text-white">Card 2</div>
      <div className="card rounded-xl bg-cyan-500 p-8 text-white">Card 3</div>
    </div>
  );
}
```

---

## Common Mistakes

- Putting `duration` or `ease` in the first object (`fromVars`) — they belong in `toVars`
- Forgetting one of the two required objects — both `fromVars` and `toVars` are mandatory
- Not using `{ scope: ref }` when targeting class-based selectors
- Expecting CSS values to affect the animation — `fromTo()` overrides everything

---

## Best Practices

- Use `fromTo()` when you need predictable, repeatable animations regardless of CSS state
- Great for hover effects, looping animations, and modal transitions
- Combine with fun easing like `back.out(1.7)` for playful bouncy effects
- Use `stagger` for sequential reveals of multiple elements
- Always scope animations to avoid affecting elements outside your component

---

## Key Takeaways

- `gsap.fromTo()` gives you **complete control** over both starting and ending animation states
- Syntax: `gsap.fromTo(target, fromVars, toVars)` — two objects define FROM and TO values
- Independent of current CSS — animation ignores element's initial state completely
- Timing props (`duration`, `ease`, `stagger`) go in the **second object** (`toVars`)
- Perfect for complex transitions, loops, and animations requiring precise control
