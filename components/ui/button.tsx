import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 outline-none focus-visible:ring-2 focus-visible:ring-aurora focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-paper-fixed shadow-[0_8px_20px_-6px_rgba(20,13,5,0.5)] hover:shadow-[0_10px_30px_-6px_rgba(20,13,5,0.55),0_0_28px_-4px_var(--sky-blue)] hover:-translate-y-0.5",
        secondary:
          "bg-lavender text-ink-fixed shadow-[0_6px_16px_-6px_rgba(20,13,5,0.4)] hover:brightness-110 hover:-translate-y-0.5",
        outline:
          "border border-chrome/30 bg-transparent text-pearl hover:border-aurora hover:text-aurora hover:shadow-[0_0_16px_-4px_var(--sky-blue)]",
        ghost: "bg-transparent text-pearl hover:bg-white/5",
        glass:
          "glass-panel text-pearl hover:border-aurora/50 hover:shadow-[0_0_20px_-6px_var(--sky-blue)]",
        link: "text-aurora underline-offset-4 hover:underline",
        destructive: "bg-destructive text-white hover:brightness-110",
      },
      size: {
        default: "h-11 px-6 py-2 has-[>svg]:px-5",
        sm: "h-9 rounded-full px-4 text-xs has-[>svg]:px-3",
        lg: "h-13 rounded-full px-8 text-base has-[>svg]:px-6",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
