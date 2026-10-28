import { cn } from "@/lib/utils";
import type { BlogPost } from "../types";
import { PostItem } from "./post-item";

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="relative pt-4">
      <div className="pointer-events-none absolute inset-0 z-0 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-e border-line" />
        <div className="border-s border-line" />
      </div>

      <ul className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className={cn(
              "max-sm:screen-line-top max-sm:screen-line-bottom",
              "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
            )}
          >
            <PostItem
              post={post}
              imageLoading={index <= 3 ? "eager" : "lazy"}
            />
          </li>
        ))}

        {posts.length === 0 && (
          <li className="screen-line-top screen-line-bottom p-8 sm:col-span-2 text-center" dir="rtl">
            <p className="font-mono text-sm text-muted-foreground select-none">
              لا توجد مقالات مطابقة لبحثك في المدونة.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}
