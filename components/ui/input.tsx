import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-input bg-navy-900/60 px-4 py-2 text-sm text-pearl placeholder:text-chrome-dim shadow-sm transition-colors outline-none",
        "focus-visible:border-aurora focus-visible:ring-2 focus-visible:ring-aurora/30 focus-visible:shadow-[0_0_20px_-6px_var(--sky-blue)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
