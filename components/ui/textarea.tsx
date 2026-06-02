import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-lg border border-als-line bg-white px-4 py-3 text-sm text-als-blue shadow-sm transition placeholder:text-als-muted/75 focus:border-als-red focus:outline-none focus:ring-4 focus:ring-als-red/10",
        className,
      )}
      {...props}
    />
  );
}
