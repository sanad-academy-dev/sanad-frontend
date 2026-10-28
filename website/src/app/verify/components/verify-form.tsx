"use client";

import { Button } from "@/components/ui/button";

export function VerifyForm() {
  return (
    <form className="w-full flex flex-col sm:flex-row gap-2.5" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="text" 
        placeholder="SND-CRT-2026-0001" 
        className="flex-1 h-11 sm:h-12 rounded-lg border border-line bg-background px-4 text-center sm:text-left text-sm sm:text-base font-mono font-bold text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all uppercase"
        dir="ltr"
      />
      <Button type="submit" className="h-11 sm:h-12 px-6 text-sm sm:text-base font-bold rounded-lg cursor-pointer">
        تحقق
      </Button>
    </form>
  );
}
