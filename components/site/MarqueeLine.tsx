import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeLineProps = {
  items: ReactNode[];
  className?: string;
};

export function MarqueeLine({ items, className }: MarqueeLineProps) {
  const loopItems = [...items, ...items];

  return (
    <section
      aria-label="ADA Law Society editorial themes"
      data-marquee-line
      className={cn(
        "overflow-hidden border-y border-white/15 bg-white/[0.08] py-3 shadow-[0_12px_40px_rgba(16,24,40,0.12)] backdrop-blur",
        className,
      )}
    >
      <div className="marquee-mask">
        <div className="marquee-line-track flex w-max items-center gap-5 whitespace-nowrap">
          {loopItems.map((item, index) => (
            <span key={index} className="inline-flex items-center gap-5">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-white/88 md:text-sm">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-als-red" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
