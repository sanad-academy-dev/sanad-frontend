"use client";

import { SectionHeader } from "@/components/ui/header";
import TrialSessionBanner from "@/components/trial-session-banner";

const LEVELS = [
  {
    name: "تمهيدي (المنطق والتفكير الأول)",
    description:
      "لا تشترط أي خبرة مسبقة ولا تتطلب أجهزة في بعض الأنشطة. تركز على التفكير المنطقي، التسلسل، حل المشكلات، وصناعة أول لعبة تفاعلية للأعمار الصغيرة.",
  },
  {
    name: "مبتدئ (البرمجة المرئية والأساسيات)",
    description:
      "جلسات تفاعلية قائمة على التطبيق العملي بالأيدي؛ التعرّف على بيئات البلوكات مثل PictoBlox، وصناعة الألعاب، ثم الانتقال لكتابة أول أسطر الكود النصي.",
  },
  {
    name: "متوسط (التطبيقات والذكاء الاصطناعي)",
    description:
      "للأطفال الذين أتموا الأساسيات؛ التعامل مع خوارزميات الذكاء الاصطناعي، برمجة الدوائر الإلكترونية والحساسات، وربط المنطق بالبيانات والمتغيرات.",
  },
  {
    name: "متقدم (بناء المشاريع وتطوير النظم)",
    description:
      "مشاريع أوسع وأكثر احترافية تشمل تطبيقات الهاتف الذكي، لغات البرمجة كائنية التوجه (Java)، ومحركات الألعاب؛ وصولاً إلى مشاريع تخرج كاملة قابلة للنشر.",
  },
];

export default function CourseLevelsGuide() {
  return (
    <section className="relative w-full screen-line-top pb-8 sm:pb-12">
      <SectionHeader
        title="لست متأكداً من أين تبدأ؟"
        description="دليل مبسط لمستويات التعلم يساعدك في اختيار البداية الملائمة لسن وخبرة طفلك."
      />

      <div>
        <div className="flex flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.name}
                className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 sm:gap-4 py-4 sm:py-5 border-b border-line transition-colors hover:bg-card/20 px-4 sm:px-6 lg:px-8"
              >
                <div className="md:col-span-4 flex items-center gap-3 sm:gap-4">
                  <span className="font-heading font-bold text-base sm:text-lg text-foreground tracking-normal">
                    {lvl.name}
                  </span>
                </div>

                <div className="md:col-span-8 font-sans text-xs sm:text-[13.5px] text-foreground/80 leading-relaxed font-normal">
                  {lvl.description}
                </div>
              </div>
            ))}
          </div>

          <TrialSessionBanner />
        </div>
      </div>
    </section>
  );
}
