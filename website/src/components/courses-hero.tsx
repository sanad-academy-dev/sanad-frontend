import Image from "next/image";

export default function CoursesHero() {
  return (
    <div 
      className="relative min-h-[440px] overflow-hidden border border-border bg-[linear-gradient(to_bottom,#1a1a1a,#0a0a0a)] sm:min-h-[460px]"
      dir="rtl"
    >
      {/* نمط النقاط في الخلفية مثل CTA Banner */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #ededed 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* الصورة — أسفل اليسار، كبيرة وملاصقة للحافة */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[280px] w-[380px] -translate-x-1/2 sm:left-0 sm:h-[380px] sm:w-[58%] sm:translate-x-0 lg:h-[440px] lg:w-[52%]">
        <Image
          src="/courses-hero.png"
          alt="معلّمة وطفلة تتعلّمان البرمجة"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 700px"
          className="object-contain object-bottom"
        />
      </div>

      {/* النص — يمين، بمنتصف الارتفاع */}
      <div className="relative z-10 flex min-h-[440px] flex-col items-center justify-start gap-5 px-6 pt-12 text-center sm:min-h-[460px] sm:items-start sm:justify-center sm:px-12 sm:pt-0 sm:text-right">
        <h1 className="text-5xl font-medium text-white lg:text-[64px] lg:leading-[76px]">
          دورات تعليمية
        </h1>
        <span className="inline-block rounded-full bg-card px-8 py-2 text-4xl font-bold text-primary shadow-lg lg:text-[56px] border border-border">
          للأطفال
        </span>
      </div>
    </div>
  );
}
