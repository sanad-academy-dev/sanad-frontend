import Container from "@/components/container";
import { Marquee } from "@/components/ui/marquee";
import { Landmark, Microscope, RadioTower } from "lucide-react";

// قسم "Desktop - 3": عنوان + شريط متحرّك للشركات والدورات
export default function BrandMarquee() {
  return (
    <section className="w-full bg-card py-16 my-5">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-3xl font-bold text-foreground">
            اعتمادات وشراكات سند
          </h2>
          <p className="text-lg text-muted-foreground">
            تجربة تعليمية مصممة للجيل القادم
          </p>
        </div>

        <div className="flex text-muted-foreground w-full max-w-full flex-col gap-2 font-medium" dir="rtl">
          <Marquee
            label="Partners"
            lens={false}
            fade={false}
            className="text-lg text-muted-foreground font-bold"
            items={[
              { name: "وزارة الاستثمار", icon: <Landmark className="text-[#cda434] size-5" /> },
              { name: "STEM", icon: <Microscope className="text-[#e3000f] size-5" /> },
              { name: "وزارة الاتصالات", icon: <RadioTower className="text-[#00529b] size-5" /> },
              { name: "وزارة الاستثمار", icon: <Landmark className="text-[#cda434] size-5" /> },
              { name: "STEM", icon: <Microscope className="text-[#e3000f] size-5" /> },
              { name: "وزارة الاتصالات", icon: <RadioTower className="text-[#00529b] size-5" /> },
              { name: "وزارة الاستثمار", icon: <Landmark className="text-[#cda434] size-5" /> },
              { name: "STEM", icon: <Microscope className="text-[#e3000f] size-5" /> },
              { name: "وزارة الاتصالات", icon: <RadioTower className="text-[#00529b] size-5" /> },
              { name: "وزارة الاستثمار", icon: <Landmark className="text-[#cda434] size-5" /> },
              { name: "STEM", icon: <Microscope className="text-[#e3000f] size-5" /> },
              { name: "وزارة الاتصالات", icon: <RadioTower className="text-[#00529b] size-5" /> },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

