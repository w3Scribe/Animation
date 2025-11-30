# 📚 My Learning Journey

---

## 📚 Reference: useGSAP Hook & Context

### 🧠 Core Concept

**`useGSAP` context** is GSAP's React integration that creates a **scoped animation context**. It gives you:

- **`context.selector`**: A scoped query function that only finds elements inside your component
- **`context.revert()`**: Automatic cleanup that kills all animations/tweens created in the context
- **`{ scope: ref }`**: Tells GSAP which element to scope animations to

Think of it as **sandboxing your animations** — they stay isolated to your component and clean up automatically when the component unmounts.

---

### 🔑 Why Use Context?

**❌ Without Context (manual queries, no cleanup):**

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

**✅ With Context (scoped, auto-cleanup):**

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

**Benefits:**

- ✅ Scoped queries — only selects elements inside your ref
- ✅ Automatic cleanup — `ctx.revert()` kills everything
- ✅ No cross-component pollution — animations stay isolated
- ✅ SSR-safe — works with React's lifecycle
- ✅ Cleaner code — no manual `querySelector` or `killTweensOf`

---

### 📐 Basic Syntax

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

### 🎯 `context.selector` Explained

**What it does:**

- Returns a **scoped selector function** that queries only inside the scoped ref
- Similar to `ref.current.querySelectorAll()`, but GSAP-managed
- Automatically cleaned up when `context.revert()` is called

**Syntax:**

```tsx
const q = context.selector!;
const title = q('.heroTitle')[0]; // First match
const cards = q('.card'); // Array of all matches
```

**Important:**

- `q('.class')` returns an **array** of elements (like `querySelectorAll`)
- For a single element, use `q('.class')[0]`
- Always guard with `if (!element) return;` to avoid null errors

---

### 🕐 When to Use Context

| Scenario                       | Use Context? | Why                                  |
| ------------------------------ | ------------ | ------------------------------------ |
| Animating multiple class-based | ✅ Yes       | `context.selector` scopes queries    |
| Single ref animation           | Optional     | Can just use `ref.current`           |
| Component with many animations | ✅ Yes       | Single `context.revert()` cleans all |
| Reusable component             | ✅ Yes       | Prevents cross-component conflicts   |
| Timeline with multiple targets | ✅ Yes       | Cleaner to scope all queries         |
| SSR (Next.js, Remix)           | ✅ Yes       | React-safe lifecycle                 |

---

### 🔄 Context Cleanup

**Why it matters:**

- Animations continue running even after a component unmounts (memory leak)
- GSAP tweens reference DOM nodes (prevents garbage collection)
- `context.revert()` kills all tweens, timelines, and selectors created in the context

**Pattern:**

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

### ⚠️ Watch Out For

- **Don't forget `{ scope: ref }`** — without it, `context.selector` won't work correctly
- **`context.selector` returns an array** — use `[0]` for single elements
- **Always add cleanup** — return `() => ctx.revert()` from the callback
- **Guard against null** — check if elements exist before animating
- **Don't use `document.querySelector` inside context** — defeats the purpose of scoping

---

### 🆚 Context vs Manual Queries

| Feature          | Manual Queries        | Context                 |
| ---------------- | --------------------- | ----------------------- |
| Scoping          | Global (whole page)   | Local (scoped ref)      |
| Cleanup          | Manual `killTweensOf` | Auto `context.revert()` |
| SSR Safety       | Can break             | React-safe              |
| Multi-component  | Risk of conflicts     | Isolated                |
| Code cleanliness | Verbose               | Clean                   |

---

### 💻 Full Example

<details>
<summary>Hero animation with context and cleanup</summary>

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

</details>

---

### 🎓 Key Takeaways

- **`useGSAP((ctx) => {...}, { scope: ref })`** creates a scoped animation context
- **`ctx.selector`** queries elements only inside the scoped ref
- **`ctx.revert()`** kills all animations and cleans up automatically
- Always return `() => ctx.revert()` from the callback for proper cleanup
- Use context whenever you have multiple animations or class-based selectors
- Context prevents cross-component conflicts and memory leaks

---

## 📚 Reference: GSAP `to()` Method

### 🧠 Core Concept

**`gsap.to()`** animates elements **from their current state** to the values you specify.

- You define the **target** (end state)
- GSAP animates from wherever the element currently is
- Must set initial CSS state (like `opacity-0` in Tailwind) to control starting point

