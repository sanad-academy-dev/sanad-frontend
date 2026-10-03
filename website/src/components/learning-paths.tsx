"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowLeft, Gamepad2, Code2, Globe, Cpu, Sparkles } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

import Container from "@/components/container";
import Link from "next/link";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { JoinButton } from "@/components/join-button";

// --- PageDots Logic ---
const DOT = 6;
const PILL = 20;
const GAP = 6;
const STEP = DOT + GAP;

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (v: number) => v * v * (3 - 2 * v);
const lead = (t: number) => smooth(clamp01(t / 0.6));
const trail = (t: number) => smooth(clamp01((t - 0.4) / 0.6));

function PageDots({
  count,
  progress,
  onSelect,
  autoplay,
  className,
}: {
  count: number;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
  autoplay?: {
    duration: number;
    running: boolean;
    onElapsed: (active: number) => void;
  };
  className?: string;
}) {
  const [active, setActive] = useState(() => Math.round(progress.get()));
  useMotionValueEvent(progress, "change", (p) => setActive(Math.round(p)));

  const fillRef = useRef<HTMLSpanElement>(null);
  const settle = useRef<Animation | undefined>(undefined);
  const onElapsed = useRef(autoplay?.onElapsed);
  useEffect(() => {
    onElapsed.current = autoplay?.onElapsed;
  });
  const running = autoplay?.running ?? false;
  const duration = autoplay?.duration ?? 0;

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill || !running) return;
    settle.current?.cancel();
    const countdown = fill.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration, easing: "linear" },
    );
    countdown.onfinish = () => onElapsed.current?.(active);
    return () => {
      countdown.onfinish = null;
      if (countdown.playState !== "running") return;
      const from = getComputedStyle(fill).transform;
      countdown.cancel();
      settle.current = fill.animate(
        [{ transform: from }, { transform: "scaleX(1)" }],
        { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
      );
    };
  }, [running, active, duration]);

  useEffect(() => () => settle.current?.cancel(), []);

  const pill = (p: number) => {
    const k = Math.min(Math.max(Math.floor(p), 0), Math.max(count - 2, 0));
    const t = clamp01(p - k);
    const left = k * STEP + STEP * trail(t);
    const right = k * STEP + PILL + STEP * lead(t);
    return { left, width: right - left };
  };
  const pillX = useTransform(progress, (p) => pill(p).left);
  const pillWidth = useTransform(progress, (p) => pill(p).width);

  if (count <= 1) return null;

  return (
    <div
      role="group"
      aria-label="Pages"
      className={cn("relative h-8 [contain:layout] dir-ltr", className)}
      style={{ width: (count - 1) * STEP + PILL, direction: "ltr" }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Dot
          key={i}
          index={i}
          count={count}
          progress={progress}
          current={i === active}
          onSelect={onSelect}
        />
      ))}
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 overflow-hidden rounded-full",
          autoplay ? "bg-primary/40" : "bg-primary",
        )}
        style={{ x: pillX, width: pillWidth }}
      >
        {autoplay && (
          <span
            ref={fillRef}
            className="absolute inset-0 origin-left bg-primary"
          />
        )}
      </motion.span>
    </div>
  );
}

function Dot({
  index,
  count,
  progress,
  current,
  onSelect,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  current: boolean;
  onSelect: (index: number) => void;
}) {
  const width = useTransform(
    progress,
    (p) => DOT + (PILL - DOT) * clamp01(1 - Math.abs(p - index)),
  );
  const left = useTransform(
    progress,
    (p) => index * STEP + (PILL - DOT) * clamp01(index - p),
  );

  return (
    <motion.button
      type="button"
      aria-label={`Page ${index + 1} of ${count}`}
      aria-current={current ? "page" : undefined}
      onClick={() => onSelect(index)}
      className="group absolute inset-y-0 -ml-[3px] box-content flex touch-manipulation items-center rounded-full px-[3px] outline-none focus-visible:outline-2 focus-visible:outline-primary"
      style={{ left, width }}
    >
      <span className="h-1.5 w-full rounded-full bg-primary/20 transition-[background-color,scale] duration-150 ease-out group-hover:bg-primary/40 group-active:scale-[0.96]" />
    </motion.button>
  );
}

function SwapIcon({
  visible,
  reduceMotion,
  children,
}: {
  visible: boolean;
  reduceMotion: boolean | null;
  children: React.ReactNode;
}) {
  const hidden = reduceMotion
    ? { opacity: 0 }
    : { scale: 0.25, opacity: 0, filter: "blur(4px)" };
  return (
    <motion.svg
      viewBox="0 0 16 16"
      className="col-start-1 row-start-1 size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={visible ? { scale: 1, opacity: 1, filter: "blur(0px)" } : hidden}
      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
    >
      {children}
    </motion.svg>
  );
}
// --- End PageDots Logic ---

export type LearningPathData = {
  trackNumber: string;
  title: string;
  age: string;
  level: string;
  description: string;
  skills: string;
  finalProject: string;
  seatsTotal: number;
  seatsBooked: number;
  href: string;
  icon: React.ElementType;
};

