"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowLeft } from "lucide-react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-md flex-col gap-6 overflow-hidden rounded-[calc(var(--radius)*2)] bg-card p-6 sm:p-8 text-center shadow-xl border border-border"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 flex size-8 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="إغلاق"
        >
          <X className="size-5" />
        </button>
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">قريباً!</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            خدمة التواصل المباشر مع فريق المبيعات ستكون متاحة قريباً جداً لتلبية احتياجات مؤسستك.
          </p>
        </div>
        <Button onClick={onClose} size="lg" className="w-full text-base font-semibold">
          حسناً، فهمت
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function CtaBanner() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <section className="w-full bg-card">
      <Container withBorder>
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[calc(var(--radius)*3)] border border-border bg-[linear-gradient(to_bottom,#1a1a1a,#0a0a0a)] px-6 py-14 text-center sm:px-12">
          {/* نمط النقاط في الخلفية */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ededed 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          />
          {/* المحتوى */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-[28px] font-bold leading-tight primarysm:text-[32px]">
                شراكة تحوّل التقنية إلى تجربة تعليمية قابلة للقياس
              </h2>
              <p className="max-w-3xl text-lg font-medium text-muted-foreground sm:text-xl">
                نصمم برامج ومعسكرات تناسب طلاب مؤسستك، مع أهداف واضحة ومشاريع وتقارير متابعة.
              </p>
            </div>
            <Button
              size="lg"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setPopupOpen(true)}
            >
              تواصل مع المبيعات (قريباً) <ArrowLeft className="size-5 ml-1" />
            </Button>
          </div>
        </div>
      </Container>
      
      <AnimatePresence>
        {popupOpen && <ComingSoonPopup onClose={() => setPopupOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}
