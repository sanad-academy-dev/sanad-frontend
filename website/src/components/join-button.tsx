"use client";

import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { openTrialAssessmentModal } from "@/components/trial-modal";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export function JoinButton({ 
  className, 
  children,
  variant,
  size
}: { 
  className?: string;
  children?: React.ReactNode;
  variant?: ButtonVariantProps["variant"];
  size?: ButtonVariantProps["size"];
}) {
  return (
    <Button 
      variant={variant}
      size={size || "default"}
      onClick={() => openTrialAssessmentModal()}
      className={cn("cursor-pointer", className)}
    >
      {children || (
        <>
          <ArrowLeft className="size-5 ml-2" />
          <span className="whitespace-nowrap"> قيم ابنك </span>
        </>
      )}
    </Button>
  );
}
