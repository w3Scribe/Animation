# GSAP from() Method

![GSAP from Method Animation](../seo/gsap-from-method.jpg)

---

## Core Concept

**`gsap.from()`** animates elements **from the values you specify** to their **current state** (opposite of `to()`).

- You define the **starting** state
- GSAP animates TO the element's current CSS state
- No need to hide elements initially — they stay visible

---

## Key Differences from to()

| Method   | Direction           | Initial CSS Needed?         |
| -------- | ------------------- | --------------------------- |
| `to()`   | Current → Target    | Yes (set starting state)    |
| `from()` | Specified → Current | No (uses current as target) |

---

## Common Properties

- `opacity` — Fade in from invisible
- `y`, `x` — Slide from offset position
- `scale` — Grow from smaller/larger size
- `rotation` — Spin in from rotated state
- `duration` — Animation length in seconds
- `ease` — Timing function (`power3.out`, `back.out`, etc.)
- `stagger` — Delay between multiple elements

---

## Important Notes

- **Don't set hidden state** in CSS when using `from()` — defeats the purpose
- Better for SEO/accessibility — content visible even if JS fails
- Must use `{ scope: ref }` when targeting class-based selectors
- Elements are already in their final position/state

---

## Code Example

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function StaggeredCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.card', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {/* Cards visible in CSS - no opacity-0! */}
      <div className="card rounded-md bg-amber-500 p-6 text-white">Card 1</div>
      <div className="card rounded-md bg-rose-500 p-6 text-white">Card 2</div>
      <div className="card rounded-md bg-teal-500 p-6 text-white">Card 3</div>
    </div>
  );
}
```

---

## Common Mistakes

- Setting initial hidden state (`opacity-0`) when using `from()` — defeats the purpose
- Forgetting to scope animations with `{ scope: ref }` when targeting class names
- Confusing `from()` with `to()` — remember: `from()` = "come FROM this position"
- Not checking if ref exists before running animation

---

## Best Practices

- Use `from()` when you want elements to be visible by default (better for SEO/accessibility)
- Scope animations to avoid targeting elements outside your component
- Combine with `stagger` for sequential entrance animations
- Use meaningful class names (`.card`, `.item`) for multi-element animations

---

## Key Takeaways

- `gsap.from()` animates elements **from the values you specify** to their **current state**
- This is the **opposite** of `to()` — you define where animation starts, GSAP animates to current CSS
- No need to set initial hidden state in CSS — elements remain visible in their final state
- Use `{ scope: ref }` to target class-based selectors within a specific container
- Best practice for entrance animations and SEO-friendly content
