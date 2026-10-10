"use client";

import { Button } from "@/components/ui/button";

export function VerifyForm() {
  return (
    <form className="w-full flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="text" 
        placeholder="SND-CRT-2026-0001" 
        className="flex-1 h-[56px] rounded-xl border-2 border-border/80 bg-muted/30 px-5 text-center sm:text-left text-lg font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all uppercase"
        dir="ltr"
      />
      <Button type="submit" className="h-[56px] px-8 text-[17px] font-bold rounded-xl shadow-md transition-all hover:scale-[1.02]">
        تحقق
      </Button>
    </form>
  );
}
