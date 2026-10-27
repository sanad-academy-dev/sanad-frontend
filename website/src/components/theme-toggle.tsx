"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label="تبديل المظهر (فاتح / داكن)"
      className={cn(
        "relative flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      <DarkSideIcon className="size-4.5" isDark={mounted ? resolvedTheme === "dark" : false} />
    </button>
  );
}

// Chanhdai's signature Dark Side icon with smooth 180deg flip
function DarkSideIcon({
  className,
  isDark,
}: {
  className?: string;
  isDark: boolean;
}) {
  return (
    <svg
      className={cn("transition-transform duration-500 ease-out", isDark && "rotate-180", className)}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 .5C7.4.5.5 7.4.5 16S7.4 31.5 16 31.5 31.5 24.6 31.5 16 24.6.5 16 .5zm0 28.1V3.4C23 3.4 28.6 9 28.6 16S23 28.6 16 28.6z" />
    </svg>
  );
}