const TABS = [
  "البرمجة",
  "التصميم",
  "الذكاء الاصطناعي",
  "الأمن السيبراني",
  "علوم البيانات",
  "التسويق",
  "تطوير مواقع الويب",
];

const PATHS: LearningPathData[] = [
  {
    trackNumber: "01",
    title: "البرمجة للأطفال",
    age: "6–10 سنوات",
    level: "مبتدئ",
    description: "مدخل بصري ممتع يبني المنطق والثقة قبل الانتقال لكتابة الكود.",
    skills: "سكراتش • التفكير المنطقي • البرمجة الإبداعية",
    finalProject: "لعبة أو قصة تفاعلية",
    seatsBooked: 5,
    seatsTotal: 8,
    href: "#",
    icon: Gamepad2,
  },
  {
    trackNumber: "02",
    title: "بايثون",
    age: "10–14 سنة",
    level: "مبتدئ إلى متوسط",
    description: "يتعلم الطفل أساسيات البرمجة ويستخدمها في حل مشكلات حقيقية.",
    skills: "بايثون • الخوارزميات • حل المشكلات",
    finalProject: "تطبيق بايثون صغير",
    seatsBooked: 6,
    seatsTotal: 8,
    href: "#",
    icon: Code2,
  },
  {
    trackNumber: "03",
    title: "تطوير مواقع الويب",
    age: "13–18 سنة",
    level: "متوسط",
    description: "من تصميم الواجهة إلى بناء تجربة ويب تعمل ويمكن مشاركتها.",
    skills: "لغة HTML • لغة CSS • جافا سكريبت",
    finalProject: "موقع ويب متكامل",
    seatsBooked: 4,
    seatsTotal: 8,
    href: "#",
    icon: Globe,
  },
  {
    trackNumber: "04",
    title: "الروبوتات",
    age: "8–16 سنة",
    level: "حسب التقييم",
    description: "يربط البرمجة بالحركة والاستشعار وبناء نماذج تتفاعل مع الواقع.",
    skills: "الروبوتات • التفكير المنطقي • الحوسبة الفيزيائية",
    finalProject: "نموذج روبوت يعمل",
    seatsBooked: 8,
    seatsTotal: 8,
    href: "#",
    icon: Cpu,
  },
  {
    trackNumber: "05",
    title: "الذكاء الاصطناعي والتكنولوجيا المتقدمة",
    age: "13–18 سنة",
    level: "متوسط إلى متقدم",
    description: "يفهم كيف تعمل الأدوات الذكية ويوظفها في حل مشكلة واضحة.",
    skills: "الذكاء الاصطناعي • الأتمتة • التكنولوجيا الحديثة",
    finalProject: "تطبيق ذكي أو أتمتة",
    seatsBooked: 5,
    seatsTotal: 8,
    href: "https://ta-01m3wj31wpddvqs87rdfbhmjms-1380-0gg1fm6snphrk9093d7sazppk.makeproxy-m.figma.site/#assessment",
    icon: Sparkles,
  },
];

function LearningPathCard({ path }: { path: LearningPathData }) {
  const progressPercent = Math.round((path.seatsBooked / path.seatsTotal) * 100);
  
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <article className="group flex h-full flex-col justify-between gap-6 rounded-3xl bg-muted/30 p-6 shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="flex flex-col gap-5 text-right">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">مسار {path.trackNumber}</span>
          
          {/* Circular Progress (replaces icon) */}
          <div className="relative flex size-14 items-center justify-center">
            <svg className="size-14 -rotate-90 transform" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-primary/10"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
              <span className="text-[12px] font-bold leading-none text-foreground">{path.seatsBooked}/{path.seatsTotal}</span>
              <span className="text-[8px] font-medium leading-none text-muted-foreground mt-0.5">مقعد</span>
            </div>
          </div>
        </div>

        {/* Title & Level */}
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
            {path.title}
          </h3>
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <span>{path.age}</span>
            <span className="size-1.5 rounded-full bg-primary" />
            <span>{path.level}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {path.description}
          </p>
        </div>

        <hr className="border-border/50" />

        {/* Skills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">المهارات والتقنيات</span>
          <span className="text-sm font-bold text-foreground">{path.skills}</span>
        </div>

        <hr className="border-border/50" />

        {/* Final Project */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">المشروع النهائي للمسار</span>
          <span className="text-sm font-bold text-foreground">{path.finalProject}</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex pt-2">
        <JoinButton 
          variant="ghost" 
          className="flex w-full items-center justify-between text-base font-bold text-primary transition-opacity hover:opacity-80 p-0 h-auto bg-transparent hover:bg-transparent"
        >
          <span>التقييم الأولي</span>
          <ArrowLeft className="size-5" />
        </JoinButton>
      </div>
    </article>
  );
}

const INTERVAL = 3000;
const SCROLL_QUIET = 200;

