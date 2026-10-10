"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Feature = {
  title: string;
  text: string;
  icon: React.ReactNode;
};

function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLit, setIsLit] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      data-lit={isLit || undefined}
      onMouseEnter={() => setIsLit(true)}
      onMouseLeave={() => setIsLit(false)}
      onMouseMove={handleMouseMove}
      className="group/grid relative overflow-hidden rounded-3xl bg-card border border-border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
      style={
        {
          "--mouse-x": `${pos.x}px`,
          "--mouse-y": `${pos.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-[opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[lit]/grid:opacity-100"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.15), transparent 80%)`,
        }}
      />

      {/* Glow border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-[opacity] duration-300 group-data-[lit]/grid:opacity-100"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), hsl(var(--primary) / 0.08), transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        <div
          className={cn(
            "flex items-center justify-center size-12 rounded-2xl border border-border/80 bg-background/50 text-foreground transition-all duration-300 group-data-[lit]/grid:border-primary/30 group-data-[lit]/grid:text-primary group-data-[lit]/grid:bg-primary/5",
          )}
        >
          {feature.icon}
        </div>

        <div className="flex flex-col gap-1.5 text-right">
          <h3 className="text-base font-bold text-foreground leading-tight">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SpotlightGrid({ features }: { features: Feature[] }) {
  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {features.map((feature, i) => (
        <FeatureCard key={feature.title} feature={feature} index={i} />
      ))}
    </div>
  );
}
