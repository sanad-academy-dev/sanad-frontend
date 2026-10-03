import { Bookmark, Clock, GraduationCap, Share2, Star, Video } from "lucide-react";

import Container from "@/components/container";

// بانر صفحة تفاصيل الدورة — Frame 144 من التصميم

const TRIANGLES = [
  { x: 20, y: 30, s: 1.0, o: 0.22, r: 0 },
  { x: 60, y: 18, s: 0.8, o: 0.16, r: 30 },
  { x: 95, y: 45, s: 1.1, o: 0.26, r: 180 },
  { x: 35, y: 75, s: 0.9, o: 0.2, r: 90 },
  { x: 80, y: 90, s: 1.0, o: 0.22, r: 200 },
  { x: 130, y: 35, s: 0.7, o: 0.14, r: 150 },
  { x: 150, y: 70, s: 1.0, o: 0.2, r: 20 },
  { x: 110, y: 110, s: 0.8, o: 0.16, r: 240 },
  { x: 50, y: 125, s: 1.1, o: 0.24, r: 60 },
  { x: 165, y: 120, s: 0.9, o: 0.18, r: 300 },
];

function Decor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={className} fill="none">
      {TRIANGLES.map((t, i) => (
        <path
          key={i}
          d="M6 0L12 11H0Z"
          fill="white"
          fillOpacity={t.o}
          transform={`translate(${t.x} ${t.y}) rotate(${t.r}) scale(${t.s})`}
        />
      ))}
    </svg>
  );
}

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-base text-white">
      <Icon className="size-5 shrink-0" />
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

export default function CourseDetailsHero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#360092_20%,#7C3AED_104%)]">
      <Decor className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rotate-12" />
      <Decor className="pointer-events-none absolute -bottom-12 right-10 h-72 w-72 -rotate-12" />

      <Container className="relative z-10 py-12">
        <div className="flex items-start justify-between gap-6">
          {/* المحتوى — يمين */}
          <div className="flex flex-col items-end gap-5 text-right">
            <h1 className="text-3xl font-bold primarysm:text-4xl lg:text-[40px]">
              دورة تطوير مواقع الويب
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              انطلق في عالم تطوير الويب واصنع مواقع احترافية من الصفر، تعلّم HTML
              وCSS وJavaScript خطوة بخطوة 🚀
            </p>
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3 pt-2">
              <MetaItem icon={Clock}>20 ساعة</MetaItem>
              <MetaItem icon={Video}>12 محاضرة</MetaItem>
              <MetaItem icon={GraduationCap}>للمبتدئين</MetaItem>
              <div className="flex items-center gap-2">
                <span className="text-base text-white">( 215.624 )</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </span>
                <span className="text-base font-medium text-white">4.5</span>
              </div>
            </div>
          </div>

          {/* أزرار — يسار */}
          <div className="flex shrink-0 flex-col gap-3">
            <button
              type="button"
              aria-label="حفظ الدورة"
              className="flex size-11 items-center justify-center rounded-full bg-card/10 primarybackdrop-blur-sm transition-colors hover:bg-card/20"
            >
              <Bookmark className="size-5" />
            </button>
            <button
              type="button"
              aria-label="مشاركة"
              className="flex size-11 items-center justify-center rounded-full bg-card/10 primarybackdrop-blur-sm transition-colors hover:bg-card/20"
            >
              <Share2 className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
