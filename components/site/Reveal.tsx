"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
  headingLevel = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  className?: string;
  headingLevel?: "h1" | "h2";
}) {
  const HeadingTag = headingLevel;

  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-als-red">{eyebrow}</p>
      ) : null}
      <HeadingTag className="text-3xl font-bold leading-tight text-als-blue md:text-4xl">
        {title}
      </HeadingTag>
      {text ? <p className="mt-4 text-base leading-7 text-als-muted md:text-lg">{text}</p> : null}
    </Reveal>
  );
}
