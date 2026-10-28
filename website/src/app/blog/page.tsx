import { Suspense } from "react";
import type { Metadata } from "next";

import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { PostList } from "@/features/blog/components/post-list";
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search";
import { PostSearchInput } from "@/features/blog/components/post-search-input";
import { getBlogPosts } from "@/features/blog/data";

export const metadata: Metadata = {
  title: "المدونة | أكاديمية سند",
  description: "قصص، ومحطات، وتجارب نتعلّمها في رحلتنا التعليمية والبرمجية في أكاديمية سند.",
};

export default function BlogPage() {
  const allPosts = getBlogPosts();

  return (
    <div className="w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20">
      <Container className="relative">
        <PageBreadcrumb items={[{ label: "المدونة" }]} />

        <div className="pt-10 sm:pt-12" dir="rtl">
          <div className="px-4 sm:px-6 pb-2.5 font-heading text-sm/none font-medium tracking-wider text-muted-foreground select-none">
            المدونة
          </div>

          <h1
            className="screen-line-top screen-line-bottom px-4 sm:px-6 py-5 sm:py-6 font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-foreground leading-snug sm:leading-[1.2] text-balance select-none"
          >
            قصص، ومحطات ملهمة، وتجارب نتعلّمها في رحلتنا.
          </h1>
        </div>

        <div className="h-4" />

        <div className="screen-line-top screen-line-bottom p-2 bg-card/10">
          <Suspense
            fallback={
              <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
            }
          >
            <PostSearchInput />
          </Suspense>
        </div>

        <Suspense fallback={<PostList posts={allPosts} />}>
          <PostListWithSearch posts={allPosts} />
        </Suspense>

        <div className="h-4" />
      </Container>
    </div>
  );
}
