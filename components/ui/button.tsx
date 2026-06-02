import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-als-red text-white shadow-sm hover:bg-[#96384d] focus-visible:outline-als-red",
        secondary:
          "border border-als-line bg-white text-als-blue hover:border-als-red/40 hover:bg-als-red/5 focus-visible:outline-als-red",
        ghost:
          "bg-transparent text-als-blue hover:bg-als-blue/5 focus-visible:outline-als-red",
        navy:
          "bg-als-blue text-white shadow-sm hover:bg-als-ink focus-visible:outline-als-blue",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
