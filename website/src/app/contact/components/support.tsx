"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/header";
import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { MultiStepForm } from "../../../components/multi-step-form";
import { Button } from "@/components/ui/button";
import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import { PopupContact } from "./popup-contact";
import { FaqAccordion } from "@/components/faq-accordion";
import { Separator } from "@/components/separator";

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
    action: "تحدث معنا",
    onClickType: "contact-popup",
  },
  {
    title: "الدعم والمساعدة",
    subtitle: "هل تحتاج إلى مساعدة؟",
    text: "نساعدك في أي استفسار يتعلق بالتسجيل، المواعيد، الدفع، البرامج، أو رحلة التعلم.",
    action: "تحدث معنا",
    onClickType: "contact-popup",
  },
];

export default function Support() {
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
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="flex-1 flex flex-col">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb
          items={[
            { label: "حول الأكاديمية" },
            { label: "تحدث معنا" },
          ]}
        />

        {/* Header */}
        <SectionHeader
          title="تحدث معنا"
          label={
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 sm:px-3 py-0.5 sm:py-1 font-sans text-xs font-bold text-emerald-500 select-none">
              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
              <span>متاحون أونلاين</span>
            </span>
          }
          description="نحن هنا للإجابة عن كافة استفساراتك ومساعدتك في اختيار المسار والبرنامج الأنسب لطفلك."
        />

        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-line">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-start p-5 sm:p-6 gap-6 group hover:bg-secondary/40 transition-colors bg-card"
            >
              <div className="flex-1 space-y-2.5 text-right w-full">
                <h3 className="text-base sm:text-lg font-bold text-foreground font-heading tracking-normal">
                  {card.title}
                </h3>
                <div className="space-y-1">
                  <p className="font-sans text-xs sm:text-[12.5px] font-semibold text-foreground/90">
                    {card.subtitle}
                  </p>
                  <p className="font-sans text-xs sm:text-[13px] text-foreground/75 leading-relaxed font-normal">
                    {card.text}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(card.onClickType, card.href)}
                className="w-full h-9 font-sans text-xs font-bold rounded-lg cursor-pointer group transition-all border-line bg-secondary/60 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none"
              >
                <span>{card.action}</span>
                <ArrowUpLeft className="size-3.5 mr-1 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Parents FAQ */}
        <div className="bg-background">
          <Separator className="border-x-0" />
          <SectionHeader 
            title="أسئلة أولياء الأمور" 
            description="أبرز الأسئلة الشائعة حول برامجنا ومواعيد الحصص وطرق التدريس المعتمدة."
          />
          <FaqAccordion idPrefix="contact-faq" />
        </div>
      </Container>

      {/* Trial Assessment Modal Portal */}
      {multiStepOpen && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 md:pt-[8vh] px-4 overflow-y-auto pb-12"
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

      {/* Direct Contact Modal Portal */}
      {typeof document !== "undefined" && createPortal(
        <PopupContact isOpen={contactPopupOpen} onClose={() => setContactPopupOpen(false)} />,
        document.body
      )}
    </div>
  );
}
