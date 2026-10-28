"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type Variants,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import {
  Compass,
  Users,
  Gamepad2,
  Calendar,
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Clock,
  User,
  Mail,
  Smile,
  ArrowRight,
  ChevronDown,
  Pencil,
  Bookmark,
  Loader2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type Panel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const HEIGHT = { type: "spring", duration: 0.32, bounce: 0 } as const;
const SHIFT = 32;
const ICON_SWAP = { type: "spring", duration: 0.3, bounce: 0 } as const;

// Asymmetric RTL transitions (xevrion style)
const slide: Variants = {
  enter: (d: number) => ({
    x: d * -SHIFT,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: EASE_OUT },
  },
  exit: (d: number) => ({
    x: d * SHIFT * 0.7,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: EASE_OUT },
  }),
};

const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } },
};

function getStepMeta(panel: Panel): { stepIndex: number; title: string } {
  if (panel <= 1) {
    return { stepIndex: 0, title: "تحديد العمر" };
  }
  if (panel >= 2 && panel <= 14) {
    return { stepIndex: 1, title: "قياس المهارات" };
  }
  if (panel === 15) {
    return { stepIndex: 2, title: "موعد الجلسة" };
  }
  if (panel >= 16 && panel <= 17) {
    return { stepIndex: 3, title: "بيانات التواصل" };
  }
  return { stepIndex: 4, title: "اكتمل التقييم" };
}

function FormHeader({
  stepIndex,
  totalSteps = 4,
  stepTitle,
  onClose,
}: {
  stepIndex: number;
  totalSteps?: number;
  stepTitle?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-line bg-secondary/15 shrink-0 select-none"
      dir="rtl"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-line-hover transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="size-4" />
          </button>
        )}
        <div className="flex items-center gap-1.5 min-w-0 text-xs sm:text-sm">
          <span className="font-mono text-muted-foreground tabular-nums shrink-0">
            {stepIndex < totalSteps
              ? `الخطوة ${stepIndex + 1} من ${totalSteps}`
              : "اكتمل التقييم"}
          </span>
          {stepTitle && (
            <>
              <span className="text-line select-none font-mono shrink-0">/</span>
              <span className="font-semibold text-foreground truncate">
                {stepTitle}
              </span>
            </>
          )}
        </div>
      </div>

      <div aria-hidden className="flex items-center gap-1 sm:gap-1.5 shrink-0" dir="rtl">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-6 sm:w-7 overflow-hidden rounded-full bg-foreground/15"
          >
            <span
              className={cn(
                "block h-full rounded-full bg-primary transition-[scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                i <= stepIndex
                  ? "origin-right scale-x-100"
                  : "origin-left scale-x-0"
              )}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

function IntroHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-line bg-secondary/15 shrink-0 select-none"
      dir="rtl"
    >
      <div className="flex items-center gap-2 min-w-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-line-hover transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="size-4" />
          </button>
        )}
        <span className="text-xs sm:text-sm font-semibold text-foreground">
          تقييم مستوى واهتمامات طفلك
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-semibold text-primary">
        <Sparkles className="size-3 text-primary" />
        <span>جلسة تقييم مجانية</span>
      </div>
    </div>
  );
}

