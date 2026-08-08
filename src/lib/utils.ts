import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number | [number, number]) {
  return Array.isArray(year) ? `${year[0]}—${year[1]}` : String(year);
}

/** Strip protocol and trailing slash so links read as `github.com/user/repo`. */
export function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
