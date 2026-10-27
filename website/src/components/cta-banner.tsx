"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowUpLeft } from "lucide-react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";

function ComingSoonPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-sm flex-col gap-4 overflow-hidden rounded-xl bg-card p-5 sm:p-6 text-center border border-border"
        dir="rtl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 left-3.5 flex size-7 items-center justify-center rounded-md bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="size-4" />
        </button>
        <div className="flex flex-col items-center gap-3 pt-1">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="size-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">قريباً!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            خدمة التواصل المباشر مع فريق المبيعات ستكون متاحة قريباً جداً لتلبية احتياجات مؤسستك.
          </p>
        </div>
        <Button onClick={onClose} className="mt-2 h-9 w-full text-xs sm:text-sm font-semibold cursor-pointer">
          حسناً، فهمت
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function CtaBanner() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <section className="w-full bg-background relative overflow-hidden" id="b2b-cta">
      <Container className="relative">
        <div className="py-6 sm:py-8 px-4 sm:px-6">
          <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-line bg-card/40 backdrop-blur-xs px-6 sm:px-10 py-10 sm:py-14 text-center max-w-5xl mx-auto" dir="rtl">
            <DotGridSpotlight />

            <div className="relative z-10 flex flex-col items-center gap-3.5 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[30px] font-heading font-bold leading-snug text-foreground tracking-tight text-center">
                عندك طلاب؟
              </h2>

              <p className="text-xs sm:text-[13px] md:text-sm text-muted-foreground leading-relaxed max-w-lg text-center">
                خلّي سند شريكك في رحلتهم لتعلّم البرمجة والذكاء الاصطناعي
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/+201022805731?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D8%B9%D8%A7%D9%88%D9%86%20%D9%85%D8%B9%20%D8%A3%D9%83%D8%A7%D8%AF%D9%8A%D9%85%D9%8A%D8%A9%20%D8%B3%D9%86%D8%AF%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%B7%D9%84%D8%A7%D8%A8%D9%86%D8%A7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs sm:text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] hover:bg-primary/90 group cursor-pointer shadow-sm"
                >
                  <span>تعاون معانا</span>
                  <ArrowUpLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      <AnimatePresence>
        {popupOpen && <ComingSoonPopup onClose={() => setPopupOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
