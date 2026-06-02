"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  target?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

const variants = {
  primary: "bg-als-red text-white shadow-lg shadow-als-red/20 hover:bg-[#96384d]",
  secondary:
    "border border-white/25 bg-white/10 text-white backdrop-blur hover:border-white/50 hover:bg-white/[0.16]",
  ghost:
    "border border-als-line bg-white text-als-blue hover:border-als-red/[0.35] hover:bg-als-red/5",
};

export function MagneticButton({
  children,
  href,
  className,
  variant = "primary",
  target,
  type = "button",
  onClick,
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 16, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 16, mass: 0.3 });

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-als-red",
    variants[variant],
    className,
  );

  const inner = (
    <motion.span style={{ x: springX, y: springY }} className="inline-flex items-center gap-2">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={classes}
        onMouseMove={handleMove}
        onMouseLeave={reset}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
