"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, MessageSquare, Clock, Video, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-5xl bg-[#111] rounded-2xl shadow-xl overflow-hidden border border-border/50 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header & Tabs */}
            <div className="flex items-center justify-between border-b border-border/50 p-4 bg-muted/20">
              <div className="flex bg-secondary/50 rounded-lg p-1">
                <button
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-colors",
                    activeTab === "message" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab("message")}
                >
                  <MessageSquare className="w-4 h-4" />
                  راسلنا
                </button>
                <button
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-colors",
                    activeTab === "book" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setActiveTab("book")}
                >
                  <CalendarIcon className="w-4 h-4" />
                  احجز موعد
                </button>
              </div>
              <button onClick={onClose} className="p-2 bg-secondary/50 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
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
