"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Users, Calendar } from "lucide-react";
import { Plot } from "@lucasmarkes/hairline/react";
import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import { Separator } from "@/components/separator";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";
import { SectionHeader } from "@/components/ui/header";
import { PricingCalculator, PLANS } from "@/components/pricing";
import PricingFaq from "@/components/pricing-faq";
import TrialSessionBanner from "@/components/trial-session-banner";

export default function PricingView() {
  return (
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="relative">
        <PageBreadcrumb
          items={[{ label: "باقات الاشتراكات والأسعار" }]}
        />

        {/* Pricing Hero Header */}
        <div className="relative overflow-hidden" dir="rtl">
          <DotGridSpotlight />

          <div className="relative z-10 grid grid-cols-1 items-center gap-6 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-12">
            <div className="flex flex-col items-start gap-4 text-right lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-sans text-xs font-bold text-primary select-none">
                <Sparkles className="size-3.5" />
                <span>استثمار حقيقي في مهارات المستقبل</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold tracking-normal text-foreground leading-snug sm:leading-tight text-balance">
                خطط وباقات اشتراك{" "}
                <span className="text-primary">مرنة وشفافة</span>
              </h1>

              <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
                استثمر في شغف طفلك البرمجي مع خطط تعليمية مدروسة تشمل الحضور التفاعلي، رصيد الحصص المجمّدة، خصم العائلات، والشهادات المعتمدة من الصفر حتى مشاريع التخرج.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 font-sans text-xs font-medium text-foreground/80 w-full">
                <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>ضمان الجودة والاسترجاع</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
                  <Users className="size-3.5 text-primary" />
                  <span>خصم عائلي <strong className="font-mono font-bold text-foreground">10%</strong> للأخوة</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
                  <Calendar className="size-3.5 text-primary shrink-0" />
                  <span>تجميد حتى <strong className="font-mono font-bold text-foreground">7</strong> حصص</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:col-span-5 self-center my-auto">
              <div className="relative h-[250px] w-full max-w-[420px] sm:h-[300px] lg:h-[320px] overflow-hidden bg-card/10 flex items-center justify-center">
                <Plot
                  className="h-full w-full max-w-[340px]"
                  intensity={0.6}
                  label="أنيميشن مخطط تدرج باقات وأسعار الاشتراك"
                />
              </div>
            </div>
          </div>
        </div>

        {/* الفاصل التقني المخطط بين الهيرو وسكشن الباقات */}
        <Separator withBorder={false} />

        {/* Section 1: سكشن باقات الاشتراك والحاسبة */}
        <section className="relative w-full py-8 sm:py-12" id="plans">
          <SectionHeader
            title="باقات وخطط الاشتراك المعتمدة"
            description="حدد المرحلة المناسبة لطفلك، نوع الحضور (أونلاين أو في المقر)، وفترة الاشتراك لحساب التكلفة ونسبة التوفير فوراً."
          />

          <div className="flex w-full justify-center">
            <PricingCalculator
              plans={PLANS}
              defaultPlanIndex={0}
              familyDiscount={0.1}
            />
          </div>
        </section>

        {/* الفاصل التقني المخطط بين الباقات والأسئلة الشائعة */}
        <Separator withBorder={false} />

        {/* Section 2: سكشن أسئلة الأسعار */}
        <div>
          <PricingFaq />
        </div>

        {/* الفاصل التقني المخطط بين الأسئلة الشائعة وبانر الحصة التجريبية */}
        <Separator withBorder={false} />

        {/* Section 3: سكشن احضر حصة تجريبية قبل أن تقرر */}
        <section className="relative w-full py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto w-full">
            <TrialSessionBanner />
          </div>
        </section>
      </Container>
    </div>
  );
}
