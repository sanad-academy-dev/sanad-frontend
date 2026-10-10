import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Container from "@/components/container";
import CoursesHero from "@/components/courses-hero";
import PathCard from "@/components/path-card";
import { getCourses } from "@/lib/courses";

export const metadata: Metadata = {
  title: "الدورات | سند",
  description: "استكشف دورات سند التعليمية للأطفال في البرمجة والتقنية",
};

// تبويبات الفلترة (RTL: النشط "البرمجة" يمين)
const TABS = [
  "البرمجة",
  "التصميم",
  "الذكاء الاصطناعي",
  "الأمن السيبراني",
  "علوم البيانات",
  "التسويق",
  "تطوير مواقع الويب",
];

const FILTERS = ["المستوى", "الفئة العمرية"];

export default async function CoursesPage() {
  // يُجلب ديناميكياً من داشبورد سند
  const { courses } = await getCourses();

  return (
    <main className="bg-card">
      <Navbar variant="solid" />

      {/* فتات الخبز */}
      <Container className="pt-6">
        <nav className="flex items-center justify-start gap-1 text-base">
          <Link href="/" className="text-foreground hover:text-primary">
            الرئيسية
          </Link>
          <ArrowLeft className="size-4 text-primary" />
          <span className="text-primary">الدورات</span>
        </nav>
      </Container>

      {/* البانر */}
      <Container className="py-6">
        <CoursesHero />
      </Container>

      {/* قسم الدورات */}
      <Container className="flex flex-col gap-8 py-10">
        {/* الرأس + الفلاتر */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-3 text-right">
              <h2 className="text-2xl font-bold text-foreground">مسارات التعلم</h2>
              <p className="text-base text-muted-foreground">
                اختر المسار الأنسب لاهتمامات ابنك ومستواه
              </p>
            </div>
            <div className="flex items-center gap-3">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="flex items-center justify-between gap-6 rounded border border-border px-4 py-2 text-base text-muted-foreground transition-colors hover:bg-background"
                >
                  <span className="whitespace-nowrap">{filter}</span>
                  <ChevronDown className="size-4 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* شريط التبويبات */}
          <div className="flex">
            <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded border border-border p-1">
              {TABS.map((tab, i) => (
                <Fragment key={tab}>
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="h-[34px] w-px shrink-0 bg-secondary"
                    />
                  )}
                  <button
                    type="button"
                    className={`shrink-0 whitespace-nowrap rounded px-4 py-2 text-base font-medium transition-colors ${
                      i === 0
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-background"
                    }`}
                  >
                    {tab}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* الشبكة */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <PathCard key={i} path={course} />
          ))}
        </div>
      </Container>

      <Footer />
    </main>
  );
}
