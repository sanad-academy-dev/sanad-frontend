import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  label?: React.ReactNode
  badge?: React.ReactNode
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, description, label, badge, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-3 mb-12 md:mb-16", className)}
      {...props}
    >
      {label && (
        <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3 ">
        <h2 className="text-3xl font-bold text-foreground">
          {title}
        </h2>
        {badge && (
          <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
)
SectionHeader.displayName = "SectionHeader"

export { SectionHeader }
