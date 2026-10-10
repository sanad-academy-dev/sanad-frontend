"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/header";
import { MultiStepForm } from "../../../components/multi-step-form";
import { Button } from "@/components/ui/button";
import { PopupContact } from "./popup-contact";

type SupportCard = {
  title: string;
  subtitle: string;
  text: string;
  action: string;
  onClickType?: string;
  href?: string;
};

const CARDS: SupportCard[] = [
  {
    title: "التسجيل والبرامج",
    subtitle: "ابدأ رحلة التعلم مع سند",
    text: "تعرّف على البرامج والمسارات المتاحة، والمواعيد، وطريقة التسجيل المناسبة لطفلك.",
    action: "تعرّف على البرامج",
    onClickType: "ai-agent",
  },
  {
    title: "التقييم وتحديد المسار",
    subtitle: "ما المسار المناسب لطفلك؟",
    text: "ابدأ بتقييم أولي يساعدنا على فهم مستوى طفلك وقدراته، واختيار المسار التعليمي الأنسب له.",
    action: "احجز التقييم",
    onClickType: "trial-modal",
  },
  {
    title: "التعاون مع سند",
    subtitle: "هل ترغب في العمل معنا؟",
    text: "إذا كنت مدربًا، أو تمثل مدرسة أو مؤسسة تعليمية، أو لديك فكرة للتعاون مع سند، يسعدنا التواصل معك.",
    action: "تواصل معنا",
    onClickType: "contact-popup",
  },
  {
    title: "الدعم والمساعدة",
    subtitle: "هل تحتاج إلى مساعدة؟",
    text: "نساعدك في أي استفسار يتعلق بالتسجيل، المواعيد، الدفع، البرامج، أو رحلة التعلم.",
    action: "تواصل مع الدعم",
    onClickType: "contact-popup",
  },
];

export default function Support({ withBorder = true }: { withBorder?: boolean } = {}) {
  const [multiStepOpen, setMultiStepOpen] = useState(false);
  const [contactPopupOpen, setContactPopupOpen] = useState(false);

  useEffect(() => {
    if (multiStepOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [multiStepOpen]);

  const handleAction = (type?: string, href?: string) => {
    if (type === "ai-agent") {
      window.dispatchEvent(new Event("open-ai-agent"));
    } else if (type === "trial-modal") {
      setMultiStepOpen(true);
    } else if (type === "contact-popup") {
      setContactPopupOpen(true);
    } else if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-background ">
      <div className="w-full">
        <SectionHeader
          title="كيف يمكننا مساعدتك؟"
          description="سواء كنت تبحث عن المسار المناسب لطفلك، أو تريد حجز التقييم، أو لديك استفسار عن برامج سند، نحن هنا لمساعدتك."
          className="text-center items-center"
        />

        <div className="w-full rounded-3xl border border-border bg-card overflow-hidden shadow-sm" dir="rtl">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between p-8 md:p-12 border-b border-border gap-8">
            <div className="flex flex-col items-start gap-4 max-w-2xl">
              <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                تواصل مع فريق سند
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                نحن هنا للإجابة عن استفساراتك ومساعدتك في اختيار الخطوة المناسبة في رحلة التعلم.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Button
                  onClick={() => setContactPopupOpen(true)}
                >
                  تحدث معنا
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-[#25D366] bg-[#25D366]/10 px-5 py-2.5 rounded-full whitespace-nowrap self-start md:self-auto">
              <CheckCircle2 className="size-5" />
              <span>متاحون أونلاين</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border">
            {CARDS.map((card, i) => (
              <div key={i} className="flex flex-col items-start p-8 md:p-10 gap-8 group hover:bg-muted/40 transition-colors bg-card">
                <div className="flex-1 space-y-4">
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">
                    {card.title}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground/90">
                      {card.subtitle}
                    </p>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleAction(card.onClickType, card.href)}
                  className="transition-all hover:bg-foreground hover:text-background"
                >
                  {card.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {multiStepOpen && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 md:pt-[8vh] px-4"
            onClick={() => setMultiStepOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[800px] mx-auto">
              <MultiStepForm 
                onCreate={() => setTimeout(() => setMultiStepOpen(false), 2000)} 
                onClose={() => setMultiStepOpen(false)}
              />
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== "undefined" && createPortal(
        <PopupContact isOpen={contactPopupOpen} onClose={() => setContactPopupOpen(false)} />,
        document.body
      )}
    </section>
  );
}
