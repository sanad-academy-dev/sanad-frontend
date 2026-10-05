"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Container from "./container";

// Paints only the 1px padding ring, so the gradient shows as a lit edge.
const RING_MASK =
  "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)";

// Monochrome on purpose: a faint dark wash in light mode, faint white in dark.
const GLOW =
  "radial-gradient(300px circle at var(--x) var(--y), rgba(255,255,255,0.08), transparent 70%)";
const EDGE =
  "radial-gradient(200px circle at var(--x) var(--y), rgba(255,255,255,0.6), transparent 70%)";

// Card-space point the shadows are cast from: the middle of the icon
const SHADOW_ORIGIN = 30;
const SHADOW_MAX = 6;
const SHADOW_FALLOFF = 420;
const SHADOW_COLOR = "rgba(0,0,0,0.9)";
const CAST =
  "transition-[filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[lit]/grid:transition-none motion-reduce:[filter:none]";

export type Feature = {
  title: string;
  text: string;
  icon: React.ReactNode;
};

export function SpotlightGrid({
  features,
  className,
}: {
  features: Feature[];
  className?: string;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);

  const track = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    gridRef.current?.setAttribute("data-lit", "");
    for (const card of cards.current) {
      if (!card) continue;
      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
      const dx = SHADOW_ORIGIN - x;
      const dy = SHADOW_ORIGIN - y;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.max(0, 1 - dist / SHADOW_FALLOFF);
      card.style.setProperty("--sx", `${((dx / dist) * SHADOW_MAX * reach).toFixed(2)}px`);
      card.style.setProperty("--sy", `${((dy / dist) * SHADOW_MAX * reach).toFixed(2)}px`);
    }
  };

  return (
    <div
      ref={gridRef}
      className={cn(
        "group/grid grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      onPointerMove={track}
      onPointerLeave={() => {
        gridRef.current?.removeAttribute("data-lit");
        for (const card of cards.current) {
          card?.style.setProperty("--sx", "0px");
          card?.style.setProperty("--sy", "0px");
        }
      }}
    >
      {features.map((feature, i) => (
        <article
          key={feature.title}
          ref={(el) => {
            cards.current[i] = el;
          }}
          className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 shadow-sm"
        >
          {/* Fades rather than snaps, so leaving the grid doesn't flash dark. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-[opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[lit]/grid:opacity-100"
            style={{ background: GLOW }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-[opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[lit]/grid:opacity-100"
            style={{ background: EDGE, mask: RING_MASK, WebkitMask: RING_MASK }}
          />

          <div
            className="relative h-full flex flex-col items-start gap-4 text-right"
            style={{ "--shadow": SHADOW_COLOR } as React.CSSProperties}
          >
            <span
              className={cn(
                CAST,
                "flex items-center justify-center size-12 rounded-2xl border border-border/80 bg-background/50 text-foreground [filter:drop-shadow(var(--sx,0px)_var(--sy,0px)_2px_var(--shadow))]",
              )}
            >
              {feature.icon}
            </span>

            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm md:text-[15px] text-pretty text-muted-foreground leading-relaxed">
                {feature.text}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const FEATURES: Feature[] = [
  {
    title: "التأسيس",
    text: "نبدأ من الصفر حتي كتابة أول سطر كود",
    icon: <Icon><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></Icon>,
  },
  {
    title: "تحديد المسار",
    text: "لكل عمر مساره، ولكل طفل إيقاعه، لا أسرع ولا أبطأ من طبيعته",
    icon: <Icon><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></Icon>,
  },
  {
    title: "يتعلم بالممارسة",
    text: "كل مفهوم يتحول إلى تجربة ومهمة ومشروع يستطيع الطفل فهمه وبناؤه",
    icon: <Icon><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></Icon>,
  },
  {
    title: "كل مستوى ينتهي بإنجاز حقيقي",
    text: "لا ينتقل الطفل لمجرد انتهاء الوقت؛ ينتقل عندما يثبت ما تعلمه.",
    icon: <Icon><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>,
  },
  {
    title: "الشفافية مع الأهل",
    text: "متابعة تقدم طفلك لحظيا من التطبيق (قريبا)",
    icon: <Icon><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>,
  },
  {
    title: "مشاركة اللحظات",
    text: "بث مباشر لطفلك داخل الاكاديميه",
    icon: <Icon><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></Icon>,
  },
  {
    title: "الأمان",
    text: "حضور وانصراف باشعارات لحظية",
    icon: <Icon><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
  },
];

export default function WhySanad() {
  return (
    <section className="w-full bg-background">
      <Container className="relative overflow-hidden py-16">
        <div className="w-full border-t border-border pt-16">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight"
          >
            لماذا أكاديمية سند؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-2xl"
          >
            نعلّم، نطبّق، ونبني مهارات تستمر مع ابنك.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          dir="rtl"
        >
          <SpotlightGrid features={FEATURES} />
        </motion.div>
      </div>
      </Container>
    </section>
  );
}
