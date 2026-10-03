"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DotGrid } from "@/components/ui/dot-grid";
import { cn } from "@/lib/utils";
import { JoinButton } from "@/components/join-button";

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

  const currentPhrase = ROTATING_WORDS[index].split(" ");

  return (
    <span className="relative inline-flex items-center gap-2 align-middle">
      <span className="relative inline-grid overflow-hidden text-right">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="col-start-1 row-start-1 flex whitespace-nowrap text-primary"
          >
            {currentPhrase.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: "0.4em", filter: "blur(4px)" }}
                animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                exit={{ opacity: 0, y: "-0.4em", filter: "blur(4px)" }}
                transition={{
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1],
                  delay: i * 0.1,
                }}
                className={cn("inline-block", i > 0 && "mr-2")}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
        {/* Ghost element to maintain width and prevent layout shift */}
        <span
          aria-hidden
          className="col-start-1 row-start-1 whitespace-nowrap opacity-0"
        >
          الذكاء الاصطناعي
        </span>
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <>
      <div className="relative overflow-hidden w-full bg-background md:pt-8 pt-10">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <DotGrid />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-6xl flex-col items-center justify-center gap-12 px-4 py-32 text-center lg:min-h-[700px]">
          <div className="flex flex-col items-center gap-6">
          <h1 className="text-[34px] font-bold leading-[1.25] tracking-[-0.5px] text-foreground sm:text-5xl lg:text-[52px] lg:leading-[68px] lg:whitespace-nowrap">
            أكاديمية سَنَد... سَنَدَ ابنك في تعلّم <RotatingWord />
          </h1>
          <p className="max-w-2xl text-lg font-medium text-muted-foreground sm:text-2xl">
            يتعلم • يطبق • يبني مشاريع حقيقية
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <JoinButton className="px-10 py-4 text-lg h-auto font-semibold">
             قيم ابنك مجانًا
          </JoinButton>
          <Button asChild variant="secondary" className="px-8 py-4 text-lg h-auto font-semibold">
            <a href="#">
              اكتشف مساراتنا
              <ArrowLeft className="size-6 ml-2" />
            </a>
          </Button>
        </div>

        {/* Location Info */}
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-bold text-muted-foreground">
          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-5 py-2.5 backdrop-blur-md transition-colors hover:bg-background/60">
            <MapPin className="size-5 text-primary" />
            <span>حضوري</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-5 py-2.5 backdrop-blur-md transition-colors hover:bg-background/60">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
            </span>
            <span>أونلاين</span>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
