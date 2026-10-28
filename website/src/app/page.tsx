import Hero from "@/components/hero";
import BrandMarquee from "@/components/brand-marquee";
import CourseCategories from "@/components/course-categories";
import LearningPaths from "@/components/learning-paths";
import Pricing from "@/components/pricing";
import ParentsFaq from "@/components/parents-faq";
import CtaBanner from "@/components/cta-banner";
import Levels from "@/components/levels";
import JourneyChild from "@/components/journey-child";
import WhySanad from "@/components/why-sanad";
import { Separator } from "@/components/separator";

export default async function Home() {
  return (
    <div className="flex flex-col w-full max-w-screen overflow-x-clip">
      <Hero />
      <Separator />

      <BrandMarquee />
      <Separator />

      <WhySanad />
      <Separator />

      <LearningPaths />
      <Separator />

      <JourneyChild />
      <Separator />

      <Levels />
      <Separator />

      <Pricing />
      <Separator />

      <ParentsFaq />
      <Separator />

      <CourseCategories />
      <Separator />

      <CtaBanner />
    </div>
  );
}
