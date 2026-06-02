import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-als-red/20 bg-als-red/10 text-als-red",
        navy: "border-als-blue/15 bg-als-blue/[0.08] text-als-blue",
        light: "border-white/20 bg-white/10 text-white",
        gold: "border-als-blue-light/80 bg-als-blue-light/60 text-als-blue-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
