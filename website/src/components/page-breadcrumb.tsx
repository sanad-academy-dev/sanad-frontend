import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  extra?: React.ReactNode;
}

export function PageBreadcrumb({ items, className, extra }: PageBreadcrumbProps) {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 py-4 screen-line-bottom flex items-center justify-between gap-4",
        className
      )}
      dir="rtl"
    >
      <nav
        aria-label="مسار التصفح"
        className="flex items-center gap-2 font-sans text-xs text-muted-foreground overflow-x-auto no-scrollbar py-0.5"
      >
        <Link
          href="/"
          className="hover:text-foreground transition-colors shrink-0"
        >
          الرئيسية
        </Link>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <span className="text-line select-none font-mono shrink-0">/</span>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors shrink-0"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "shrink-0",
                    isLast
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
      {extra && <div className="shrink-0">{extra}</div>}
    </div>
  );
}

export default PageBreadcrumb;
