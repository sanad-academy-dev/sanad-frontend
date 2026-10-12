"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MultiStepForm } from "@/components/multi-step-form";

export const OPEN_TRIAL_MODAL_EVENT = "open-trial-modal";

export function openTrialAssessmentModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_TRIAL_MODAL_EVENT));
  }
}

export function TrialModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    window.addEventListener(OPEN_TRIAL_MODAL_EVENT, handleOpen);
    window.addEventListener("close-trial-modal", handleClose);

    return () => {
      window.removeEventListener(OPEN_TRIAL_MODAL_EVENT, handleOpen);
      window.removeEventListener("close-trial-modal", handleClose);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="trial-assessment-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-12 md:pt-[8vh] px-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <motion.div
            key="trial-assessment-card"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[800px] mx-auto my-auto"
          >
            <MultiStepForm
              onCreate={() => setTimeout(() => setOpen(false), 2000)}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
