"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { Headset } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";

export type SpineItem = { id: string; label: string };

type Band = { top: number; height: number };

// Room between bands so neighbouring sections read as separate pieces.
const GAP = 8;
const MIN_BAND = 14;
const MIN_BAND_LABELLED = 24;
// Below this width there is no room for headings beside the bands.
const INLINE_MIN = 120;
// The current-section block reaches a little past its band.
const MARK_PAD = 4;
// Where on screen the "reading line" sits: a third of the way down is where
// eyes rest while reading, so a section counts as current once its heading
// passes that line, not only when it hits the very top.
const READ_LINE = 0.3;
// Scroll positions land a few pixels short of the end on some trackpads.
const END_SLACK = 4;
// Space left above a heading after jumping to it, so it isn't flush.
const JUMP_OFFSET = 16;
// Leading edge: quick, so the marker answers the scroll at once.
const LEAD = { type: "spring", visualDuration: 0.24, bounce: 0 } as const;
// Trailing edge: slower on purpose, that lag is the stretch. 0.42s is the
// shortest lag where the stretch still reads on a one-band move.
const TRAIL = { type: "spring", visualDuration: 0.42, bounce: 0 } as const;

type Target = { kind: "element"; el: HTMLElement } | { kind: "window" };

function metrics(target: Target) {
  if (target.kind === "window") {
    return {
      scrollTop: window.scrollY,
      viewport: window.innerHeight,
      height: document.documentElement.scrollHeight,
      offsetOf: (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY,
    };
  }
  const box = target.el;
  const top = box.getBoundingClientRect().top;
  return {
    scrollTop: box.scrollTop,
    viewport: box.clientHeight,
    height: box.scrollHeight,
    offsetOf: (el: HTMLElement) => el.getBoundingClientRect().top - top + box.scrollTop,
  };
}

export function ScrollSpine({
  items,
  scrollRef,
  height = 320,
  label = "On this page",
  className,
}: {
  items: SpineItem[];
  scrollRef?: React.RefObject<HTMLElement | null>;
  height?: number;
  label?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [bands, setBands] = useState<Band[]>([]);
  const [current, setCurrent] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [inline, setInline] = useState(true);
  const markTop = useMotionValue(0);
  const markBottom = useMotionValue(0);
  const markHeight = useTransform([markTop, markBottom], ([t, b]: number[]) =>
    Math.max(0, b - t),
  );
  const nav = useRef<HTMLElement>(null);
  const notch = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const offsets = useRef<number[]>([]);
  const docEnd = useRef(0);
  const bandsRef = useRef<Band[]>([]);
  const currentRef = useRef(0);
  const placed = useRef(false);

  const target = useCallback((): Target | null => {
    if (!scrollRef) return { kind: "window" };
    return scrollRef.current ? { kind: "element", el: scrollRef.current } : null;
  }, [scrollRef]);

  useEffect(() => {
    const el = nav.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setInline(entry.contentRect.width >= INLINE_MIN),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const t = target();
    if (!t) return;
    const minBand = inline ? MIN_BAND_LABELLED : MIN_BAND;
    const measure = () => {
      const m = metrics(t);
      const tops = items.map((item) => {
        const el = document.getElementById(item.id);
        return el ? m.offsetOf(el) : 0;
      });
      offsets.current = tops;
      docEnd.current = m.height;
      const lens = tops.map((top, i) => Math.max(1, (tops[i + 1] ?? m.height) - top));
      const total = lens.reduce((a, b) => a + b, 0);
      const free = height - GAP * (items.length - 1) - minBand * items.length;
      let y = 0;
      const next = lens.map((len) => {
        const band = { top: y, height: minBand + (free * len) / total };
        y += band.height + GAP;
        return band;
      });
      bandsRef.current = next;
      setBands(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t.kind === "window" ? document.body : (t.el.firstElementChild ?? t.el));
    return () => ro.disconnect();
  }, [items, height, target, inline]);

  useEffect(() => {
    const t = target();
    if (!t || bands.length === 0) return;
    const scroller: HTMLElement | Window = t.kind === "window" ? window : t.el;
    let frame = 0;
    const update = () => {
      frame = 0;
      const m = metrics(t);
      const tops = offsets.current;
      const atEnd = m.scrollTop >= m.height - m.viewport - END_SLACK;
      const line = m.scrollTop + m.viewport * READ_LINE;
      let i = 0;
      while (i < tops.length - 1 && tops[i + 1] <= line) i++;
      if (atEnd) i = tops.length - 1;
      const start = tops[i];
      const end = tops[i + 1] ?? docEnd.current;
      const within = atEnd ? 1 : Math.min(1, Math.max(0, (line - start) / (end - start)));
      const band = bandsRef.current[i];
      if (band && notch.current) {
        notch.current.style.transform = `translateY(${band.top + within * band.height}px)`;
      }
      fills.current.forEach((f, k) => {
        if (f) f.style.transform = `scaleY(${k < i ? 1 : k === i ? within : 0})`;
      });
      if (i !== currentRef.current) {
        currentRef.current = i;
        setCurrent(i);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [bands, target]);

  useEffect(() => {
    const band = bands[current];
    if (!band) return;
    const top = band.top - MARK_PAD;
    const bottom = band.top + band.height + MARK_PAD;
    if (!placed.current || reduceMotion) {
      placed.current = true;
      markTop.jump(top);
      markBottom.jump(bottom);
      return;
    }
    const down = top >= markTop.get();
    animate(markTop, top, down ? TRAIL : LEAD);
    animate(markBottom, bottom, down ? LEAD : TRAIL);
  }, [bands, current, reduceMotion, markTop, markBottom]);

  useEffect(
    () => () => {
      markTop.stop();
      markBottom.stop();
    },
    [markTop, markBottom],
  );

  const jump = (i: number) => {
    const t = target();
    if (!t) return;
    const top = Math.max(0, offsets.current[i] - JUMP_OFFSET);
    const behavior = reduceMotion ? "auto" : "smooth";
    if (t.kind === "window") window.scrollTo({ top, behavior });
    else t.el.scrollTo({ top, behavior });
  };

  return (
    <nav
      ref={nav}
      aria-label={label}
      className={cn("relative w-[180px] shrink-0 select-none", className)}
      style={{ height }}
    >
      <motion.div
        aria-hidden
        style={{ top: markTop, height: markHeight }}
        className={cn(
          "absolute bg-foreground/[0.06]",
          inline ? "-start-2 end-0" : "start-1/2 w-5 -translate-x-1/2",
        )}
      />
      <ol className="absolute inset-0">
        {bands.map((band, i) => {
          const active = i === current;
          const shown = preview === i && !inline;
          return (
            <li
              key={items[i].id}
              className="absolute end-0 start-0"
              style={{ top: band.top, height: band.height }}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 w-[3px] overflow-hidden rounded-full bg-foreground/[0.12]",
                  inline ? "start-0" : "start-1/2 -translate-x-1/2",
                )}
              >
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  style={{ transform: "scaleY(0)" }}
                  className="absolute inset-0 origin-top rounded-full bg-foreground"
                />
              </span>
              <button
                type="button"
                aria-current={active ? "location" : undefined}
                onClick={() => jump(i)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setPreview(i);
                }}
                onPointerLeave={() => setPreview((p) => (p === i ? null : p))}
                onFocus={(e) => {
                  if (e.currentTarget.matches(":focus-visible")) setPreview(i);
                }}
                onBlur={() => setPreview((p) => (p === i ? null : p))}
                className={cn(
                  "group/band absolute touch-manipulation rounded-[var(--radius)] text-start outline-hidden transition-[scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-foreground active:scale-[0.96] motion-reduce:transition-none",
                  inline ? "inset-y-0 -start-2 end-0 ps-5" : "inset-0",
                )}
              >
                {inline ? (
                  <span
                    className={cn(
                      "block truncate text-[15px] leading-6 transition-[color] duration-150 ease-out",
                      active
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground group-hover/band:text-foreground",
                    )}
                  >
                    {items[i].label}
                  </span>
                ) : (
                  <span className="sr-only">{items[i].label}</span>
                )}
              </button>
              {!inline && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-0 end-full z-10 me-1 rounded-full bg-foreground px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-background",
                    "transition-[opacity,scale,filter] ease-[cubic-bezier(0.23,1,0.32,1)] origin-right",
                    shown
                      ? "scale-100 opacity-100 blur-none duration-200"
                      : "scale-95 opacity-0 blur-[2px] duration-100",
                  )}
                >
                  {items[i].label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <div
        ref={notch}
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 -mt-[4.5px] size-[9px] rounded-full bg-foreground ring-[3px] ring-background",
          inline ? "-start-[3px]" : "start-1/2 -ms-[4.5px]",
          bands.length === 0 && "opacity-0",
        )}
      />
    </nav>
  );
}

const FAQS = [
  {
    q: "ما الأعمار المناسبة للالتحاق؟",
    a: "مناهجنا مصممة للأطفال والشباب من 6 إلى 18 سنة، مع مسارات تأسيسية وتمهيدية للمبتدئين.",
  },
  {
    q: "هل يحتاج الطفل لخبرة سابقة في البرمجة؟",
    a: "لا. نبدأ من الصفر ونوفر مستويات تناسب المبتدئين والمتقدمين.",
  },
  {
    q: "كيف يتم تحديد مستوى طفلي؟",
    a: "من خلال تقييم مبدئي يساعدنا على تحديد المستوى والمسار الأنسب له.",
  },
  {
    q: "هل التدريس باللغة العربية أم الإنجليزية؟",
    a: "الشرح باللغة العربية لضمان الفهم، مع استخدام مصطلحات البرمجة باللغة الإنجليزية.",
  },
  {
    q: "كم عدد الطلاب في المجموعة؟",
    a: "بحد أقصى 8 طلاب في المجموعة، لضمان اهتمام كافٍ ومشاركة وتطبيق عملي أفضل.",
  },
  {
    q: "هل التعليم في المقر أم عن بُعد؟",
    a: "يتوفر كلا الخيارين، وتختلف المواعيد والأسعار حسب البرنامج.",
  },
  {
    q: "هل يحتاج طفلي إلى لابتوب أو جهاز لوحي؟",
    a: "نعم، يحتاج إلى جهاز مناسب للتطبيق وممارسة ما يتعلمه في المنزل.",
  },
  {
    q: "ما الفرق بين المسار و المعسكر الصيفي؟",
    a: "المسار تعلم مستمر حصص أسبوعيًا لمدة 3 أشهر، بينما المعسكر تجربة مكثفة لمدة شهر خلال الصيف.",
  },
  {
    q: "هل توجد حصة تجريبية مجانية؟",
    a: "نعم، بعد التقييم المبدئي يمكن حجز حصة تجريبية مجانية للتعرف على أسلوبنا التعليمي.",
  },
  {
    q: "كيف يمكنني متابعة تقدم طفلي؟",
    a: "نوفر تقارير دورية ولوحة متابعة لولي الأمر لمتابعة الحضور والتقدم والمشاريع.",
  },
  {
    q: "كيف تضمنون سلامة طفلي أثناء الحصص؟",
    a: "يتم اعتماد وتدريب المحاضرين قبل التدريس، مع توفير أدوات متابعة لولي الأمر للحضور والتقدم.",
  },
  {
    q: "هل يحصل الطالب على شهادة؟",
    a: "نعم، يحصل الطالب على شهادة من STEM.org عند استيفاء متطلبات البرنامج.",
  },
  {
    q: "ما تكلفة الاشتراك؟",
    a: "تبدأ الأسعار من 2,500 جنيه شهريًا، حسب البرنامج والمسار.",
  },
  {
    q: "هل سند معتمدة؟",
    a: "نعم، ونوضح تفاصيل الاعتمادات عبر الموقع.",
  },
  {
    q: "هل يمكن تغيير المسار أو المستوى بعد التسجيل؟",
    a: "نعم، يمكن تعديل المسار أو المستوى بالتنسيق مع فريق سند وفق احتياجات الطالب.",
  },
  {
    q: "ما هي سياسة الاسترجاع؟",
    a: "يمكن طلب استرجاع المبلغ خلال الأسبوع الأول وفق شروط الاسترجاع المعتمدة.",
  },
];

type Section = { id: string; heading: string; body: string[] };

const SECTIONS: Section[] = FAQS.map((faq, i) => ({
  id: `faq-${i}`,
  heading: faq.q,
  body: [faq.a],
}));

const ITEMS: SpineItem[] = SECTIONS.map((s) => ({ id: s.id, label: s.heading }));

export default function Faq() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <section className="relative w-full overflow-hidden bg-card ">
      <Container className="relative z-10" withBorder>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <SectionHeader
            title="أسئلة أولياء الأمور"
            description="إجابات واضحة على الأسئلة الأكثر شيوعاً"
            className="text-center md:text-right"
          />
          <a
            href="https://wa.me/+201022805731"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius)] bg-[#25D366]/10 px-6 py-3.5 text-lg md:text-xl font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/20 shadow-sm hover:shadow-md"
          >
            تواصل معنا
            <FaWhatsapp className="size-6" />
          </a>
        </div>

        <div className="@container mt-4 flex h-[630px] w-full max-w-full overflow-hidden rounded-[calc(var(--radius)*2)] border-2 border-border bg-muted/30 shadow-sm">
          <div className="flex w-12 shrink-0 flex-col items-center border-s border-border pt-8 @min-[520px]:w-[340px] @min-[520px]:items-stretch @min-[520px]:pe-6 @min-[520px]:ps-8">
            <p className="mb-6 hidden text-base font-semibold tracking-wide text-muted-foreground uppercase @min-[520px]:block text-right">
              في هذا القسم
            </p>
            <ScrollSpine
              items={ITEMS}
              scrollRef={scroller}
              height={500}
              className="w-5 @min-[750px]:w-full cursor-pointer"
            />
          </div>
         
          <div
            ref={scroller}
            tabIndex={0}
            aria-label="الأسئلة الشائعة"
            className="min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] outline-hidden [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-48px),transparent)] focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-2 focus-visible:outline-primary"
          >
            <article className="px-8 pt-8 pb-40 text-lg leading-relaxed text-pretty text-foreground text-right">
              {SECTIONS.map((s) => (
                <section key={s.id}>
                  <h3 id={s.id} className="mt-10 scroll-mt-6 text-2xl font-bold text-foreground first:mt-0">
                    {s.heading}
                  </h3>
                  {s.body.map((p) => (
                    <p key={p.slice(0, 24)} className="my-5 text-muted-foreground">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </div>
          
        </div>
      </Container>
    </section>
  );
}
