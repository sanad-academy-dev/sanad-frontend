import Container from "@/components/container";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/header";

// قسم "Desktop - 3": عنوان + شريط متحرّك للشركات والدورات
export default function BrandMarquee() {
  return (
    <section className="w-full bg-card">
      <Container>
        <div className="w-full flex flex-col items-center gap-8 text-center">
        <SectionHeader
          title="اعتمادات وشراكات سند"
          description="تجربة تعليمية مصممة للجيل القادم"
        />

        <div className="flex text-muted-foreground w-full max-w-full flex-col gap-2 font-medium" dir="rtl">
          <Marquee
            label="Partners"
            lens={false}
            fade={false}
            className="text-lg text-muted-foreground font-bold"
            items={[
              { name: "", icon: <Image src="/assets/marquee-1.jpeg" alt="شريك 1" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-2.jpeg" alt="شريك 2" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-3.jpeg" alt="شريك 3" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-1.jpeg" alt="شريك 1" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-2.jpeg" alt="شريك 2" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-3.jpeg" alt="شريك 3" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-1.jpeg" alt="شريك 1" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-2.jpeg" alt="شريك 2" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-3.jpeg" alt="شريك 3" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-1.jpeg" alt="شريك 1" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-2.jpeg" alt="شريك 2" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
              { name: "", icon: <Image src="/assets/marquee-3.jpeg" alt="شريك 3" width={100} height={40} className="object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" /> },
            ]}
          />
        </div>
        </div>
      </Container>
    </section>
  );
}