### 🎯 Common Properties

- **`opacity`**: Fade effects (0 to 1)
- **`x`, `y`**: Position movement (pixels)
- **`scale`**: Size transformation (0 to 1+)
- **`rotation`**: Rotate in degrees
- **`duration`**: Animation length in seconds
- **`ease`**: Timing function (`power2.out`, `elastic.out`, etc.)
- **`delay`**: Wait before starting
- **`stagger`**: Delay between multiple elements

### ⚠️ Important Notes

- Always check if `ref.current` exists before animating
- Set initial state in CSS/Tailwind (e.g., `opacity-0 translate-y-20`)
- `useGSAP()` is a React hook, NOT a plugin (don't register it)
- Use `gsap.context()` for cleanup in complex scenarios

### 💻 Code Example

<details>
<summary>Basic fade-in animation</summary>

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

</details>

---

## 📚 Reference: GSAP `from()` Method

### 🧠 Core Concept

**`gsap.from()`** animates elements **from the values you specify** to their **current state** (opposite of `to()`).

- You define the **starting** state
- GSAP animates TO the element's current CSS state
- No need to hide elements initially — they stay visible

### 🎯 Key Differences from `to()`

| Method   | Direction           | Initial CSS Needed?            |
| -------- | ------------------- | ------------------------------ |
| `to()`   | Current → Target    | ✅ Yes (set starting state)    |
| `from()` | Specified → Current | ❌ No (uses current as target) |

### ⚠️ Important Notes

- **Don't set hidden state** in CSS when using `from()` — defeats the purpose
- Better for SEO/accessibility — content visible even if JS fails
- Must use `{ scope: ref }` when targeting class-based selectors
- Elements are already in their final position/state

### 💻 Code Example

<details>
<summary>Staggered card entrance</summary>

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

</details>

---

## 📚 Reference: GSAP `fromTo()` Method

### 🧠 Core Concept

**`gsap.fromTo()`** gives you **complete control** over both starting AND ending states.

- You define BOTH the FROM values and TO values
- Independent of current CSS state
- Perfect for predictable, repeatable animations

### 🎯 Syntax

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

### 🆚 When to Use Each Method

| Method     | Best For                                 | CSS Dependency |
| ---------- | ---------------------------------------- | -------------- |
| `to()`     | Simple animations from current state     | Depends on CSS |
| `from()`   | Entrance animations, visible by default  | Depends on CSS |
| `fromTo()` | Full control, loops, complex transitions | Independent    |

### ⚠️ Important Notes

- Both objects are **required** — can't skip fromVars or toVars
- Timing props (`duration`, `ease`) go in **toVars** (second object)
- Animation ignores current CSS completely
- Great for hover effects and modal transitions

### 💻 Code Example

<details>
<summary>Zoom and slide animation</summary>

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

</details>

---

## 📚 Reference: GSAP Timeline Method

### 🧠 What Is It?

A **timeline** is a powerful container that lets you **sequence multiple animations** in order, with precise control over timing and synchronization.

Think of it like a **movie director's timeline**:

- 🎬 Each animation is a scene
- ⏱️ You control when each scene starts
- 🔄 You can pause, reverse, or restart the entire sequence
- 🎭 Everything stays perfectly synchronized

---

### 🔑 Why Use Timelines?

**❌ Without Timeline (messy):**

```tsx
gsap.to(box1, { x: 100, duration: 1 });
gsap.to(box2, { x: 100, duration: 1, delay: 1 }); // Manual delay
gsap.to(box3, { x: 100, duration: 1, delay: 2 }); // More manual delays
```

**✅ With Timeline (clean):**

```tsx
const tl = gsap.timeline();
tl.to(box1, { x: 100, duration: 1 })
  .to(box2, { x: 100, duration: 1 }) // Automatically after box1
  .to(box3, { x: 100, duration: 1 }); // Automatically after box2
```

**Benefits:**

- ✅ Sequential animations — no manual delay calculations
- ✅ Easy to control — pause, play, reverse the entire sequence
- ✅ Cleaner code — method chaining for readability
- ✅ Precise timing — position labels, relative timing
- ✅ Reusable — create once, replay anytime

---

### 📐 Basic Syntax

```tsx
// Create timeline
const tl = gsap.timeline();

// Add animations (they play one after another)
tl.to(element1, { x: 100, duration: 1 })
  .to(element2, { y: 50, duration: 1 })
  .to(element3, { rotation: 360, duration: 1 });
```

**Each animation waits for the previous one to finish!** ⏱️

---

### 🎯 Timeline Options

```tsx
const tl = gsap.timeline({
  repeat: 2, // Repeat entire sequence
  yoyo: true, // Reverse on repeat
  repeatDelay: 1, // Wait 1s between repeats
  paused: true, // Start paused (trigger manually)
  onComplete: () => {}, // Callback when sequence ends
});
```

---

### 🕐 Position Parameter (Advanced Timing)

Control **when** an animation starts in the timeline:

```tsx
const tl = gsap.timeline();

tl.to(box1, { x: 100, duration: 1 })
  .to(box2, { x: 100, duration: 1 }, '<') // Start WITH previous
  .to(box3, { x: 100, duration: 1 }, '-=0.5') // Start 0.5s before previous ends
  .to(box4, { x: 100, duration: 1 }, '+=0.5'); // Start 0.5s after previous ends
```

| Position  | Meaning                               |
| --------- | ------------------------------------- |
| _(none)_  | After previous animation              |
| `"<"`     | Start WITH previous animation         |
| `"-=0.5"` | Start 0.5s **before** previous ends   |
| `"+=0.5"` | Start 0.5s **after** previous ends    |
| `"1"`     | Start at exactly 1 second on timeline |

---

### 🎬 Timeline Control Methods

```tsx
const tl = gsap.timeline();

tl.play(); // Play from current position
tl.pause(); // Pause timeline
tl.reverse(); // Play backwards
tl.restart(); // Start from beginning
tl.seek(2); // Jump to 2 seconds
tl.progress(0.5); // Jump to 50% complete
```

Perfect for **interactive animations** triggered by buttons! 🎮

---

### 🔄 Common Patterns

**Pattern 1: Staggered Card Entrance**

```tsx
const tl = gsap.timeline();
tl.from('.card', {
  opacity: 0,
  y: 50,
  duration: 0.5,
  stagger: 0.2, // Works in timelines too!
});
```

**Pattern 2: Synchronized Elements**

```tsx
const tl = gsap.timeline();
tl.to('.title', { opacity: 1, y: 0, duration: 1 })
  .to('.subtitle', { opacity: 1, duration: 0.5 }, '<0.3') // Start 0.3s into title
  .to('.button', { scale: 1, duration: 0.5 });
```

**Pattern 3: Looping Background Animation**

```tsx
const tl = gsap.timeline({ repeat: -1, yoyo: true });
tl.to('.bg', { scale: 1.1, duration: 3, ease: 'power1.inOut' });
```

---

### ⚠️ Watch Out For

- **Timeline doesn't auto-cleanup** — use `tl.kill()` in component unmount if needed
- **Position parameter is optional** — default is "after previous"
- **Each `.to()`, `.from()`, `.fromTo()` returns the timeline** — that's why chaining works!
- **Timeline defaults:** `{paused: false}` — starts immediately

---

### 🆚 Timeline vs Individual Tweens

| Feature     | Individual Tweens | Timeline       |
| ----------- | ----------------- | -------------- |
| Sequential  | Manual delays     | Automatic      |
| Control     | Each separately   | All together   |
| Readability | Can get messy     | Clean chaining |
| Timing sync | Hard to maintain  | Easy           |

---

### 💻 Full Example

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

export default function TimelineAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Create timeline with options
      const tl = gsap.timeline({
        repeat: -1, // Infinite loop
        yoyo: true, // Reverse animation
        repeatDelay: 0.5, // Pause between loops
      });

      // Add animations sequentially
      tl.to('.box1', {
        x: 200,
        rotation: 360,
        duration: 1,
        ease: 'power2.inOut',
      })
        .to('.box2', {
          x: 200,
          scale: 1.5,
          duration: 1,
          ease: 'back.out(1.7)',
        })
        .to('.box3', {
          x: 200,
          y: -50,
          duration: 1,
          ease: 'elastic.out(1, 0.3)',
        });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="grid h-screen place-items-center gap-8">
      <div className="box1 h-20 w-20 rounded-lg bg-red-500"></div>
      <div className="box2 h-20 w-20 rounded-lg bg-blue-500"></div>
      <div className="box3 h-20 w-20 rounded-lg bg-green-500"></div>
    </div>
  );
}
```

---

## ✔️ Topic Completed: GSAP `fromTo()` Method

### 🔹 Key Concept 🧠

- **`gsap.fromTo()`** gives you **complete control** over both starting and ending animation states.
- Syntax: `gsap.fromTo(target, fromVars, toVars)` — two objects define FROM and TO values.
- Independent of current CSS — animation ignores element's initial state completely.
- Timing props (`duration`, `ease`, `stagger`) go in the **second object** (`toVars`).
- Perfect for complex transitions, loops, and animations requiring precise control.

### 🔹 Common Mistakes ⚠️

- Putting `duration` or `ease` in the first object (`fromVars`) — they belong in `toVars`.
- Forgetting one of the two required objects — both `fromVars` and `toVars` are mandatory.
- Not using `{ scope: ref }` when targeting class-based selectors.
- Expecting CSS values to affect the animation — `fromTo()` overrides everything.

### 🔹 Improvements / Best Practices ✅

- Use `fromTo()` when you need predictable, repeatable animations regardless of CSS state.
- Great for hover effects, looping animations, and modal transitions.
- Combine with fun easing like `back.out(1.7)` for playful bouncy effects.
- Use `stagger` for sequential reveals of multiple elements.
- Always scope animations to avoid affecting elements outside your component.

### 🔹 Mini Example 💡

<details>
<summary>Click to view code</summary>

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
          // TO: ending state (with timing props)
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

</details>

---

## ✔️ Topic Completed: GSAP `from()` Method

### 🔹 Key Concept 🧠

- **`gsap.from()`** animates elements **from the values you specify** to their **current state**.
- This is the **opposite** of `to()` — you define where animation starts, GSAP animates to current CSS.
- Key props: `opacity`, `y`, `x`, `scale`, `rotation`, `duration`, `ease`, `stagger`.
- No need to set initial hidden state in CSS — elements remain visible in their final state.
- Use `{ scope: ref }` to target class-based selectors within a specific container.

### 🔹 Common Mistakes ⚠️

- Setting initial hidden state (`opacity-0`) when using `from()` — defeats the purpose.
- Forgetting to scope animations with `{ scope: ref }` when targeting class names.
- Confusing `from()` with `to()` — remember: `from()` = "come FROM this position".
- Not checking if ref exists before running animation.

### 🔹 Improvements / Best Practices ✅

- Use `from()` when you want elements to be visible by default (better for SEO/accessibility).
- Scope animations to avoid targeting elements outside your component.
- Combine with `stagger` for sequential entrance animations.
- Use meaningful class names (`.card`, `.item`) for multi-element animations.

### 🔹 Mini Example 💡

<details>
<summary>Click to view code</summary>

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
      {/* Cards are visible in CSS - no opacity-0 needed! */}
      <div className="card rounded-md bg-amber-500 p-6 text-white">
        Card One
      </div>
      <div className="card rounded-md bg-rose-500 p-6 text-white">Card Two</div>
      <div className="card rounded-md bg-teal-500 p-6 text-white">
        Card Three
      </div>
    </div>
  );
}
```

