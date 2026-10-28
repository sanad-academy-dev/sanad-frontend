"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JoinButton } from "@/components/join-button";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";

const ROTATING_WORDS = [
  "البرمجة",
  "الكود",
  "الروبوتيكس",
  "الذكاء الاصطناعي",
];

export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex items-baseline text-orange-600 dark:text-orange-500 mr-1.5 text-right select-none">
      <span className="invisible select-none opacity-0 pointer-events-none" aria-hidden="true">
        الذكاء الاصطناعي
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
          transition={{
            duration: 0.35,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="absolute inset-y-0 right-0 flex items-center justify-start whitespace-nowrap text-right"
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  return (
    <div className="relative w-full">
      {/* Central CAD Container — Connects seamlessly with navbar border-x with 0 gap */}
      <div className="relative mx-auto w-full max-w-5xl border-x border-line overflow-hidden">
        {/* Chanhdai Interactive Dot Grid Spotlight Canvas */}
        <DotGridSpotlight />

        {/* Hero Content — Centered, with unchanged height */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 sm:pt-24 pb-12 sm:pb-16 min-h-[335px] sm:min-h-[415px] md:min-h-[475px] lg:min-h-[515px]">
          {/* Main Headline — Responsive scaling, wrapping cleanly on mobile and single-line on sm+ */}
          <h1 className="mb-3.5 sm:mb-4.5 text-center font-heading text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-tight text-foreground sm:whitespace-nowrap leading-snug sm:leading-tight px-1">
            <span className="inline-block">سند… يسند طفلك لبناء عقلية تفكّر وتصنع</span>{""}
            <RotatingWord />
          </h1>

          {/* Description — Centered */}
          <p className="mb-6 sm:mb-8 text-center text-sm sm:text-base md:text-lg font-medium text-muted-foreground leading-relaxed max-w-2xl">
            بالبرمجة، وذكاء اصطناعي نجعله يصنع مشاريع بيده
          </p>

          {/* Action Buttons — Centered */}
          <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-center gap-2.5 w-full">
            <JoinButton
              className="w-full sm:w-auto text-xs sm:text-sm font-medium"
              size="default"
            >
              قيم ابنك مجانًا
            </JoinButton>

            <Button
              asChild
              variant="outline"
              size="default"
              className="w-full sm:w-auto text-xs sm:text-sm font-medium group"
            >
              <Link href="/#paths">
                اكتشف مساراتنا
                <ArrowUpLeft className="size-4 mr-1.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>

          {/* Location & Delivery Mode Badges — Centered */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs font-semibold text-muted-foreground select-none">
            <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/70 px-3 py-1 backdrop-blur-xs">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span>حضوري في الفروع</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/70 px-3 py-1 backdrop-blur-xs">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>أونلاين تفاعلي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
