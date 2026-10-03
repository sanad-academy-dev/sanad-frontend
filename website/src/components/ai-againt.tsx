"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronsLeft,
  Copy,
  Cpu,
  CreditCard,
  Monitor,
  Trash2,
  Triangle,
  ArrowUp,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { icon: Triangle, text: "ما هي منصة سند؟" },
  { icon: Monitor, text: "كيف يمكنني حجز دورة؟" },
  { icon: Cpu, text: "ما هي مسارات التعلم المتاحة؟" },
  { icon: CreditCard, text: "كم تكلفة الاشتراك في المنصة؟" },
];

export default function AiAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Keyboard shortcut (Ctrl + I)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    const handleCustomOpen = () => setIsOpen(true);
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-ai-agent", handleCustomOpen);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-ai-agent", handleCustomOpen);
    };
  }, []);

  return (
    <>

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 sm:hidden"
            />

            <motion.div
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              dir="rtl"
              className="fixed inset-y-0 left-0 z-[100] flex w-full flex-col border-r border-border bg-card shadow-2xl sm:w-[400px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <h2 className="text-base font-bold text-foreground">
                    مساعد سند الذكي
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <button className="flex size-8 items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors">
                    <Copy className="size-4" />
                  </button>
                  <button className="flex size-8 items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex size-8 items-center justify-center rounded hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ChevronsLeft className="size-5" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
                {/* Example of empty state / disconnected */}
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="flex items-center gap-2 rounded bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
                    <RefreshCw className="size-4" />
                    <span>فشلت محاولة الاتصال بالخادم.</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    هذه المحادثة غير متوفرة حالياً. أعد التحميل للمحاولة.
                  </p>
                  <button className="flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                    <RefreshCw className="size-4" />
                    إعادة تحميل
                  </button>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  {SUGGESTIONS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => setQuery(item.text)}
                        className="flex items-center gap-3 text-right text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <Icon className="size-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span>{item.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>تلميح: يمكنك فتح وإغلاق المحادثة باستخدام</span>
                  <kbd className="flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-mono font-medium text-foreground">
                    <span>Ctrl</span>
                    <span>I</span>
                  </kbd>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 pt-0">
                <div className="relative rounded border border-border bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary transition-all">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اطرح سؤالاً..."
                    className="min-h-[80px] w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        // handle submit
                        if(query.trim()) setQuery("");
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2">
                    <button
                      disabled={!query.trim()}
                      className={cn(
                        "flex size-8 items-center justify-center rounded transition-colors",
                        query.trim()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      <ArrowUp className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
