import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow mb-6">404</p>
      <h1 className="font-display text-display-lg text-foreground">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-5 max-w-md text-lead text-muted">
        The link may be stale, or the page moved. The work is all still here.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          Back home
        </Link>
        <Link href="/projects" className={cn(buttonVariants({ variant: "outline" }))}>
          Browse work
        </Link>
      </div>
    </div>
  );
}
