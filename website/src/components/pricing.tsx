"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CircleCheck, ArrowUpLeft, Sparkles, Monitor, MapPin, Users, Award, CheckCircle2 } from "lucide-react";
import { openTrialAssessmentModal } from "@/components/trial-modal";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";

export type LearningMode = "online" | "offline";
export type Duration = "1_month" | "3_months" | "1_year";
export type Billing = "single" | "family";

export type PlanPrices = {
  "1_month"?: number | null;
  "3_months"?: number | null;
  "1_year"?: number | null;
  saveQuarterly?: number;
  saveYearly?: number;
};

export type Plan = {
  id: string;
  name: string;
  stage: string;
  age: string;
  levels: string;
  shortLevels: string;
  promise: string;
  prerequisite: string;
  ratio: string;
  sessions: string;
  reports: string;
  certificate: string;
  storeDiscount: string;
  campDiscount: string;
  frozenCredits: string;
  isCustom?: boolean;
  prices: {
    online: PlanPrices;
    offline: PlanPrices;
  };
  features: string[];
};

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const BLUR_IN = {
  initial: { opacity: 0, y: 4, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -2, filter: "blur(2px)" },
};

function money(value: number, cents = false) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
}

export function PricingCalculator({
  plans,
  defaultPlanIndex = 0,
  familyDiscount = 0.1,
  className,
}: {
  plans: Plan[];
  defaultPlanIndex?: number;
  familyDiscount?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [planIndex, setPlanIndex] = useState(defaultPlanIndex);
  const [mode, setMode] = useState<LearningMode>("online");
  const [duration, setDuration] = useState<Duration>("1_month");
  const [billing, setBilling] = useState<Billing>("single");

  const plan = plans[planIndex] || plans[0];
  const isFamily = billing === "family";
  const isCustom = plan.isCustom;

  const currentPrices = plan.prices[mode];
  const rawPrice = isCustom ? null : currentPrices?.[duration];
  const hasPrice = typeof rawPrice === "number" && rawPrice > 0;

  const basePrice = hasPrice ? rawPrice : 0;
  const familyCut = isFamily && hasPrice ? Math.round(basePrice * familyDiscount) : 0;
  const total = hasPrice ? basePrice - familyCut : 0;

  const saveAmount = hasPrice 
    ? duration === "3_months" 
      ? (currentPrices?.saveQuarterly || 0)
      : duration === "1_year" 
        ? (currentPrices?.saveYearly || 0)
        : 0
    : 0;

  const handleModeChange = (newMode: LearningMode) => {
    setMode(newMode);
    if (newMode === "offline" && !plan.prices.offline?.[duration]) {
      setDuration("1_month");
    }
  };

  const handlePlanChange = (index: number) => {
    setPlanIndex(index);
    const nextPlan = plans[index];
    if (nextPlan && mode === "offline" && !nextPlan.prices.offline?.[duration]) {
      setDuration("1_month");
    }
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-5xl flex-col bg-card/50 backdrop-blur-xs mx-auto",
        className
      )}
      dir="rtl"
    >
      <div className="screen-line-bottom -mx-5 flex items-center justify-center px-5 py-3.5 sm:py-4 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
        <div className="w-full max-w-4xl">
          <LevelSlider
            value={planIndex}
            min={0}
            max={plans.length - 1}
            plans={plans}
            onChange={handlePlanChange}
            reduceMotion={reduceMotion}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 bg-card/10 screen-line-bottom">
        <div>
          <LearningModeSwitch value={mode} onChange={handleModeChange} />
        </div>

        <div className="border-s border-line">
          <DurationSwitch value={duration} onChange={setDuration} mode={mode} />
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:p-7 lg:flex-row">
        <div className="flex-1 flex flex-col justify-start gap-4 sm:gap-5">
          <div className="flex flex-col gap-3">
            {/* Header of selected plan */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-line/60">
              <div className="flex items-center gap-2">
                <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                  خطة {plan.name}
                </span>
              </div>
              <span className="font-sans text-xs font-medium text-muted-foreground/85">
                {plan.levels}
              </span>
            </div>

            {/* Promise to family */}
            <div className="p-3 rounded-lg bg-secondary/35 border border-line flex items-start gap-2.5">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-sans text-[11px] text-primary font-bold">الوعد للأسرة</span>
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-foreground leading-snug">{plan.promise}</span>
              </div>
            </div>

            {/* Plan Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 font-sans text-[11.5px] sm:text-xs text-foreground/80">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-line">
                <Users className="size-3.5 sm:size-4 text-primary shrink-0" />
                <span>المجموعة: <strong className="font-mono font-bold text-foreground">{plan.ratio}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-line">
                <Award className="size-3.5 sm:size-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{plan.age}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-line">
                <CheckCircle2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                <span className="truncate">الشرط: <strong className="font-medium text-foreground">{plan.prerequisite}</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-1 flex flex-col gap-3 pt-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs sm:text-[13px] font-bold text-foreground">نوع الاشتراك</span>
                <span className="font-sans text-xs text-primary font-bold">خصم الأخوة 10%</span>
              </div>
              <BillingSwitch
                value={billing}
                onChange={setBilling}
                discount={familyDiscount}
              />
            </div>

            <dl className="flex flex-col text-xs sm:text-[13px] gap-2 pt-0.5">
              <Row
                label="القيمة الإجمالية للباقة"
                value={hasPrice ? basePrice : "تواصل معنا"}
                reduceMotion={reduceMotion}
              />
              {hasPrice && (
                <Row
                  label={
                    isFamily
                      ? `خصم الأخوة (${Math.round(familyDiscount * 100)}%)`
                      : `أضف طفل آخر لتفعيل خصم الأخوة (${Math.round(familyDiscount * 100)}%)`
                  }
                  value={isFamily ? -familyCut : 0}
                  dim={!isFamily}
                  reduceMotion={reduceMotion}
                />
              )}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-line/60 font-sans text-muted-foreground">
                <span>نمط التدريب المعتمد:</span>
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  {mode === "online" ? (
                    <>
                      <Monitor className="size-3.5 text-primary" />
                      <span>أونلاين تفاعلي مباشر</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="size-3.5 text-primary" />
                      <span>حضوري في الفروع</span>
                    </>
                  )}
                </span>
              </div>
            </dl>
          </div>
        </div>

        <div className="w-full lg:w-[350px] xl:w-[370px] shrink-0 flex flex-col justify-between gap-5 rounded-xl bg-secondary/30 backdrop-blur-xs p-5 sm:p-6 border border-line">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-semibold text-muted-foreground">الإجمالي للباقة</span>
                {saveAmount > 0 && hasPrice && (
                  <span className="font-sans text-[11px] text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    وفر <span className="font-mono font-bold">{money(saveAmount)}</span> ج.م
                  </span>
                )}
              </div>

              {!hasPrice ? (
                <div className="py-2 text-right">
                  <span className="text-2xl sm:text-3xl leading-none font-bold tracking-normal text-foreground font-heading">
                    تواصل معنا
                  </span>
                  <p className="font-sans text-xs text-muted-foreground mt-1.5 leading-relaxed font-normal">
                    {isCustom
                      ? "مسار مصمَّم ومفصل بالكامل حول هدف طفلك وسرعة استيعابه."
                      : "الاشتراك الحضوري في المقر معتمد بنظام التجديد الشهري، وللباقات الممتدة يرجى التواصل معنا للتنسيق مع إدارة الفرع."}
                  </p>
                </div>
              ) : (
                <div className="flex items-baseline gap-2" dir="ltr">
                  <span className="text-3xl sm:text-4xl leading-none font-bold tracking-tight text-foreground font-mono">
                    <RollingMoney value={total} reduceMotion={reduceMotion} />
                  </span>
                  <span className="font-sans text-xs sm:text-sm text-muted-foreground font-bold">جنيه</span>
                </div>
              )}

              {isFamily && hasPrice && (
                <span className="font-sans text-[11px] text-primary font-bold text-right bg-primary/10 border border-primary/20 w-fit px-2 py-0.5 rounded-md mt-1">
                  السعر يشمل خصم الأخوة
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-dashed border-line/70 pt-4">
              <div className="flex items-center justify-between">
                <p className="font-heading text-xs sm:text-sm font-bold text-foreground text-right">مزايا باقة {plan.name}:</p>
                <span className="font-sans text-xs font-semibold text-primary">{plan.sessions}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-right">
                    <CircleCheck className="size-3.5 shrink-0 text-primary mt-0.5" />
                    <span className="font-sans text-xs sm:text-[12.5px] text-foreground/80 leading-relaxed font-normal">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {!hasPrice ? (
            <div className="mt-2.5 grid grid-cols-2 gap-2 w-full">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => openTrialAssessmentModal()}
                className="group flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-2 font-sans text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer shadow-none"
              >
                <span>قيم ابنك</span>
                <ArrowUpLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <Link
                href="/contact"
                className="group flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-line bg-secondary/80 px-2 font-sans text-xs sm:text-sm font-bold text-foreground hover:bg-secondary hover:border-primary/40 transition-all active:scale-[0.98] cursor-pointer shadow-none"
              >
                <span>تواصل معنا</span>
                <ArrowUpLeft className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          ) : (
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => openTrialAssessmentModal()}
              className="group mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 font-sans text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer shadow-none"
            >
              <span>قيّم طفلك مجاناً</span>
              <ArrowUpLeft className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Trust & Community strip */}
      <div className="screen-line-top px-4 sm:px-5 py-3 text-center font-sans text-xs font-medium text-muted-foreground/85 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 select-none">
        <span>✓ تقييم مجاني لتحديد المستوى</span>
        <span className="text-line select-none">•</span>
        <span>خصم <span className="font-mono font-bold text-foreground">10%</span> للأخوة</span>
        <span className="text-line select-none">•</span>
        <span>مقاعد مدعومة لمحدودي الدخل</span>
        <span className="text-line select-none">•</span>
        <span>معامل وروبوتات قريباً</span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  dim,
  reduceMotion,
}: {
  label: string;
  value: number | string;
  dim?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-7 items-center justify-between gap-3 transition-colors duration-200 ease-out font-sans text-xs sm:text-sm",
        dim ? "text-muted-foreground" : "text-foreground"
      )}
    >
      <dt className="relative min-w-0 flex-1 truncate text-right">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={label}
            {...BLUR_IN}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
            className="block truncate font-medium"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </dt>
      <dd className="shrink-0 font-mono font-bold" dir="ltr">
        {typeof value === "number" ? (
          <RollingMoney value={value} reduceMotion={reduceMotion} />
        ) : (
          <span className="font-sans text-xs text-primary font-bold">{value}</span>
        )}
      </dd>
    </div>
  );
}

