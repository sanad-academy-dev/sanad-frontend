"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { ExternalLink, Sparkles, CalendarCheck, Tag, ArrowLeft } from "lucide-react";

interface FormattedAssistantMessageProps {
  content: string;
  onOpenTrial?: () => void;
  onScrollToPricing?: () => void;
}


export function FormattedAssistantMessage({
  content,
  onOpenTrial,
  onScrollToPricing,
}: FormattedAssistantMessageProps) {
  const lines = content.split("\n");

  const suggestsTrial = /تقييم|حجز|تجريب|سجل|ابدأ الآن/i.test(content);
  const suggestsPricing = /سعر|أسعار|اشتراك|تكلفة|باقة|خطة|جنيه/i.test(content);
  const suggestsWhatsapp = /واتساب|تواصل|مساعدة|فريقنا|\+201022805731/i.test(content);

  const renderLine = (line: string, index: number) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }

    const isBullet = trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("•");
    const bulletContent = isBullet ? trimmed.replace(/^[\*\-•]\s*/, "") : trimmed;
    const parsedElements = parseInlineStyles(bulletContent);

    if (isBullet) {
      return (
        <div key={index} className="flex items-start gap-2.5 my-1 text-[13px] leading-relaxed text-foreground/90 pr-1">
          <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
          <div className="flex-1">{parsedElements}</div>
        </div>
      );
    }

    if (trimmed.startsWith("###") || trimmed.startsWith("##")) {
      const heading = trimmed.replace(/^#+\s*/, "");
      return (
        <h4 key={index} className="font-bold text-sm text-foreground mt-3 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary shrink-0" />
          {parseInlineStyles(heading)}
        </h4>
      );
    }

    return (
      <p key={index} className="text-[13px] leading-relaxed text-foreground/90 my-1">
        {parsedElements}
      </p>
    );
  };

  return (
    <div className="space-y-0.5">
      {lines.map((line, idx) => renderLine(line, idx))}

      {(suggestsTrial || suggestsPricing || suggestsWhatsapp) && (
        <div className="mt-3.5 pt-2.5 border-t border-border/40 flex flex-wrap gap-1.5">
          {suggestsTrial && onOpenTrial && (
            <button
              onClick={onOpenTrial}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-all border border-primary/20 cursor-pointer group"
            >
              <CalendarCheck className="size-3.5 text-primary" />
              <span>احجز التقييم المجاني</span>
              <ArrowLeft className="size-2.5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}

          {suggestsPricing && onScrollToPricing && (
            <button
              onClick={onScrollToPricing}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-medium transition-all border border-border/60 cursor-pointer"
            >
              <Tag className="size-3 text-muted-foreground" />
              <span>خطط الأسعار</span>
            </button>
          )}

          {suggestsWhatsapp && (
            <a
              href="https://wa.me/+201022805731"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium transition-all border border-emerald-500/20 cursor-pointer"
            >
              <FaWhatsapp className="size-3 text-emerald-500" />
              <span>واتساب الدعم</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function parseInlineStyles(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|\+201022805731)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part === "+201022805731") {
      return (
        <a
          key={i}
          href="https://wa.me/+201022805731"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mx-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer"
          dir="ltr"
        >
          <FaWhatsapp className="size-3.5 text-emerald-500" />
          <span>+20 102 280 5731</span>
          <ExternalLink className="size-2.5 opacity-60" />
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={i} className="font-bold text-foreground">
          {boldText}
        </strong>
      );
    }

    return <span key={i}>{part}</span>;
  });
}
