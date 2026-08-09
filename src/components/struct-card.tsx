import { site, type StructField } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The "about me" block on the home page, rendered as a C++ struct.
 *
 * Tokens are coloured by hand rather than by a syntax highlighter — there are
 * six token kinds here, and pulling in Shiki to colour a fixed 12-line snippet
 * would ship a grammar and a theme to every visitor for no gain.
 */

const KEYWORD = "text-accent";
const TYPE = "text-accent-2";
const NAME = "text-foreground";
const STRING = "text-[#a86f44] dark:text-[#d9b08c]";
const PUNCT = "text-subtle";

function Value({ value }: { value: StructField["value"] }) {
  if (Array.isArray(value)) {
    return (
      <>
        <span className={PUNCT}>{"{"}</span>
        {value.map((item, i) => (
          <span key={item}>
            <span className={STRING}>&quot;{item}&quot;</span>
            {i < value.length - 1 && <span className={PUNCT}>, </span>}
          </span>
        ))}
        <span className={PUNCT}>{"}"}</span>
      </>
    );
  }
  return <span className={STRING}>&quot;{value}&quot;</span>;
}

export function StructCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border border-border bg-surface/70 shadow-card backdrop-blur-sm",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-subtle">faiyaj.hpp</span>
      </div>

      {/* The snippet is decorative for screen readers — the same facts are on
          the About page as real prose. */}
      <pre
        aria-hidden
        className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed md:p-6"
      >
        <code>
          <span className={KEYWORD}>struct</span> <span className={TYPE}>{site.structName}</span>{" "}
          <span className={PUNCT}>{"{"}</span>
          {"\n"}
          {site.structFields.map((field) => (
            <span key={field.name}>
              {"    "}
              <span className={TYPE}>{field.type}</span>{" "}
              <span className={NAME}>{field.name}</span>
              <span className={PUNCT}> = </span>
              <Value value={field.value} />
              <span className={PUNCT}>;</span>
              {"\n"}
            </span>
          ))}
          <span className={PUNCT}>{"};"}</span>
        </code>
      </pre>

      <p className="sr-only">
        {site.name} studies {site.structFields.find((f) => f.name === "major")?.value} at the
        University of Michigan, graduating May 2028. Based in {site.location}. Contact:{" "}
        {site.email}.
      </p>
    </div>
  );
}
