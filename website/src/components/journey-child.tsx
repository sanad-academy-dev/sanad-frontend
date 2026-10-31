"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Container from "./container";
import { SectionHeader } from "@/components/ui/header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STATIONS = [
  {
    stationNumber: "01",
    label: "المحطة",
    title: "نكتشف نقطة البداية",
    description: "تقييم بسيط يوضح مستوى ابنك واهتماماته وطريقة تفكيره.",
  },
  {
    stationNumber: "02",
    label: "المحطة",
    title: "نختار المسار الأنسب",
    description: "نشرح لك لماذا هذا المسار مناسب، وما الذي سيتعلمه ابنك فيه.",
  },
  {
    stationNumber: "03",
    label: "المحطة",
    title: "يفهم ويجرّب",
    description: "يتعلم بالممارسة: فكرة واضحة، تجربة قصيرة، ثم تحدٍ يناسب مستواه.",
  },
  {
    stationNumber: "04",
    label: "المحطة",
    title: "يبني مشروعه",
    description: "يحوّل ما تعلّمه إلى منتج حقيقي يمكنه عرضه وشرحه بثقة.",
  },
  {
    stationNumber: "05",
    label: "المحطة",
    title: "نراجع التقدّم",
    description: "نقيس المهارات، ونشاركك نقاط القوة وما يحتاج إلى تطوير.",
  },
  {
    stationNumber: "06",
    label: "المحطة",
    title: "جاهز للمستوى التالي",
    description: "ينتقل للمستوى التالي بعد إتقان كامل أهداف المستوى وبناء مشروعه بثقة، لا لمجرد انتهاء الوقت.",
  },
];

export default function JourneyChild() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [stationWidth, setStationWidth] = useState<number | null>(null);

  const checkScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = Math.abs(el.scrollLeft);

    setCanScrollRight(current > 10);
    setCanScrollLeft(current < maxScroll - 10);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateWidth = () => {
      const w = el.clientWidth;
      if (w >= 768) {
        // Desktop: exactly 3 stations per view (2 views total for 6 stations)
        setStationWidth(w / 3);
      } else if (w >= 520) {
        // Tablet: exactly 2 stations per view (3 views total)
        setStationWidth(w / 2);
      } else {
        // Mobile: exactly 1 station per view with clean snap
        setStationWidth(w);
      }
      checkScroll();
    };

    updateWidth();
    el.addEventListener("scroll", checkScroll, { passive: true });

    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const handleScroll = (direction: "prev" | "next") => {
    const el = viewportRef.current;
    if (!el) return;
    const amount = stationWidth || (el.clientWidth >= 768 ? el.clientWidth / 3 : 320);
    // In RTL, scrolling left moves towards higher scroll offset (next stations)
    const delta = direction === "next" ? -amount : amount;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-background scroll-mt-16" id="journey">
      <Container className="relative z-10" dir="rtl">
        <SectionHeader
          title="رحلة الطالب"
          description="محطات تعليمية متتابعة ترافق ابنك من استكشاف شغفه الأولي حتى بناء مشاريعه التقنية وإتقانها بثقة."
          action={
            <TooltipProvider delayDuration={150}>
              <div className="flex items-center gap-1.5 sm:gap-2" dir="ltr">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleScroll("next")}
                      disabled={!canScrollLeft}
                      aria-label="المحطة التالية"
                      className="size-8.5 sm:size-9 rounded-2xl border border-line bg-secondary/80 hover:bg-secondary flex items-center justify-center text-foreground transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shadow-none"
                    >
                      <ArrowLeft className="size-4 sm:size-4.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="font-sans text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                    <p>المحطة التالية</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleScroll("prev")}
                      disabled={!canScrollRight}
                      aria-label="المحطة السابقة"
                      className="size-8.5 sm:size-9 rounded-2xl border border-line bg-secondary/80 hover:bg-secondary flex items-center justify-center text-foreground transition-all cursor-pointer disabled:opacity-25 disabled:pointer-events-none shadow-none"
                    >
                      <ArrowRight className="size-4 sm:size-4.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="font-sans text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none">
                    <p>المحطة السابقة</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          }
        />

        <div className="w-full relative overflow-hidden py-8 sm:py-10 px-4 sm:px-6" dir="rtl">
          <div
            ref={viewportRef}
            className="w-full overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar snap-x snap-mandatory"
          >
            <div className="relative flex w-max items-start py-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[3.75rem] h-0 border-t border-dashed border-line"
              />

              {STATIONS.map((station) => (
                <div
                  key={station.stationNumber}
                  style={{
                    width: stationWidth ? `${stationWidth}px` : undefined,
                  }}
                  className="relative shrink-0 w-[280px] sm:w-[325px] not-last:pe-6 sm:not-last:pe-8 text-right snap-start"
                >
                  <div className="flex flex-col text-right pb-3">
                    <span className="font-sans text-xs font-semibold text-muted-foreground/80 select-none">
                      {station.label}
                    </span>
                    <span className="text-sm font-mono font-bold text-foreground tabular-nums tracking-normal">
                      {station.stationNumber}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="absolute z-10 bg-line right-0 top-[3.75rem] h-3 w-[1.25px] -translate-y-1/2"
                  />

                  <div className="pt-4 text-right">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-foreground leading-snug tracking-normal">
                      {station.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-[13px] text-foreground/75 leading-relaxed mt-2 max-w-[280px] sm:max-w-[300px]">
                      {station.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
