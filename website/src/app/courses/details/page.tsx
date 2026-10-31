import type { Metadata } from "next";
import Link from "next/link";
import { Keyboard } from "@lucasmarkes/hairline/react";
import {
  ArrowUpLeft,
  Award,
  Calendar,
  Download,
  Infinity as InfinityIcon,
  Star,
  Video,
} from "lucide-react";

import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import CourseDetailsHero from "@/components/course-details-hero";
import CourseContent from "@/components/course-content";
import FreeTrialDialog from "@/components/free-trial-dialog";
import PathCard, { type PathCardData } from "@/components/path-card";
import { SectionHeader } from "@/components/ui/header";
import { JoinButton } from "@/components/join-button";

export const metadata: Metadata = {
  title: "تفاصيل الكورس | أكاديمية سند",
  description: "تفاصيل كورس بايثون والبرمجة النصية للأطفال في أكاديمية سند",
};

const INCLUDES = [
  { icon: Video, label: "24 ساعة تدريبية وتطبيقية" },
  { icon: Award, label: "شهادة إتمام معتمدة من الأكاديمية" },
  { icon: Download, label: "حقيبة ومصادر برمجية متكاملة" },
  { icon: InfinityIcon, label: "متابعة وتقييم دوري مستمر" },
];

const INSTRUCTOR_STATS = [
  { value: "342+", label: "تقييمات" },
  { value: "18", label: "محاضرة" },
  { value: "1,250", label: "طالب" },
];

const RELATED: PathCardData[] = [
  {
    title: "بكتو بلوكس (برمجة من الصفر)",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "385",
    rating: "4.9",
    level: "مبتدئ",
    age: "8–12 سنة",
    lectures: "12 حصة",
    hours: "24 ساعة",
    seatsBooked: 6,
    seatsTotal: 8,
    description: "مدخل تطبيقي بالبلوكات البرمجية التفاعلية؛ صناعة الألعاب الرقمية والرسوم المتحركة ومفاهيم البرمجة الممتعة.",
    skillsList: ["بيئة PictoBlox", "البرمجة المرئية", "ميكانيكا الألعاب", "المتغيرات"],
    comingSoon: false,
    animation: "Query",
  },
  {
    title: "HTML و CSS (تصميم مواقع الويب)",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "340",
    rating: "4.9",
    level: "مبتدئ",
    age: "12–17 سنة",
    lectures: "12 حصة",
    hours: "18 ساعة",
    seatsBooked: 7,
    seatsTotal: 8,
    description: "تعلّم لغات الويب الأساسية باستخدام محرر VS Code؛ هيكلة المواقع وتنسيقها لتصميم صفحات ويب متجاوبة.",
    skillsList: ["عناصر HTML5", "تنسيقات CSS3", "التصميم المتجاوب", "محرر VS Code"],
    comingSoon: false,
    animation: "Format",
  },
  {
    title: "MIT App Inventor (برمجة التطبيقات)",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "295",
    rating: "4.8",
    level: "متقدم",
    age: "10–14 سنة",
    lectures: "12 أسبوع",
    hours: "18 ساعة",
    seatsBooked: 6,
    seatsTotal: 8,
    description: "تصميم وبناء تطبيقات الهاتف الذكي الحقيقية لنظام أندرويد عبر بيئة MIT App Inventor وربطها بالحساسات.",
    skillsList: ["واجهات التطبيقات UI", "حساسات الهاتف", "قواعد البيانات", "نشر التطبيقات"],
    comingSoon: false,
    animation: "Phone",
  },
];

export default function CourseDetailsPage() {
  return (
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="relative">
        <PageBreadcrumb
          items={[
            { label: "المسارات التعليمية", href: "/tracks" },
            { label: "تفاصيل الكورس" },
          ]}
        />

        <CourseDetailsHero />

        <div className="p-4 sm:p-6 lg:p-8 screen-line-bottom">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <CourseContent />
            </div>

            <aside className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex flex-col gap-4 rounded-xl border border-line bg-card/20 p-5 shadow-none">
                <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg bg-muted border border-line">
                  <Keyboard
                    className="h-full w-full"
                    intensity={0.35}
                    label="تفاعل كورس بايثون والبرمجة النصية للأطفال"
                  />
                  <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-md border border-line bg-background/90 px-2 py-0.5 text-xs font-mono font-bold text-foreground">
                    <span>متبقي مقعدان فقط</span>
                  </div>
                </div>

                <JoinButton className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-center text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-none cursor-pointer">
                  <span>سجّل ابنك الآن</span>
                  <Calendar className="size-4" />
                </JoinButton>

                <FreeTrialDialog />

                <div className="h-px w-full bg-line" />

                <h3 className="text-right text-xs font-mono font-bold text-foreground">
                  ما الذي يتضمنه الكورس؟
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {INCLUDES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2.5 text-xs font-mono text-muted-foreground">
                      <Icon className="size-3.5 shrink-0 text-primary" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 rounded-xl border border-line bg-card/20 p-5 shadow-none">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-base font-bold font-mono text-primary">
                    سَنَد
                  </div>
                  <div className="flex flex-1 flex-col items-start gap-0.5 text-right">
                    <span className="text-sm font-bold text-foreground">
                      م. مهند أحمد
                    </span>
                    <span className="text-xs text-muted-foreground">
                      مدرب برمجيات وذكاء اصطناعي معتمد
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground mt-0.5">
                      <Star className="size-3 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-yellow-600 dark:text-yellow-400">4.9</span>
                      <span>(تقييم أولياء الأمور)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-stretch justify-between rounded-lg bg-secondary/50 border border-line py-2">
                  {INSTRUCTOR_STATS.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`flex flex-1 flex-col items-center gap-0.5 ${
                        i < INSTRUCTOR_STATS.length - 1
                          ? "border-l border-line"
                          : ""
                      }`}
                    >
                      <span className="text-sm font-bold font-mono text-primary">
                        {stat.value}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <p className="text-right text-xs leading-relaxed text-muted-foreground">
                  خبرة تزيد عن 7 سنوات في تعليم البرمجة التفاعلية للأطفال وبناء عقول التفكير المنطقي، مع التركيز على تحويل الأفكار إلى مشاريع برمجية حية.
                </p>
              </div>
            </aside>
          </div>
        </div>

        <SectionHeader
          title="كورسات ذات صلة"
          description="استكشف كورسات مكملة تبني مهارات طفلك في مسارات التقنية والذكاء الاصطناعي."
          action={
            <Link
              href="/courses"
              className="flex items-center gap-1.5 rounded-lg border border-line bg-secondary/60 px-3 py-1.5 text-xs font-mono font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-none cursor-pointer"
            >
              <span>جميع الكورسات</span>
              <ArrowUpLeft className="size-3.5" />
            </Link>
          }
        />

        <div className="relative py-1 sm:py-3">
          <div
            dir="rtl"
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 py-3 sm:gap-5 sm:px-6"
          >
            {RELATED.map((course, i) => (
              <div
                key={i}
                className="w-[315px] shrink-0 snap-center sm:w-[355px] md:w-[385px] lg:w-[415px]"
              >
                <PathCard path={course} className="border border-line rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
