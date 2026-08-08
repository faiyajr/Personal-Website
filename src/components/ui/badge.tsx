import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-mono text-[0.6875rem] tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-surface/60 text-muted",
        accent: "border-transparent bg-accent-soft text-accent",
        outline: "border-border-strong bg-transparent text-muted",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-2.5 py-1",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
