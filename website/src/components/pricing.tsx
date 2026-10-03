"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
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

export type Plan = {
  name: string;
  levels: string;
  price: number;
  features: string[];
};

type Billing = "single" | "family";

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
  const [billing, setBilling] = useState<Billing>("single");
  const plan = plans[planIndex];

  const monthly = plan.price;
  const familyCut = billing === "family" ? monthly * familyDiscount : 0;
  const total = monthly - familyCut;
  const isFamily = billing === "family";

  return (
    <div
      className={cn(
        "flex flex-col xl:flex-row w-full gap-10 rounded-3xl bg-card p-6 md:p-10 border-2 border-border mx-auto shadow-sm",
        className,
      )}
      dir="rtl"
    >
      {/* القسم الأيمن: التفاعل والحسابات */}
      <div className="flex-1 flex flex-col gap-10 justify-center">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium text-muted-foreground">المرحلة التعليمية</p>
            <p className="flex items-end gap-3 text-[40px] leading-none font-bold tracking-tight tabular-nums text-foreground">
              {plan.name}
              <span className="mb-2 text-[18px] leading-none font-medium text-muted-foreground">
                ({plan.levels})
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-8 mb-4" dir="ltr">
          <LevelSlider
            value={planIndex}
            min={0}
            max={plans.length - 1}
            plans={plans}
            onChange={setPlanIndex}
            reduceMotion={reduceMotion}
          />
        </div>

        <div className="flex flex-col gap-6 mt-4">
          <BillingSwitch
            value={billing}
            onChange={setBilling}
            discount={familyDiscount}
          />

          <dl className="flex flex-col text-[16px] gap-3 mt-4">
            <Row
              label="القيمة الإجمالية للمستوى"
              value={monthly}
              reduceMotion={reduceMotion}
            />
            <Row
              label={
                isFamily
                  ? `خصم العائلات (${Math.round(familyDiscount * 100)}%)`
                  : `أضف طفل آخر لتوفير ${Math.round(familyDiscount * 100)}%`
              }
              value={-familyCut}
              dim={!isFamily}
              reduceMotion={reduceMotion}
            />
          </dl>
        </div>
      </div>

      {/* القسم الأيسر: الخلاصة والمزايا */}
      <div className="w-full xl:w-[420px] flex flex-col gap-6 rounded-2xl bg-secondary/30 p-6 md:p-8 border border-border/50">
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-semibold text-foreground">الباقة المختارة</span>
          <PlanBadge plan={plan} rank={planIndex} reduceMotion={reduceMotion} />
        </div>
        
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-[15px] font-medium text-muted-foreground">الإجمالي للمستوى</span>
          <div className="flex items-baseline gap-2" dir="ltr">
            <span className="text-[54px] leading-none font-bold tracking-tight text-foreground">
              <RollingMoney value={total} reduceMotion={reduceMotion} />
            </span>
            <div className="flex flex-col items-start justify-end pb-2">
              <span className="text-[18px] text-foreground font-bold leading-none">جنيه</span>
            </div>
          </div>
          {isFamily && (
            <span className="text-[14px] text-primary mt-2 font-medium text-right bg-primary/10 w-fit px-3 py-1 rounded-full">
              السعر يشمل جميع الأطفال
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-dashed border-border pt-6 mt-4 flex-1">
          <p className="text-[16px] font-semibold text-foreground text-right">ماذا سيتعلم طفلك؟</p>
          <ul className="flex flex-col gap-3.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CircleCheck className="size-5 shrink-0 text-primary mt-0.5" />
                <span className="text-right text-[15.5px] text-muted-foreground leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          suppressHydrationWarning
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-[17px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 hover:shadow-primary/40"
        >
          قيّم طفلك مجاناً
        </button>
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
  value: number;
  dim?: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center justify-between gap-3 transition-colors duration-200 ease-out",
        dim ? "text-muted-foreground" : "text-foreground",
      )}
    >
      <dt className="relative min-w-0 flex-1 truncate text-right">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={label}
            {...BLUR_IN}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: EASE_OUT }}
            className="block truncate"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </dt>
      <dd className="shrink-0 font-medium" dir="ltr">
        <RollingMoney value={value} reduceMotion={reduceMotion} />
      </dd>
    </div>
  );
}

function Struck({
  show,
  reduceMotion,
  children,
}: {
  show: boolean;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.s
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            filter: "blur(2px)",
            transition: { duration: 0.15 },
          }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: EASE_OUT }}
          className="relative text-[15px] text-muted-foreground tabular-nums no-underline"
        >
          {children}
          <motion.span
            aria-hidden
            className="absolute inset-x-[-2px] top-1/2 h-[1.5px] origin-left bg-muted-foreground"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              delay: reduceMotion ? 0 : 0.08,
              ease: EASE_OUT,
            }}
          />
        </motion.s>
      )}
    </AnimatePresence>
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
            negative ? "w-[0.6em] opacity-100" : "w-0 opacity-0",
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

