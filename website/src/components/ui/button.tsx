import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button cursor-pointer inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-line bg-surface/80 backdrop-blur-xs hover:bg-secondary hover:text-foreground text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-secondary hover:text-foreground text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 rounded-[min(var(--radius-lg),10px)] px-2.5 sm:px-3 text-xs sm:text-sm font-medium gap-2",
        xs: "h-6 rounded-md px-1.5 text-xs font-medium gap-1 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-7 rounded-md px-2 text-xs font-medium gap-1.5",
        lg: "h-9 rounded-[min(var(--radius-lg),10px)] px-3.5 text-sm font-medium gap-2",
        icon: "size-8 rounded-[min(var(--radius-lg),10px)]",
        "icon-xs": "size-6 rounded-md p-0 [&>svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-[min(var(--radius-lg),10px)]",
        "icon-lg": "size-9 rounded-[min(var(--radius-lg),10px)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      suppressHydrationWarning
      {...props}
    />
  )
}

export { Button, buttonVariants }
