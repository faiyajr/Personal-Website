"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      // `resolvedTheme` is undefined during SSR and the first client render.
      // Reading it inside the handler — rather than during render — means the
      // markup is identical on both sides, so there is nothing to mismatch.
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle colour theme"
      className="grid size-9 place-items-center rounded-full border border-border text-muted transition-colors duration-200 hover:border-border-strong hover:text-foreground"
    >
      {/* Both icons render; CSS picks one off the `dark` class on <html>. That
          avoids the mount-flag dance and the flash of the wrong icon. */}
      <Sun className="hidden size-4 dark:block" strokeWidth={1.75} />
      <Moon className="size-4 dark:hidden" strokeWidth={1.75} />
    </button>
  );
}
