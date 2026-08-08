import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";

/** Components available inside every case-study `.mdx` body. */
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const external = /^https?:\/\//.test(href);
    if (external) {
      return (
        <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  },
  // Markdown `![alt](/images/x.png)` becomes an optimised, lazy-loaded image.
  img: ({ src = "", alt = "" }) => (
    <Image
      src={String(src)}
      alt={alt}
      width={1600}
      height={900}
      sizes="(min-width: 768px) 720px, 100vw"
      className="h-auto w-full rounded-card border border-border"
    />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-case">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
