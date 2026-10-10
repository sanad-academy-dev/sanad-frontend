"use client";

import { useState } from "react";
import { Clock, Video, Globe, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col lg:flex-row h-full min-h-[500px]" dir="rtl">
      {/* لوحة المعلومات - اليمين */}
      <div className="w-full lg:w-[280px] p-6 lg:border-l border-border/30 flex flex-col gap-6 shrink-0 bg-[#111]">
        <div className="space-y-4">
          {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary border border-border/50">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=gamal" alt="جمال حسن" className="w-full h-full object-cover" />
          </div> */}
          <div>
            {/* <div className="text-muted-foreground text-sm font-semibold mb-1">جمال حسن</div> */}
            <h2 className="text-2xl font-bold text-foreground leading-tight">اجتماع لمدة 30 دقيقة</h2>
          </div>
        </div>
        
        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-[15px]">30 دقيقة</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Video className="w-5 h-5 text-primary" />
            <span className="font-semibold text-[15px]">مكالمة فيديو</span>
          </div>
          {/* <div className="flex items-center gap-3 text-muted-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <span className="font-semibold text-[15px]">إفريقيا/القاهرة <span className="text-[10px] mr-1">▼</span></span>
          </div> */}
        </div>
      </div>

      {/* لوحة التقويم - الوسط */}
      <div className="flex-1 p-6 lg:p-8 bg-[#111]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-foreground">أكتوبر <span className="text-muted-foreground font-normal">2026</span></h3>
          <div className="flex items-center gap-2" dir="ltr">
            <button className="p-2 rounded-md hover:bg-secondary/50 text-muted-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-secondary/50 text-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
          {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map((day) => (
            <div key={day} className="text-[13px] font-bold text-muted-foreground/70">{day}</div>
          ))}
          
          {/* أيام فارغة للتعويض */}
          <div className="p-2"></div>
          <div className="p-2"></div>
          <div className="p-2"></div>
          <div className="p-2"></div>
          
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const isPast = day < 8; // محاكاة الأيام السابقة
            
            return (
              <div key={day} className="flex justify-center">
                <button
                  onClick={() => !isPast && setSelectedDay(day)}
                  disabled={isPast}
                  className={cn(
                    "relative w-11 h-11 rounded-lg flex items-center justify-center text-[15px] font-bold transition-all",
                    isSelected 
                      ? "bg-foreground text-background shadow-md transform scale-105" 
                      : isPast 
                        ? "text-muted-foreground/30 cursor-not-allowed" 
                        : "bg-secondary/30 text-foreground hover:bg-secondary/80 hover:scale-105"
                  )}
                >
                  {day}
                  {day === 8 && !isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-foreground"></span>
                  )}
                  {day === 8 && isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-background"></span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* لوحة المواعيد - اليسار */}
      <div className="w-full lg:w-[300px] p-6 lg:border-r border-border/30 flex flex-col h-[500px] bg-[#111]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-foreground">الخميس، 8</h3>
          <div className="flex items-center bg-secondary/30 rounded-lg p-1 border border-border/30">
            <button 
              onClick={() => setTimeFormat("12h")}
              className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors", timeFormat === "12h" ? "text-foreground bg-secondary/80 shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              12ص/م
            </button>
            <button 
              onClick={() => setTimeFormat("24h")}
              className={cn("px-4 py-1.5 rounded text-xs font-bold transition-colors", timeFormat === "24h" ? "text-foreground bg-secondary/80 shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              24س
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pl-2 space-y-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {currentSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "w-full flex items-center justify-center py-3.5 rounded-xl border transition-all text-sm font-bold",
                  isSelected 
                    ? "bg-foreground text-background border-foreground shadow-sm" 
                    : "bg-secondary/20 border-border/50 text-foreground hover:border-foreground/50 hover:bg-secondary/40"
                )}
              >
                {!isSelected && <span className="w-2 h-2 rounded-full bg-[#00e676] ml-3"></span>}
                {slot}
              </button>
            );
          })}
        </div>
        
        {selectedSlot && (
          <div className="pt-6 mt-auto border-t border-border/30">
            <Button className="w-full py-6 text-base font-bold shadow-md hover:shadow-lg transition-all" onClick={() => alert("Proceeding to booking...")}>
              تأكيد الموعد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
