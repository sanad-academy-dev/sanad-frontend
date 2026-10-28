"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageForm } from "./message";
import { Call } from "./call";

export function PopupContact({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"message" | "book">("message");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            className="w-full max-w-4xl bg-card rounded-xl overflow-hidden border border-line flex flex-col max-h-[90vh] shadow-none"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-line p-3 sm:p-4 bg-muted/30">
              <div className="flex bg-secondary/60 rounded-lg border border-line p-1 gap-1">
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-md font-sans text-xs sm:text-sm font-bold transition-colors cursor-pointer select-none",
                    activeTab === "message" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab("message")}
                >
                  <MessageSquare className="size-4 text-primary" />
                  <span>راسلنا</span>
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-md font-sans text-xs sm:text-sm font-bold transition-colors cursor-pointer select-none",
                    activeTab === "book" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab("book")}
                >
                  <CalendarIcon className="size-4 text-primary" />
                  <span>احجز موعد</span>
                </button>
              </div>
              <button 
                type="button"
                onClick={onClose} 
                className="p-1.5 bg-secondary/60 rounded-lg border border-line hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="إغلاق النافذة"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "message" ? (
                <MessageForm />
              ) : (
                <Call />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
