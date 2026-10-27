import { Award, CheckCircle2, Sparkles } from "lucide-react";
import { Keyboard } from "@lucasmarkes/hairline/react";
import { DotGridSpotlight } from "@/components/ui/dot-grid-spotlight";

export default function CoursesHero({
  title = "كورسات برمجية وتقنية",
  highlight = "تبني عقول المستقبل",
  description = "مناهج تفاعلية متدرجة تربط بين التفكير المنطقي، البرمجة الإبداعية، وبناء المشاريع الواقعية من الصفر تحت إشراف نخبة من المتخصصين.",
  badge = "6 مسارات تخصصية",
}: {
  title?: string;
  highlight?: string;
  description?: string;
  badge?: string;
} = {}) {
  return (
    <div 
      className="relative overflow-hidden"
      dir="rtl"
    >
      <DotGridSpotlight />

      <div className="relative z-10 grid grid-cols-1 items-center gap-6 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-4 text-right lg:col-span-6">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-normal text-foreground leading-snug sm:leading-tight text-balance">
            {title} <span className="text-primary">{highlight}</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-sans font-medium text-foreground/80 w-full">
            <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
              <Sparkles className="size-3.5 text-primary" />
              <span>{badge}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
              <Award className="size-3.5 text-primary" />
              <span>شهادات إنجاز معتمدة</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-line bg-secondary/50 px-2.5 py-1">
              <CheckCircle2 className="size-3.5 text-primary" />
              <span>تطبيق عملي <strong className="font-mono font-bold text-foreground">100%</strong></span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:col-span-6 self-center my-auto">
          <div className="relative h-[260px] w-full max-w-[500px] sm:h-[320px] sm:max-w-[560px] lg:h-[380px] lg:max-w-[620px] overflow-hidden bg-card/10 flex items-center justify-center">
            <Keyboard
              className="h-full w-full"
              intensity={0.55}
              label="تفاعل مع أنيميشن البرمجة"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
