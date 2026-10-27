"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function MessageForm() {
  const phoneNumber = "+201022805731";
  const email = "gamal.htg@gmail.com";
  
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[460px]" dir="rtl">
      <div className="w-full lg:w-[350px] p-6 sm:p-8 border-b lg:border-b-0 lg:border-l border-line flex flex-col gap-6 shrink-0 bg-card">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-normal">تحدث معنا مباشرة.</h2>
          <p className="font-sans text-muted-foreground text-xs sm:text-sm">هذا رقمنا، لا تتردد في المراسلة أو الاتصال.</p>
        </div>

        <div className="flex items-center justify-between bg-secondary/40 border border-line rounded-lg p-3 sm:p-3.5">
          <span className="text-foreground font-mono font-bold tracking-wider text-base sm:text-lg" dir="ltr">{phoneNumber}</span>
          <button 
            type="button"
            onClick={handleCopyPhone}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer"
            title="نسخ الرقم"
            aria-label="نسخ الرقم"
          >
            {copiedPhone ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </button>
        </div>

        <div className="space-y-3">
          <p className="font-sans text-muted-foreground text-xs sm:text-sm leading-relaxed">
            نحن أيضاً على Telegram و WhatsApp. استخدم القناة التي تفضلها.
          </p>
          <div className="flex items-center gap-2.5">
            <a 
              href={`https://wa.me/${phoneNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white py-2.5 rounded-lg font-sans font-bold text-xs sm:text-sm hover:bg-[#25D366]/90 transition-all cursor-pointer"
            >
              <FaWhatsapp className="size-4" />
              <span>WhatsApp</span>
            </a>
            <a 
              href="https://t.me/gamalhtg" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#0088cc] text-white py-2.5 rounded-lg font-sans font-bold text-xs sm:text-sm hover:bg-[#0088cc]/90 transition-all cursor-pointer"
            >
              <FaTelegramPlane className="size-4" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-sans text-muted-foreground text-xs sm:text-sm shrink-0">أو راسلنا:</span>
            <span className="text-primary font-mono font-bold text-xs sm:text-sm break-all" dir="ltr">{email}</span>
          </div>
          <button 
            type="button"
            onClick={handleCopyEmail}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer shrink-0"
            title="نسخ البريد الإلكتروني"
            aria-label="نسخ البريد الإلكتروني"
          >
            {copiedEmail ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 sm:p-8 bg-card flex flex-col">
        <div className="mb-3 text-right">
          <h3 className="text-base sm:text-lg font-heading font-bold text-foreground tracking-normal">أرسل رسالة</h3>
          <p className="font-sans text-muted-foreground text-xs sm:text-sm">اكتب استفسارك وسيقوم فريقنا بالتواصل معك في أقرب وقت.</p>
        </div>
        
        <form 
          className="relative flex-1 min-h-[260px]"
          onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.reset();
          }}
        >
          <textarea 
            name="message"
            required
            className="w-full h-full bg-background border border-line rounded-xl p-4 sm:p-5 pb-16 outline-none focus:border-primary transition-all text-foreground font-sans text-xs sm:text-sm resize-none placeholder:text-muted-foreground/50"
            placeholder="اكتب رسالتك هنا..."
          ></textarea>
          
          <Button 
            type="submit"
            className="absolute bottom-3 left-3 rounded-lg h-8 px-4 font-sans text-xs font-bold cursor-pointer shadow-none"
          >
            إرسال
          </Button>
        </form>
      </div>
    </div>
  );
}
