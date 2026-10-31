"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  q: string;
  a: string;
};

export type FaqCategory = {
  id: string;
  name: string;
  questions: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "admission",
    name: "القبول",
    questions: [
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
        q: "هل توجد حصة تجريبية مجانية؟",
        a: "نعم، بعد التقييم المبدئي يمكن حجز حصة تجريبية مجانية للتعرف على أسلوبنا التعليمي.",
      },
      {
        q: "هل يمكن تغيير المسار أو المستوى بعد التسجيل؟",
        a: "نعم، يمكن تعديل المسار أو المستوى بالتنسيق مع فريق سند وفق احتياجات الطالب.",
      },
    ],
  },
  {
    id: "tracks",
    name: "المسارات",
    questions: [
      {
        q: "ما الفرق بين المسار والمعسكر الصيفي؟",
        a: "المسار تعلم مستمر حصص أسبوعيًا لمدة 3 أشهر، بينما المعسكر تجربة مكثفة لمدة شهر خلال الصيف.",
      },
      {
        q: "هل التدريس باللغة العربية أم الإنجليزية؟",
        a: "الشرح باللغة العربية لضمان الفهم، مع استخدام مصطلحات البرمجة باللغة الإنجليزية.",
      },
      {
        q: "هل التعليم في المقر أم عن بُعد؟",
        a: "يتوفر كلا الخيارين، وتختلف المواعيد والأسعار حسب البرنامج.",
      },
      {
        q: "كم عدد الطلاب في المجموعة؟",
        a: "بحد أقصى 8 طلاب في المجموعة، لضمان اهتمام كافٍ ومشاركة وتطبيق عملي أفضل.",
      },
      {
        q: "هل يحتاج طفلي إلى لابتوب أو جهاز لوحي؟",
        a: "نعم، يحتاج إلى جهاز مناسب للتطبيق وممارسة ما يتعلمه في المنزل.",
      },
      {
        q: "هل يحصل الطالب على شهادة؟",
        a: "نعم، يحصل الطالب على شهادة من STEM.org عند استيفاء متطلبات البرنامج.",
      },
      {
        q: "هل سند معتمدة؟",
        a: "نعم، ونوضح تفاصيل الاعتمادات عبر الموقع.",
      },
    ],
  },
  {
    id: "progress",
    name: "المتابعة",
    questions: [
      {
        q: "كيف يمكنني متابعة تقدم طفلي؟",
        a: "نوفر تقارير دورية ولوحة متابعة لولي الأمر لمتابعة الحضور والتقدم والمشاريع.",
      },
      {
        q: "كيف تضمنون سلامة طفلي أثناء الحصص؟",
        a: "يتم اعتماد وتدريب المحاضرين قبل التدريس، مع توفير أدوات متابعة لولي الأمر للحضور والتقدم.",
      },
    ],
  },
  {
    id: "pricing",
    name: "الأسعار",
    questions: [
      {
        q: "ما تكلفة الاشتراك؟",
        a: "تبدأ الأسعار من 800 جنيه شهريًا لخطة التأسيس أونلاين (و1,000 جنيه شهريًا في المقر)، وتتدرج حسب المستوى والمسار.",
      },
      {
        q: "ما هي سياسة الاسترجاع؟",
        a: "يمكن طلب استرجاع المبلغ خلال الأسبوع الأول وفق شروط الاسترجاع المعتمدة.",
      },
    ],
  },
];

export function FaqAccordion({
  idPrefix = "faq",
  className,
}: {
  idPrefix?: string;
  className?: string;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("admission");
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

  const activeCategory =
    FAQ_CATEGORIES.find((c) => c.id === activeCategoryId) || FAQ_CATEGORIES[0];

  const toggleQuestion = (q: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [q]: !prev[q],
    }));
  };

  return (
    <div className={cn("pt-0 pb-5 max-w-5xl mx-auto w-full", className)}>
      <div
        className="w-full screen-line-bottom bg-card/10 select-none"
        dir="rtl"
      >
        <div className="grid grid-cols-4 w-full bg-card/10 select-none">
          {FAQ_CATEGORIES.map((cat, idx) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={cn(
                  "relative flex items-center justify-center py-3 sm:py-4 px-1 sm:px-2 text-center font-sans text-xs sm:text-[13px] transition-colors cursor-pointer outline-none select-none",
                  idx !== FAQ_CATEGORIES.length - 1 && "border-l border-line",
                  isActive
                    ? "bg-secondary/70 text-foreground font-bold"
                    : "text-muted-foreground font-semibold hover:bg-secondary/35 hover:text-foreground"
                )}
              >
                <span className="block truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-3 sm:px-5">
        <div
        id={`${idPrefix}-questions`}
        className="mt-3 rounded-2xl border border-line bg-card/40 backdrop-blur-xs overflow-hidden shadow-none"
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoryId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="divide-y divide-line"
          >
            {activeCategory.questions.map((item) => {
              const isOpen = !!openQuestions[item.q];
              return (
                <div
                  key={item.q}
                  className="group/faq transition-colors hover:bg-secondary/15"
                >
                  <button
                    type="button"
                    onClick={() => toggleQuestion(item.q)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 px-5 sm:px-6 text-right cursor-pointer select-none outline-none focus-visible:bg-secondary/25"
                  >
                    <span
                      className={cn(
                        "font-heading text-sm sm:text-base font-bold transition-colors leading-relaxed tracking-normal",
                        isOpen
                          ? "text-primary"
                          : "text-foreground group-hover/faq:text-foreground"
                      )}
                    >
                      {item.q}
                    </span>

                    <div className="flex shrink-0 items-center justify-center text-primary transition-colors">
                      {isOpen ? (
                        <Minus className="size-4 sm:size-4.5 stroke-[2.5]" />
                      ) : (
                        <Plus className="size-4 sm:size-4.5 stroke-[2.5]" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-0 font-sans text-xs sm:text-[13.5px] text-foreground/80 leading-relaxed font-normal">
                          <p className="border-t border-line/40 pt-3">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
}
