"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Exploded,
  Keyboard,
  Phosphor,
  Turntable,
} from "@lucasmarkes/hairline/react";
import { motion, type Transition } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import { cn } from "@/lib/utils";
import { openTrialAssessmentModal } from "@/components/trial-modal";

const CAMPS = [
  {
    id: "01",
    title: "Coding Camp",
    desc: "من الفكرة إلى أول برنامج",
    animation: Keyboard,
  },
  {
    id: "02",
    title: "AI Camp",
    desc: "اصنع تجربة ذكية وتطبيقات تفاعلية",
    animation: Phosphor,
  },
  {
    id: "03",
    title: "Robotics Camp",
    desc: "برمج شيئًا يتحرك وتصل بالإلكترونيات",
    animation: Turntable,
  },
  {
    id: "04",
    title: "Future Tech Camp",
    desc: "اكتشف تقنيات المستقبل وبناء الألعاب",
    animation: Exploded,
  },
];

const ICON_STROKE_WIDTH = 2.5;

const PAUSE_ICON = {
  left: "M5.5 5.5L8.5 5.5L8.5 18.5L5.5 18.5Z",
  right: "M15.5 5.5L18.5 5.5L18.5 18.5L15.5 18.5Z",
} as const;

const PLAY_ICON = {
  left: "M7.5 5.87L13 9.08L13 14.92L7.5 18.13Z",
  right: "M13 9.08L18.01 12L18.01 12L13 14.92Z",
} as const;

const ICON_TRANSITION: Transition = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0,
};

const AUTOPLAY_DURATION = 4000;

export default function CourseCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container || isAnimatingRef.current) return;

    const cRect = container.getBoundingClientRect();
    const cCenter = cRect.left + cRect.width / 2;

    let minDiff = Infinity;
    let closestIndex = 0;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const diff = Math.abs(cardCenter - cCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const scrollToCamp = useCallback((index: number) => {
    const container = scrollRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    isAnimatingRef.current = true;
    container.toggleAttribute("data-animating", true);

    const cRect = container.getBoundingClientRect();
    const cCenter = cRect.left + cRect.width / 2;
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const delta = cardCenter - cCenter;

    container.scrollBy({
      left: delta,
      behavior: "smooth",
    });

    setActiveIndex(index);

    setTimeout(() => {
      isAnimatingRef.current = false;
      container?.toggleAttribute("data-animating", false);
    }, 450);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(updateActiveIndex, 60);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [updateActiveIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      const next = (activeIndex + 1) % CAMPS.length;
      scrollToCamp(next);
    }, AUTOPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, scrollToCamp]);

  return (
    <section className="w-full bg-background relative overflow-hidden scroll-mt-16" id="bootcamps">
      <Container>
        <SectionHeader
          title="معسكرات سَنَد"
          description="معسكرات تدريبية مكثفة مصممة لتسريع المهارات التطبيقية وبناء مشاريع واقعية."
          action={
            <button
              type="button"
              onClick={() => openTrialAssessmentModal()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-secondary/60 px-3.5 text-xs font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group cursor-pointer shadow-none"
            >
              <span>اعرف المعسكر المناسب</span>
              <ArrowUpLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          }
        />

        <div className="relative py-2 sm:py-3">
          <div
            ref={scrollRef}
            dir="rtl"
            className="flex gap-3 sm:gap-4.5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-6 py-2 data-animating:snap-none"
          >
            {CAMPS.map((camp, idx) => (
              <div
                key={camp.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="shrink-0 snap-center w-[295px] sm:w-[325px] md:w-[350px] lg:w-[370px]"
              >
                <div
                  className={cn(
                    "group relative flex flex-row h-[120px] sm:h-[125px] overflow-hidden rounded-xl",
                    "border border-line bg-card/60 backdrop-blur-xs transition-all duration-200",
                    "hover:border-primary/40 hover:bg-card/90 shadow-none select-none"
                  )}
                >
                  <div className="relative w-[100px] sm:w-[115px] md:w-[125px] shrink-0 overflow-hidden bg-muted border-l border-line select-none">
                    <camp.animation
                      className="h-full w-full"
                      intensity={0.35}
                      label={`تفاعل ${camp.title}`}
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5 text-right">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-heading text-sm sm:text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                        {camp.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {camp.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-start pt-2 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex h-7 items-center justify-center rounded-lg border border-line bg-secondary/80 px-3 text-[11px] sm:text-xs font-semibold text-foreground transition-colors hover:bg-secondary cursor-default select-none shadow-none"
                      >
                        <span>قريباً</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 pb-2 select-none" dir="rtl">
            <div 
              role="tablist"
              aria-label="معسكرات سَنَد"
              className="flex h-10 items-center rounded-full bg-muted/80 border border-line/60 px-3.5 shadow-xs backdrop-blur-md"
            >
              {CAMPS.map((camp, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={camp.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`معسكر ${camp.title}`}
                    onClick={() => scrollToCamp(idx)}
                    className={cn(
                      "relative mx-1.5 h-2 overflow-hidden rounded-full transition-all duration-400 ease-[cubic-bezier(0.645,0.045,0.355,1)] cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      isCurrent 
                        ? "w-9 sm:w-11 bg-muted-foreground/30" 
                        : "size-2 bg-muted-foreground/50 hover:bg-foreground"
                    )}
                  >
                    {isCurrent && (
                      <motion.span
                        key={`${activeIndex}-${isPlaying}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isPlaying ? 1 : 0 }}
                        transition={{
                          duration: AUTOPLAY_DURATION / 1000,
                          ease: "linear",
                        }}
                        aria-hidden
                        className="absolute inset-0 origin-right rounded-[inherit] bg-foreground"
                      />
                    )}
                    <span className="sr-only">{camp.title}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              aria-label={isPlaying ? "إيقاف التمرير التلقائي" : "تشغيل التمرير التلقائي"}
              title={isPlaying ? "إيقاف التمرير التلقائي" : "تشغيل التمرير التلقائي"}
              className={cn(
                "flex size-10 items-center justify-center rounded-full bg-muted/80 border border-line/60 text-foreground shadow-xs backdrop-blur-md",
                "transition-[background-color,transform] duration-200 ease-out hover:bg-muted active:scale-95 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={ICON_STROKE_WIDTH}
                strokeLinejoin="round"
                className="size-4"
              >
                <motion.path
                  initial={false}
                  animate={{ d: isPlaying ? PAUSE_ICON.left : PLAY_ICON.left }}
                  transition={ICON_TRANSITION}
                />
                <motion.path
                  initial={false}
                  animate={{ d: isPlaying ? PAUSE_ICON.right : PLAY_ICON.right }}
                  transition={ICON_TRANSITION}
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