</details>

---

## ✔️ Topic Completed: GSAP `to()` Method

### 🔹 Key Concept 🧠

- **`gsap.to()`** animates elements **from their current state** to the values you specify.
- Key props: `opacity`, `x`, `y`, `rotation`, `scale`, `duration`, `ease`, `delay`, `stagger`.
- Works with refs in React — always check if ref exists before animating.
- `useGSAP()` hook is the React-specific way to run GSAP animations with automatic cleanup.

### 🔹 Common Mistakes ⚠️

- Forgetting to set initial CSS state (e.g., `opacity-0` in Tailwind) — GSAP animates FROM current state.
- Not checking if `ref.current` exists before animating — can cause runtime errors.
- Registering `useGSAP` as a plugin (`gsap.registerPlugin(useGSAP)`) — it's a React hook, not a plugin.
- Missing cleanup in complex scenarios with multiple animations or component unmounting.

### 🔹 Improvements / Best Practices ✅

- Use `gsap.context()` for better cleanup in reusable components:
  ```tsx
  const ctx = gsap.context(() => {
    /* animations */
  });
  return () => ctx.revert();
  ```
- Set initial state in CSS/Tailwind to control the starting point.
- Use easing functions like `power2.out`, `elastic.out` for smooth, professional motion.
- Combine with `useGSAP` dependencies array for reactive animations.

### 🔹 Mini Example 💡

<details>
<summary>Click to view code</summary>

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

</details>

---
