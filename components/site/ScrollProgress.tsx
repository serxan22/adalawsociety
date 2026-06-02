"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";

export function ScrollProgress() {
  const rawProgress = useMotionValue(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(rawProgress, {
    stiffness: 260,
    damping: 32,
    mass: 0.22,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    rawProgress.set(latest);
  });

  useEffect(() => {
    const updateProgress = () => {
      const scrollable =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      rawProgress.set(scrollable > 0 ? window.scrollY / scrollable : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [rawProgress]);

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-progress
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-als-red shadow-[0_0_16px_rgba(174,72,94,0.32)] md:h-1"
      style={{ scaleX }}
    />
  );
}
