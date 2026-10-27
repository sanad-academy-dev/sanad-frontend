"use client";

import { Bookmark, Clock, GraduationCap, Share2, Star, Video, Award } from "lucide-react";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";

export default function CourseDetailsHero() {
  return (
    <section className="relative overflow-hidden bg-card/10 screen-line-bottom" dir="rtl">
      <DotGridSpotlight />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-3.5 text-right flex-1">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold tracking-tight text-foreground leading-snug sm:leading-tight text-balance">
              كورس بايثون والبرمجة النصية للأطفال
            </h1>

            <p className="max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-muted-foreground">
              انطلق في عالم البرمجة الحقيقية خطوة بخطوة؛ تعلّم أساسيات لغة Python، التفكير الخوارزمي، وحل المشكلات وصناعة ألعاب وتطبيقات تفاعلية متكاملة.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-3 mt-1 border-t border-line/60 text-xs font-mono">
              <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1 text-foreground">
                <Clock className="size-3.5 text-primary" />
                <span>24 ساعة تطبيقية</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1 text-foreground">
                <Video className="size-3.5 text-primary" />
                <span>18 محاضرة</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1 text-foreground">
                <GraduationCap className="size-3.5 text-primary" />
                <span>مستوى مبتدئ</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1 text-foreground">
                <Award className="size-3.5 text-primary" />
                <span>شهادة معتمدة</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1">
                <Star className="size-3 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-yellow-600 dark:text-yellow-400">4.9</span>
                <span className="text-muted-foreground">(342 تقييم)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:flex-col sm:gap-2.5 self-start shrink-0">
            <button
              type="button"
              aria-label="حفظ الكورس"
              className="flex size-9 items-center justify-center rounded-lg border border-line bg-background/80 backdrop-blur-md text-foreground transition-all hover:bg-secondary hover:text-primary hover:border-primary/50 cursor-pointer shadow-none"
              title="حفظ الكورس"
            >
              <Bookmark className="size-4" />
            </button>
            <button
              type="button"
              aria-label="مشاركة الكورس"
              className="flex size-9 items-center justify-center rounded-lg border border-line bg-background/80 backdrop-blur-md text-foreground transition-all hover:bg-secondary hover:text-primary hover:border-primary/50 cursor-pointer shadow-none"
              title="مشاركة"
            >
              <Share2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