export default function LearningPaths() {
  const courses = PATHS;
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const regionRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  const [choice, setChoice] = useState<boolean | null>(null);
  const playing = choice ?? !reduceMotion;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [visible, setVisible] = useState(true);
  const running = playing && !hovered && !focused && !scrolling && visible;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = scroller.scrollWidth - scroller.clientWidth;
      progress.set(
        max > 0 ? (Math.abs(scroller.scrollLeft) / max) * (courses.length - 1) : 0,
      );
    };

    let touching = false;
    let busy = false;
    let quiet: ReturnType<typeof setTimeout> | undefined;
    const settleSoon = () => {
      clearTimeout(quiet);
      quiet = setTimeout(() => {
        if (touching) return;
        busy = false;
        setScrolling(false);
      }, SCROLL_QUIET);
    };
    const start = () => {
      busy = true;
      setScrolling(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
      if (busy) settleSoon();
    };
    const onWheel = () => {
      start();
      settleSoon();
    };
    const onTouchStart = () => {
      touching = true;
      clearTimeout(quiet);
      start();
    };
    const onTouchEnd = () => {
      touching = false;
      settleSoon();
    };

    const passive = { passive: true } as const;
    scroller.addEventListener("scroll", onScroll, passive);
    scroller.addEventListener("wheel", onWheel, passive);
    scroller.addEventListener("touchstart", onTouchStart, passive);
    scroller.addEventListener("touchend", onTouchEnd, passive);
    scroller.addEventListener("touchcancel", onTouchEnd, passive);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("touchcancel", onTouchEnd);
      cancelAnimationFrame(frame);
      clearTimeout(quiet);
    };
  }, [progress, courses.length]);

  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    onChange();
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    // In RTL scrollLeft goes negative
    scroller.scrollTo({
      left: -(index / (courses.length - 1)) * max,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const advance = (active: number) => goTo((active + 1) % courses.length);

  const insideRegion = (node: EventTarget | null) =>
    node instanceof Node &&
    !!regionRef.current?.contains(node) &&
    !toggleRef.current?.contains(node);

  return (
    <section 
      className="w-full bg-card"
      ref={regionRef}
      onPointerOver={(e) => {
        if (e.pointerType !== "touch") setHovered(insideRegion(e.target));
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={(e) => {
        if (insideRegion(e.target) && (e.target as Element).matches(":focus-visible"))
          setFocused(true);
      }}
      onBlur={(e) => {
        if (!insideRegion(e.relatedTarget)) setFocused(false);
      }}
    >
      <Container className="flex flex-col gap-8 border-t border-border py-16">
        {/* الرأس */}
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            {/* <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              مسارات وليست كورسات منفصلة
            </span> */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              المسار الذي يناسب طفلك الآن
            </h2>
            <p className="max-w-[600px] text-base text-muted-foreground">
              العمر يوجّه الاختيار، والتقييم يحدد المستوى ونقطة البداية الفعلية.
            </p>
          </div>

            {/* شريط الفلترة */}
          {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex w-full md:w-auto">
              <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto border border-border p-1 [scrollbar-width:none]">
                {TABS.map((tab, i) => (
                  <Fragment key={tab}>
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="h-[34px] w-px shrink-0 bg-border"
                      />
                    )}
                    <button
                      type="button"
                      className={`cursor-pointer shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {tab}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div> 


            </div>*/}
          
          </div>

        {/* الكاروسيل */}
        <div
          ref={scrollerRef}
          tabIndex={0}
          role="region"
          aria-label="مسارات التعلم"
          aria-roledescription="carousel"
          aria-live={running ? "off" : "polite"}
          className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-6 outline-none [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-scrollbar]:hidden"
        >
          {courses.map((path, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${courses.length}`}
              className="mt-3 w-[85vw] sm:w-[350px] md:w-[400px] lg:w-[420px] shrink-0 snap-center snap-always"
            >
              <LearningPathCard path={path} />
            </div>
          ))}
        </div>
        
        {/* Pagination Controls */}
        {courses.length > 1 && (
          <div className="flex items-center justify-center gap-4 dir-ltr pt-2" style={{ direction: "ltr" }}>
            <button
              type="button"
              aria-label="Pause autoplay"
              aria-pressed={!playing}
              onClick={() => setChoice(!playing)}
              className="relative flex size-8 touch-manipulation items-center justify-center rounded-full text-muted-foreground outline-none transition-[scale,color,background-color] duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.96] after:absolute after:-inset-1.5 after:rounded-full"
            >
              <span className="grid" aria-hidden>
                <SwapIcon visible={playing} reduceMotion={reduceMotion}>
                  <path d="M5.75 3.75v8.5M10.25 3.75v8.5" />
                </SwapIcon>
                <SwapIcon visible={!playing} reduceMotion={reduceMotion}>
                  <path d="M5 3.9v8.2a.6.6 0 0 0 .9.5l6.6-4.1a.6.6 0 0 0 0-1L5.9 3.4a.6.6 0 0 0-.9.5Z" />
                </SwapIcon>
              </span>
            </button>
            <PageDots
              count={courses.length}
              progress={progress}
              onSelect={goTo}
              autoplay={{ duration: INTERVAL, running, onElapsed: advance }}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
