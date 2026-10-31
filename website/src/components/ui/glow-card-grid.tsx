"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type GlowCardGridProps = React.ComponentPropsWithoutRef<"div"> & {
  // Card parameters
  cardRadius?: number;

  // Icon parameters
  iconBlur?: number;
  iconSaturate?: number;
  iconBrightness?: number;
  iconScale?: number;
  iconOpacity?: number;

  // Border parameters
  borderWidth?: number;
  borderBlur?: number;
  borderSaturate?: number;
  borderBrightness?: number;
  borderContrast?: number;

  children: React.ReactNode;
};

export function GlowCardGrid({
  cardRadius = 16,

  iconBlur = 25,
  iconSaturate = 5.0,
  iconBrightness = 1.3,
  iconScale = 4,
  iconOpacity = 0.3,

  borderWidth = 3,
  borderBlur = 10,
  borderSaturate = 4.2,
  borderBrightness = 2.5,
  borderContrast = 2.5,

  className,
  style,
  ...props
}: GlowCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!gridRef.current) return;

      const cards = gridRef.current.querySelectorAll<HTMLElement>(
        "[data-slot='glow-card']"
      );

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x = (event.clientX - centerX) / (rect.width / 2);
        const y = (event.clientY - centerY) / (rect.height / 2);

        card.style.setProperty("--pointer-x", x.toFixed(3));
        card.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };

    document.addEventListener("pointermove", handlePointerMove);

    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3",
        className
      )}
      style={
        {
          "--card-radius": `${cardRadius}px`,
          "--card-icon-blur": `${iconBlur}px`,
          "--card-icon-saturate": iconSaturate,
          "--card-icon-brightness": iconBrightness,
          "--card-icon-scale": iconScale,
          "--card-icon-opacity": iconOpacity,
          "--card-border-width": `${borderWidth}px`,
          "--card-border-blur": `${borderBlur}px`,
          "--card-border-saturate": borderSaturate,
          "--card-border-brightness": borderBrightness,
          "--card-border-contrast": borderContrast,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export type GlowCardProps = {
  name: string;
  handle: string;
  avatar: string;
  href?: string;
  className?: string;
};

export function GlowCard({ name, handle, avatar, href, className }: GlowCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`LinkedIn profile for ${name}`}
      data-slot="glow-card"
      className={cn(
        "@container-size relative h-52 w-full overflow-hidden border border-line bg-card/60 transition-transform duration-200 select-none active:scale-[0.98]",
        className
      )}
      style={{
        containerType: "size",
        borderRadius: "var(--card-radius, 16px)",
      }}
    >
      <div
        className="flex size-full overflow-hidden"
        style={{
          borderRadius: "var(--card-radius, 16px)",
          clipPath: "inset(0 round var(--card-radius, 16px))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-[transform,filter]"
          style={{
            transform:
              "translate(calc(var(--pointer-x, -10) * 50cqi), calc(var(--pointer-y, -10) * 50cqh)) scale(var(--card-icon-scale, 4))",
            filter:
              "blur(var(--card-icon-blur, 25px)) brightness(var(--card-icon-brightness, 1.3)) saturate(var(--card-icon-saturate, 5))",
            opacity: "var(--card-icon-opacity, 0.3)",
          }}
        >
          <Image
            className="size-20"
            src={avatar}
            alt={name}
            width={80}
            height={80}
            unoptimized
          />
        </div>

        <div className="z-10 flex flex-1 flex-col items-center justify-center gap-4">
          <Image
            className="size-20 rounded-full border border-line object-cover"
            src={avatar}
            alt={name}
            width={80}
            height={80}
            unoptimized
          />

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-base leading-none font-semibold text-foreground">
              {name}
            </h2>
            <p className="text-sm/none text-foreground/50 font-mono dir-ltr" dir="ltr">
              {handle}
            </p>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 translate-z-0 border-solid border-transparent"
        style={{
          borderRadius: "var(--card-radius, 16px)",
          borderWidth: "var(--card-border-width, 3px)",
          backdropFilter:
            "blur(var(--card-border-blur, 10px)) brightness(var(--card-border-brightness, 2.5)) contrast(var(--card-border-contrast, 2.5)) saturate(var(--card-border-saturate, 4.2))",
          clipPath: "inset(0 round var(--card-radius, 16px))",
          maskImage:
            "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
          maskOrigin: "border-box, padding-box",
          maskClip: "border-box, padding-box",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        } as React.CSSProperties}
      />
    </a>
  );
}
