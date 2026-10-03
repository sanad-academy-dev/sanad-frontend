import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Download,
  Infinity as InfinityIcon,
  Star,
  Video,
} from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";
import CourseDetailsHero from "@/components/course-details-hero";
import CourseContent from "@/components/course-content";
import FreeTrialDialog from "@/components/free-trial-dialog";
import PathCard, { type PathCardData } from "@/components/path-card";

export const metadata: Metadata = {
  title: "تفاصيل الدورة | سند",
  description: "تفاصيل دورة تطوير مواقع الويب للأطفال في أكاديمية سند",
};

const INCLUDES = [
  { icon: Video, label: "12 ساعة فيديو" },
  { icon: Award, label: "شهادة" },
  { icon: Download, label: "المشاهدة دون اتصال" },
  { icon: InfinityIcon, label: "الوصول للمحاضرات مدى الحياة" },
];

const INSTRUCTOR_STATS = [
  { value: "6,230", label: "تقييمات" },
  { value: "32", label: "دورات" },
  { value: "11,604", label: "طالب" },
];

const RELATED: PathCardData[] = [
  {
    title: "دورة تطوير مواقع الويب",
    provider: "framer",
    image: "/courses/path-1.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
  {
    title: "دورة تطوير مواقع الويب",
    provider: "framer",
    image: "/courses/path-2.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
  {
    title: "دورة تطوير مواقع الويب",
    provider: "meta",
    image: "/courses/path-3.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
];

export default function CourseDetailsPage() {
  return (
    <main className="bg-card">
      <Navbar variant="solid" />

      {/* فتات الخبز */}
      <Container className="py-4">
        <nav className="flex items-center justify-start gap-1 text-base">
          <Link href="/" className="text-foreground hover:text-primary">
            الرئيسية
          </Link>
          <ArrowLeft className="size-4 text-primary" />
          <Link href="/courses" className="text-foreground hover:text-primary">
            الدورات
          </Link>
          <ArrowLeft className="size-4 text-primary" />
          <span className="text-primary">تفاصيل الدورة</span>
        </nav>
      </Container>

      {/* البانر */}
      <CourseDetailsHero />

      {/* المحتوى الرئيسي */}
      <Container className="py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* المحتوى (التبويبات) — يمين */}
          <CourseContent />

          {/* الشريط الجانبي — يسار */}
          <aside className="flex flex-col gap-6">
            {/* بطاقة التسجيل */}
            <div className="flex flex-col gap-4 rounded border border-border bg-card p-4">
              <div className="relative h-[200px] w-full overflow-hidden rounded bg-[#d9d9d9]">
                <Image
                  src="/courses/path-1.jpg"
                  alt="معاينة الدورة"
                  fill
                  sizes="360px"
                  className="object-cover"
                />
              </div>
              <a
                href="#"
                className="rounded bg-primary py-3 text-center text-base font-medium primarytransition-colors hover:bg-primary"
              >
                سجّل ابنك الآن
              </a>
              <FreeTrialDialog />

              <div className="h-px w-full bg-secondary" />

              <h3 className="text-right text-lg font-semibold text-foreground">
                ما الذي يتضمنه الكورس؟
              </h3>
              <ul className="flex flex-col gap-4">
                {INCLUDES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon className="size-5 shrink-0 text-primary" />
                    <span className="text-base text-muted-foreground">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* بطاقة المدرّب */}
            <div className="flex flex-col gap-5 rounded border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-col items-end gap-1 text-right">
                  <span className="text-lg font-semibold text-foreground">
                    صالح الغامدي
                  </span>
                  <span className="text-sm text-muted-foreground">
                    مطور ومصمم واجهات المستخدم
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-3.5 fill-primary text-primary" />
                    <span className="font-medium text-primary">4.5</span>
                    تقييم
                  </span>
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
                  ص
                </div>
              </div>

              <div className="flex items-stretch justify-between rounded bg-background py-3">
                {INSTRUCTOR_STATS.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex flex-1 flex-col items-center gap-1 ${
                      i < INSTRUCTOR_STATS.length - 1
                        ? "border-l border-border"
                        : ""
                    }`}
                  >
                    <span className="text-lg font-bold text-primary">
                      {stat.value}
                    </span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-right text-sm leading-relaxed text-muted-foreground">
                مصمم ومطوّر شغوف بتبسيط التقنية للأطفال، خبرة سنوات في تصميم
                تجربة وواجهة المستخدم وبناء تطبيقات الويب، يجمع بين الإبداع
                والتطبيق العملي لإيصال المفاهيم بأسلوب ممتع.
              </p>

              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded bg-background py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                مزيد من التفاصيل
                <ArrowLeft className="size-5" />
              </a>
            </div>
          </aside>
        </div>
      </Container>

      {/* دورات ذات صلة */}
      <Container className="flex flex-col gap-8 border-t border-border py-12">
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-foreground">دورات ذات صلة</h2>
          <Link
            href="/courses"
            className="flex shrink-0 items-center gap-2 text-xl font-medium text-primary transition-opacity hover:opacity-80"
          >
            جميع الدورات
            <ArrowLeft className="size-6" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((course, i) => (
            <PathCard key={i} path={course} />
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
