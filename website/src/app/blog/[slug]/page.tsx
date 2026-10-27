import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { getBlogPosts, getPostBySlug } from "@/features/blog/data";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="min-h-screen pt-14 pb-20 bg-background" dir="rtl">
      <Container className="relative">
        {/* Standardized Breadcrumb Navigation */}
        <PageBreadcrumb
          items={[
            { label: "المدونة", href: "/blog" },
            { label: post.title },
          ]}
          extra={
            post.category ? (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground bg-secondary/70 border border-line px-2.5 py-0.5 rounded-md">
                <Tag className="size-3" />
                <span>{post.category}</span>
              </span>
            ) : undefined
          }
        />

        {/* Header with Title and Metadata */}
        <header className="px-4 sm:px-8 py-8 sm:py-12 border-b border-line">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance leading-snug mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formattedDate}
              </time>
            </span>

            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{post.readTime}</span>
              </span>
            )}

            {post.author && (
              <span className="flex items-center gap-1.5 font-sans">
                <User className="size-3.5" />
                <span>{post.author}</span>
              </span>
            )}
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.image && (
          <div className="p-4 sm:p-8 border-b border-line bg-card/20">
            <div className="relative overflow-hidden rounded-xl border border-line">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full aspect-1200/630 object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Article Body */}
        <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6 text-foreground leading-relaxed text-sm sm:text-base">
          <p className="text-base sm:text-lg font-medium text-foreground/90 leading-relaxed border-r-2 border-primary pr-4">
            {post.description}
          </p>

          <div className="h-px w-full bg-line my-6" />

          <p className="text-muted-foreground leading-relaxed">
            تعتبر هذه المقالة جزءاً من سلسلة المبادرات والمقالات التقنية والتعليمية المقدمة من أكاديمية سند، بهدف تمكين الطلاب والمعلمين وأولياء الأمور من أحدث المعارف في البرمجة، والذكاء الاصطناعي، وهندسة البرمجيات.
          </p>

          <div className="rounded-xl border border-dashed border-line bg-secondary/30 p-5 mt-8">
            <h3 className="font-heading font-semibold text-foreground text-sm sm:text-base mb-2">
              تابع جديد المدونة
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              يتم تحديث هذه المدونة بانتظام بالمقالات الهندسية والتربوية المتخصصة لتزويدك بأفضل الأفكار والممارسات التعليمية.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="border-t border-line p-4 sm:p-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            <span>تصفح جميع المقالات</span>
          </Link>
        </footer>
      </Container>
    </article>
  );
}
