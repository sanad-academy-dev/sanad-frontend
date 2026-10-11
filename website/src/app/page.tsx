import Image from "next/image";

import Hero from "@/components/hero";
import BrandMarquee from "@/components/brand-marquee";
import CourseCategories from "@/components/course-categories";
import LearningPaths from "@/components/learning-paths";
import Pricing from "@/components/pricing";
import Faq from "@/components/faq";
import CtaBanner from "@/components/cta-banner";
import Levels from "@/components/levels";
import JourneyChild from "@/components/journey-child";
import WhySanad from "@/components/why-sanad";

export default async function Home() {

  return (
    <main>
      <section className="relative w-full overflow-hidden">
        {/* خلفية الـ hero */}
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6),rgba(28,0,75,0.12))]" />

        {/* محتوى الـ hero */}
        <Hero />
      </section>

      {/* كرت الإحصائيات — يطفو فوق حدّ الـ hero */}
      {/* <div className="relative z-20 -mt-16 px-4 lg:-mt-[62px]">
        <StatsCard />
      </div> */}

      {/* شعارات الشركات */}
      <div id="partners">
        <BrandMarquee />
      </div>

      {/* الدورات الأكثر طلباً */}
      {/* <FeaturedCourses courses={courses} /> */}

          {/* لماذا سند */}
      <div id="about">
        <WhySanad />
      </div>

      {/* مسارات التعلم */}
      <div id="paths">
        <LearningPaths />
      </div>

  

      {/* رحلة الطالب */}
      <JourneyChild />

      {/*  مستويات مسارات التعلم  */}
      <div id="levels">
        <Levels />
      </div>

      {/* الفيد باك  */}
      {/* <TestimonialsSection /> */}

      
      {/* باقات الاشتراك */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* أسئلة أولياء الأمور */}
      <Faq />

      {/* استكشاف فئات الدورات */}
      <div id="bootcamps">
        <CourseCategories  />
      </div>

      {/* بانر الدعوة للإجراء */}
      <CtaBanner />

    </main>
  );
}
