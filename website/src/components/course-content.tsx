"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// تبويبات محتوى الدورة (المحتوى / الوصف / التقييمات) — Frame من التصميم

const TABS = ["التقييمات", "الوصف", "المحتوى"];

const LECTURES = [
  "1- مقدمة في تطوير الويب وفهم كيفية عمل الإنترنت",
  "2- أساسيات HTML وبناء هيكل الصفحات",
  "3- تنسيق الصفحات باستخدام CSS",
  "4- تصميم واجهات متجاوبة (Responsive Design)",
  "5- أساسيات JavaScript والتعامل مع DOM",
  "6- التعامل مع المستخدم وإضافة الديناميكية للموقع",
  "7- التعامل مع Git وGitHub لإدارة الأكواد",
  "8- مقدمة في Frameworks (مثل Bootstrap) لتسريع التصميم",
  "9- أساسيات Frontend Libraries (مثل React)",
  "10- مقدمة في Backend (Node.js وExpress)",
  "11- ربط الواجهة الأمامية مع السيرفر وAPIs",
  "12- نشر الموقع (Deployment) وبناء مشروع نهائي كامل",
];

function Content() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className="flex flex-col gap-4">
      {LECTURES.map((lecture, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-background"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
            >
              <span className="text-base font-medium text-foreground">
                {lecture}
              </span>
              <ChevronDown
                className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-right text-sm leading-relaxed text-muted-foreground">
                    محتوى تفصيلي للمحاضرة يشمل فيديوهات تعليمية وتمارين تطبيقية
                    ومشروع عملي لترسيخ المفاهيم.
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
    <div className="flex flex-col gap-4 text-right text-base leading-relaxed text-muted-foreground">
      <p>
        في هذه الدورة الشاملة، ينطلق ابنك في رحلة تطوير الويب من الصفر حتى احتراف
        بناء مواقع تفاعلية كاملة. نبدأ بأساسيات HTML وCSS لبناء وتنسيق الصفحات،
        ثم ننتقل إلى JavaScript لإضافة التفاعل والديناميكية.
      </p>
      <p>
        تعتمد الدورة على أسلوب عملي وممتع من خلال مشاريع تطبيقية حقيقية، وتنتهي
        بمشروع تخرّج كامل ينشره الطفل على الإنترنت — مع شهادة إتمام معتمدة.
      </p>
    </div>
  );
}

function Reviews() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="text-4xl font-bold text-primary">4.5</span>
      <span className="text-base text-muted-foreground">
        بناءً على 215.624 تقييم من أولياء الأمور
      </span>
    </div>
  );
}

export default function CourseContent() {
  const [activeTab, setActiveTab] = useState("المحتوى");

  return (
    <div className="rounded-3xl border border-border bg-card p-5 lg:p-6">
      {/* التبويبات */}
      <div className="mb-6 flex items-center justify-between border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 pb-4 text-center text-base font-medium transition-colors ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-muted-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* المحتوى حسب التبويب */}
      {activeTab === "المحتوى" && <Content />}
      {activeTab === "الوصف" && <Description />}
      {activeTab === "التقييمات" && <Reviews />}
    </div>
  );
}
