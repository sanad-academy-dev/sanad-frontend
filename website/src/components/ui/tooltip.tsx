"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      dir="rtl"
      className={cn(
        "z-50 overflow-visible rounded-md border border-line bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground backdrop-blur-md select-none pointer-events-none shadow-none",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow asChild width={11} height={6}>
        <svg
          viewBox="0 0 30 10"
          preserveAspectRatio="none"
          className="overflow-visible block"
        >
          <polygon points="0,0 30,0 15,10" className="fill-popover" />
          <path
            d="M0,0 L15,10 L30,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-line"
          />
        </svg>
      </TooltipPrimitive.Arrow>
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipPortal };
