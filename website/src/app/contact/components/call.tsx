"use client";

import { useState } from "react";
import { Clock, Video, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function Call() {
  const [selectedDay, setSelectedDay] = useState<number | null>(8);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const slots12h = [
    "9:00 ص", "9:30 ص", "10:00 ص", "10:30 ص", 
    "11:00 ص", "11:30 ص", "12:00 م", "12:30 م",
    "1:00 م", "1:30 م"
  ];
  const slots24h = [
    "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30"
  ];

  const currentSlots = timeFormat === "12h" ? slots12h : slots24h;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[460px]" dir="rtl">
      <div className="w-full lg:w-[250px] p-6 border-b lg:border-b-0 lg:border-l border-line flex flex-col gap-5 shrink-0 bg-card">
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground leading-tight tracking-normal">اجتماع لمدة 30 دقيقة</h2>
        </div>
        
        <div className="space-y-3 mt-1">
          <div className="flex items-center gap-2.5 text-muted-foreground font-sans text-xs sm:text-sm">
            <Clock className="size-4 text-primary" />
            <span className="font-semibold text-foreground/90">30 دقيقة</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground font-sans text-xs sm:text-sm">
            <Video className="size-4 text-primary" />
            <span className="font-semibold text-foreground/90">مكالمة فيديو مباشرة</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-heading font-bold text-foreground">أكتوبر <span className="font-mono text-muted-foreground font-normal">2026</span></h3>
          <div className="flex items-center gap-1.5" dir="ltr">
            <button type="button" aria-label="الشهر السابق" className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors cursor-pointer">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" aria-label="الشهر التالي" className="p-1.5 rounded-md hover:bg-secondary text-foreground transition-colors cursor-pointer">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-1 sm:gap-x-1.5 text-center mb-2">
          {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map((day) => (
            <div key={day} className="font-sans text-xs font-semibold text-muted-foreground/80">{day}</div>
          ))}
          
          <div className="p-1"></div>
          <div className="p-1"></div>
          <div className="p-1"></div>
          <div className="p-1"></div>
          
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isPast = day < 8;
            
            return (
              <div key={day} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => !isPast && setSelectedDay(day)}
                  disabled={isPast}
                  className={cn(
                    "relative size-8 sm:size-9 rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    isSelected ? "bg-foreground text-background scale-105" : isPast ? "text-muted-foreground/30 cursor-not-allowed" : "bg-secondary/40 text-foreground hover:bg-secondary"
                  )}
                >
                  {day}
                  {day === 8 && !isSelected && (
                    <span className="absolute bottom-1 size-1 rounded-full bg-foreground" />
                  )}
                  {day === 8 && isSelected && (
                    <span className="absolute bottom-1 size-1 rounded-full bg-background" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-[250px] p-4 sm:p-6 border-t lg:border-t-0 lg:border-r border-line flex flex-col h-[320px] lg:h-[460px] bg-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sans text-sm sm:text-base font-bold text-foreground">الخميس، <span className="font-mono">8</span></h3>
          <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 border border-line">
            <button 
              type="button"
              onClick={() => setTimeFormat("12h")}
              className={cn("px-2.5 py-1 rounded font-sans text-[11px] font-bold transition-colors cursor-pointer", timeFormat === "12h" ? "text-foreground bg-background" : "text-muted-foreground hover:text-foreground")}
            >
              12ص/م
            </button>
            <button 
              type="button"
              onClick={() => setTimeFormat("24h")}
              className={cn("px-2.5 py-1 rounded font-sans text-[11px] font-bold transition-colors cursor-pointer", timeFormat === "24h" ? "text-foreground bg-background" : "text-muted-foreground hover:text-foreground")}
            >
              24س
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pl-1 space-y-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {currentSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                type="button"
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "w-full flex items-center justify-center py-2.5 rounded-lg border transition-all font-sans text-xs font-bold cursor-pointer",
                  isSelected ? "bg-foreground text-background border-foreground" : "bg-secondary/30 border-line text-foreground hover:border-foreground/40 hover:bg-secondary/60"
                )}
              >
                {!isSelected && <span className="size-1.5 rounded-full bg-emerald-500 ml-2" />}
                <span>{slot}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
