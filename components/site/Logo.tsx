"use client";

import Link from "next/link";
import { Scale } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

export function Logo({ className, markClassName, textClassName }: LogoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-als-line bg-white shadow-sm",
          markClassName,
        )}
      >
        {!failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/als-logo.png"
            alt="ADA Law Society logo"
            className="h-full w-full object-contain p-1.5"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-als-blue text-white">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </span>
      <span className={cn("text-base font-bold text-als-blue", textClassName)}>
        ADA Law Society
      </span>
    </Link>
  );
}
