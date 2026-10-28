"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { cn } from "@/lib/utils";
import { useIsScrolled } from "@/hooks/use-is-scrolled";
import { Button } from "@/components/ui/button";

export function ScrollToTop({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { scrollY } = useScroll();

  const visible = useIsScrolled() === true;
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    const prev = scrollY.getPrevious() ?? 0;
    const diff = latestValue - prev;
    setScrollDirection(diff > 0 ? "down" : "up");
  });

  return (
    <Button
      data-visible={visible}
      data-scroll-direction={scrollDirection}
      className={cn( "[--bottom:0.75rem] sm:[--bottom:1.25rem] lg:[--bottom:2rem]", "fixed right-4 bottom-[calc(var(--bottom,0.75rem)+env(safe-area-inset-bottom,0))] z-50 lg:right-8",
        "transition-[background-color,opacity,visibility] duration-300 data-[scroll-direction=down]:opacity-40 data-[scroll-direction=up]:opacity-100 data-[visible=false]:invisible data-[visible=false]:opacity-0",
        "data-[scroll-direction=down]:hover:opacity-100",
        "border border-line cursor-pointer",
        className
      )}
      variant="secondary"
      size="icon-sm"
      aria-label="العودة لأعلى الصفحة"
      title="العودة لأعلى الصفحة"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      {...props}
    >
      <ArrowUp className="size-4" />
    </Button>
  );
}
