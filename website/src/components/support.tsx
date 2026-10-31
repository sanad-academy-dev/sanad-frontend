"use client";

import Container from "./container";
import { Button } from "@/components/ui/button";
import { openTrialAssessmentModal } from "@/components/trial-modal";

const CARDS = [
  {
    title: "التسجيل والبرامج",
    subtitle: "ابدأ رحلة التعلم مع سند",
    text: "تعرّف على البرامج والمسارات المتاحة، والمواعيد، وطريقة التسجيل المناسبة لطفلك.",
    action: "تعرّف على البرامج",
    onClickType: "ai-agent",
  },
  {
    title: "التقييم وتحديد المسار",
    subtitle: "ما المسار المناسب لطفلك؟",
    text: "ابدأ بتقييم أولي يساعدنا على فهم مستوى طفلك وقدراته، واختيار المسار التعليمي الأنسب له.",
    action: "احجز التقييم",
    onClickType: "trial-modal",
  },
  {
    title: "التعاون مع سند",
    subtitle: "هل ترغب في العمل معنا؟",
    text: "إذا كنت مدربًا، أو تمثل مدرسة أو مؤسسة تعليمية، أو لديك فكرة للتعاون مع سند، يسعدنا التواصل معك.",
    action: "تواصل معنا",
    href: "https://wa.me/+201022805731",
  },
  {
    title: "الدعم والمساعدة",
    subtitle: "هل تحتاج إلى مساعدة؟",
    text: "نساعدك في أي استفسار يتعلق بالتسجيل، المواعيد، الدفع، البرامج، أو رحلة التعلم.",
    action: "تواصل مع الدعم",
    href: "https://wa.me/+201022805731",
  },
];

export default function Support() {
  const handleAction = (type?: string, href?: string) => {
    if (type === "ai-agent") {
      window.dispatchEvent(new Event("open-ai-agent"));
    } else if (type === "trial-modal") {
      openTrialAssessmentModal();
    } else if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <Container className="py-20 md:py-28" >
        <div className="w-full border-t border-line pt-20 md:pt-28">
        <div className="flex flex-col items-center justify-center text-center space-y-6 mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            كيف يمكننا مساعدتك؟
          </h2>
          <p className="text-lg md:text-xl font-medium text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            سواء كنت تبحث عن المسار المناسب لطفلك، أو تريد حجز التقييم، أو لديك استفسار عن برامج سند، نحن هنا لمساعدتك.
          </p>
        </div>

        <div className="w-full rounded-xl border border-line bg-card/60 backdrop-blur-xs overflow-hidden" dir="rtl">
          {/* Top Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between p-8 md:p-12 border-b border-line gap-8">
            <div className="flex flex-col items-start gap-4 max-w-2xl">
              <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                تواصل مع فريق سند
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                نحن هنا للإجابة عن استفساراتك ومساعدتك في اختيار الخطوة المناسبة في رحلة التعلم.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://wa.me/+201022805731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-foreground px-8 py-3.5 text-base font-bold text-background transition-colors hover:bg-foreground/90"
                >
                  تحدث معنا
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full whitespace-nowrap self-start md:self-auto">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>متاحون أونلاين</span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-border">
            {CARDS.map((card, i) => (
              <div key={i} className="flex flex-col items-start p-8 md:p-10 gap-8 group hover:bg-muted/40 transition-colors">
                <div className="flex-1 space-y-4">
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">
                    {card.title}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground/90">
                      {card.subtitle}
                    </p>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {card.text}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => handleAction(card.onClickType, card.href)}
                  className="rounded-lg px-5 py-5 text-[15px] font-semibold transition-all hover:bg-foreground hover:text-background"
                >
                  {card.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
        </div>
      </Container>
    </section>
  );
}
