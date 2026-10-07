"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { Check, Star, Code, PenTool, Lightbulb, User, Flag, Sparkles } from 'lucide-react';
import Container from './container';
import { SectionHeader } from "@/components/ui/header";

const stations = [
  {
    num: "01",
    title: "المحطة 01",
    heading: "نكتشف نقطة البداية",
    description: "تقييم بسيط يوضح مستوى ابنك واهتماماته وطريقة تفكيره.",
    icon: <User className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "المحطة 02",
    heading: "نختار المسار الأنسب",
    description: "نشرح لك لماذا هذا المسار مناسب، وما الذي سيتعلمه ابنك فيه.",
    icon: <Code className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "المحطة 03",
    heading: "يفهم ويجرّب",
    description: "يتعلم بالممارسة: فكرة واضحة، تجربة قصيرة، ثم تحدٍ يناسب مستواه.",
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    num: "04",
    title: "المحطة 04",
    heading: "يبني مشروعه",
    description: "يحوّل ما تعلّمه إلى منتج حقيقي يمكنه عرضه وشرحه بثقة.",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    num: "05",
    title: "المحطة 05",
    heading: "نراجع التقدّم",
    description: "نقيس المهارات، ونشاركك نقاط القوة وما يحتاج إلى تطوير.",
    icon: <Star className="w-5 h-5" />,
  },
  {
    num: "06",
    title: "المحطة 06",
    heading: "يتقدّم عندما يكون جاهزًا",
    description: "ينتقل للمستوى التالي بعد إتقان أهداف المستوى، لا لمجرد انتهاء الوقت.",
    icon: <Check className="w-5 h-5" />,
  }
];

