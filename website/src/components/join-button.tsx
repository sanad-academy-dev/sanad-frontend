"use client";

import { ArrowUpLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { openTrialAssessmentModal } from "@/components/trial-modal";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function JoinButton({ 
  className, 
  children,
  variant,
  size,
  onClick,
  showArrow = true,
}: { 
  className?: string;
  children?: React.ReactNode;
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
  onClick?: () => void;
  showArrow?: boolean;
}) {
  return (
    <Button 
      variant={variant}
      size={size || "default"}
      onClick={() => {
        openTrialAssessmentModal();
        onClick?.();
      }}
      className={cn("cursor-pointer group", className)}
    >
      {children ? (
        <>
          {children}
          {showArrow && (
            <ArrowUpLeft className="size-4 mr-1.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </>
      ) : (
        <>
          <span className="whitespace-nowrap">قيم ابنك</span>
          <ArrowUpLeft className="size-4 mr-1.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        </>
      )}
    </Button>
  );
}
