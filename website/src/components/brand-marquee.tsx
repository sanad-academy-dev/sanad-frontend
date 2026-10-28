"use client";

import Image from "next/image";
import Container from "@/components/container";
import { SectionHeader } from "@/components/ui/header";
import { LogosCarousel } from "@/components/ui/logos-carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Partner = {
  name: string;
  src: string;
  alt: string;
  darkClass: string;
};

const BASE_PARTNERS: Partner[] = [
  {
    name: "الهيئة العامة للاستثمار والمناطق الحرة",
    src: "/assets/marquee-1.png",
    alt: "الهيئة العامة للاستثمار والمناطق الحرة - جمهورية مصر العربية",
    darkClass: "dark:brightness-125",
  },
  {
    name: "وزارة الاتصالات وتكنولوجيا المعلومات",
    src: "/assets/marquee-2.png",
    alt: "جمهورية مصر العربية - وزارة الاتصالات وتكنولوجيا المعلومات",
    darkClass: "dark:invert dark:brightness-200",
  },
  {
    name: "اعتماد STEM.org الدولي",
    src: "/assets/marquee-3.png",
    alt: "اعتماد STEM.org الدولي للتعليم التقني",
    darkClass: "dark:invert dark:brightness-150",
  },
];

const CAROUSEL_PARTNERS: Partner[] = [
  BASE_PARTNERS[0], // Col 0: GAFI
  BASE_PARTNERS[1], // Col 1: MCIT
  BASE_PARTNERS[2], // Col 2: STEM
  BASE_PARTNERS[2], // Col 0: STEM
  BASE_PARTNERS[0], // Col 1: GAFI
  BASE_PARTNERS[1], // Col 2: MCIT
  BASE_PARTNERS[1], // Col 0: MCIT
  BASE_PARTNERS[2], // Col 1: STEM
  BASE_PARTNERS[0], // Col 2: GAFI
];

export default function BrandMarquee() {
  return (
    <section id="partners" className="relative w-full bg-background scroll-mt-16">
      <Container className="relative">
        <SectionHeader
          title="اعتمادات"
          description="تجربة تعليمية مصممة للجيل القادم"
        />

        <div className="relative w-full">
          <TooltipProvider delayDuration={100}>
            <LogosCarousel
              columnCount={3}
              direction="rtl"
              cycleInterval={2800}
              className="w-full"
              columnClassName="h-24 sm:h-28 md:h-32 hover:bg-secondary/20 transition-colors duration-200"
            >
              {CAROUSEL_PARTNERS.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="group/logo relative flex size-full items-center justify-center px-4 sm:px-6 md:px-8 py-3 select-none cursor-pointer"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        aria-label={partner.name}
                        className="relative flex items-center justify-center max-w-[170px] sm:max-w-[210px] md:max-w-[240px] w-full cursor-pointer focus:outline-hidden"
                      >
                        <Image
                          src={partner.src}
                          alt={partner.alt}
                          width={240}
                          height={70}
                          className={cn(
                            "max-h-12 sm:max-h-14 md:max-h-16 w-auto object-contain opacity-80 grayscale group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300",
                            partner.darkClass
                          )}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={6}
                      className="font-heading text-xs font-semibold py-1 px-2.5 bg-popover text-foreground border border-line backdrop-blur-md rounded-md shadow-none"
                    >
                      <p>{partner.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </LogosCarousel>
          </TooltipProvider>
        </div>
      </Container>
    </section>
  );
}
