# GSAP Timeline Method

---

## What Is It?

A **timeline** is a powerful container that lets you **sequence multiple animations** in order, with precise control over timing and synchronization.

Think of it like a **movie director's timeline**:

- 🎬 Each animation is a scene
- ⏱️ You control when each scene starts
- 🔄 You can pause, reverse, or restart the entire sequence
- 🎭 Everything stays perfectly synchronized

---

## Why Use Timelines?

### Without Timeline (messy):

```tsx
gsap.to(box1, { x: 100, duration: 1 });
gsap.to(box2, { x: 100, duration: 1, delay: 1 }); // Manual delay
gsap.to(box3, { x: 100, duration: 1, delay: 2 }); // More manual delays
```

### With Timeline (clean):

```tsx
const tl = gsap.timeline();
tl.to(box1, { x: 100, duration: 1 })
  .to(box2, { x: 100, duration: 1 }) // Automatically after box1
  .to(box3, { x: 100, duration: 1 }); // Automatically after box2
```

### Benefits:

- ✅ Sequential animations — no manual delay calculations
- ✅ Easy to control — pause, play, reverse the entire sequence
- ✅ Cleaner code — method chaining for readability
- ✅ Precise timing — position labels, relative timing
- ✅ Reusable — create once, replay anytime

---

## Basic Syntax

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

## Timeline Options

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

## Position Parameter (Advanced Timing)

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

## Timeline Control Methods

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

## Common Patterns

### Pattern 1: Staggered Card Entrance

```tsx
const tl = gsap.timeline();
tl.from('.card', {
  opacity: 0,
  y: 50,
  duration: 0.5,
  stagger: 0.2, // Works in timelines too!
});
```

### Pattern 2: Synchronized Elements

```tsx
const tl = gsap.timeline();
tl.to('.title', { opacity: 1, y: 0, duration: 1 })
  .to('.subtitle', { opacity: 1, duration: 0.5 }, '<0.3') // Start 0.3s into title
  .to('.button', { scale: 1, duration: 0.5 });
```

### Pattern 3: Looping Background Animation

```tsx
const tl = gsap.timeline({ repeat: -1, yoyo: true });
tl.to('.bg', { scale: 1.1, duration: 3, ease: 'power1.inOut' });
```

---

## Watch Out For

- **Timeline doesn't auto-cleanup** — use `tl.kill()` in component unmount if needed
- **Position parameter is optional** — default is "after previous"
- **Each `.to()`, `.from()`, `.fromTo()` returns the timeline** — that's why chaining works!
- **Timeline defaults:** `{paused: false}` — starts immediately

---

## Timeline vs Individual Tweens

| Feature     | Individual Tweens | Timeline       |
| ----------- | ----------------- | -------------- |
| Sequential  | Manual delays     | Automatic      |
| Control     | Each separately   | All together   |
| Readability | Can get messy     | Clean chaining |
| Timing sync | Hard to maintain  | Easy           |

---

## Full Example

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

## Key Takeaways

- **`gsap.timeline()`** creates a container for sequenced animations
- Animations play one after another — no manual delay calculations needed
- Use **position parameters** (`<`, `-=0.5`, `+=0.5`) for precise timing control
- Control methods: `play()`, `pause()`, `reverse()`, `restart()`, `seek()`
- Great for complex sequences, interactive animations, and coordinated motion
- Always use `{ scope: ref }` when targeting class-based selectors in React

```

```
