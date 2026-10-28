import React from "react";
import { Code2, Compass, Laptop, Boxes, Video, ShieldCheck } from "lucide-react";
import Container from "./container";
import { SectionHeader } from "@/components/ui/header";
import { cn } from "@/lib/utils";

export type WhySanadFeature = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

const WHY_SANAD_FEATURES: WhySanadFeature[] = [
  {
    title: "التأسيس",
    subtitle: "نبدأ من الصفر حتي كتابة أول سطر كود",
    icon: <Code2 className="size-4" />,
  },
  {
    title: "تحديد المسار",
    subtitle: "لكل عمر مساره، ولكل طفل إيقاعه، لا أسرع ولا أبطأ من طبيعته",
    icon: <Compass className="size-4" />,
  },
  {
    title: "تطبيق عملي",
    subtitle: "كل مفهوم برمجي نحوله لتجربة وتطبيق عملي",
    icon: <Laptop className="size-4" />,
  },
  {
    title: "نبني مشاريع",
    subtitle: "في كل مستوي يبني الطفل مشروع حقيقي",
    icon: <Boxes className="size-4" />,
  },
  {
    title: "مشاركة اللحظات",
    subtitle: "بث مباشر لطفلك داخل الاكاديميه",
    icon: <Video className="size-4" />,
  },
  {
    title: "الأمان",
    subtitle: "حضور وانصراف باشعارات علي التطبيق",
    icon: <ShieldCheck className="size-4" />,
  },
];


function getBorderClasses(index: number) {
  return cn( // على الموبايل (عمود واحد)
    index < 5 && "max-sm:border-b max-sm:border-line",

    index < 4 && "sm:max-md:border-b sm:max-md:border-line",
    index % 2 === 0 && "sm:max-md:border-e sm:max-md:border-line",

    index < 3 && "md:border-b md:border-line",
    index % 3 !== 2 && "md:border-e md:border-line"
  );
}

export default function WhySanad() {
  return (
    <section className="w-full bg-background relative overflow-hidden scroll-mt-16" id="about">
      <Container className="relative">
        <SectionHeader
          title="لماذا أكاديمية سند؟"
          description="نعلّم، نطبّق، ونبني مهارات تستمر مع ابنك."
        />

        <div className="relative" dir="rtl">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {WHY_SANAD_FEATURES.map((feature, i) => (
              <li
                key={feature.title}
                className={cn( "relative group flex items-center gap-3.5 p-4 sm:p-5 transition-[background-color] ease-out hover:bg-secondary/40 cursor-default select-none", getBorderClasses(i)
                )}
              >
                <div className="relative flex size-7 shrink-0 items-center justify-center rounded-md select-none border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-border/50 ring-offset-1 ring-offset-background dark:ring-line transition-colors group-hover:text-foreground">
                  {feature.icon}
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight leading-snug group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-1 mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
