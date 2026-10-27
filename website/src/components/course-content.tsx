"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = ["المحتوى", "الوصف", "التقييمات"];

const LECTURES = [
  "1- مقدمة في لغة Python وفهم المنطق البرمجي",
  "2- المتغيرات وأنواع البيانات الأساسية (Strings & Numbers)",
  "3- اتخاذ القرارات والشروط المنطقية (If & Else)",
  "4- التكرار والحلقات الذكية (For & While Loops)",
  "5- بناء الدوال وإعادة استخدام الأكواد (Functions)",
  "6- القوائم والمجموعات وتنظيم البيانات (Lists & Tuples)",
  "7- القواميس والبيانات المهيكلة (Dictionaries)",
  "8- التعامل مع الأخطاء وتصحيح الكود (Debugging)",
  "9- مكتبة Turtle للرسومات الهندسية والأشكال",
  "10- برمجة ألعاب تفاعلية بسيطة (Mini Games)",
  "11- مقدمة في التفكير الخوارزمي وهياكل البيانات",
  "12- بناء مشروع التخرج النهائي ونشره",
];

function Content() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      {LECTURES.map((lecture, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-line bg-secondary/30 transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-right cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md border border-line bg-background/80 font-mono text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {lecture.replace(/^\d+-\s*/, '')}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden border-t border-line/60 bg-background/40"
                >
                  <p className="px-4 py-3 text-right text-xs leading-relaxed text-muted-foreground font-mono">
                    تطبيق عملي خطوة بخطوة يتضمن أمثلة حية، حل تحديات برمجية مع المدرب، وواجبات تفاعلية لقياس استيعاب الطالب للمفهوم.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function Description() {
  return (
    <div className="flex flex-col gap-4 text-right text-xs sm:text-sm leading-relaxed text-muted-foreground">
      <p>
        في هذا الكورس التفاعلي، ينطلق طفلك في رحلة تعلّم البرمجة الحقيقية باستخدام لغة Python الأكثر طلباً في العالم وعالم الذكاء الاصطناعي. نبدأ بالأساسيات المنطقية وكيف يفكر الحاسوب، ثم نتدرج لبناء خوارزميات وألعاب وأدوات تفاعلية.
      </p>
      <p>
        يعتمد منهج أكاديمية سَنَد على التعليم التطبيقي القائم على المشاريع (Project-Based Learning)، حيث يخرج الطالب في نهاية الكورس بمحفظة مشاريع حقيقية مع شهادة إتمام معتمدة.
      </p>
    </div>
  );
}

function Reviews() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center border border-line rounded-lg bg-card/20">
      <div className="flex items-center gap-1.5">
        <Star className="size-6 fill-yellow-500 text-yellow-500" />
        <span className="text-3xl font-bold font-mono text-foreground">4.9</span>
      </div>
      <span className="text-xs font-mono text-muted-foreground">
        بناءً على 342 تقييم موثق من أولياء أمور الطلاب في أكاديمية سند
      </span>
    </div>
  );
}

export default function CourseContent() {
  const [activeTab, setActiveTab] = useState("المحتوى");

  return (
    <div className="rounded-xl border border-line bg-card/20 p-4 sm:p-6 shadow-none">
      <div className="mb-6 flex items-center border-b border-line gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative pb-3 px-3 text-xs sm:text-sm font-mono font-medium transition-colors cursor-pointer select-none",
              activeTab === tab
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] bg-primary" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "المحتوى" && <Content />}
      {activeTab === "الوصف" && <Description />}
      {activeTab === "التقييمات" && <Reviews />}
    </div>
  );
}
