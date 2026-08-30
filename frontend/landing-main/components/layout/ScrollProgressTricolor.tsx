import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressTricolor() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[5px] bg-black/5 pointer-events-none overflow-hidden select-none"
    >
      {/* Official Indian Flag Tiranga Progress Line: Saffron (#FF671F) -> White (#FFFFFF) -> India Green (#046A38) */}
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] shadow-[0_1px_8px_rgba(255,103,31,0.4)] border-b border-black/10"
        style={{ scaleX }}
      />
    </div>
  );
}