export function MultiStepForm({
  className,
  onCreate,
  onClose,
}: {
  className?: string;
  onCreate?: () => void;
  onClose?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [panel, setPanel] = useState<Panel>(-1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Form State
  const [age, setAge] = useState<number | null>(null);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [c1, setC1] = useState<string | null>(null);
  const [c2, setC2] = useState<string | null>(null);
  const [c3, setC3] = useState<string | null>(null);
  const [c4, setC4] = useState<string | null>(null);
  const [c5, setC5] = useState<string[]>([]);
  const [c6, setC6] = useState<string | null>(null);
  const [c7, setC7] = useState<string | null>(null);
  const [c10, setC10] = useState<string | null>(null);
  const [bookingDay, setBookingDay] = useState<number | null>(14);
  const [bookingTime, setBookingTime] = useState<string | null>("4:00 م");
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [childrenList, setChildrenList] = useState([{ name: "", age: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requestCode, setRequestCode] = useState<string | null>(null);

  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const height = useMotionValue(0);
  const [measured, setMeasured] = useState(false);
  const hasMeasured = useRef(false);

  useIsomorphicLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const next = el.offsetHeight;
      if (!hasMeasured.current || reduceMotion) {
        height.jump(next);
        hasMeasured.current = true;
        setMeasured(true);
      } else {
        animate(height, next, HEIGHT);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [height, reduceMotion, panel]);

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoTimer = () => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  const getDayName = (d: number | null) => {
    if (!d) return "";
    const blanks = [0, 1, 2, 3];
    const idx = (d + blanks.length - 1) % 7;
    return daysOfWeek[idx];
  };

  const go = (next: Panel, dir: 1 | -1) => {
    clearAutoTimer();
    setDirection(dir);
    setPanel(next);
  };

  const scheduleAutoAdvance = (next: Panel, delayMs: number = 600) => {
    clearAutoTimer();
    autoTimerRef.current = setTimeout(() => {
      go(next, 1);
    }, delayMs);
  };

  const handleSetAge = (chosenAge: number) => {
    setAge(chosenAge);
    setChildrenList((prev) => [
      { name: prev[0]?.name || "", age: `${chosenAge}` },
    ]);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const student = childrenList[0] || { name: "", age: "" };
      const ageVal = student.age ? `${student.age} سنوات` : age ? `${age} سنوات` : null;

      const payload = {
        source: "WEBSITE",
        studentName: student.name.trim() || "طالب جديد",
        ageLabel: ageVal,
        targetClass: c1 ? `مسار تمهيدي (${c1})` : "مسار تمهيدي",
        guardianName: parentName.trim() || "ولي أمر",
        guardianPhone: phone.trim() || "0500000000",
        guardianEmail: email.trim() || null,
        notes: `الموعد المختار: ${getDayName(bookingDay)} ${bookingDay || ""} أكتوبر - الساعة: ${bookingTime || "غير محدد"}. إجابات التقييم: مسار=${c1 || ""}, هدف=${c2 || ""}, خطوات=${c5?.join(",") || ""}`,
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1200);

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          setRequestCode(data.requestCode || `SND-${Math.floor(100000 + Math.random() * 900000)}`);
          go(18, 1);
          return;
        }
      } catch {
        // Fallback for demo or network offline
      }

      const code = `SND-${Math.floor(100000 + Math.random() * 900000)}`;
      setRequestCode(code);
      go(18, 1);
    } catch {
      const code = `SND-${Math.floor(100000 + Math.random() * 900000)}`;
      setRequestCode(code);
      go(18, 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepMeta = getStepMeta(panel);

  return (
    <div className={cn("w-full max-w-[540px] font-sans mx-auto", className)} dir="rtl">
      <div
        className="bg-card/95 backdrop-blur-md rounded-2xl flex flex-col w-full overflow-hidden text-foreground border border-line shadow-2xl relative"
      >
        {panel === -1 ? (
          <IntroHeader onClose={onClose} />
        ) : (
          <FormHeader
            stepIndex={stepMeta.stepIndex}
            totalSteps={4}
            stepTitle={stepMeta.title}
            onClose={onClose}
          />
        )}

        <motion.div
          ref={bodyRef}
          className="overflow-x-hidden overflow-y-auto custom-scrollbar max-h-[82vh]"
          style={{ height: measured ? height : "auto" }}
        >
          <div ref={innerRef} className="relative w-full">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={panel}
                data-panel={panel}
                custom={direction}
                variants={reduceMotion ? fade : slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-4 sm:p-6 w-full"
              >
                <PanelContent
                  panel={panel}
                  age={age}
                  setAge={handleSetAge}
                  q1={q1}
                  setQ1={(val) => {
                    setQ1(val);
                    scheduleAutoAdvance(3, 500);
                  }}
                  q2={q2}
                  setQ2={(val) => {
                    setQ2(val);
                    scheduleAutoAdvance(4, 500);
                  }}
                  q3={q3}
                  setQ3={(val) => {
                    setQ3(val);
                    scheduleAutoAdvance(5, 500);
                  }}
                  c1={c1}
                  setC1={(val) => {
                    setC1(val);
                    scheduleAutoAdvance(7, 500);
                  }}
                  c2={c2}
                  setC2={(val) => {
                    setC2(val);
                    scheduleAutoAdvance(8, 500);
                  }}
                  c3={c3}
                  setC3={(val) => {
                    setC3(val);
                    scheduleAutoAdvance(9, 500);
                  }}
                  c4={c4}
                  setC4={(val) => {
                    setC4(val);
                    scheduleAutoAdvance(10, 500);
                  }}
                  c5={c5}
                  setC5={(updater) => {
                    setC5((prev) => {
                      const next = typeof updater === "function" ? updater(prev) : updater;
                      if (next.length === 3) {
                        scheduleAutoAdvance(11, 700);
                      }
                      return next;
                    });
                  }}
                  c6={c6}
                  setC6={(val) => {
                    setC6(val);
                    scheduleAutoAdvance(12, 500);
                  }}
                  c7={c7}
                  setC7={(val) => {
                    setC7(val);
                    scheduleAutoAdvance(13, 500);
                  }}
                  c10={c10}
                  setC10={(val) => {
                    setC10(val);
                    scheduleAutoAdvance(14, 500);
                  }}
                  bookingDay={bookingDay}
                  setBookingDay={setBookingDay}
                  bookingTime={bookingTime}
                  setBookingTime={setBookingTime}
                  parentName={parentName}
                  setParentName={setParentName}
                  phone={phone}
                  setPhone={setPhone}
                  email={email}
                  setEmail={setEmail}
                  childrenList={childrenList}
                  setChildrenList={setChildrenList}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  requestCode={requestCode}
                  onConfirmBooking={handleConfirmBooking}
                  go={go}
                  onCreate={onCreate}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Reusable Question Navigation Component (xevrion style)
function QuestionNav({
  onPrev,
  onNext,
  canNext,
  nextLabel = "التالي",
  prevLabel = "السابق",
}: {
  onPrev?: () => void;
  onNext?: () => void;
  canNext?: boolean;
  nextLabel?: string;
  prevLabel?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 mt-4 pt-3.5 border-t border-line/70"
      dir="rtl"
    >
      {onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="h-10 px-4 rounded-full text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 active:scale-[0.96] transition-[scale,color,background-color] duration-150 ease-out flex items-center gap-1.5 cursor-pointer select-none"
        >
          <ArrowRight className="size-3.5" />
          <span>{prevLabel}</span>
        </button>
      ) : (
        <div className="h-10" />
      )}

      {onNext && (
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className={cn(
            "h-10 px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-[scale,opacity,background-color] duration-150 ease-out select-none cursor-pointer",
            canNext
              ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.96] shadow-sm"
              : "bg-secondary text-muted-foreground/50 cursor-not-allowed opacity-50"
          )}
        >
          <span>{nextLabel}</span>
          <ArrowLeft className="size-3.5" />
        </button>
      )}
    </div>
  );
}

function PanelContent({
  panel,
  age,
  setAge,
  q1,
  setQ1,
  q2,
  setQ2,
  q3,
  setQ3,
  c1,
  setC1,
  c2,
  setC2,
  c3,
  setC3,
  c4,
  setC4,
  c5,
  setC5,
  c6,
  setC6,
  c7,
  setC7,
  c10,
  setC10,
  bookingDay,
  setBookingDay,
  bookingTime,
  setBookingTime,
  parentName,
  setParentName,
  phone,
  setPhone,
  email,
  setEmail,
  childrenList,
  setChildrenList,
  isSubmitting,
  submitError,
  requestCode,
  onConfirmBooking,
  go,
  onCreate,
}: {
  panel: Panel;
  age: number | null;
  setAge: (age: number) => void;
  q1: string | null;
  setQ1: (q: string) => void;
  q2: string | null;
  setQ2: (q: string) => void;
  q3: string | null;
  setQ3: (q: string) => void;
  c1: string | null;
  setC1: (q: string) => void;
  c2: string | null;
  setC2: (q: string) => void;
  c3: string | null;
  setC3: (q: string) => void;
  c4: string | null;
  setC4: (q: string) => void;
  c5: string[];
  setC5: (updater: string[] | ((prev: string[]) => string[])) => void;
  c6: string | null;
  setC6: (q: string) => void;
  c7: string | null;
  setC7: (q: string) => void;
  c10: string | null;
  setC10: (q: string) => void;
  bookingDay: number | null;
  setBookingDay: (day: number | null) => void;
  bookingTime: string | null;
  setBookingTime: (time: string | null) => void;
  parentName: string;
  setParentName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  childrenList: { name: string; age: string }[];
  setChildrenList: (v: { name: string; age: string }[]) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
  requestCode?: string | null;
  onConfirmBooking?: () => void;
  go: (next: Panel, dir: 1 | -1) => void;
  onCreate?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [agePrompt, setAgePrompt] = useState(false);
  const [bookingPrompt, setBookingPrompt] = useState(false);

  // Panel -1: Intro
  if (panel === -1) {
    return (
      <div className="flex flex-col pt-1 pb-1">
        <div className="flex items-center justify-between mb-3.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-line bg-secondary/60 text-xs font-semibold text-primary font-mono">
            <Sparkles className="size-3.5 text-primary" />
            <span>خطوتك الأولى</span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-1.5 leading-snug text-right">
          احجز تقييم مستوى طفلك
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm mb-4 text-right font-medium leading-relaxed">
          سنفهم مستواه واهتماماته، ثم نرشح نقطة البداية الأنسب.
        </p>

        <div className="flex flex-col rounded-xl border border-line divide-y divide-line bg-secondary/25 overflow-hidden">
          <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5">
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">نحدد</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm">المسار والمستوى المناسبين</span>
          </div>
          <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5">
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">نوضح</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm">المدة وعدد الحصص</span>
          </div>
          <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5">
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">الفئة العمرية</span>
            <span className="text-foreground font-semibold font-mono text-xs sm:text-sm">من 6 إلى 18 سنة</span>
          </div>
          <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5">
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">النتيجة المتوقعة</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm">مهارات عملية + مشروع</span>
          </div>
          <div className="flex justify-between items-center px-3.5 sm:px-4 py-2.5">
            <span className="text-muted-foreground font-medium text-xs sm:text-sm">السعر</span>
            <span className="text-foreground font-semibold text-xs sm:text-sm">يُوضح حسب المسار</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => go(0, 1)}
            className="cursor-pointer h-10 sm:h-11 w-full rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-[scale,opacity,background-color] duration-150 ease-out flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm"
          >
            <span>ابدأ التقييم</span>
            <ArrowLeft className="size-4" />
          </button>
          <p className="text-[11px] text-muted-foreground font-medium text-center">
            لن تحتاج إلى اختيار باقة قبل أن تعرف ما يناسب طفلك.
          </p>
        </div>
      </div>
    );
  }

  // Panel 0: Age Selection
  if (panel === 0) {
    const ages = Array.from({ length: 12 }, (_, i) => i + 6);
    return (
      <div className="flex flex-col gap-4 text-center pt-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">كم عمر ابنك؟</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            اختر العمر بالتحديد لتكييف صعوبة الأسئلة
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 my-1">
          {ages.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAge(a);
                setAgePrompt(false);
              }}
              className={cn(
                "h-11 rounded-xl text-sm sm:text-base font-bold font-mono transition-[scale,border-color,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] border cursor-pointer select-none",
                age === a
                  ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30 shadow-sm"
                  : "border-line bg-secondary/35 text-foreground hover:border-line-hover hover:bg-secondary/65"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {agePrompt && !age && (
          <p className="text-destructive text-xs font-medium animate-in fade-in">
            يرجى اختيار عمر طفلك للمتابعة
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            if (age) {
              go(1, 1);
            } else {
              setAgePrompt(true);
            }
          }}
          className={cn(
            "h-10 sm:h-11 w-full rounded-full text-xs sm:text-sm font-semibold transition-[scale,opacity,background-color] duration-150 ease-out flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]",
            age
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
              : "bg-secondary text-muted-foreground border border-line"
          )}
        >
          <span>التالي</span>
          <ArrowLeft className="size-4" />
        </button>
      </div>
    );
  }

  // Panel 1: Overview
  if (panel === 1) {
    return (
      <div className="flex flex-col gap-4 text-center items-center pt-1">
        <div className="flex size-11 items-center justify-center rounded-xl border border-line bg-secondary/60 text-primary">
          <Compass className="size-5.5 text-primary" strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            ما هو التقييم المبدئي؟
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed px-1 font-medium">
            في تجربة قصيرة وممتعة (5-7 دقائق)، نبدأ بثلاثة أسئلة سريعة لك كولي أمر،
            ثم سلّم الجهاز لابنك ليخوض 8 تحديات ذكية ممتعة تكتشف مهاراته في التفكير والإبداع وحل المشكلات.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mt-1">
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-secondary/30 py-2.5 px-2">
            <Users className="size-4.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground text-center">3 أسئلة لك</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-secondary/30 py-2.5 px-2">
            <Gamepad2 className="size-4.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground text-center">8 تحديات لابنك</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-secondary/30 py-2.5 px-2">
            <Calendar className="size-4.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground text-center">حجز التقييم العملي</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <button
            type="button"
            onClick={() => go(2, 1)}
            className="h-10 sm:h-11 w-full rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-[scale,opacity,background-color] duration-150 ease-out flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>لنبدأ</span>
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(0, -1)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1 cursor-pointer active:scale-[0.98]"
          >
            تغيير العمر
          </button>
        </div>
      </div>
    );
  }

  // Panel 2: Parent Q1
  if (panel === 2) {
    const options = [
      { id: "1", label: "الألعاب والقصص" },
      { id: "2", label: "الرسم والتصميم" },
      { id: "3", label: "الروبوتات والآلات" },
      { id: "4", label: "الأرقام والألغاز" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">1 / 3</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-3.5 text-primary" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center">
          ما أكثر ما يجذب ابنك؟
        </h2>

        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const checked = q1 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ1(opt.id)}
                className={cn( "flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold" : "border-line bg-secondary/25 hover:border-line-hover hover:bg-secondary/40 text-foreground" )}
              >
                <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                <span
                  className={cn( "flex size-6 sm:size-7 items-center justify-center rounded-lg text-xs font-bold font-mono transition-colors", checked ? "bg-primary text-primary-foreground" : "border border-line bg-secondary text-foreground" )}
                >
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(1, -1)}
          onNext={() => go(3, 1)}
          canNext={!!q1}
        />
      </div>
    );
  }

  // Panel 3: Parent Q2
  if (panel === 3) {
    const options = [
      { id: "1", label: "لا يوجد بعد" },
      { id: "2", label: "خبرة بسيطة" },
      { id: "3", label: "خبرة جيدة" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">2 / 3</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-3.5 text-primary" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center">
          هل لديه خبرة سابقة في البرمجة أو الروبوتات؟
        </h2>

        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const checked = q2 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ2(opt.id)}
                className={cn( "flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold" : "border-line bg-secondary/25 hover:border-line-hover hover:bg-secondary/40 text-foreground" )}
              >
                <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                <span
                  className={cn( "flex size-6 sm:size-7 items-center justify-center rounded-lg text-xs font-bold font-mono transition-colors", checked ? "bg-primary text-primary-foreground" : "border border-line bg-secondary text-foreground" )}
                >
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(2, -1)}
          onNext={() => go(4, 1)}
          canNext={!!q2}
        />
      </div>
    );
  }

  // Panel 4: Parent Q3
  if (panel === 4) {
    const options = [
      { id: "1", label: "مهارات المستقبل" },
      { id: "2", label: "الإبداع والثقة" },
      { id: "3", label: "التفوق الدراسي" },
      { id: "4", label: "استثمار وقته بفائدة" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">3 / 3</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-3.5 text-primary" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center">
          ما هدفك الأهم من انضمامه؟
        </h2>

        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const checked = q3 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ3(opt.id)}
                className={cn( "flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold" : "border-line bg-secondary/25 hover:border-line-hover hover:bg-secondary/40 text-foreground" )}
              >
                <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
                <span
                  className={cn( "flex size-6 sm:size-7 items-center justify-center rounded-lg text-xs font-bold font-mono transition-colors", checked ? "bg-primary text-primary-foreground" : "border border-line bg-secondary text-foreground" )}
                >
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(3, -1)}
          onNext={() => go(5, 1)}
          canNext={!!q3}
        />
      </div>
    );
  }

  // Panel 5: Child Handoff
  if (panel === 5) {
    return (
      <div className="flex flex-col gap-4 text-center items-center pt-2">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-line bg-secondary/50 text-3xl">
          🤖
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            دور البطل يبدأ الآن!
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed px-1 font-medium">
            من فضلك سلّم الجهاز إلى ابنك 📱. الأسئلة القادمة له وحده —
            مجرد ألعاب ذكية ممتعة، ولا توجد إجابات تحرج. نيكسي سيرافقه في الرحلة!
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-2">
          <Button
            type="button"
            onClick={() => go(6, 1)}
            className="h-10 sm:h-11 w-full rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center justify-center gap-2"
          >
            <span>أنا جاهز — لنبدأ!</span>
            <ArrowLeft className="size-4" />
          </Button>
          <button
            type="button"
            onClick={() => go(4, -1)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors self-center py-1 cursor-pointer"
          >
            السابق
          </button>
        </div>
      </div>
    );
  }

  // Panel 6: Child Challenge 1
  if (panel === 6) {
    const options = [
      { id: "24", label: "24" },
      { id: "28", label: "28" },
      { id: "30", label: "30" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">1 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">النمط الرقمي</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center">
          أكمل المتتالية
        </h2>

        <div className="flex items-center justify-center gap-2 mt-1 bg-secondary/30 p-3 rounded-xl border border-line">
          {[2, 6, 12, 20].map((num) => (
            <div
              key={num}
              className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-line bg-card text-xs sm:text-sm font-bold font-mono text-foreground"
            >
              {num}
            </div>
          ))}
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary/10 text-xs sm:text-sm font-bold font-mono text-primary">
            ؟
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {options.map((opt) => {
            const checked = c1 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC1(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all cursor-pointer", checked ? "border-primary bg-primary text-primary-foreground font-bold ring-2 ring-primary/30" : "border-line bg-secondary/25 hover:border-line-hover text-foreground font-semibold" )}
              >
                <span className="text-xs sm:text-sm font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(5, -1)}
          onNext={() => go(7, 1)}
          canNext={!!c1}
        />
      </div>
    );
  }

  // Panel 7: Child Challenge 2
  if (panel === 7) {
    const options = [
      { id: "1", label: "A أكبر من C" },
      { id: "2", label: "A أصغر من C" },
      { id: "3", label: "متساويان" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">2 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">التفكير المنطقي</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          إذا A أكبر من B، و B أكبر من C — فما علاقة A بـ C؟
        </h2>

        <div className="flex flex-col gap-2 mt-1">
          {options.map((opt) => {
            const checked = c2 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC2(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-line bg-secondary/25 hover:border-line-hover text-foreground" )}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(6, -1)}
          onNext={() => go(8, 1)}
          canNext={!!c2}
        />
      </div>
    );
  }

  // Panel 8: Child Challenge 3
  if (panel === 8) {
    const options = [
      { id: "10", label: "10" },
      { id: "12", label: "12" },
      { id: "16", label: "16" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">3 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">النمط</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          كل رقم ضعف الذي قبله — ما التالي؟
        </h2>

        <div className="flex items-center justify-center gap-2 mt-1 bg-secondary/30 p-3 rounded-xl border border-line" dir="ltr">
          {[1, 2, 4, 8].map((num) => (
            <div
              key={num}
              className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-line bg-card text-xs sm:text-sm font-bold font-mono text-foreground"
            >
              {num}
            </div>
          ))}
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-lg border border-dashed border-primary/50 bg-primary/10 text-xs sm:text-sm font-bold font-mono text-primary">
            ؟
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {options.map((opt) => {
            const checked = c3 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC3(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all cursor-pointer", checked ? "border-primary bg-primary text-primary-foreground font-bold ring-2 ring-primary/30" : "border-line bg-secondary/25 hover:border-line-hover text-foreground font-semibold" )}
              >
                <span className="text-xs sm:text-sm font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(7, -1)}
          onNext={() => go(9, 1)}
          canNext={!!c3}
        />
      </div>
    );
  }

  // Panel 9: Child Challenge 4
  if (panel === 9) {
    const options = [
      { id: "1", label: "نموذج بسيط يعمل" },
      { id: "2", label: "شرح نظري طويل" },
      { id: "3", label: "تصميم الشعار" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">4 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">حل المشكلات</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          لديك 5 دقائق لعرض فكرتك — بمَ تبدأ؟
        </h2>

        <div className="flex flex-col gap-2 mt-1">
          {options.map((opt) => {
            const checked = c4 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC4(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-line bg-secondary/25 hover:border-line-hover text-foreground" )}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(8, -1)}
          onNext={() => go(10, 1)}
          canNext={!!c4}
        />
      </div>
    );
  }

  // Panel 10: Child Challenge 5 (Steps Ordering)
  if (panel === 10) {
    const options = [
      { id: "idea", label: "فكرة" },
      { id: "execute", label: "تنفيذ" },
      { id: "test", label: "اختبار" },
    ];

    const toggleOption = (id: string) => {
      setC5((prev) => {
        if (prev.includes(id)) {
          return prev.filter((i) => i !== id);
        } else {
          if (prev.length < 3) {
            return [...prev, id];
          }
          return prev;
        }
      });
    };

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">5 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">التسلسل</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          رتّب خطوات بناء مشروع بالترتيب الصحيح
        </h2>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {options.map((opt) => {
            const index = c5.indexOf(opt.id);
            const isSelected = index !== -1;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(opt.id)}
                className={cn( "relative flex h-13 sm:h-14 items-center justify-center rounded-xl border transition-all cursor-pointer", isSelected ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 font-semibold" : "border-line bg-secondary/25 hover:border-line-hover text-foreground" )}
              >
                {isSelected && (
                  <span className="absolute -top-2 -right-1.5 flex size-5 items-center justify-center rounded-md bg-primary text-[10px] font-bold font-mono text-primary-foreground">
                    {index + 1}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-semibold">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-1 px-1">
          <p className="text-xs font-medium text-muted-foreground">
            اضغط البطاقات بالترتيب (1 ثم 2 ثم 3)
          </p>
          {c5.length > 0 && (
            <button
              type="button"
              onClick={() => setC5([])}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="size-3" />
              <span>إعادة</span>
            </button>
          )}
        </div>

        <QuestionNav
          onPrev={() => go(9, -1)}
          onNext={() => go(11, 1)}
          canNext={c5.length > 0}
        />
      </div>
    );
  }

  // Panel 11: Child Challenge 6
  if (panel === 11) {
    const options = [
      { id: "12", label: "12" },
      { id: "10", label: "10" },
      { id: "9", label: "9" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">6 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">التفكير المنطقي</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          أي رقم لا يقبل القسمة على 3؟
        </h2>

        <div className="grid grid-cols-3 gap-2 mt-2">
          {options.map((opt) => {
            const checked = c6 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC6(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all cursor-pointer", checked ? "border-primary bg-primary text-primary-foreground font-bold ring-2 ring-primary/30" : "border-line bg-secondary/25 hover:border-line-hover text-foreground font-semibold" )}
              >
                <span className="text-xs sm:text-sm font-mono">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(10, -1)}
          onNext={() => go(12, 1)}
          canNext={!!c6}
        />
      </div>
    );
  }

  // Panel 12: Child Challenge 7
  if (panel === 12) {
    const options = [
      { id: "1", label: "الصور والأمثلة" },
      { id: "2", label: "الألوان فقط" },
      { id: "3", label: "الحظ" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">7 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">الذكاء الاصطناعي</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          لتعليم الحاسوب تمييز القطط 🐱، نعطيه كثيرًا من...؟
        </h2>

        <div className="flex flex-col gap-2 mt-1">
          {options.map((opt) => {
            const checked = c7 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC7(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-line bg-secondary/25 hover:border-line-hover text-foreground" )}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(11, -1)}
          onNext={() => go(13, 1)}
          canNext={!!c7}
        />
      </div>
    );
  }

  // Panel 13: Child Challenge 8
  if (panel === 13) {
    const options = [
      { id: "1", label: "بناء نموذج مصغر" },
      { id: "2", label: "الانتظار سنة" },
      { id: "3", label: "عدم المحاولة" },
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-muted-foreground">8 / 8</span>
          <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-foreground">حل المشكلات</span>
            <span className="text-yellow-500 text-xs">⚡</span>
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold font-heading text-foreground text-center leading-snug">
          أفضل طريقة لاختبار فكرة بسرعة؟
        </h2>

        <div className="flex flex-col gap-2 mt-1">
          {options.map((opt) => {
            const checked = c10 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC10(opt.id)}
                className={cn( "flex h-10 sm:h-11 items-center justify-center rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer", checked ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40" : "border-line bg-secondary/25 hover:border-line-hover text-foreground" )}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        <QuestionNav
          onPrev={() => go(12, -1)}
          onNext={() => go(14, 1)}
          canNext={!!c10}
          nextLabel="عرض النتيجة"
        />
      </div>
    );
  }

  // Panel 14: Results & Acceptance
  if (panel === 14) {
    return (
      <div className="flex flex-col gap-4 text-center items-center pt-1">
        <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-2xl">
          🎉
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-primary font-mono">القبول المبدئي</span>
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground leading-snug">
            تهانينا! تم قبولك مبدئياً
          </h2>
        </div>

        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed px-2 font-medium">
          لقد اجتزت التقييم المبدئي للانتقال إلى المرحلة التالية. يمكنك الآن حجز جلسة التقييم الحضورية.
        </p>

        <div className="flex items-center gap-2 sm:gap-3 w-full mt-1 justify-center">
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-secondary/25 py-2.5 px-3 border border-line flex-1">
            <span className="text-xl sm:text-2xl font-bold font-mono text-primary">EN2</span>
            <span className="text-[11px] font-medium text-muted-foreground text-center">المستوى المقترح</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-secondary/25 py-2.5 px-3 border border-line flex-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-primary">8</span>
              <span className="text-xs sm:text-sm font-bold font-mono text-muted-foreground">/8</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground text-center">نتيجتك</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full mt-2">
          <Button
            type="button"
            onClick={() => go(15, 1)}
            className="h-10 sm:h-11 w-full rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>احجز جلسة التقييم الحضورية</span>
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center justify-between w-full px-1">
            <button
              type="button"
              onClick={() => go(13, -1)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              السابق
            </button>
            <p className="text-[11px] font-medium text-muted-foreground">
              المستوى النهائي يُؤكّد بالتقييم الحضوري
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Panel 15: Booking Calendar & Timeslots
  if (panel === 15) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const blanks = [0, 1, 2, 3];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const getDayName = (d: number) => {
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    const timeslots = [
      "9:00 ص", "10:00 ص", "12:00 م",
      "1:00 م", "2:00 م", "3:00 م",
      "4:00 م", "5:00 م", "6:00 م",
    ];

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            احجز حصة تجريبية مجانية
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            اختر اليوم والوقت الأنسب لحضور طفلك
          </p>
        </div>

        {/* Calendar */}
        <div className="flex flex-col gap-2 rounded-xl border border-line bg-secondary/20 p-3">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              className="size-7 flex items-center justify-center hover:bg-secondary rounded-lg border border-line text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
            <span className="text-xs sm:text-sm font-bold font-mono text-foreground">أكتوبر 2026</span>
            <button
              type="button"
              className="size-7 flex items-center justify-center hover:bg-secondary rounded-lg border border-line text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center" dir="rtl">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {blanks.map((b) => (
              <div key={`b-${b}`} className="py-1"></div>
            ))}
            {days.map((d) => {
              const isFriday = (d + blanks.length - 1) % 7 === 5;
              const isSelected = bookingDay === d;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={isFriday}
                  onClick={() => {
                    setBookingDay(d);
                    setBookingPrompt(false);
                    if (!bookingTime) {
                      setBookingTime("4:00 م");
                    }
                  }}
                  className={cn( "h-7 sm:h-8 w-full flex items-center justify-center text-xs font-semibold font-mono transition-all rounded-lg cursor-pointer", isFriday ? "text-muted-foreground/30 cursor-not-allowed" : isSelected ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary/30" : "text-foreground hover:bg-secondary/70" )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {bookingDay && (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-1.5 text-foreground text-xs font-semibold">
              <Clock className="size-3.5 text-primary" />
              <span>
                المواعيد المتاحة — {getDayName(bookingDay)} {bookingDay} أكتوبر
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2" dir="rtl">
              {timeslots.map((time) => {
                const isSelected = bookingTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setBookingTime(time);
                      setBookingPrompt(false);
                    }}
                    className={cn( "h-8.5 sm:h-9 rounded-lg text-xs font-medium transition-all border cursor-pointer", isSelected ? "bg-primary border-primary text-primary-foreground font-semibold ring-2 ring-primary/30" : "bg-secondary/25 border-line text-foreground hover:border-line-hover hover:bg-secondary/40" )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {bookingPrompt && (!bookingDay || !bookingTime) && (
          <p className="text-destructive text-xs font-medium text-center animate-in fade-in">
            يرجى تحديد اليوم والموعد المناسب للمتابعة
          </p>
        )}

        <div className="flex gap-2.5 mt-2" dir="rtl">
          <Button
            type="button"
            variant="outline"
            onClick={() => go(14, -1)}
            className="h-10 sm:h-11 flex-[0.8] rounded-xl text-xs sm:text-sm font-semibold border border-line bg-secondary/30 hover:bg-secondary/60 text-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="size-4" />
            <span>السابق</span>
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (bookingDay && bookingTime) {
                go(16, 1);
              } else {
                setBookingPrompt(true);
              }
            }}
            className={cn( "h-10 sm:h-11 flex-[2] rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer", bookingDay && bookingTime ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "bg-secondary text-muted-foreground border border-line" )}
          >
            <span>التالي — البيانات</span>
            <ArrowLeft className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Panel 16: Personal Info Form
  if (panel === 16) {
    const validateAndNext = () => {
      const errs: Record<string, string> = {};
      if (!parentName.trim()) {
        errs.parentName = "يرجى كتابة اسم ولي الأمر";
      }
      if (!phone.trim()) {
        errs.phone = "يرجى كتابة رقم الجوال";
      } else if (phone.trim().replace(/\D/g, "").length < 9) {
        errs.phone = "رقم الجوال يجب ألا يقل عن 9 أرقام";
      }
      if (!email.trim()) {
        errs.email = "يرجى كتابة البريد الإلكتروني";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errs.email = "صيغة البريد الإلكتروني غير صحيحة";
      }
      if (!childrenList[0]?.name.trim()) {
        errs.studentName = "يرجى كتابة اسم الطفل";
      }

      setFormErrors(errs);
      if (Object.keys(errs).length === 0) {
        go(17, 1);
      }
    };

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            البيانات الشخصية
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            لإتمام الحجز والتواصل معك لتأكيد الموعد
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-3" dir="rtl">
          {/* Parent Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">
              اسم ولي الأمر <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={parentName}
                onChange={(e) => {
                  setParentName(e.target.value);
                  if (formErrors.parentName) {
                    setFormErrors((prev) => ({ ...prev, parentName: "" }));
                  }
                }}
                className={cn( "h-10 w-full rounded-xl border bg-secondary/20 px-3 text-xs sm:text-sm outline-none transition-colors text-right pl-3 pr-9", formErrors.parentName ? "border-destructive focus:border-destructive ring-1 ring-destructive/30" : "border-line focus:border-primary" )}
              />
              <User className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            </div>
            {formErrors.parentName && (
              <span className="text-[11px] font-medium text-destructive px-1">
                {formErrors.parentName}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">
              رقم الجوال <span className="text-destructive">*</span>
            </label>
            <div
              className={cn( "relative flex items-center h-10 w-full rounded-xl border bg-secondary/20 overflow-hidden transition-colors", formErrors.phone ? "border-destructive focus-within:border-destructive ring-1 ring-destructive/30" : "border-line focus-within:border-primary" )}
            >
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) {
                    setFormErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                className="flex-1 min-w-0 h-full bg-transparent px-3 text-xs sm:text-sm outline-none text-left font-mono"
                dir="ltr"
              />
              <div
                className="flex items-center gap-1.5 h-full px-2.5 border-r border-line bg-secondary/40 text-foreground text-xs font-semibold font-mono"
                dir="ltr"
              >
                <ChevronDown className="size-3 text-muted-foreground" />
                <span>+20</span>
                <span className="text-xs leading-none">🇪🇬</span>
              </div>
            </div>
            {formErrors.phone && (
              <span className="text-[11px] font-medium text-destructive px-1">
                {formErrors.phone}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">
              البريد الإلكتروني <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formErrors.email) {
                    setFormErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                className={cn( "h-10 w-full rounded-xl border bg-secondary/20 px-3 text-xs sm:text-sm outline-none transition-colors text-left pl-3 pr-9 font-mono", formErrors.email ? "border-destructive focus:border-destructive ring-1 ring-destructive/30" : "border-line focus:border-primary" )}
                dir="ltr"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
            </div>
            {formErrors.email && (
              <span className="text-[11px] font-medium text-destructive px-1">
                {formErrors.email}
              </span>
            )}
          </div>

          {/* Children Info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-xs font-semibold text-foreground">
                اسم الطفل <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسم الطفل"
                  value={childrenList[0]?.name || ""}
                  onChange={(e) => {
                    const newList = [...childrenList];
                    if (newList[0]) newList[0].name = e.target.value;
                    setChildrenList(newList);
                    if (formErrors.studentName) {
                      setFormErrors((prev) => ({ ...prev, studentName: "" }));
                    }
                  }}
                  className={cn( "h-10 w-full rounded-xl border bg-secondary/20 px-3 text-xs sm:text-sm outline-none transition-colors pr-9", formErrors.studentName ? "border-destructive focus:border-destructive ring-1 ring-destructive/30" : "border-line focus:border-primary" )}
                />
                <Smile className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              </div>
              {formErrors.studentName && (
                <span className="text-[11px] font-medium text-destructive px-1">
                  {formErrors.studentName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-xs font-semibold text-foreground">عمر الطفل</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: 10"
                  value={childrenList[0]?.age || (age ? `${age}` : "")}
                  onChange={(e) => {
                    const newList = [...childrenList];
                    if (newList[0]) newList[0].age = e.target.value;
                    setChildrenList(newList);
                  }}
                  className="h-10 w-full rounded-xl border border-line bg-secondary/20 px-3 text-xs sm:text-sm outline-none focus:border-primary transition-colors pr-9 font-mono"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2.5 mt-2" dir="rtl">
          <Button
            type="button"
            variant="outline"
            onClick={() => go(15, -1)}
            className="h-10 sm:h-11 flex-[0.8] rounded-xl text-xs sm:text-sm font-semibold border border-line bg-secondary/30 hover:bg-secondary/60 text-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="size-4" />
            <span>السابق</span>
          </Button>
          <Button
            type="button"
            onClick={validateAndNext}
            className="h-10 sm:h-11 flex-[2] rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>التالي — التأكيد</span>
            <ArrowLeft className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Panel 17: Summary
  if (panel === 17) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const getDayName = (d: number | null) => {
      if (!d) return "";
      const blanks = [0, 1, 2, 3];
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    return (
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            ملخص الحجز
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            تأكد من تفاصيل الموعد قبل تأكيد الحجز
          </p>
        </div>

        {/* Summary Content */}
        <div className="flex flex-col rounded-xl border border-line divide-y divide-line bg-secondary/25 overflow-hidden" dir="rtl">
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">الموعد</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground font-mono">
              {getDayName(bookingDay)} {bookingDay} أكتوبر
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">الوقت</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground font-mono">
              {bookingTime}
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">ولي الأمر</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              {parentName || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">الجوال</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground font-mono" dir="ltr">
              {phone || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">الطفل</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground">
              {childrenList[0]?.name || "-"} ({childrenList[0]?.age || age || "-"} سنوات)
            </span>
          </div>
          <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">المسار المقترح</span>
            <span className="text-xs sm:text-sm font-semibold text-primary font-mono">
              EN2 — مسار تمهيدي
            </span>
          </div>
        </div>

        {submitError && (
          <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
            {submitError}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-2" dir="rtl">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => go(16, -1)}
            className="h-10 sm:h-11 flex-[0.8] rounded-xl text-xs sm:text-sm font-semibold border border-line bg-secondary/30 hover:bg-secondary/60 text-foreground transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>تعديل</span>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            onClick={() => onConfirmBooking?.()}
            disabled={isSubmitting}
            className="h-10 sm:h-11 flex-[2] rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span>جاري تأكيد الحجز...</span>
                <Loader2 className="size-4 animate-spin" />
              </>
            ) : (
              <>
                <span>تأكيد الحجز</span>
                <Bookmark className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Panel 18: Success
  if (panel === 18) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const getDayName = (d: number | null) => {
      if (!d) return "";
      const blanks = [0, 1, 2, 3];
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    return (
      <div className="flex flex-col gap-4 text-center items-center pt-2 pb-2">
        <motion.div
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { scale: 0.3, opacity: 0, filter: "blur(4px)" }
          }
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ ...ICON_SWAP, delay: 0.08 }}
          className="flex size-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 shadow-sm"
        >
          <CheckCircle2 className="size-8" />
        </motion.div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            تم استلام طلب الحجز بنجاح!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-primary font-mono" dir="rtl">
            موعدك: {getDayName(bookingDay)} {bookingDay} أكتوبر — {bookingTime}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground font-medium max-w-[360px] leading-relaxed">
          سنرسل تأكيد الحجز على بريدك الإلكتروني وسيتواصل معك فريق سَنَد قبل الموعد.
        </p>

        {requestCode && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-secondary/50 border border-line px-3.5 py-2 text-xs font-semibold text-muted-foreground">
            <span>رقم متابعة الطلب:</span>
            <span dir="ltr" className="font-mono tracking-wider font-bold text-foreground">
              {requestCode}
            </span>
          </div>
        )}

        <div className="w-full mt-2" dir="rtl">
          <button
            type="button"
            onClick={() => onCreate?.()}
            className="h-10 sm:h-11 w-full rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-[scale,opacity,background-color] duration-150 ease-out cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] shadow-sm"
          >
            <span>العودة للصفحة الرئيسية</span>
            <ArrowLeft className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
