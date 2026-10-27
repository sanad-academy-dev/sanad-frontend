"use client";

import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import { FaqAccordion } from "@/components/faq-accordion";

export default function Faq() {
  return (
    <section className="relative w-full overflow-hidden bg-background scroll-mt-16" id="faq">
      <Container className="relative z-10">
        <SectionHeader
          title="أسئلة أولياء الأمور"
          action={
            <Link
              href="/contact"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-secondary/60 px-3.5 text-xs font-medium text-foreground transition-all hover:bg-secondary hover:text-foreground group cursor-pointer shadow-none"
            >
              <span>تواصل معنا</span>
              <ArrowUpLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
        />

        <FaqAccordion idPrefix="home-faq" />
      </Container>
    </section>
  );
}