export default function JourneyChild() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState("");
  const [arrowPos, setArrowPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const calculatePath = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    let d = "";
    
    for (let i = 0; i <= stations.length; i++) {
      const node = nodesRef.current[i];
      if (!node) continue;
      
      const rect = node.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - containerRect.left;
      const y = rect.top + rect.height / 2 - containerRect.top;
      
      if (i === 0) {
        const startY = Math.max(0, y - 100);
        d += `M ${x} ${startY} L ${x} ${y} `;
        setStartPos({ x, y: startY });
      } else {
        const prevNode = nodesRef.current[i - 1]!;
        const prevRect = prevNode.getBoundingClientRect();
        const prevX = prevRect.left + prevRect.width / 2 - containerRect.left;
        const prevY = prevRect.top + prevRect.height / 2 - containerRect.top;
        
        if (Math.abs(x - prevX) < 5) {
            d += `L ${x} ${y} `;
        } else {
            // استخدام offsetY أكبر يجعل الخط يخرج بشكل عمودي أكثر من المحطة قبل أن ينحني
            const offsetY = (y - prevY) * 0.75;
            d += `C ${prevX} ${prevY + offsetY}, ${x} ${y - offsetY}, ${x} ${y} `;
        }
      }
    }
    setPathD(d);
  }, []);

  useEffect(() => {
    // Initial calculation needs a tiny delay to ensure DOM is fully painted
    const timer = setTimeout(() => {
      calculatePath();
    }, 100);
    
    window.addEventListener("resize", calculatePath);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculatePath);
    };
  }, [calculatePath]);

  useMotionValueEvent(scaleY, "change", (latest) => {
    if (pathRef.current && pathD) {
      const totalLength = pathRef.current.getTotalLength();
      if (totalLength > 0) {
        const point = pathRef.current.getPointAtLength(latest * totalLength);
        setArrowPos({ x: point.x, y: point.y });
      }
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.floor(latest * (stations.length + 1));
    setActiveIndex(index);
  });

  return (
    <section className="relative w-full overflow-hidden bg-background " id="journey">
      <Container className="relative z-10" dir="rtl" withBorder>
        <SectionHeader
          title="رحلة واضحة من التقييم إلى الإنجاز"
          description="لا تبدأ الرحلة بحجز كورس؛ تبدأ بفهم ابنك، ثم تتحول كل خطوة إلى مهارة ومشروع وتقدّم ملموس."
          className="text-center items-center mx-auto"
        />

        <div className="relative" ref={containerRef}>
          {/* SVG Canvas for the curved line */}
          <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
            <svg className="w-full h-full" style={{ minHeight: '100%' }}>
              {/* الطريق الخلفي */}
              {/* الطريق الخلفي */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="currentColor"
                className="text-secondary"
                strokeWidth="28" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d={pathD} 
                fill="none" 
                stroke="currentColor"
                className="text-muted-foreground opacity-30"
                strokeWidth="4" 
                strokeDasharray="12 12" 
                strokeLinecap="round"
              />
              {/* الطريق الملون عند التمرير */}
              <motion.path 
                d={pathD} 
                fill="none" 
                stroke="currentColor"
                className="text-primary opacity-15"
                strokeWidth="28" 
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: scaleY }}
              />
              <motion.path 
                ref={pathRef}
                d={pathD} 
                fill="none" 
                stroke="currentColor"
                className="text-primary"
                strokeWidth="4" 
                strokeDasharray="12 12" 
                strokeLinecap="round"
                style={{ pathLength: scaleY }}
              />
            </svg>
          </div>

          {/* Moving Arrow (Dot) */}
          {pathD && (
            <div 
              className="absolute z-30 pointer-events-none transition-opacity duration-300"
              style={{ 
                left: arrowPos.x, 
                top: arrowPos.y,
                transform: 'translate(-50%, -50%)',
                opacity: arrowPos.y > 0 ? 1 : 0
              }}
            >
              <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/80 border-2 border-background" />
            </div>
          )}

          {/* Start Flag */}
          {pathD && (
            <div 
              className="absolute z-20 pointer-events-none flex items-center justify-center"
              style={{ 
                left: startPos.x, 
                top: startPos.y,
                transform: 'translate(-18%, -95%)',
              }}
            >
              <Flag className="w-8 h-8 fill-none text-white" strokeWidth={2} />
            </div>
          )}

          <div className="flex flex-col gap-6 md:gap-0 relative z-20">
            {stations.map((station, index) => {
              const isEven = index % 2 === 0;
              const isActive = activeIndex >= index;
              
              return (
                <div key={station.num} className="grid grid-cols-[4rem_1fr] md:flex w-full min-h-[140px] items-center relative">
                  
                  {/* Right/Left Card (Desktop) */}
                  <div className={`hidden md:flex w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <StationCard station={station} isActive={isActive} isEven={isEven} className="shrink-0" />
                  </div>

                  {/* Shared Node */}
                  <div 
                    ref={el => { if(el) nodesRef.current[index] = el; }}
                    className={`absolute z-20 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-background border-[4px] rounded-full transition-all duration-500 shadow-md ${
                        isActive ? 'border-primary' : 'border-border'
                    } 
                    top-1/2 -translate-y-1/2
                    right-[2rem] translate-x-1/2
                    md:translate-x-0
                    ${isEven ? 'md:right-[390px]' : 'md:right-auto md:left-[390px]'}`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold font-sans transition-colors duration-500 ${isActive ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-foreground'}`}>
                      {station.num}
                    </div>
                  </div>

                  {/* Card (Mobile) */}
                  <div className="flex md:hidden col-start-2 items-center ps-2">
                    <StationCard station={station} isActive={isActive} isEven={true} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* شارة الإنجاز النهائية */}
          <div className="flex flex-col items-center justify-center mt-20 mb-8 relative z-20">
            <div 
              className={`transition-all duration-700 flex flex-col items-center gap-4 md:gap-6 ${activeIndex >= stations.length ? 'scale-105' : 'opacity-80 scale-100'}`}
            >
              {/* Pill Container */}
              <div 
                ref={el => { if(el) nodesRef.current[stations.length] = el; }}
                className={`relative px-5 py-3 md:px-6 md:py-4 text-center transition-all duration-500 flex items-center justify-center w-full max-w-[280px] md:max-w-[320px] ${activeIndex >= stations.length ? 'bg-primary text-primary-foreground shadow-xl' : 'bg-muted text-muted-foreground border border-border'}`} style={{ borderRadius: 'var(--radius)' }}>
                
                {/* Sparkle icon */}
                <div className={`transition-opacity duration-500 flex-shrink-0 ${activeIndex >= stations.length ? 'opacity-100' : 'opacity-0'}`}>
                   <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" fill="currentColor" strokeWidth={1} />
                </div>

                <div className="flex flex-col items-center flex-1">
                  <h4 className="text-xs md:text-sm font-bold opacity-80 mb-0.5">
                    أهداف المستوى اكتملت
                  </h4>
                  <p className="text-lg md:text-xl font-black leading-tight">
                    جاهز للمستوى التالي
                  </p>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {['مهارة', 'مشروع', 'شارة إنجاز', 'تقدّم'].map((badge) => (
                  <div 
                    key={badge} 
                    className={`flex items-center gap-1.5 border px-3 py-1.5 md:px-4 md:py-2 rounded-[var(--radius)] text-xs md:text-sm font-medium transition-colors duration-500 ${activeIndex >= stations.length ? 'bg-background/50 border-border text-foreground shadow-sm hover:bg-background/80' : 'bg-background border-border/50 text-muted-foreground'}`} style={{ borderRadius: 'var(--radius)' }}
                  >
                    <Check className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors duration-500 ${activeIndex >= stations.length ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={2.5} />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

function StationCard({ station, isActive, isEven, className }: { station: any, isActive: boolean, isEven: boolean, className?: string }) {
  return (
    <div className={`p-6 w-full max-w-[360px] transition-all duration-500 relative overflow-hidden border text-right ${isActive ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' : 'bg-muted/30 border-border hover:border-primary/50'} ${className ?? ''}`} style={{ borderRadius: 'var(--radius)' }}>
      <div className="flex items-start gap-4">
        <div className={`p-3 shrink-0 transition-colors duration-500 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-primary'}`} style={{ borderRadius: 'var(--radius)' }}>
          {station.icon}
        </div>
        <div className="flex flex-col flex-1 gap-2 pt-1">
          <span className={`font-bold text-sm transition-colors duration-500 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
            {station.title}
          </span>
          <h3 className={`text-xl font-bold transition-colors duration-500 ${isActive ? 'text-primary' : 'text-foreground'}`}>
            {station.heading}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mt-1">
            {station.description}
          </p>
        </div>
      </div>
    </div>
  );
}
