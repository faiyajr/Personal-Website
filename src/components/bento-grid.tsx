import { cn } from "@/lib/utils";

/**
 * Editorial bento grid. Six columns from `md` up so cards can take 2/3/4/6 —
 * that is what produces the broken, non-uniform rhythm rather than a plain
 * 3-across gallery. Single column on mobile, always.
 */
export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5 lg:gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
