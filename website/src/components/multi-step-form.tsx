"use client";

import { useId, useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type Variants,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Compass, Users, Gamepad2, Calendar, BookOpen, X, ChevronRight, ChevronLeft, Check, ArrowLeft, Clock, User, Mail, Smile, Plus, ArrowRight, ChevronDown, Pencil, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Panel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const HEIGHT = { type: "spring", duration: 0.3, bounce: 0 } as const;
const SHIFT = 36;

// RTL transitions
const slide: Variants = {
  enter: (d: number) => ({ x: d * -SHIFT, opacity: 0, filter: "blur(4px)" }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: EASE_OUT },
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
  const uid = useId();
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
  const [bookingDay, setBookingDay] = useState<number | null>(null);
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [childrenList, setChildrenList] = useState([{ name: "", age: "" }]);

  const bodyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const height = useMotionValue(0);
  const [measured, setMeasured] = useState(false);
  const hasMeasured = useRef(false);

  useLayoutEffect(() => {
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
  }, [height, reduceMotion]);

  const go = (next: Panel, dir: 1 | -1) => {
    setDirection(dir);
    setPanel(next);
  };

  const content = (p: Panel, isGhost: boolean) => (
    <PanelContent
      panel={p}
      age={age}
      setAge={setAge}
      q1={q1}
      setQ1={(val) => {
        setQ1(val);
        if (!isGhost) setTimeout(() => go(3, 1), 400);
      }}
      q2={q2}
      setQ2={(val) => {
        setQ2(val);
        if (!isGhost) setTimeout(() => go(4, 1), 400);
      }}
      q3={q3}
      setQ3={(val) => {
        setQ3(val);
        if (!isGhost) setTimeout(() => go(5, 1), 400);
      }}
      c1={c1}
      setC1={(val) => {
        setC1(val);
        if (!isGhost) setTimeout(() => go(7, 1), 400);
      }}
      c2={c2}
      setC2={(val) => {
        setC2(val);
        if (!isGhost) setTimeout(() => go(8, 1), 400);
      }}
      c3={c3}
      setC3={(val) => {
        setC3(val);
        if (!isGhost) setTimeout(() => go(9, 1), 400);
      }}
      c4={c4}
      setC4={(val) => {
        setC4(val);
        if (!isGhost) setTimeout(() => go(10, 1), 400);
      }}
      c5={c5}
      setC5={(val) => {
        setC5(val);
        if (!isGhost && val.length === 3) {
          setTimeout(() => go(11, 1), 800);
        }
      }}
      c6={c6}
      setC6={(val) => {
        setC6(val);
        if (!isGhost) setTimeout(() => go(12, 1), 400);
      }}
      c7={c7}
      setC7={(val) => {
        setC7(val);
        if (!isGhost) setTimeout(() => go(13, 1), 400);
      }}
      c10={c10}
      setC10={(val) => {
        setC10(val);
        if (!isGhost) setTimeout(() => go(14, 1), 400);
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
      go={go}
      onCreate={onCreate}
    />
  );

  return (
    <div className={cn(" grid w-full max-w-[800px] font-sans mx-auto", className)} dir="rtl">
      {/* Ghost layer to pre-calculate height */}
      <div
        aria-hidden
        inert
        className="invisible col-start-1 row-start-1 flex flex-col overflow-hidden w-full"
      >
        <div className="grid">
          {([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const).map((p) => (
            <div key={p} className="col-start-1 row-start-1 p-4 sm:p-6 md:p-8">
              {content(p, true)}
            </div>
          ))}
        </div>
      </div>

      <form
        noValidate
        className="col-start-1 bg-background row-start-1 flex flex-col self-start w-full overflow-hidden max-h-[85vh] text-foreground shadow-2xl border relative"
        onSubmit={(e) => e.preventDefault()}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer absolute top-4 left-4 z-50 flex size-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="إغلاق"
          >
            <X className="size-5" />
          </button>
        )}
        {/* Overall Progress Stepper */}
        {panel >= 0 && (
          <div className="w-full flex justify-center px-4 pt-6 sm:pt-8 pb-2 shrink-0 z-10">
            <ProgressStepper
              steps={["قيم ابنك", "اختر الموعد", "البيانات الشخصية", "التأكيد"]}
              current={panel <= 14 ? 0 : panel === 15 ? 1 : panel === 16 ? 2 : 3}
              className="w-full max-w-full mt-10"
            />
          </div>
        )}

        <motion.div
          ref={bodyRef}
          className="overflow-y-auto overflow-x-hidden custom-scrollbar w-full"
          style={{ height: measured ? height : "auto" }}
        >
          <div ref={innerRef} className="relative">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={panel}
                custom={direction}
                variants={reduceMotion ? fade : slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-4 sm:p-6 md:p-8 pt-2 sm:pt-4 w-full max-w-full"
              >
                {content(panel, false)}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </form>
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
  setC5: (q: string[]) => void;
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
  parentName?: string;
  setParentName?: (v: string) => void;
  phone?: string;
  setPhone?: (v: string) => void;
  email?: string;
  setEmail?: (v: string) => void;
  childrenList?: { name: string; age: string }[];
  setChildrenList?: (v: { name: string; age: string }[]) => void;
  go: (next: Panel, dir: 1 | -1) => void;
  onCreate?: () => void;
}) {
  if (panel === -1) {
    return (
      <div className="flex flex-col pt-2 pb-2">
        <div className="flex items-center justify-between mb-8">
          <div className="text-primary font-bold text-sm px-4 py-1.5 rounded-full">
            خطوتك الأولى
          </div>
          
        </div>

        <h2 className="text-[28px] md:text-[32px] font-extrabold text-foreground mb-3 leading-snug text-right">
          احجز تقييم مستوى طفلك
        </h2>
        <p className="text-muted-foreground text-[16px] mb-8 text-right font-medium">
          سنفهم مستواه واهتماماته، ثم نرشح نقطة البداية الأنسب.
        </p>

        <div className="flex flex-col border-t border-border/60">
          <div className="bg-muted px-6 rounded flex justify-between items-center py-4 my-2">
            <span className="text-muted-foreground font-bold text-[15px]">نحدد</span>
            <span className="text-foreground font-extrabold text-[15px]">المسار والمستوى المناسبين</span>
          </div>
          <div className="bg-muted px-6 rounded flex justify-between items-center py-4 my-2">
            <span className="text-muted-foreground font-bold text-[15px]">نوضح</span>
            <span className="text-foreground font-extrabold text-[15px]">المدة وعدد الحصص</span>
          </div>
          <div className="bg-muted px-6 rounded flex justify-between items-center py-4 my-2">
            <span className="text-muted-foreground font-bold text-[15px]">الفئة العمرية</span>
            <span className="text-foreground font-extrabold text-[15px]">من 6 إلى 18 سنة</span>
          </div>
          <div className="bg-muted px-6 rounded flex justify-between items-center py-4 my-2">
            <span className="text-muted-foreground font-bold text-[15px]">النتيجة المتوقعة</span>
            <span className="text-foreground font-extrabold text-[15px]">مهارات عملية + مشروع</span>
          </div>
          <div className="bg-muted px-6 rounded flex justify-between items-center py-4 my-2">
            <span className="text-muted-foreground font-bold text-[15px]">السعر</span>
            <span className="text-foreground font-extrabold text-[15px]">يُوضح حسب المسار</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 w-full">
          <Button
            onClick={() => go(0, 1)}
            className="cursor-po h-[54px] w-full rounded text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span>ابدأ التقييم</span>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p className="text-[12px] text-muted-foreground font-medium">
            لن تحتاج إلى اختيار باقة قبل أن تعرف ما يناسب طفلك.
          </p>
        </div>
      </div>
    );
  }

  if (panel === 0) {
    const ages = Array.from({ length: 12 }, (_, i) => i + 6);
    return (
      <div className="flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-[26px] font-extrabold text-foreground">كم عمر ابنك؟</h2>
          <p className="text-muted-foreground text-[15px]">
            اختر العمر بالتحديد لتكييف صعوبة الأسئلة
          </p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {ages.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAge(a)}
              className={cn(
                "h-14 rounded text-[20px] font-bold transition-all border-2",
                age === a
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent bg-secondary text-secondary-foreground shadow-sm hover:border-border"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        <Button
          onClick={() => go(1, 1)}
          disabled={!age}
          className="h-[54px] w-full rounded text-lg font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          التالي
        </Button>
      </div>
    );
  }

  if (panel === 1) {
    return (
      <div className="flex flex-col gap-7 text-center items-center pt-2">
        <div className="flex size-[72px] items-center justify-center rounded bg-secondary shadow-sm">
          <Compass className="size-9 text-muted-foreground" strokeWidth={1.5} />
        </div>
        
        <h2 className="text-[28px] font-extrabold text-foreground">
          ما هو التقييم المبدئي؟
        </h2>
        
        <p className="text-muted-foreground text-[15px] leading-relaxed px-1 font-medium">
          في تجربة قصيرة وممتعة (5-7 دقائق)، نبدأ بثلاثة أسئلة سريعة لك كولي أمر، 
          ثم سلّم الجهاز لابنك ليخوض 10 تحديات ذكية ممتعة تكتشف مهاراته في التفكير والإبداع وحل المشكلات.
        </p>

        <div className="grid grid-cols-3 gap-3 w-full mt-1">
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 rounded bg-secondary/50 py-3 sm:py-4 px-1 sm:px-2 shadow-sm border border-border">
            <Users className="size-5 sm:size-6 text-muted-foreground" />
            <span className="text-[10px] sm:text-[11px] font-extrabold text-foreground text-center">3 أسئلة لك</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 rounded bg-secondary/50 py-3 sm:py-4 px-1 sm:px-2 shadow-sm border border-border">
            <Gamepad2 className="size-5 sm:size-6 text-muted-foreground" />
            <span className="text-[10px] sm:text-[11px] font-extrabold text-foreground text-center">10 تحديات لابنك</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5 rounded bg-secondary/50 py-3 sm:py-4 px-1 sm:px-2 shadow-sm border border-border">
            <Calendar className="size-5 sm:size-6 text-muted-foreground" />
            <span className="text-[10px] sm:text-[11px] font-extrabold text-foreground text-center">حجز التقييم العملي</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-3">
          <Button
            onClick={() => go(2, 1)}
            className="h-[54px] w-full rounded text-lg font-bold transition-all shadow-lg shadow-primary/25"
          >
            لنبداً
          </Button>
          <button
            type="button"
            onClick={() => go(0, -1)}
            className="text-[15px] font-bold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            تغيير العمر
          </button>
        </div>
      </div>
    );
  }

  if (panel === 2) {
    const options = [
      { id: "1", label: "الألعاب والقصص" },
      { id: "2", label: "الرسم والتصميم" },
      { id: "3", label: "الروبوتات والآلات" },
      { id: "4", label: "الأرقام والألغاز" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">1 / 3</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-4 text-foreground" />
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1">
          ما أكثر ما يجذب ابنك؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = q1 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ1(opt.id)}
                className={cn(
                  "flex items-center justify-between rounded border-2 p-4 transition-all bg-secondary/20",
                  checked
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border shadow-sm hover:border-primary/50"
                )}
              >
                <span className="text-[17px] font-bold text-foreground">{opt.label}</span>
                <span className={cn(
                  "flex size-[34px] items-center justify-center rounded text-[15px] font-extrabold transition-colors",
                  checked ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                )}>
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1, -1)}
          className="text-[15px] font-bold text-muted-foreground hover:text-foreground transition-colors mt-3"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (panel === 3) {
    const options = [
      { id: "1", label: "لا يوجد بعد" },
      { id: "2", label: "خبرة بسيطة" },
      { id: "3", label: "خبرة جيدة" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">2 / 3</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-4 text-foreground" />
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1">
          هل لديه خبرة سابقة في البرمجة أو الروبوتات؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = q2 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ2(opt.id)}
                className={cn(
                  "flex items-center justify-between rounded border-2 p-4 transition-all bg-secondary/20",
                  checked
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border shadow-sm hover:border-primary/50"
                )}
              >
                <span className="text-[17px] font-bold text-foreground">{opt.label}</span>
                <span className={cn(
                  "flex size-[34px] items-center justify-center rounded text-[15px] font-extrabold transition-colors",
                  checked ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                )}>
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(2, -1)}
          className="text-[15px] font-bold text-muted-foreground hover:text-foreground transition-colors mt-3"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (panel === 4) {
    const options = [
      { id: "1", label: "مهارات المستقبل" },
      { id: "2", label: "الإبداع والثقة" },
      { id: "3", label: "التفوق الدراسي" },
      { id: "4", label: "استثمار وقته بفائدة" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">3 / 3</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">سؤال لولي الأمر</span>
            <BookOpen className="size-4 text-foreground" />
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1">
          ما هدفك الأهم من انضمامه؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = q3 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQ3(opt.id)}
                className={cn(
                  "flex items-center justify-between rounded border-2 p-4 transition-all bg-secondary/20",
                  checked
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border shadow-sm hover:border-primary/50"
                )}
              >
                <span className="text-[17px] font-bold text-foreground">{opt.label}</span>
                <span className={cn(
                  "flex size-[34px] items-center justify-center rounded text-[15px] font-extrabold transition-colors",
                  checked ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                )}>
                  {opt.id}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(3, -1)}
          className="text-[15px] font-bold text-muted-foreground hover:text-foreground transition-colors mt-3"
        >
          رجوع
        </button>
      </div>
    );
  }

  if (panel === 5) {
    return (
      <div className="flex flex-col gap-7 text-center items-center pt-4">
        <div className="flex flex-col items-center justify-center">
          <div className="text-[64px] mb-2 leading-none">🤖</div>
          <Gamepad2 className="size-8 text-primary/80 -mt-4" />
        </div>
        
        <h2 className="text-[28px] font-extrabold text-foreground">
          دور البطل يبدأ الآن!
        </h2>
        
        <p className="text-muted-foreground text-[15px] leading-relaxed px-1 font-medium">
          من فضلك سلّم الجهاز إلى ابنك 📱. الأسئلة القادمة له وحده — 
          مجرد ألعاب ذكية ممتعة، ولا توجد إجابات تحرج. نيكسي سيرافقه في الرحلة!
        </p>

        <div className="flex flex-col gap-3 w-full mt-4">
          <Button
            onClick={() => go(6, 1)}
            className="h-[54px] w-full rounded text-lg font-bold transition-all shadow-lg shadow-primary/25"
          >
            أنا جاهز — لنبدأ!
          </Button>
        </div>
      </div>
    );
  }

  if (panel === 6) {
    const options = [
      { id: "24", label: "24" },
      { id: "28", label: "28" },
      { id: "30", label: "30" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">1 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">النمط الرقمي</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1">
          أكمل المتتالية
        </h2>

        <div className="flex items-center justify-center gap-2 mt-4 bg-secondary/30 p-4 rounded">
          {[2, 6, 12, 20].map((num) => (
            <div key={num} className="flex size-12 md:size-14 items-center justify-center rounded bg-muted/30 text-xl font-bold text-foreground shadow-sm">
              {num}
            </div>
          ))}
          <div className="flex size-12 md:size-14 items-center justify-center rounded bg-primary/10 text-xl font-bold text-primary shadow-sm border border-primary/20 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)]">
            ؟
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {options.map((opt) => {
            const checked = c1 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC1(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-xl font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 7) {
    const options = [
      { id: "1", label: "A أكبر من C" },
      { id: "2", label: "A أصغر من C" },
      { id: "3", label: "متساويان" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">2 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">التفكير المنطقي</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          إذا A أكبر من B، و B أكبر من C — فما علاقة A بـ C؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = c2 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC2(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-lg font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 8) {
    const options = [
      { id: "10", label: "10" },
      { id: "12", label: "12" },
      { id: "16", label: "16" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">3 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">النمط</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          كل رقم ضعف الذي قبله — ما التالي؟
        </h2>

        <div className="flex items-center justify-center gap-2 mt-4 bg-secondary/30 p-4 rounded" dir="ltr">
          {[1, 2, 4, 8].map((num) => (
            <div key={num} className="flex size-12 md:size-14 items-center justify-center rounded bg-muted/30 text-xl font-bold text-foreground shadow-sm">
              {num}
            </div>
          ))}
          <div className="flex size-12 md:size-14 items-center justify-center rounded bg-primary/10 text-xl font-bold text-primary shadow-sm border border-primary/20 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)]">
            ؟
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {options.map((opt) => {
            const checked = c3 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC3(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-xl font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 9) {
    const options = [
      { id: "1", label: "نموذج بسيط يعمل" },
      { id: "2", label: "شرح نظري طويل" },
      { id: "3", label: "تصميم الشعار" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">4 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">حل المشكلات</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          لديك 5 دقائق لعرض فكرتك — بمَ تبدأ؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = c4 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC4(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-lg font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 10) {
    const options = [
      { id: "test", label: "اختبار" },
      { id: "idea", label: "فكرة" },
      { id: "execute", label: "تنفيذ" },
    ];

    const toggleOption = (id: string) => {
      if (c5.includes(id)) {
        setC5(c5.filter(i => i !== id));
      } else {
        if (c5.length < 3) {
          setC5([...c5, id]);
        }
      }
    };

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">5 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">التسلسل</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          رتّب خطوات بناء مشروع بالترتيب الصحيح
        </h2>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {options.map((opt) => {
            const index = c5.indexOf(opt.id);
            const isSelected = index !== -1;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(opt.id)}
                className={cn(
                  "relative flex h-[80px] items-center justify-center rounded border-2 transition-all bg-background",
                  isSelected
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                {isSelected && (
                  <span className="absolute -top-3 -right-2 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                )}
                <span className="text-lg font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
        
        <p className="text-center text-sm font-medium text-muted-foreground -mt-2">
          اضغط البطاقات بالترتيب الصحيح
        </p>
      </div>
    );
  }

  if (panel === 11) {
    const options = [
      { id: "12", label: "12" },
      { id: "10", label: "10" },
      { id: "9", label: "9" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">6 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">التفكير المنطقي</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          أي رقم لا يقبل القسمة على 3؟
        </h2>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {options.map((opt) => {
            const checked = c6 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC6(opt.id)}
                className={cn(
                  "flex h-[70px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-2xl font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 12) {
    const options = [
      { id: "1", label: "الصور والأمثلة" },
      { id: "2", label: "الألوان فقط" },
      { id: "3", label: "الحظ" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">7 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">الفضول</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          لتعليم الحاسوب تمييز القطط 🐱، نعطيه كثيرًا من...؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = c7 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC7(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-lg font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 13) {
    const options = [
      { id: "1", label: "بناء نموذج مصغر" },
      { id: "2", label: "الانتظار سنة" },
      { id: "3", label: "عدم المحاولة" },
    ];

    return (
      <div className="flex flex-col gap-8 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground opacity-60">10 / 10</span>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <span className="text-[13px] font-bold text-foreground">حل المشكلات</span>
            <span className="text-yellow-500 text-sm">⚡</span>
          </div>
        </div>

        <h2 className="text-[26px] font-extrabold text-foreground text-center mt-1 leading-snug">
          أفضل طريقة لاختبار فكرة بسرعة؟
        </h2>

        <div className="flex flex-col gap-3.5 mt-2">
          {options.map((opt) => {
            const checked = c10 === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setC10(opt.id)}
                className={cn(
                  "flex h-[60px] items-center justify-center rounded border-2 transition-all bg-background",
                  checked
                    ? "border-primary shadow-md shadow-primary/10 text-primary"
                    : "border-border shadow-sm hover:border-primary/50 text-foreground"
                )}
              >
                <span className="text-lg font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (panel === 14) {
    return (
      <div className="flex flex-col gap-5 text-center items-center pt-2">
        <div className="flex size-[80px] items-center justify-center rounded-full bg-emerald-500/10 mb-2">
          <div className="flex size-[60px] items-center justify-center rounded-full bg-emerald-500 text-3xl shadow-lg shadow-emerald-500/20">
            🎉
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-primary">القبول المبدئي</span>
          <h2 className="text-[30px] font-extrabold text-foreground leading-snug">
            تهانينا! تم قبولك مبدئياً
          </h2>
        </div>
        
        <p className="text-muted-foreground text-[15px] leading-relaxed px-2 font-medium">
          لقد اجتزت التقييم المبدئي للانتقال إلى المرحلة التالية. يمكنك الآن حجز جلسة التقييم الحضورية.
        </p>

        <div className="flex items-center gap-2 sm:gap-4 w-full mt-2 justify-center">
          <div className="flex flex-col items-center justify-center gap-1 rounded bg-background py-3 sm:py-4 px-4 sm:px-6 shadow-sm border-2 border-secondary flex-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary">EN2</span>
            <span className="text-[11px] sm:text-[12px] font-bold text-muted-foreground mt-1 text-center">المستوى المقترح</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 rounded bg-background py-3 sm:py-4 px-4 sm:px-6 shadow-sm border-2 border-secondary flex-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">7</span>
              <span className="text-base sm:text-lg font-bold text-muted-foreground">/10</span>
            </div>
            <span className="text-[11px] sm:text-[12px] font-bold text-muted-foreground mt-1 text-center">نتيجتك</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-2">
          <Button
            onClick={() => go(15, 1)}
            className="h-[54px] w-full rounded text-lg font-bold transition-all shadow-lg shadow-primary/25"
          >
            احجز جلسة التقييم الحضورية
          </Button>
          <p className="text-[11px] font-medium text-muted-foreground">
            المستوى النهائي يُؤكّد بالتقييم الحضوري داخل المقر
          </p>
        </div>
      </div>
    );
  }

  if (panel === 15) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const blanks = [0, 1, 2, 3];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const getDayName = (d: number) => {
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    const timeslots = [
      "9:00 ص", "10:00 ص", "12:00 ص",
      "1:00 م", "2:00 م", "3:00 م",
      "4:00 م", "5:00 م", "6:00 م"
    ];

    return (
      <div className="flex flex-col gap-6 pt-2 pb-4">
        <div className="flex items-center justify-between" dir="ltr">
          <button type="button" onClick={() => onCreate?.()} className="rounded border-2 border-border p-1.5 hover:bg-secondary transition-colors">
            <X className="size-5 text-foreground" />
          </button>
          <h2 className="text-[22px] font-extrabold text-foreground" dir="rtl">
            احجز حصة تجريبية مجانية
          </h2>
        </div>



        {/* Calendar */}
        <div className="flex flex-col gap-4 mt-2 px-4">
          <div className="flex items-center justify-between">
            <button type="button" className="p-1 hover:bg-secondary rounded">
              <ChevronRight className="size-5 text-foreground" />
            </button>
            <span className="text-[15px] font-bold text-foreground">أكتوبر 2026</span>
            <button type="button" className="p-1 hover:bg-secondary rounded">
              <ChevronLeft className="size-5 text-foreground" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 text-center" dir="rtl">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-[12px] font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
            {blanks.map((b) => (
              <div key={`b-${b}`} className="py-2"></div>
            ))}
            {days.map((d) => {
              const isFriday = (d + blanks.length - 1) % 7 === 5; // 0=Sun.. 5=Fri
              const isSelected = bookingDay === d;
              return (
                <button
                  key={d}
                  type="button"
                  disabled={isFriday}
                  onClick={() => { setBookingDay(d); setBookingTime(null); }}
                  className={cn(
                    "h-10 w-full flex items-center justify-center text-[15px] font-bold transition-all rounded",
                    isFriday ? "text-muted-foreground/30" : 
                    isSelected ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-foreground hover:bg-secondary"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {bookingDay && (
          <div className="flex flex-col gap-3 px-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 text-foreground" dir="rtl">
              <Clock className="size-[18px]" />
              <span className="text-[14px] font-bold">المواعيد المتاحة — {getDayName(bookingDay)} {bookingDay} أكتوبر</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2" dir="rtl">
              {timeslots.map((time) => {
                const isSelected = bookingTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setBookingTime(time)}
                    className={cn(
                      "h-[44px] rounded text-[14px] font-bold transition-all border-2",
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-background border-border text-foreground hover:border-primary/50"
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="px-4 mt-2">
          <Button
            onClick={() => {
              if (bookingTime) go(16, 1);
            }}
            className={cn(
              "h-[54px] w-full rounded text-lg font-bold transition-all",
              bookingTime
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            التالي — البيانات
            <ArrowLeft className="mr-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (panel === 16) {
    return (
      <div className="flex flex-col gap-6 pt-2 pb-4">
        <div className="flex items-center justify-between" dir="ltr">
          <button type="button" onClick={() => go(15, -1)} className="rounded border-2 border-border p-1.5 hover:bg-secondary transition-colors">
            <X className="size-5 text-foreground" />
          </button>
          <h2 className="text-[22px] font-extrabold text-foreground" dir="rtl">
            احجز حصة تجريبية مجانية
          </h2>
        </div>



        {/* Form Fields */}
        <div className="flex flex-col gap-4 mt-2 px-2" dir="rtl">
          {/* Parent Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-foreground">
              اسم ولي الأمر <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={parentName}
                onChange={(e) => setParentName?.(e.target.value)}
                className="h-12 w-full rounded border-2 border-border bg-background px-4 text-[15px] outline-none focus:border-primary transition-colors text-right pl-4 pr-11"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-foreground">
              رقم الجوال <span className="text-destructive">*</span>
            </label>
            <div className="relative flex items-center h-12 w-full rounded border-2 border-border bg-background overflow-hidden focus-within:border-primary transition-colors">
              <input
                type="tel"
                placeholder="05XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone?.(e.target.value)}
                className="flex-1 min-w-0 h-full bg-transparent px-4 text-[15px] outline-none text-left"
                dir="ltr"
              />
              <div className="flex items-center gap-2 h-full px-3 border-r-2 border-border bg-secondary/30 text-foreground" dir="ltr">
                <ChevronDown className="size-4 text-muted-foreground" />
                <span className="text-[14px] font-bold">+249</span>
                <div className="size-5 rounded-full overflow-hidden bg-white border border-border flex items-center justify-center text-[10px] leading-none">
                  🇪🇬
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-foreground">
              البريد الإلكتروني <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail?.(e.target.value)}
                className="h-12 w-full rounded border-2 border-border bg-background px-4 text-[15px] outline-none focus:border-primary transition-colors text-left pl-4 pr-11"
                dir="ltr"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
            </div>
          </div>

          {/* Children */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 w-full min-w-0">
              <label className="text-[14px] font-bold text-foreground">
                اسم الطفل <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اسم الطفل"
                  value={childrenList?.[0]?.name || ""}
                  onChange={(e) => {
                    const newList = [...(childrenList || [])];
                    if (newList[0]) newList[0].name = e.target.value;
                    setChildrenList?.(newList);
                  }}
                  className="h-12 w-full rounded border-2 border-border bg-background px-4 text-[15px] outline-none focus:border-primary transition-colors pr-11"
                />
                <Smile className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 w-full min-w-0">
              <label className="text-[14px] font-bold text-foreground">
                عمر الطفل <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: 10"
                  value={childrenList?.[0]?.age || ""}
                  onChange={(e) => {
                    const newList = [...(childrenList || [])];
                    if (newList[0]) newList[0].age = e.target.value;
                    setChildrenList?.(newList);
                  }}
                  className="h-12 w-full rounded border-2 border-border bg-background px-4 text-[15px] outline-none focus:border-primary transition-colors pr-11"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
              </div>
            </div>
          </div>

          {/* Add Child Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 h-12 w-full rounded bg-secondary hover:bg-secondary/80 text-foreground text-[15px] font-bold transition-colors mt-2"
          >
            <Plus className="size-5" />
            اضافة طفل
          </button>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 px-2 mt-4" dir="rtl">
          <Button
            variant="outline"
            onClick={() => go(15, -1)}
            className="h-[50px] flex-[0.8] rounded text-[15px] font-bold border-2 hover:bg-secondary transition-all text-foreground"
          >
            <ArrowRight className="ml-2 size-5" />
            السابق
          </Button>
          <Button
            onClick={() => go(17, 1)}
            className="h-[50px] flex-[2] rounded text-[15px] font-bold bg-primary/20 hover:bg-primary/30 text-primary transition-all shadow-none"
          >
            التالي — التأكيد
            <ArrowLeft className="mr-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (panel === 17) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const getDayName = (d: number | null) => {
      if (!d) return "";
      const blanks = [0, 1, 2, 3];
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    return (
      <div className="flex flex-col gap-6 pt-2 pb-4">
        <div className="flex items-center justify-between" dir="ltr">
          <button type="button" onClick={() => onCreate?.()} className="rounded border-2 border-border p-1.5 hover:bg-secondary transition-colors">
            <X className="size-5 text-foreground" />
          </button>
          <h2 className="text-[22px] font-extrabold text-foreground" dir="rtl">
            احجز حصة تجريبية مجانية
          </h2>
        </div>



        {/* Summary Content */}
        <div className="flex flex-col mt-4 px-2" dir="rtl">
          <h3 className="text-[17px] font-extrabold text-foreground text-center mb-6">
            ملخص الحجز
          </h3>
          
          <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-muted-foreground">الموعد</span>
              <span className="text-[16px] font-bold text-foreground">{getDayName(bookingDay)} {bookingDay} أكتوبر</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-muted-foreground">الوقت</span>
              <span className="text-[16px] font-bold text-foreground">{bookingTime}</span>
            </div>
            
            <div className="h-px w-full bg-border/60 my-2"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-muted-foreground">ولي الأمر</span>
              <span className="text-[16px] font-bold text-foreground">{parentName || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-muted-foreground">الجوال</span>
              <span className="text-[16px] font-bold text-foreground" dir="ltr">{phone || "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-muted-foreground">الطفل</span>
              <span className="text-[16px] font-bold text-foreground">{childrenList?.[0]?.name || "-"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-2 mt-8" dir="rtl">
          <Button
            variant="outline"
            onClick={() => go(16, -1)}
            className="h-[54px] flex-[0.7] rounded text-[16px] font-bold border-2 hover:bg-secondary transition-all text-foreground"
          >
            تعديل
            <Pencil className="mr-2 size-4" />
          </Button>
          <Button
            onClick={() => go(18, 1)}
            className="h-[54px] flex-[2] rounded text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md shadow-primary/20"
          >
            تأكيد الحجز
            <Bookmark className="mr-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (panel === 18) {
    const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    const getDayName = (d: number | null) => {
      if (!d) return "";
      const blanks = [0, 1, 2, 3];
      const idx = (d + blanks.length - 1) % 7;
      return daysOfWeek[idx];
    };

    return (
      <div className="flex flex-col pt-4 pb-4 min-h-[380px]">
        <div className="flex items-start justify-between" dir="ltr">
          <button type="button" onClick={() => onCreate?.()} className="rounded border-2 border-border p-1.5 hover:bg-secondary transition-colors mt-1">
            <X className="size-5 text-foreground" />
          </button>
          <div className="flex flex-col items-end gap-1.5" dir="rtl">
            <h2 className="text-[24px] font-extrabold text-foreground">
              تم تأكيد الحجز
            </h2>
            <p className="text-[14px] font-bold text-primary" dir="rtl">
              موعدك: {getDayName(bookingDay)} {bookingDay} أكتوبر — {bookingTime}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-border/60 mt-6 mb-16"></div>

        <div className="flex flex-col items-center justify-center gap-3 text-center mb-16 px-4">
          <h3 className="text-[22px] font-extrabold text-foreground">
            تم استلام طلب الحجز
          </h3>
          <p className="text-[15px] font-medium text-muted-foreground max-w-[340px]">
            سنرسل تأكيد الحجز على بريدك الإلكتروني ونتواصل معك قبل الموعد بيوم
          </p>
        </div>

        <div className="mt-auto px-4 w-full flex justify-center" dir="rtl">
          <Button
            onClick={() => onCreate?.()}
            className="h-[54px] w-[80%] rounded text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-md shadow-primary/20"
          >
            العودة للصفحة الرئيسية
            <ArrowLeft className="mr-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

// --- Stepper Components ---

const ICON_SWAP = { type: "spring", duration: 0.3, bounce: 0 } as const;
const LINE_MS = 240;
const STAGGER_MS = 120;
const ARRIVE_MS = 160;
const TAIL_LAG = 0.12;
const INCH_EASE = [0.77, 0, 0.175, 1] as const;
const HALO = 22;

type Status = "complete" | "current" | "upcoming";

export function ProgressStepper({
  steps,
  current,
  label = "Progress",
  className,
}: {
  steps: string[];
  current: number;
  label?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [move, setMove] = useState({ from: current, to: current });
  if (move.to !== current) setMove({ from: move.to, to: current });
  const { from } = move;
  const last = steps.length - 1;
  const n = steps.length;

  const olRef = useRef<HTMLOListElement>(null);
  const rtl = useRef(false);
  const head = useMotionValue(current);
  const tail = useMotionValue(current);
  const runs = useRef<AnimationPlaybackControls[]>([]);
  const prev = useRef(current);

  useEffect(() => {
    const start = prev.current;
    prev.current = current;
    if (start === current) return;
    if (olRef.current) rtl.current = getComputedStyle(olRef.current).direction === "rtl";
    runs.current.forEach((r) => r.stop());
    if (reduceMotion) {
      head.jump(current);
      tail.jump(current);
      return;
    }
    const travel = ((Math.abs(current - start) - 1) * STAGGER_MS + LINE_MS) / 1000;
    runs.current = [
      animate(head, current, { duration: travel, ease: INCH_EASE }),
      animate(tail, current, { duration: travel, ease: INCH_EASE, delay: TAIL_LAG }),
    ];
  }, [current, reduceMotion, head, tail]);

  useEffect(() => () => runs.current.forEach((r) => r.stop()), []);

  const clip = useTransform([head, tail], ([h, t]: number[]) => {
    const lo = ((Math.min(h, t) + 0.5) / n) * 100;
    const hi = ((Math.max(h, t) + 0.5) / n) * 100;
    const [l, r] = rtl.current ? [100 - hi, lo] : [lo, 100 - hi];
    return `inset(0 calc(${r}% - ${HALO}px) 0 calc(${l}% - ${HALO}px) round ${HALO}px)`;
  });

  const lineDelay = (k: number) => {
    if (reduceMotion) return 0;
    if (current > from && k >= from && k < current) return (k - from) * STAGGER_MS;
    if (current < from && k >= current && k < from)
      return (from - 1 - k) * STAGGER_MS;
    return 0;
  };

  const stepDelay = (j: number) => {
    if (reduceMotion) return 0;
    if (current > from && j > from && j <= current)
      return (j - 1 - from) * STAGGER_MS + ARRIVE_MS;
    if (current < from && j >= current && j < from)
      return (from - 1 - j) * STAGGER_MS + ARRIVE_MS;
    return 0;
  };

  const statusOf = (j: number): Status =>
    j < current ? "complete" : j === current ? "current" : "upcoming";

  return (
    <div className={cn("w-[min(520px,100%)] mx-auto", className)} dir="rtl">
      <ol
        ref={olRef}
        aria-label={label}
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        <motion.span
          aria-hidden
          style={{ clipPath: clip }}
          className="pointer-events-none absolute inset-x-0 -top-1 h-11 bg-primary/10"
        />
        {steps.map((step, j) => {
          const status = statusOf(j);
          const checked =
            status === "complete" || (status === "current" && j === last);
          const delay = stepDelay(j);
          return (
            <li
              key={step}
              aria-current={status === "current" ? "step" : undefined}
              className="relative flex flex-col items-center gap-2.5"
            >
              {j < last && (
                <span
                  aria-hidden
                  className="absolute top-[17px] right-[calc(50%+26px)] left-[calc(-50%+26px)] h-0.5 overflow-hidden rounded-full bg-border"
                >
                  <span
                    className={cn(
                      "absolute inset-0 origin-right rounded-full bg-primary transition-[scale] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ltr:origin-left",
                      j < current ? "scale-x-100" : "scale-x-0",
                    )}
                    style={{
                      transitionDuration: `${LINE_MS}ms`,
                      transitionDelay: `${lineDelay(j)}ms`,
                    }}
                  />
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  "relative grid size-9 place-items-center rounded-full text-sm font-medium tabular-nums ring-1 ring-inset transition-[background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  checked
                    ? "bg-primary text-primary-foreground ring-primary"
                    : status === "current"
                      ? "bg-background text-foreground ring-primary shadow-sm"
                      : "bg-background text-muted-foreground ring-border",
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <Swap visible={!checked} delay={delay} reduceMotion={reduceMotion}>
                  {j + 1}
                </Swap>
                <Swap visible={checked} delay={delay} reduceMotion={reduceMotion}>
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3.5 8.5 3 3 6-7" />
                  </svg>
                </Swap>
              </span>
              <span
                className={cn(
                  "text-center text-[12px] sm:text-sm font-bold transition-[color] duration-200 ease-out",
                  status === "upcoming" ? "text-muted-foreground opacity-60" : "text-foreground",
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
      <span className="sr-only" aria-live="polite">
        {current !== from
          ? `Step ${current + 1} of ${steps.length}: ${steps[current]}`
          : ""}
      </span>
    </div>
  );
}

function Swap({
  visible,
  delay,
  reduceMotion,
  children,
}: {
  visible: boolean;
  delay: number;
  reduceMotion: boolean | null;
  children: React.ReactNode;
}) {
  const hidden = reduceMotion
    ? { opacity: 0 }
    : { scale: 0.25, opacity: 0, filter: "blur(4px)" };
  return (
    <motion.span
      className="col-start-1 row-start-1 grid place-items-center"
      initial={false}
      animate={visible ? { scale: 1, opacity: 1, filter: "blur(0px)" } : hidden}
      transition={{ ...ICON_SWAP, delay: delay / 1000 }}
    >
      {children}
    </motion.span>
  );
}
