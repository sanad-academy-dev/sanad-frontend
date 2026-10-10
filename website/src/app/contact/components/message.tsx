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
    <div className="flex flex-col lg:flex-row h-full min-h-[500px]" dir="rtl">
      {/* اللوحة اليمنى - تفاصيل التواصل */}
      <div className="w-full lg:w-[380px] p-8 lg:border-l border-border/30 flex flex-col gap-8 shrink-0 bg-[#111]">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">تواصل معنا مباشرة.</h2>
          <p className="text-muted-foreground text-[15px]">هذا رقمنا، لا تتردد في المراسلة أو الاتصال.</p>
        </div>

        <div className="flex items-center justify-between bg-secondary/30 border border-border/50 rounded-xl p-4">
          <span className="text-foreground font-bold tracking-wider text-lg" dir="ltr">{phoneNumber}</span>
          <button 
            onClick={handleCopyPhone}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary/80"
            title="نسخ الرقم"
          >
            {copiedPhone ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            نحن أيضاً على Telegram و WhatsApp. استخدم القناة التي تفضلها.
          </p>
          <div className="flex items-center gap-3">
            <a 
              href={`https://wa.me/${phoneNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#25D366]/90 transition-all hover:scale-[1.02] shadow-sm"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp
            </a>
            <a 
              href="https://t.me/gamalhtg" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#0088cc]/90 transition-all hover:scale-[1.02] shadow-sm"
            >
              <FaTelegramPlane className="w-5 h-5" />
              Telegram
            </a>
          </div>
        </div>

        <div className="mt-auto pt-8 flex items-center justify-between border-t border-border/20">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-[15px]">أو راسلنا:</span>
            <span className="text-primary font-bold text-[15px]" dir="ltr">{email}</span>
          </div>
          <button 
            onClick={handleCopyEmail}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary/80"
            title="نسخ البريد الإلكتروني"
          >
            {copiedEmail ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* اللوحة اليسرى - نموذج المراسلة */}
      <div className="flex-1 p-8 bg-[#111] flex flex-col">
        <div className="mb-4 text-right">
          <h3 className="text-xl font-bold text-foreground">أرسل رسالة</h3>
          <p className="text-muted-foreground text-[15px]">رسالتك</p>
        </div>
        
        <form 
          className="relative flex-1 min-h-[300px]"
          onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.reset();
          }}
        >
          <textarea 
            name="message"
            required
            className="w-full h-full bg-secondary/10 border border-border/40 rounded-2xl p-6 pb-20 outline-none focus:border-primary/50 focus:bg-secondary/20 transition-all text-foreground text-lg resize-none shadow-inner"
            placeholder="أكتب رسالتك..."
          ></textarea>
          
          <Button 
            type="submit"
                      variant="default"
                      className="absolute bottom-5 left-5"
          >
            أرسل
          </Button>
        </form>
      </div>
    </div>
  );
}
