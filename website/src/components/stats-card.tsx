"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

// كرت الإحصائيات العائم — Frame 36 من التصميم
const STATS = [
  { value: "20+", label: "مجال تعليمي" },
  { value: "2,000+", label: "فيديوهات تعليمية" },
  { value: "1,200+", label: "طفل متعلم" },
  { value: "152+", label: "مدرب معتمد" },
];

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const numMatch = value.match(/[\d,]+/);
  const suffixMatch = value.replace(/[\d,]+/, ""); 
  
  const targetNumber = numMatch ? parseInt(numMatch[0].replace(/,/g, "")) : 0;

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, targetNumber, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = Math.round(v).toLocaleString("en-US");
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, targetNumber]);

  return (
    <span className="inline-flex items-center" dir="ltr">
      <span ref={ref}>0</span>
      <span>{suffixMatch}</span>
    </span>
  );
}

export default function StatsCard() {
  return (
    <div className="mx-auto w-full max-w-[978px] rounded-3xl border border-border/50 bg-card px-2 shadow-sm">
      <ul
        dir="ltr"
        className="grid grid-cols-2 items-center gap-y-4 sm:grid-cols-4 lg:flex lg:justify-center lg:gap-x-[60px]"
      >
        {STATS.map((stat, i) => (
          <li key={stat.label} className="flex items-center">
            <div className="flex flex-1 flex-col items-center gap-2 px-6 py-4">
              <span className="text-xl font-bold text-primary">
                <AnimatedStat value={stat.value} />
              </span>
              <span className="text-lg text-foreground">{stat.label}</span>
            </div>
            {i < STATS.length - 1 && (
              <span
                aria-hidden
                className="hidden h-[66px] w-px bg-secondary lg:block"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
