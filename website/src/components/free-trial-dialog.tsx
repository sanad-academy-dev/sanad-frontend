"use client";

import { Fragment, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@/lib/utils";

// modal "احجز حصة تجريبية مجانية" — Frame 1984079124 من التصميم

const STEPS = [
  { title: "اختر الموعد", desc: "أختر اليوم والوقت المناسب لك" },
  { title: "البيانات", desc: "تأكد من إدخال بياناتك بشكل صحيح" },
  { title: "التأكيد", desc: "تأكد من بياناتك قبل الإرسال" },
];

const WEEKDAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

type Selected = { year: number; month: number; day: number };

function Calendar() {
  const [view, setView] = useState({ year: 2026, month: 9 }); // أكتوبر
  const [selected, setSelected] = useState<Selected>({
    year: 2026,
    month: 9,
    day: 14,
  });

  const firstWeekday = new Date(view.year, view.month, 1).getDay(); // 0 = أحد
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="flex flex-col gap-2">
      {/* التنقّل بين الأشهر */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="الشهر السابق"
          onClick={() => changeMonth(-1)}
          className="flex size-8 items-center justify-center rounded text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronRight className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          aria-label="الشهر التالي"
          onClick={() => changeMonth(1)}
          className="flex size-8 items-center justify-center rounded text-foreground transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>

      {/* أيام الأسبوع */}
      <div dir="rtl" className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* الأيام */}
      <div dir="rtl" className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const weekday = new Date(view.year, view.month, day).getDay();
          const isFriday = weekday === 5;
          const isSelected =
            selected.year === view.year &&
            selected.month === view.month &&
            selected.day === day;

          return (
            <button
              key={day}
              type="button"
              disabled={isFriday}
              onClick={() =>
                setSelected({ year: view.year, month: view.month, day })
              }
              className={cn(
                "mx-auto flex h-9 w-full items-center justify-center rounded text-xs font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isFriday
                    ? "cursor-not-allowed text-muted-foreground"
                    : "text-foreground hover:bg-secondary",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stepper({ active }: { active: number }) {
  return (
    <div className="relative flex justify-between">
      {/* خط الربط خلف الدوائر */}
      <div className="absolute inset-x-[16.66%] top-[11px] h-0.5 bg-secondary" />
      {STEPS.map((step, i) => {
        const done = i <= active;
        return (
          <div
            key={step.title}
            className="relative z-10 flex flex-1 flex-col items-center gap-3 px-2 text-center"
          >
            {done ? (
              <span className="flex size-6 items-center justify-center rounded-full bg-[#7F56D9]">
                <Check className="size-3.5 text-white" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#EAECF0] bg-[#F9FAFB]">
                <span className="size-2 rounded-full bg-[#D0D5DD]" />
              </span>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">
                {step.title}
              </span>
              <span className="text-sm text-muted-foreground">{step.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TrialModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[729px] flex-col gap-8 overflow-y-auto rounded-3xl bg-card p-6 sm:p-12"
      >
        {/* الرأس */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              احجز حصة تجريبية مجانية
            </h2>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded text-foreground transition-colors hover:bg-secondary"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="h-px w-full bg-secondary" />
          <Stepper active={step} />
        </div>

        {/* المحتوى */}
        {step === 0 ? (
          <div className="flex flex-col gap-8">
            <Calendar />
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex w-full items-center justify-center gap-2 rounded bg-secondary py-2.5 text-base font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              التالي — البيانات
              <ArrowLeft className="size-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-10 text-center">
            <p className="text-base text-muted-foreground">
              {STEPS[step].title} — هذه الخطوة قيد التطوير وستتوفّر قريباً.
            </p>
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded border border-border px-8 py-2.5 text-base font-medium text-primary transition-colors hover:bg-primary/10"
            >
              رجوع
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function FreeTrialDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border border-border py-3 text-center text-base font-medium text-primary transition-colors hover:bg-primary/10"
      >
        الحصة الأولى تجريبية مجانية
      </button>

      <AnimatePresence>
        {open && <TrialModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
