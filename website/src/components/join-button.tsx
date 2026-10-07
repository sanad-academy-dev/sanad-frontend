"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { MultiStepForm } from "@/components/multi-step-form";

export function JoinButton({ 
  className, 
  children,
  variant,
  size
}: { 
  className?: string;
  children?: React.ReactNode;
  variant?: any;
  size?: any;
}) {
  const [open, setOpen] = useState(false);

  // منع التمرير في الخلفية عند فتح النافذة
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button 
        variant={variant}
        size={size || "default"}
        onClick={() => setOpen(true)}
        className={cn("cursor-pointer", className)}
      >
        {children || (
          <>
            <ArrowLeft className="size-5 ml-2" />
            <span className="whitespace-nowrap"> قيم ابنك </span>
          </>
        )}
      </Button>

      {open && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 md:pt-[8vh] px-4"
            onClick={() => setOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[800px] mx-auto">
              <MultiStepForm 
                onCreate={() => setTimeout(() => setOpen(false), 2000)} 
                onClose={() => setOpen(false)}
              />
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
