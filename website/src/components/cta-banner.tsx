import Container from "@/components/container";
import { JoinButton } from "./join-button";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

// قسم بانر الدعوة للإجراء — Desktop - 11 من التصميم

// زخرفة هندسية مقاربة (عنقود مثلثات) — بديل عن الـ SVG الأصلي المعقّد
const TRIANGLES = [
  { x: 20, y: 30, s: 1.0, o: 0.25, r: 0 },
  { x: 50, y: 18, s: 0.7, o: 0.15, r: 30 },
  { x: 82, y: 40, s: 1.2, o: 0.3, r: 180 },
  { x: 30, y: 70, s: 0.9, o: 0.2, r: 90 },
  { x: 60, y: 82, s: 1.1, o: 0.25, r: 200 },
  { x: 102, y: 70, s: 0.6, o: 0.12, r: 45 },
  { x: 122, y: 30, s: 0.8, o: 0.18, r: 150 },
  { x: 142, y: 60, s: 1.0, o: 0.22, r: 20 },
  { x: 90, y: 110, s: 0.7, o: 0.15, r: 240 },
  { x: 40, y: 122, s: 1.2, o: 0.28, r: 60 },
  { x: 160, y: 100, s: 0.9, o: 0.2, r: 300 },
  { x: 130, y: 132, s: 0.6, o: 0.12, r: 120 },
  { x: 70, y: 150, s: 1.0, o: 0.22, r: 10 },
  { x: 110, y: 162, s: 0.8, o: 0.18, r: 200 },
  { x: 30, y: 172, s: 0.7, o: 0.14, r: 80 },
  { x: 170, y: 150, s: 1.1, o: 0.24, r: 160 },
];

function GeometricDecor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={className}
      fill="none"
    >
      {TRIANGLES.map((t, i) => (
        <path
          key={i}
          d="M6 0L12 11H0Z"
          fill="white"
          fillOpacity={t.o}
          transform={`translate(${t.x} ${t.y}) rotate(${t.r}) scale(${t.s})`}
        />
      ))}
    </svg>
  );
}

export default function CtaBanner() {
  return (
    <section className="w-full bg-card">
      <Container className="py-16">
        <div className="w-full border-t border-border pt-16">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl border border-border bg-[linear-gradient(to_bottom,#1a1a1a,#0a0a0a)] px-6 py-14 text-center sm:px-12">
          {/* نمط النقاط في الخلفية */}
          <div 
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle at center, #ededed 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }}
          />
          {/* المحتوى */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-6">
              <h2 className="text-[28px] font-bold leading-tight primarysm:text-[32px]">
                شراكة تحوّل التقنية إلى تجربة تعليمية قابلة للقياس
              </h2>
              <p className="text-lg font-medium text-muted-foreground sm:text-xl max-w-3xl">
                نصمم برامج ومعسكرات تناسب طلاب مؤسستك، مع أهداف واضحة ومشاريع وتقارير متابعة.
              </p>
            </div>
            <JoinButton
                      className="flex flex-1 items-center justify-center gap-2 bg-primary text-xl px-8 py-3 text-base font-medium transition-colors hover:bg-primary/90 h-auto"
            >
              تواصل مع المبيعات (قريباً) <ArrowLeft className="mt-1" />
            </JoinButton>
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
