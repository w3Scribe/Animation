# Framer Motion: Introduction

![Framer Motion React Animations](../seo/framer-motion-introduction.jpg)

Master smooth animations with Framer Motion, the React animation library built on principles of physics and simplicity.

---

## Why Framer Motion?

Framer Motion brings the simplicity of Framer to React. Create animations with less code and more power.

**Advantages:**

- ✨ React-first design
- 🎪 Gesture support
- 🎬 Variants system
- 🏎️ Optimized performance

---

## Installation

```bash
npm install framer-motion
```

---

## Basic Animation

```jsx interactive="framer-motion-basic"
import { motion } from 'framer-motion';

export default function Box() {
  return (
    <motion.div
      animate={{ x: 100, rotate: 360 }}
      transition={{ duration: 0.8 }}
      className="h-20 w-20 rounded bg-blue-500"
    />
  );
}
```

---

## Transition Options

Control your animations with these options:

```tsx
transition={{
  duration: 0.8,      // Length of animation
  delay: 0.2,         // Start delay
  ease: 'easeInOut',  // Easing function
  repeat: 2,          // Number of repeats
  yoyo: true,         // Reverse animation
}}
```

Start creating beautiful animations! 🎨
