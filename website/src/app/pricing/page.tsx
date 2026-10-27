import { Suspense } from "react";
import type { Metadata } from "next";
import PricingView from "./pricing-view";

export const metadata: Metadata = {
  title: "باقات وأسعار الاشتراكات | أكاديمية سند",
  description:
    "استكشف باقات وأسعار اشتراكات أكاديمية سند لتعليم البرمجة والذكاء الاصطناعي للأطفال واليافعين — خطط مرنة أونلاين وبالمقر مع خصومات الإخوة وضمان الجودة وحصص تجريبية مجانية.",
};

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PricingView />
    </Suspense>
  );
}
