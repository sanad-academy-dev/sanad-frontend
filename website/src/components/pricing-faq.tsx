"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/header";

export type FaqItem = {
  q: string;
  a: string;
};

const PRICING_FAQS: FaqItem[] = [
  {
    q: "ما هي أنظمة الدفع وفترات الاشتراك المتاحة؟",
    a: "نوفر خيارات دفع مرنة تناسب احتياجات كل أسرة: اشتراك شهري يجدد شهرياً، اشتراك ربع سنوي (3 أشهر) يمنحك توفيراً يصل إلى 1,000 ج.م، واشتراك سنوي (12 شهر) يوفر لك حتى 8,000 ج.م مقارنة بالدفع الشهري. ندعم الدفع السلس عبر المحافظ الإلكترونية (فودافون كاش)، تطبيق InstaPay، والبطاقات البنكية المباشرة.",
  },
  {
    q: "كيف يعمل خصم الأخوة والعائلات (Family Discount)؟",
    a: "نوفر خصماً عائلياً فورياً بنسبة 10% عند اشتراك أكثر من طفل من نفس العائلة (أخوين أو أكثر). يُطبق الخصم تلقائياً على كافة الباقات والمستويات لكل طفل، مع الحفاظ على خطة تعليمية ومتابعة فردية مستقلة لكل طالب.",
  },
  {
    q: "ما هو رصيد الحصص المجمّدة (Frozen Credits) في حال السفر أو الامتحانات؟",
    a: "تقديراً لظروف المدارس والامتحانات والسفر، نمنح كل طالب رصيد حصص مجمّدة رسمي يتراوح بين 4 إلى 7 حصص حسب باقة اشتراكه؛ حيث يمكن لولي الأمر تعليق الاشتراك مؤقتاً دون فقدان أي درس. كما يحظى مشتركو باقة 'خاص 1:1' بمرونة كاملة لإعادة جدولة الحصص قبل 24 ساعة.",
  },
  {
    q: "هل يمكننا تجربة حصة تقييمية قبل دفع الاشتراك؟",
    a: "بالتأكيد! نتيح لكل طفل جلسة تقييم وتجربة مجانية 100% مدتها 45 دقيقة عبر الإنترنت أو في فروعنا، يتعرف خلالها الطالب على أسلوب التعلم التفاعلي ونحدد مستواه وشغفه بدقة قبل اتخاذ أي قرار مالي.",
  },
  {
    q: "ما الفرق بين الحضور في المقر (Offline) والتعلم عن بُعد (Online)؟",
    a: "التعلم في المقر يشمل التطبيق العملي التفاعلي داخل فروعنا وتوفير الأجهزة ومختبرات الروبوتيكس والتفاعل المباشر وجهاً لوجه مع المدربين والزملاء. أما التعلم أونلاين فيتم عبر فصول افتراضية مباشرة (Live) بمجموعات صغيرة لا تتعدى 8 طلاب مع مشاركة الشاشات وتطبيق كل خطوة بنفس كفاءة الحضور.",
  },
  {
    q: "ما هي الشهادات والمزايا الإضافية المشمولة مع الاشتراك؟",
    a: "يحصل الطالب عند إتمام كل مرحلة على شهادة رسمية موثقة برمز QR للتحقق، بالإضافة لمعرض أعمال رقمي (Portfolio) لمشاريعه، وتقارير دورية لأولياء الأمور، وخصم 5% إلى 20% على متجر سند، وخصم 10% إلى 25% على معسكرات سند الصيفية والشتوية.",
  },
  {
    q: "ما هي سياسة الاسترجاع وضمان الجودة؟",
    a: "نلتزم بتقديم تجربة تعليمية متميزة تصنع فارقاً حقيقياً لطفلك. إذا رغبت في إلغاء الاشتراك أو تبديل المسار، يمكنك طلب استرجاع المبلغ خلال الأسبوع الأول من بدء البرنامج وفق الشروط والضوابط المعتمدة للأكاديمية.",
  },
  {
    q: "هل يمكن لطفلي الانتقال بين المستويات أو المسارات بعد البدء؟",
    a: "نعم، نظام سند التعليمي مرن وتراكمي؛ فإذا وجد الطالب شغفاً أكبر في تخصص معين (كالذكاء الاصطناعي أو تطوير الألعاب أو الويب) أو رغب في التقدم أسرع، يقيّم المدرب مستواه لنقله بسلاسة إلى المسار أو المستوى الأنسب دون أي عوائق.",
  },
];

export default function PricingFaq({
  className,
}: {
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className={cn("relative w-full py-8 sm:py-12", className)} dir="rtl">
      <SectionHeader
        title="أسئلة شائعة حول الباقات والاشتراك"
        description="إجابات واضحة ومباشرة عن أنظمة الدفع، خصم الإخوة، تجميد الحصص، والمزايا الإضافية المشمولة."
      />

      <div className="pt-2 pb-6 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-2xl border border-line bg-card/40 backdrop-blur-xs overflow-hidden shadow-none divide-y divide-line">
          {PRICING_FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="group/item transition-colors hover:bg-secondary/15"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 px-5 sm:px-6 text-right cursor-pointer select-none outline-none focus-visible:bg-secondary/25"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="size-4 text-primary shrink-0 opacity-70 group-hover/item:opacity-100 transition-opacity" />
                    <span
                      className={cn(
                        "font-heading text-sm sm:text-base font-bold transition-colors leading-relaxed tracking-normal",
                        isOpen
                          ? "text-primary"
                          : "text-foreground group-hover/item:text-foreground"
                      )}
                    >
                      {item.q}
                    </span>
                  </div>

                  <div className="flex size-7 items-center justify-center rounded-md border border-line bg-secondary/50 text-primary transition-colors shrink-0">
                    {isOpen ? (
                      <Minus className="size-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="size-3.5 stroke-[2.5]" />
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
                        <p className="border-t border-line/40 pt-3 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