function PlanBadge({
  plan,
  rank,
  reduceMotion,
}: {
  plan: Plan;
  rank: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.span
      layout={!reduceMotion}
      transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
      className={cn(
        "relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-full px-4 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-300 ease-out",
        rank <= 1 && "bg-secondary text-foreground",
        rank > 1 && rank <= 3 &&
          "bg-background text-foreground shadow-[inset_0_0_0_1px_var(--foreground)]",
        rank > 3 && "bg-primary text-primary-foreground",
      )}
    >
      <motion.span
        layout={reduceMotion ? false : "position"}
        className="text-[12px] opacity-70"
      >
        الباقة:
      </motion.span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={plan.name}
          layout={reduceMotion ? false : "position"}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{
            opacity: 0,
            y: -6,
            filter: "blur(2px)",
            transition: { duration: 0.15 },
          }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: EASE_OUT }}
        >
          {plan.name}
        </motion.span>
      </AnimatePresence>
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
    if (reduceMotion) fill.jump(at(value));
    else fill.set(at(value));
  }, [value, reduceMotion, fill]);

  const scaleX = fill;
  const left = useTransform(fill, (f) => `calc(${f * 100}% - ${f * 20}px)`);

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="sr-only">المستوى</label>
      <div className="relative h-12">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-secondary shadow-inner">
          <motion.div
            className="h-full origin-left bg-primary"
            style={{ scaleX }}
          />
        </div>
        {plans.map((plan, i) => (
          <span
            key={plan.name}
            aria-hidden
            className={cn(
              "absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ease-out",
              value >= i ? "bg-background" : "bg-muted-foreground/40",
            )}
            style={{
              left: `calc(${at(i) * 100}% + ${10 - at(i) * 20}px)`,
            }}
          />
        ))}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-background shadow-lg border-2 border-primary"
          style={{ left }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={plans[value]?.name}
          className="peer absolute inset-0 h-full w-full cursor-pointer touch-pan-y appearance-none rounded-full opacity-0"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full outline-hidden peer-focus-visible:outline-2 peer-focus-visible:outline-solid focus-visible:outline-solid peer-focus-visible:outline-foreground"
        />
      </div>
      
      <div
        aria-hidden
        className="relative h-12 text-[14px] font-medium text-muted-foreground hidden md:block"
      >
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={cn(
              "absolute -translate-x-1/2 flex flex-col items-center whitespace-nowrap transition-all duration-200 ease-out",
              value >= i ? "text-foreground font-bold" : "text-muted-foreground/70",
            )}
            style={{
              left: `calc(${at(i) * 100}% + ${10 - at(i) * 20}px)`,
            }}
          >
            <span>{plan.name}</span>
            <span className={cn("text-[11px] mt-1 font-normal", value >= i ? "opacity-100" : "opacity-60")}>
              {plan.levels}
            </span>
          </div>
        ))}
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
    { id: "family", label: "باقة العائلات" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="نوع الاشتراك"
      className="relative grid h-12 grid-cols-2 rounded-full bg-secondary p-1.5 shadow-inner"
      onKeyDown={(e) => {
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          e.preventDefault();
          const next = value === "single" ? "family" : "single";
          onChange(next);
          (
            e.currentTarget.querySelector(
              `[data-id="${next}"]`,
            ) as HTMLElement | null
          )?.focus();
        }
      }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1.5 right-1.5 w-[calc(50%-6px)] rounded-full bg-background shadow-sm transition-transform duration-250 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none",
          value === "family" && "-translate-x-full",
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
              "relative flex touch-manipulation items-center justify-center gap-1.5 rounded-full text-[15px] font-semibold outline-none transition-[color,scale] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary active:scale-[0.96]",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {option.label}
            {option.id === "family" && (
              <span className="text-[12px] font-normal text-muted-foreground bg-foreground/10 px-1.5 py-0.5 ml-1">
                −{Math.round(discount * 100)}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

const PLANS: Plan[] = [
  { 
    name: "المستكشف", 
    levels: "المستويات 05-09",
    price: 399,
    features: [
      "تأسيس منطقي قوي للبرمجة",
      "ألعاب تفاعلية وبصرية",
      "شهادة إتمام لكل مستوى",
      "متابعة دورية مع ولي الأمر",
    ]
  },
  { 
    name: "المفكر", 
    levels: "المستويات 10-14",
    price: 499,
    features: [
      "برمجة قصص ومشاريع تفاعلية",
      "التعرف على الخوارزميات الأساسية",
      "شهادة إتمام لكل مستوى",
      "تنمية مهارات حل المشكلات",
    ]
  },
  { 
    name: "المبرمج", 
    levels: "المستويات 15-19",
    price: 599,
    features: [
      "تطوير ألعاب ثنائية الأبعاد",
      "المنطق البرمجي المتقدم",
      "مشروع تطبيقي بعد كل مستوى",
      "دعم فني مباشر للمتدرب",
    ]
  },
  { 
    name: "الباني", 
    levels: "المستويات 20-23",
    price: 699,
    features: [
      "تصميم واجهات المستخدم (UI)",
      "بناء تطبيقات الهواتف الذكية",
      "نشر وتجربة المشاريع العملية",
      "استشارات برمجية مخصصة",
    ]
  },
  { 
    name: "المبتكر", 
    levels: "المستويات 24-27",
    price: 799,
    features: [
      "مقدمة للغات البرمجة النصية",
      "تطبيقات مبسطة للذكاء الاصطناعي",
      "شهادة معتمدة لكل مرحلة",
      "جلسات توجيه لتطوير المهارات",
    ]
  },
  { 
    name: "المهندس", 
    levels: "المستويات 28-32",
    price: 899,
    features: [
      "بناء مشاريع برمجية متكاملة",
      "هيكلة البيانات المتقدمة",
      "معرض للمشاريع النهائية",
      "شهادة تخرج احترافية من الأكاديمية",
    ]
  },
];

export default function Pricing() {
  return (
    <section className="relative w-full overflow-hidden bg-card">
      <Container className="relative z-10 flex flex-col items-center gap-12 py-20 md:py-28 border-t border-border">
        <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            باقات الاشتراك
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            خطط مرنة تتناسب مع مسار ابنك — حدد المرحلة التعليمية لتبدأ الرحلة.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <PricingCalculator plans={PLANS} defaultPlanIndex={0} familyDiscount={0.1} />
        </div>
      </Container>
    </section>
  );
}
