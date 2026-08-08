import * as React from "react";

import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-border bg-surface/50 px-4 py-3 text-[0.9375rem] text-foreground placeholder:text-subtle transition-colors duration-200 hover:border-border-strong focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:opacity-50 aria-[invalid=true]:border-red-500/70";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-36 resize-y", className)} {...props} />;
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-2 block text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-red-500">
      {children}
    </p>
  );
}
