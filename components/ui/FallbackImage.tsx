"use client";

import { ImageIcon, Scale } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FallbackImageProps = {
  src?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  label?: string;
};

export function FallbackImage({
  src,
  alt,
  className,
  imageClassName,
  label,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(!src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-white/10 bg-als-blue",
        className,
      )}
    >
      {!failed && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("h-full w-full object-cover", imageClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#3F6076_0%,#2F4C60_45%,#AE485E_100%)] p-6 text-center text-white">
          <div className="absolute inset-0 hero-grid opacity-50" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Scale className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="relative max-w-44 text-sm font-semibold">
            {label || "ADA Law Society"}
          </div>
          <ImageIcon className="relative h-4 w-4 text-white/[0.55]" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
