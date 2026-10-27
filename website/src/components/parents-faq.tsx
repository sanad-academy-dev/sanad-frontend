"use client";

import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import { FaqAccordion } from "@/components/faq-accordion";

export default function ParentsFaq() {
  return (
    <section className="relative w-full overflow-hidden bg-background scroll-mt-16" id="faq">
      <Container className="relative z-10">
        <SectionHeader
          title="أسئلة أولياء الأمور"
          description="أبرز الأسئلة الشائعة حول برامجنا، مواعيد الحصص، وطرق التدريس المعتمدة لمساعدتك في اتخاذ القرار الأنسب لطفلك."
        />

        <div className="flex w-full justify-center">
          <FaqAccordion idPrefix="home-parents-faq" />
        </div>
      </Container>
    </section>
  );
}
