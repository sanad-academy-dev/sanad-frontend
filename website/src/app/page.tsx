import Image from "next/image";

import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import StatsCard from "@/components/stats-card";
import BrandMarquee from "@/components/brand-marquee";
import CourseCategories from "@/components/course-categories";
// import FeaturedCourses from "@/components/featured-courses";
import LearningPaths from "@/components/learning-paths";
import Pricing from "@/components/pricing";
import Faq from "@/components/faq";
import CtaBanner from "@/components/cta-banner";
import Footer from "@/components/footer";
import { getCourses, getCategories } from "@/lib/courses";
import Levels from "@/components/levels";
import JourneyChild from "@/components/journey-child";
import TestimonialsSection from "@/components/testimonials";
import AiAgent from "@/components/ai-againt";
import WhySanad from "@/components/why-sanad";

export default async function Home() {
  // المحتوى يُجلب ديناميكياً من داشبورد سند
  const [{ courses }, { categories }] = await Promise.all([
    getCourses(),
    getCategories(),
  ]);

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

        {/* الـ Navbar فوق الـ hero */}
        <Navbar />

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

      {/* مسارات التعلم */}
      <div id="paths">
        <LearningPaths />
      </div>

      {/* لماذا سند */}
      <div id="about">
        <WhySanad />
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

      {/* الفوتر */}
      <div id="footer">
        <Footer />
      </div>

      {/* المساعد الذكي */}
      <AiAgent />
    </main>
  );
}
