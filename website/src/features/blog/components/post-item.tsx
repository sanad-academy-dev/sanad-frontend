import type { ImageProps } from "next/image";
import Image from "next/image";
import Link from "next/link";

import type { BlogPost } from "../types";

type HeadingTypes = "h2" | "h3" | "h4";

export function PostItem({
  post,
  headingAs,
  imageLoading = "lazy",
}: {
  post: BlogPost;
  headingAs?: HeadingTypes;
  imageLoading?: ImageProps["loading"];
}) {
  const Heading = headingAs ?? "h2";

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group/post relative flex h-full flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-secondary/40 select-none">
      {post.image && (
        <div className="relative select-none rounded-xl overflow-hidden">
          <Image
            className="aspect-1200/630 w-full object-cover rounded-xl grayscale transition-[filter,transform] duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] group-hover/post:grayscale-0 group-hover/post:scale-[1.01]"
            src={post.image}
            alt={post.title}
            width={1200}
            height={630}
            quality={95}
            loading={imageLoading}
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/15 dark:ring-white/15" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <Heading
          dir="auto"
          className="text-base sm:text-lg/snug font-medium text-balance leading-snug group-hover/post:text-primary transition-colors text-right rtl:text-right ltr:text-left"
        >
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>

          {(post.new || post.updated) && (
            <span className="pointer-events-none mx-2 inline-block size-2 -translate-y-px rounded-full bg-blue-500">
              <span className="sr-only">
                {post.new ? "(جديد)" : "(محدّث)"}
              </span>
            </span>
          )}
        </Heading>

        <p
          dir="auto"
          className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed text-right rtl:text-right ltr:text-left"
        >
          {post.description}
        </p>

        <dl className="mt-1 flex items-center gap-2 text-xs text-muted-foreground/80 font-mono">
          <dt className="sr-only">نُشر بتاريخ</dt>
          <dd>
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {formattedDate}
            </time>
          </dd>
          {post.readTime && (
            <>
              <span className="text-line">•</span>
              <dd>{post.readTime}</dd>
            </>
          )}
          {post.category && (
            <>
              <span className="text-line">•</span>
              <dd className="text-foreground/70 font-sans">{post.category}</dd>
            </>
          )}
        </dl>
      </div>
    </article>
  );
}
