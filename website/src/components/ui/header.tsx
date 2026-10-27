import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  label?: React.ReactNode;
  action?: React.ReactNode;
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, description, label, action, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} dir="rtl" {...props}>
      <div
        className={cn( "w-full screen-line-bottom px-4 sm:px-6 py-2.5 sm:py-3.5 bg-card/15 flex justify-between gap-2 sm:gap-6 text-right", description ? "flex-col sm:flex-row sm:items-center" : "flex-row items-center" )}
      >
        <div className="flex items-center gap-2.5 shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground">
            {title}
          </h2>
          {label && (
            React.isValidElement(label) ? (
              label
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-secondary/80 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
                {label}
              </span>
            )
          )}
        </div>

        {description && (
          <p className="text-[10.5px] sm:text-[11.5px] md:text-[12.5px] text-muted-foreground leading-relaxed sm:text-left text-right max-w-xl">
            {description}
          </p>
        )}

        {action && (
          <div className="shrink-0 ltr:ml-auto rtl:mr-auto">
            {action}
          </div>
        )}
      </div>
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
