"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  Bot,
  Check,
  Loader2,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormattedAssistantMessage } from "@/components/formatted-assistant-message";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  { icon: Triangle, text: "ما هي منصة سند؟" },
  { icon: Monitor, text: "كيف يمكنني حجز دورة أو تقييم مجاني؟" },
  { icon: Cpu, text: "ما هي مسارات التعلم والمراحل العمرية؟" },
  { icon: CreditCard, text: "كم تكلفة الاشتراك في المنصة؟" },
];

const STORAGE_KEY = "sanad_ai_agent_chat_history";

export default function AiAgent() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageIdRef = useRef(0);
  const streamedContentRef = useRef("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("[AiAgent] Failed to read chat history from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("[AiAgent] Failed to persist chat history", e);
    }
  }, [messages, isLoaded]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, isOpen]);

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Keyboard shortcut (Ctrl + I / Cmd + I / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isKeyI =
        e.code === "KeyI" ||
        e.key?.toLowerCase() === "i" ||
        e.key === "ه" ||
        e.key === "هـ";

      if (isCtrlOrCmd && isKeyI) {
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
  }, [isOpen]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText ?? query).trim();
    if (!textToSend || isStreaming) return;

    setErrorState(null);
    setQuery("");

    const requestId = ++messageIdRef.current;
    const userMsgId = `u-${requestId}`;
    const botMsgId = `b-${requestId}`;

    const newMessages: Message[] = [
      ...messages,
      { id: userMsgId, role: "user", content: textToSend },
    ];

    setMessages([
      ...newMessages,
      { id: botMsgId, role: "assistant", content: "" },
    ]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    streamedContentRef.current = "";

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok) {
        throw new Error("فشل الاتصال بمساعد سند الذكي");
      }

      if (!res.body) {
        throw new Error("لا توجد استجابة من الخادم");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContentRef.current = `${streamedContentRef.current}${chunk}`;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? { ...msg, content: streamedContentRef.current }
              : msg
          )
        );
      }

      if (!streamedContentRef.current.trim()) {
        throw new Error("لم يتم تلقي إجابة، يرجى المحاولة مرة أخرى.");
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("[AiAgent] Streaming stopped by user.");
        return;
      }
      console.error("[AiAgent] Chat error:", err);
      setErrorState(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء الاتصال بالمساعد."
      );
      setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleCopyChat = () => {
    if (messages.length === 0) return;
    const chatText = messages
      .map(
        (m) =>
          `${m.role === "user" ? "أنت" : "مساعد سند الذكي"}:\n${m.content}\n`
      )
      .join("\n---\n\n");
    navigator.clipboard.writeText(chatText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

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
              className="fixed inset-y-0 left-0 z-[100] flex w-full flex-col border-r border-line bg-card/95 backdrop-blur-md sm:w-[420px]"
            >
              {/* Header - Height h-14 and border-b border-line matches Navbar exactly */}
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 bg-card/60 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="size-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">
                      مساعد سند الذكي
                    </h2>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      متصل ومستعد للإجابة
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <button
                    onClick={handleCopyChat}
                    title="نسخ المحادثة"
                    disabled={messages.length === 0}
                    className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                  >
                    {copied ? (
                      <Check className="size-4 text-emerald-500" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                  <button
                    onClick={handleClearChat}
                    title="تفريغ المحادثة"
                    disabled={messages.length === 0}
                    className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="إغلاق (Ctrl+I)"
                    className="flex size-8 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ChevronsLeft className="size-5" />
                  </button>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="flex flex-1 flex-col justify-end">
                    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="size-6" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        مرحباً بك في أكاديمية سند!
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
                        أنا مساعدك الذكي، جاهز للإجابة على جميع استفساراتك حول البرامج، الدورات، الأسعار، وحجز التقييم المجاني.
                      </p>
                    </div>

                    {/* Suggestions */}
                    <div className="mt-4 flex flex-col gap-2">
                      <span className="text-[12px] font-medium text-muted-foreground px-1">
                        أسئلة شائعة:
                      </span>
                      {SUGGESTIONS.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleSend(item.text)}
                            className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-2.5 text-right text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:border-border transition-all group"
                          >
                            <Icon className="size-4 shrink-0 text-primary transition-transform group-hover:scale-110" />
                            <span className="flex-1">{item.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={cn( "group/msg flex gap-2 w-full", m.role === "user" ? "justify-end" : "justify-start" )}
                      >
                        {m.role === "assistant" && (
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-1 border border-primary/20">
                            <Sparkles className="size-3.5" />
                          </div>
                        )}

                        <div
                          className={cn( "flex flex-col gap-1 max-w-[86%]", m.role === "user" ? "items-end" : "items-start" )}
                        >
                          <div
                            className={cn( "rounded-xl px-4 py-2.5 text-[13px] leading-relaxed", m.role === "user" ? "bg-primary text-primary-foreground rounded-br-xs whitespace-pre-wrap" : "bg-card/80 border border-border/80 text-foreground rounded-bl-xs backdrop-blur-xs" )}
                          >
                            {m.content ? (
                              m.role === "assistant" ? (
                                <FormattedAssistantMessage
                                  content={m.content}
                                  onOpenTrial={() => {
                                    setIsOpen(false);
                                    window.dispatchEvent(new CustomEvent("open-trial-modal"));
                                  }}
                                  onScrollToPricing={() => {
                                    setIsOpen(false);
                                    const el = document.getElementById("pricing");
                                    if (el) {
                                      el.scrollIntoView({ behavior: "smooth" });
                                    } else {
                                      router.push("/pricing");
                                    }
                                  }}
                                />
                              ) : (
                                m.content
                              )
                            ) : (
                              <span className="inline-flex items-center gap-2 text-muted-foreground py-0.5">
                                <Loader2 className="size-3.5 animate-spin text-primary" />
                                جاري التفكير والصياغة...
                              </span>
                            )}
                          </div>

                          {/* Quick single-message copy for assistant */}
                          {m.role === "assistant" && m.content && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(m.content);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                              }}
                              className="opacity-0 group-hover/msg:opacity-100 transition-opacity text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-1 mt-0.5"
                            >
                              <Copy className="size-3" />
                              <span>نسخ الإجابة</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {errorState && (
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                        <span>{errorState}</span>
                        <button
                          onClick={() => handleSend()}
                          className="flex items-center gap-1 font-bold underline"
                        >
                          <RefreshCw className="size-3" /> إعادة المحاولة
                        </button>
                      </div>
                    )}
                  </>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Keyboard hint */}
              <div className="px-4 py-1 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/30 bg-muted/10">
                <span className="flex items-center gap-1">
                  إغلاق/فتح:
                  <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10px]">
                    Ctrl + I
                  </kbd>
                </span>
                <span>Enter للإرسال</span>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-card border-t border-border/50">
                <div className="relative rounded-xl border border-border bg-background focus-within:ring-1 focus-within:ring-primary transition-all">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="اطرح سؤالك هنا..."
                    rows={2}
                    disabled={isStreaming}
                    className="w-full resize-none bg-transparent px-3.5 py-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2">
                    {isStreaming ? (
                      <button
                        onClick={handleStop}
                        title="إيقاف الرد"
                        className="flex size-7 items-center justify-center rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                      >
                        <Square className="size-3 fill-current" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSend()}
                        disabled={!query.trim()}
                        className={cn( "flex size-7 items-center justify-center rounded-lg transition-colors", query.trim()
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        )}
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                    )}
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