function RollingMoney({
  value,
  reduceMotion,
}: {
  value: number;
  reduceMotion: boolean;
}) {
  const negative = value < -0.004;
  const text = money(Math.abs(value), false);
  const chars = [...text];
  return (
    <span className="inline-flex tabular-nums text-foreground">
      <span className="sr-only">{negative ? `minus ${text}` : text}</span>
      <span aria-hidden className="inline-flex items-center">
        <span
          className={cn(
            "inline-flex h-[1.2em] items-center overflow-hidden transition-[opacity,width] duration-200 ease-out",
            negative ? "w-[0.6em] opacity-100" : "w-0 opacity-0"
          )}
        >
          −
        </span>
        {chars.map((char, i) => {
          const fromRight = chars.length - 1 - i;
          return /\d/.test(char) ? (
            <Digit
              key={`d${fromRight}`}
              digit={Number(char)}
              reduceMotion={reduceMotion}
            />
          ) : (
            <span
              key={`c${fromRight}${char}`}
              className="inline-flex h-[1.2em] items-center"
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}

function Digit({
  digit,
  reduceMotion,
  }: {
  digit: number;
  reduceMotion: boolean;
}) {
  const target = useRef(digit);
  const position = useSpring(digit, { visualDuration: 0.35, bounce: 0.1 });

  useEffect(() => {
    const current = ((target.current % 10) + 10) % 10;
    const delta = ((digit - current + 15) % 10) - 5;
    target.current += delta;
    if (reduceMotion) position.jump(target.current);
    else position.set(target.current);
  }, [digit, reduceMotion, position]);

  return (
    <motion.span
      className="relative inline-block h-[1.2em] w-[0.62em] overflow-hidden [mask-image:linear-gradient(transparent,black_22%,black_78%,transparent)]"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT }}
    >
      {Array.from({ length: 10 }, (_, g) => (
        <Glyph key={g} glyph={g} position={position} />
      ))}
    </motion.span>
  );
}

function Glyph({
  glyph,
  position,
}: {
  glyph: number;
  position: MotionValue<number>;
}) {
  const transform = useTransform(position, (p) => {
    const offset = ((((glyph - p) % 10) + 15) % 10) - 5;
    return `translateY(${offset * 100}%)`;
  });
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform }}
    >
      {glyph}
    </motion.span>
  );
}

