import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui-style button. Kept dependency-free (no Radix Slot) — when you need
 * a link that looks like a button, use `buttonVariants` on an <a> or <Link>.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:opacity-90 active:scale-[0.98]",
        accent:
          "bg-accent text-accent-foreground hover:brightness-110 active:scale-[0.98]",
        outline:
          "border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-surface",
        ghost: "text-muted hover:bg-surface hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm [&_svg]:size-4",
        md: "h-11 px-6 text-[0.9375rem] [&_svg]:size-4",
        lg: "h-13 px-8 text-base [&_svg]:size-[1.125rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
