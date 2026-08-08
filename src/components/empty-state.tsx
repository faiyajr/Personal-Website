import { FolderOpen } from "lucide-react";

/**
 * Rendered when `content/projects/` has no publishable entries yet, so a
 * fresh clone still builds and looks intentional instead of showing a void.
 */
export function EmptyState({
  title = "No projects published yet",
  hint = "Add an .mdx file to content/projects/ — copy _TEMPLATE.mdx to get the frontmatter right.",
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-border-strong px-6 py-20 text-center">
      <FolderOpen className="mx-auto mb-4 size-6 text-subtle" strokeWidth={1.5} />
      <p className="font-display text-2xl text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{hint}</p>
    </div>
  );
}