function LevelSlider({
  value,
  min,
  max,
  plans,
  onChange,
  reduceMotion,
}: {
  value: number;
  min: number;
  max: number;
  plans: Plan[];
  onChange: (index: number) => void;
  reduceMotion: boolean;
}) {
  const id = useId();
  const at = (index: number) => (index - min) / (max - min);
  const fill = useSpring(at(value), { visualDuration: 0.2, bounce: 0 });
  
  useEffect(() => {
    const target = (value - min) / (max - min);
    if (reduceMotion) fill.jump(target);
    else fill.set(target);
  }, [value, min, max, reduceMotion, fill]);

  const scaleX = fill;
  const right = useTransform(fill, (f) => `calc(${f * 100}% + ${10 - f * 20}px)`);

  return (
    <div className="flex flex-col gap-2.5 px-2 sm:px-4">
      <label htmlFor={id} className="sr-only">المستوى</label>
      <div className="relative h-8 flex items-center">
        {/* Slider Track */}
        <div className="absolute inset-x-0 h-2 overflow-hidden rounded-full bg-secondary/80 border border-line">
          <motion.div
            className="h-full origin-right bg-primary rounded-full"
            style={{ scaleX }}
          />
        </div>

        {/* Step Dots */}
        {plans.map((plan, i) => (
          <span
            key={plan.name}
            aria-hidden
            className={cn(
              "absolute size-2.5 -translate-y-1/2 top-1/2 translate-x-1/2 rounded-full transition-all duration-200 ease-out border",
              value >= i
                ? "bg-primary border-background ring-1 ring-primary/30"
                : "bg-muted-foreground/30 border-transparent"
            )}
            style={{
              right: `calc(${at(i) * 100}% + ${10 - at(i) * 20}px)`,
            }}
          />
        ))}

        {/* Active Thumb */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute size-5 -translate-y-1/2 top-1/2 translate-x-1/2 rounded-full bg-background border-2 border-primary ring-4 ring-primary/15 shadow-sm flex items-center justify-center z-10"
          style={{ right }}
        >
          <span className="size-1.5 rounded-full bg-primary" />
        </motion.span>

        {/* Native Range Input */}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={plans[value]?.name}
          className="peer absolute inset-0 h-full w-full cursor-pointer touch-pan-y appearance-none rounded-full opacity-0 z-20"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full outline-hidden peer-focus-visible:outline-2 peer-focus-visible:outline-solid focus-visible:outline-solid peer-focus-visible:outline-foreground"
        />
      </div>
      
      {/* Slider Labels */}
      <div
        aria-hidden
        className="relative h-11 text-xs text-muted-foreground hidden sm:block mt-0.5"
      >
        {plans.map((plan, i) => {
          const isSelected = value === i;
          return (
            <button
              key={plan.name}
              type="button"
              className={cn(
                "absolute translate-x-1/2 flex flex-col items-center whitespace-nowrap transition-all duration-200 ease-out cursor-pointer group py-0.5 select-none",
                isSelected
                  ? "text-primary font-bold scale-105"
                  : value > i
                  ? "text-foreground font-medium hover:text-primary"
                  : "text-muted-foreground/75 hover:text-foreground"
              )}
              style={{
                right: `calc(${at(i) * 100}% + ${10 - at(i) * 20}px)`,
              }}
              onClick={() => onChange(i)}
            >
              <span className="text-[12.5px] sm:text-[13px] leading-tight font-sans">
                {plan.name}
              </span>
              <span
                dir={/^\d/.test(plan.shortLevels) ? "ltr" : "rtl"}
                className={cn(
                  "text-[10px] mt-1 transition-colors",
                  /^\d/.test(plan.shortLevels) ? "font-mono font-semibold" : "font-sans font-medium",
                  isSelected
                    ? "text-primary font-semibold"
                    : "opacity-75 group-hover:opacity-100"
                )}
              >
                {plan.shortLevels}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BillingSwitch({
  value,
  onChange,
  discount,
}: {
  value: Billing;
  onChange: (b: Billing) => void;
  discount: number;
}) {
  const options: { id: Billing; label: string }[] = [
    { id: "single", label: "طفل واحد" },
    { id: "family", label: "باقة الأخوة" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="نوع الاشتراك"
      className="relative grid h-9 grid-cols-2 rounded-lg bg-secondary/80 p-0.5 border border-line text-xs"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0.5 right-0.5 w-[calc(50%-2px)] rounded-md bg-background border border-line transition-transform duration-200 ease-out motion-reduce:transition-none shadow-xs",
          value === "family" && "-translate-x-full"
        )}
      />
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            suppressHydrationWarning
            key={option.id}
            type="button"
            role="radio"
            data-id={option.id}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex touch-manipulation items-center justify-center gap-1.5 rounded-md px-3 py-1 font-sans text-xs font-semibold outline-none transition-colors duration-150 cursor-pointer select-none",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>{option.label}</span>
            {option.id === "family" && (
              <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded">
                −{Math.round(discount * 100)}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LearningModeSwitch({
  value,
  onChange,
}: {
  value: LearningMode;
  onChange: (m: LearningMode) => void;
}) {
  const options: { id: LearningMode; label: string }[] = [
    { id: "online", label: "عن بعد" },
    { id: "offline", label: "حضور" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="نمط التعلم"
      className="relative grid w-full grid-cols-2 bg-card/10 text-xs"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            suppressHydrationWarning
            key={option.id}
            type="button"
            role="radio"
            data-id={option.id}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex min-h-8 touch-manipulation items-center justify-center border-s border-line px-2 py-3.5 sm:py-4 font-sans text-xs font-bold outline-none transition-colors cursor-pointer select-none first:border-s-0",
              active ? "bg-secondary/70 text-foreground" : "text-muted-foreground hover:bg-secondary/35 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function DurationSwitch({
  value,
  onChange,
}: {
  value: Duration;
  onChange: (d: Duration) => void;
  mode?: LearningMode;
}) {
  const options: { id: Duration; label: string }[] = [
    { id: "1_month", label: "شهري" },
    { id: "3_months", label: "ربع سنوي" },
    { id: "1_year", label: "سنوي" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="مدة الاشتراك"
      className="relative grid w-full grid-cols-3 bg-card/10 text-xs"
    >
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            suppressHydrationWarning
            key={option.id}
            type="button"
            role="radio"
            data-id={option.id}
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex min-h-8 touch-manipulation items-center justify-center border-s border-line px-1 sm:px-2 py-3.5 sm:py-4 font-sans text-[11px] sm:text-xs font-bold outline-none transition-colors cursor-pointer select-none first:border-s-0 text-center leading-tight",
              active
                ? "bg-secondary/70 text-foreground"
                : "text-muted-foreground hover:bg-secondary/35 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const PLANS: Plan[] = [
  {
    id: "foundation",
    name: "التأسيس",
    stage: "المُرتاد",
    age: "6–8 سنوات",
    levels: "المستويات 01–07",
    shortLevels: "01–07",
    promise: "يفكر بتسلسل ويصنع أول لعبة",
    prerequisite: "بدون أي شروط",
    ratio: "1:8",
    sessions: "4 × 90 دقيقة شهرياً",
    reports: "شهري مبسّط",
    certificate: "رقمية بإتمام المرحلة",
    storeDiscount: "5%",
    campDiscount: "10%",
    frozenCredits: "رصيد حصص مجمّد حتى 4",
    prices: {
      online: {
        "1_month": 800,
        "3_months": 2500,
        "1_year": 10000,
        saveQuarterly: 500,
        saveYearly: 2000,
      },
      offline: {
        "1_month": 1000,
      },
    },
    features: [
      "جلسات مباشرة شهرياً: 4 × 90 دقيقة",
      "نسبة المجموعة 1:8 في مجموعات تفاعلية مركزة",
      "تقييم مجاني لتحديد المستوى واختبار الميول",
      "تقارير متابعة تقدم: شهري مبسّط لولي الأمر",
      "شهادة إتمام رقمية معتمدة عند إتمام المرحلة",
      "رصيد حصص مجمّد حتى 4 حصص",
      "خصم 5% على متجر سند و 10% على المعسكرات",
    ],
  },
  {
    id: "building",
    name: "البناء",
    stage: "المُشيِّد",
    age: "9–11 سنوات",
    levels: "المستويات 08–14",
    shortLevels: "08–14",
    promise: "يبني لعبة كاملة بنقاط ومستويات",
    prerequisite: "إتمام التأسيس أو تقييم",
    ratio: "1:8",
    sessions: "4 × 60 دقيقة شهرياً",
    reports: "شهري + تعليق المدرب",
    certificate: "بلس + شارات مهارات",
    storeDiscount: "10%",
    campDiscount: "15%",
    frozenCredits: "رصيد حصص مجمّد حتى 5",
    prices: {
      online: {
        "1_month": 1800,
        "3_months": 5000,
        "1_year": 20000,
        saveQuarterly: 1000,
        saveYearly: 4000,
      },
      offline: {
        "1_month": 2000,
      },
    },
    features: [
      "جلسات مباشرة شهرياً: 4 × 60 دقيقة",
      "نسبة المجموعة 1:8 لضمان التطبيق العملي الفردي",
      "تقييم مجاني واختبار مستوى معتمد",
      "تقارير متابعة تقدم: شهري + تعليق تفصيلي من المدرب",
      "شهادات إتمام البرنامج: بلس + شارات مهارات",
      "رصيد حصص مجمّد حتى 5 حصص",
      "خصم 10% على متجر سند و 15% على المعسكرات",
    ],
  },
  {
    id: "evolution",
    name: "التطور ★",
    stage: "المُستنبِط",
    age: "12–14 سنوات",
    levels: "المستويات 15–21",
    shortLevels: "15–21",
    promise: "يبتكر أداة تحل مشكلة حقيقية",
    prerequisite: "إتمام البناء أو تقييم",
    ratio: "1:8",
    sessions: "4 جلسات مباشرة شهرياً",
    reports: "كل أسبوعين + خريطة مهارات",
    certificate: "موثّقة (QR) + معرض أعمال",
    storeDiscount: "15%",
    campDiscount: "20%",
    frozenCredits: "رصيد حصص مجمّد حتى 6",
    prices: {
      online: {
        "1_month": 2300,
        "3_months": 6500,
        "1_year": 24000,
        saveQuarterly: 1000,
        saveYearly: 6000,
      },
      offline: {
        "1_month": 2500,
      },
    },
    features: [
      "4 جلسات مباشرة شهرياً مع المدربين المتخصصين",
      "نسبة المجموعة 1:8 للتفاعل والبرمجة النصية",
      "تقييم مجاني واختبار تحديد المستوى",
      "تقارير متابعة تقدم: كل أسبوعين + خريطة مهارات",
      "شهادات إتمام: موثّقة (QR) + معرض أعمال للمشاريع",
      "رصيد حصص مجمّد حتى 6 حصص",
      "خصم 15% على متجر سند و 20% على المعسكرات",
    ],
  },
  {
    id: "mastery",
    name: "الإحتراف",
    stage: "السَّنَد",
    age: "15–17 سنوات",
    levels: "المستويات 22–28",
    shortLevels: "22–28",
    promise: "يقود مشروع فريق ويرشد غيره",
    prerequisite: "إتمام التطور أو تقييم",
    ratio: "1:8",
    sessions: "4 جلسات مباشرة شهرياً",
    reports: "أسبوعي + خريطة مهارات",
    certificate: "موثّقة (QR) + معرض أعمال",
    storeDiscount: "20%",
    campDiscount: "25%",
    frozenCredits: "رصيد حصص مجمّد حتى 7",
    prices: {
      online: {
        "1_month": 2800,
        "3_months": 8000,
        "1_year": 27000,
        saveQuarterly: 1000,
        saveYearly: 8000,
      },
      offline: {
        "1_month": 3000,
      },
    },
    features: [
      "4 جلسات مباشرة متقدمة شهرياً",
      "نسبة تدريب 1:8 لقيادة المشاريع الجماعية المتكاملة",
      "تقييم مجاني وتوجيه مسار مهني وأكاديمي",
      "تقارير متابعة تقدم: أسبوعي + خريطة مهارات",
      "شهادات إتمام: موثّقة (QR) + معرض أعمال احترافي",
      "رصيد حصص مجمّد حتى 7 حصص",
      "خصم 20% على متجر سند و 25% على المعسكرات",
    ],
  },
  {
    id: "custom",
    name: "خاص 1:1",
    stage: "مسار مخصص",
    age: "6–17 سنة",
    levels: "أي مستوى (01–28)",
    shortLevels: "مسار فردي",
    promise: "مسار مصمَّم ومفصل بالكامل حول هدف طفلك",
    prerequisite: "تقييم معمّق وخطة شخصية",
    ratio: "1:1",
    sessions: "4–8 جلسات شهرياً × 60 دقيقة",
    reports: "أسبوعي + اجتماع ربع سنوي",
    certificate: "حسب المرحلة + تقرير تقييم",
    storeDiscount: "20%",
    campDiscount: "25%",
    frozenCredits: "إعادة جدولة مرنة قبل 24 ساعة",
    isCustom: true,
    prices: {
      online: {},
      offline: {},
    },
    features: [
      "جلسات مباشرة شهرياً: 4–8 × 60 دقيقة فردية",
      "نسبة التدريب 1:1 مع مدرب متخصص مفرغ بالكامل",
      "تقييم معمّق مجاني + وضع خطة تدريبية فردية",
      "إعادة جدولة الحصص بمرونة قبل 24 ساعة",
      "تقارير متابعة: أسبوعي + اجتماع ربع سنوي مع الأسرة",
      "شهادات إتمام: حسب المرحلة + تقرير تقييم دوري",
      "خصم 20% على متجر سند و 25% على المعسكرات",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="relative w-full overflow-hidden bg-background" id="pricing">
      <Container className="relative z-10">
        <SectionHeader
          title="باقات الاشتراك"
          description="خطط تعليمية متدرجة مصممة لبناء مهارات التفكير المنطقي والبرمجة — اختر الخطة المناسبة لطفلك."
        />

        <div className="flex w-full justify-center">
          <PricingCalculator plans={PLANS} defaultPlanIndex={0} familyDiscount={0.1} />
        </div>
      </Container>
    </section>
  );
}
