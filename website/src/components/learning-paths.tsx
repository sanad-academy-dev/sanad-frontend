"use client";

import { useRef, useState, useEffect, useCallback, type ComponentType } from "react";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import {
  Hub,
  Keyboard,
  Phosphor,
  Plot,
  Riffle,
  Turntable,
  type HairlineProps,
} from "@lucasmarkes/hairline/react";
import { ArrowUpLeft } from "lucide-react";
import Container from "@/components/container";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/header";

import { PATHS, type LearningPathData } from "@/lib/learning-paths";
export { PATHS, type LearningPathData };

const pathAnimations: Record<
  LearningPathData["trackNumber"],
  ComponentType<HairlineProps>
> = {
  "01": Keyboard,
  "02": Phosphor,
  "03": Turntable,
  "04": Riffle,
  "05": Plot,
  "06": Hub,
};

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

const AUTOPLAY_DURATION = 4200;

export function LearningPathCard({ 
  path,
}: { 
  path: LearningPathData;
}) {
  const PathAnimation = pathAnimations[path.trackNumber];

  return (
    <div
      className={cn(
        "group/track relative flex h-[490px] sm:h-[500px] w-full flex-col justify-between overflow-hidden rounded-2xl",
        "border border-line bg-card transition-all duration-300 shadow-none hover:border-primary/40",
      )}
    >
      <div className="m-2.5 relative flex aspect-18/10 items-center justify-center overflow-hidden border border-line rounded select-none">
        <PathAnimation
          className="h-full w-full"
          intensity={0.35}
          label={`تفاعل مسار ${path.title}`}
        />

        {path.comingSoon && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 font-sans text-[11px] font-bold text-primary backdrop-blur-md select-none">
              قريباً
            </span>
          </div>
        )}
      </div>

      <div dir="rtl" className="grid flex-1 grid-cols-[88px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] grid-rows-[auto_auto_auto_1fr_auto] text-right bg-card">
        {/* Row 1: Title */}
        <div className="col-span-3 border-y border-line px-4 py-2.5 flex items-center justify-between">
          <h3 className="font-heading text-sm sm:text-base font-bold text-foreground group-hover/track:text-primary transition-colors tracking-normal">
            {path.title}
          </h3>
        </div>

        {/* Row 2: Track ID & Description */}
        <div className="col-span-1 border-b border-l border-line px-2 sm:px-2.5 py-2.5 font-sans text-xs font-semibold text-foreground/80 flex items-center justify-center text-center gap-1 select-none">
          <span>مسار</span>
          <span className="font-mono font-bold text-foreground">{path.trackNumber}</span>
        </div>
        <div className="col-span-2 border-b border-line px-3 sm:px-3.5 py-2.5 text-right flex items-center">
          <p className="font-sans text-xs sm:text-[13px] text-foreground/80 leading-relaxed line-clamp-2 font-normal">
            {path.description}
          </p>
        </div>

        {/* Row 3: Age / Level / Programs */}
        <div className="col-span-1 border-b border-l border-line px-1.5 sm:px-2 py-2 font-sans text-[11px] sm:text-xs text-foreground/85 font-medium flex items-center justify-center text-center">
          <span className="whitespace-nowrap">{path.age}</span>
        </div>
        <div className="col-span-1 border-b border-l border-line px-1.5 sm:px-2 py-2 font-sans text-xs text-foreground font-semibold flex items-center justify-center text-center">
          <span className="truncate">{path.level}</span>
        </div>
        <div className="col-span-1 border-b border-line px-1.5 sm:px-2 py-2 font-sans text-xs text-primary font-bold flex items-center justify-center gap-1 text-center">
          <span className="font-mono font-bold">{path.skillsList.length}</span>
          <span>برامج</span>
        </div>

        {/* Row 4: Courses label & chips */}
        <div className="col-span-1 border-l border-line px-2 sm:px-2.5 py-2.5 font-sans text-xs font-semibold text-muted-foreground/90 flex items-center justify-center text-center">
          الدورات
        </div>
        <div className="col-span-2 px-2.5 sm:px-3 py-2.5 flex flex-wrap gap-1.5 items-center content-center">
          {path.skillsList.map((course, idx) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-sm border border-line bg-secondary/60 px-2 py-0.5 font-sans text-[11px] sm:text-xs font-medium text-foreground/90 leading-normal select-none transition-colors hover:bg-secondary"
            >
              {course}
            </span>
          ))}
        </div>

        {/* Row 5: CTA Link */}
        <Link
          href={path.href}
          className="col-span-3 flex h-10 items-center justify-between border-t border-line px-4 font-sans text-xs sm:text-[13px] font-semibold text-foreground/90 transition-colors hover:bg-muted/70 hover:text-primary group/link mt-auto"
        >
          <span>استكشف برامج المسار</span>
          <ArrowUpLeft className="size-4 text-primary transition-transform duration-200 group-hover/link:-translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function LearningPaths() {
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

  const scrollToTrack = useCallback((index: number) => {
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
      const next = (activeIndex + 1) % PATHS.length;
      scrollToTrack(next);
    }, AUTOPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, scrollToTrack]);

  return (
    <section 
      className="w-full bg-background relative overflow-hidden scroll-mt-16" 
      id="paths"
    >
      <Container className="relative">
        <SectionHeader
          title="مسارات التعلم"
          description="استكشف مساراتنا التعليمية المتكاملة والمصممة لتطوير مهارات التفكير البرمجي والذكاء الاصطناعي للأبناء"
          action={
            <Link
              href="/tracks"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-secondary/60 px-3.5 font-sans text-xs font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary group cursor-pointer shadow-none"
            >
              <span>استعراض كافة الكورسات</span>
              <ArrowUpLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
        />

        <div className="relative py-1 sm:py-3">
          <div
            ref={scrollRef}
            dir="rtl"
            className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 sm:px-6 py-3 data-animating:snap-none"
          >
            {PATHS.map((path, idx) => (
              <div
                key={path.trackNumber}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="shrink-0 snap-center w-[85vw] max-w-[340px] sm:max-w-none sm:w-[355px] md:w-[385px] lg:w-[415px]"
              >
                <LearningPathCard 
                  path={path}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 pb-2 select-none" dir="rtl">
            <div 
              role="tablist"
              aria-label="مسارات التعلم"
              className="flex h-10 items-center rounded-full bg-muted/80 border border-line/60 px-3.5 shadow-xs backdrop-blur-md"
            >
              {PATHS.map((path, idx) => {
                const isCurrent = idx === activeIndex;
                return (
                  <button
                    key={path.trackNumber}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={`مسار ${path.trackNumber}: ${path.title}`}
                    onClick={() => scrollToTrack(idx)}
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
                    <span className="sr-only">{path.title}</span>
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
