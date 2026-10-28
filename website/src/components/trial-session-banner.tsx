"use client";

import { ArrowLeft, Sparkles, Coffee, MapPin, Clock } from "lucide-react";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";
import { openTrialAssessmentModal } from "@/components/trial-modal";
import { cn } from "@/lib/utils";

export default function TrialSessionBanner({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-card/60 backdrop-blur-sm p-5 sm:p-7 lg:p-8 selection:bg-primary/20",
        className
      )}
      dir="rtl"
    >
      <DotGridSpotlight />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          <h3 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-normal text-foreground leading-tight">
            احضر حصة تجريبية قبل أن تقرر.
          </h3>

          <p className="font-sans text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-xl">
            احجز جلسة تجريبية مجانية في أي أسبوع من الفصل الدراسي، أو تفضل بزيارة ورشتنا المفتوحة — أبوابنا ومقاعدنا جاهزة دائماً لاستقبال المبدعين الصغار وتجربة الشغف العملي بأنفسهم.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={() => openTrialAssessmentModal()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-sans text-xs sm:text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-none cursor-pointer group select-none"
            >
              <span>قيم ابنك</span>
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          <div className="pt-2 font-sans text-xs font-medium text-muted-foreground/85 flex flex-wrap items-center gap-x-2.5 gap-y-1 select-none">
            <span>الأعمار <strong className="font-mono font-bold text-foreground">7-16</strong> سنة</span>
            <span className="text-line">•</span>
            <span>جلسة <strong className="font-mono font-bold text-foreground">45</strong> دقيقة</span>
            <span className="text-line">•</span>
            <span>لا تتطلب أي أدوات</span>
            <span className="text-line">•</span>
            <span className="font-bold text-emerald-500">مجانية <strong className="font-mono font-bold">100%</strong></span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-xl border border-line bg-background/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="font-sans text-[11px] font-bold uppercase tracking-normal text-primary">
                الورشة المفتوحة • OPEN WORKSHOP
              </span>
              <Sparkles className="size-3.5 text-primary" />
            </div>

            <div className="pt-3">
              <h4 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-normal">
                أول سبت من كل شهر
              </h4>
              <p className="font-sans text-xs text-foreground/80 mt-1 leading-relaxed">
                جلسة مفتوحة للآباء والأبناء للتعرف على المدربين، تجربة الأجهزة، والاطلاع على مشاريع الطلاب السابقة.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-dashed border-line pt-3 font-sans text-xs font-medium text-muted-foreground/90">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-primary shrink-0" />
                  <span><strong className="font-mono font-semibold text-foreground">11:00</strong> صباحاً – <strong className="font-mono font-semibold text-foreground">1:00</strong> ظهراً</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>المقر الرئيسي والفروع المعتمدة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="size-3.5 text-primary shrink-0" />
                  <span>ضيافة خفيفة وأنشطة تفاعلية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
