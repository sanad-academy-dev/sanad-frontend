"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Container from "@/components/container";
import PageBreadcrumb from "@/components/page-breadcrumb";
import CoursesHero from "@/components/courses-hero";
import PathCard, { type PathCardData } from "@/components/path-card";
import CourseLevelsGuide from "./course-levels-guide";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "الكل",
  "البرمجة والمنطق",
  "الذكاء الاصطناعي",
  "الروبوتيكس",
  "تطوير الألعاب",
  "تحليل البيانات",
  "ريادة الأعمال",
];

export default function CoursesView({
  initialCourses,
  pageType = "courses",
}: {
  initialCourses: PathCardData[];
  pageType?: "courses" | "tracks";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const basePath = pageType === "tracks" ? "/tracks" : "/courses";

  const initialCategoryParam = searchParams.get("category");
  const defaultCategory =
    initialCategoryParam && CATEGORIES.includes(initialCategoryParam)
      ? initialCategoryParam
      : "الكل";

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
      setVisibleCount(6);
    } else if (!cat) {
      setSelectedCategory("الكل");
    }
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(6);

    if (cat === "الكل") {
      router.replace(basePath, { scroll: false });
    } else {
      router.replace(`${basePath}?category=${encodeURIComponent(cat)}`, {
        scroll: false,
      });
    }
  };

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchCategory =
        selectedCategory === "الكل" ||
        (course.category && course.category.includes(selectedCategory)) ||
        course.title.includes(selectedCategory);

      return matchCategory;
    });
  }, [initialCourses, selectedCategory]);

  const displayedCourses = useMemo(() => {
    return filteredCourses.slice(0, visibleCount);
  }, [filteredCourses, visibleCount]);

  return (
    <div
      className="flex-1 flex flex-col w-full max-w-screen overflow-x-clip bg-background pt-14 selection:bg-primary/20"
      dir="rtl"
    >
      <Container className="relative">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb
          items={[
            {
              label: pageType === "tracks" ? "المسارات التعليمية" : "الكورسات",
            },
          ]}
        />

        {/* Hero Section */}
        <CoursesHero
          title={pageType === "tracks" ? "مسارات تعليمية متكاملة" : "كورسات برمجية وتقنية"}
          highlight={pageType === "tracks" ? "تقود طفلك نحو الاحتراف" : "تبني عقول المستقبل"}
          badge={pageType === "tracks" ? "6 مسارات تخصصية" : "برامج تدريبية معتمدة"}
          description={
            pageType === "tracks"
              ? "استكشف مساراتنا المعتمدة في البرمجة والذكاء الاصطناعي والروبوتيكس — رحلة تعليمية متدرجة من الأساسيات والتفكير المنطقي حتى قيادة مشاريع التخرج."
              : "مناهج تفاعلية متدرجة تربط بين التفكير المنطقي، البرمجة الإبداعية، وبناء المشاريع الواقعية من الصفر تحت إشراف نخبة من المتخصصين."
          }
        />
    
        {/* Category Filters Bar */}
        <div className="screen-line-top screen-line-bottom px-4 sm:px-6 py-0 bg-card/10 relative z-30">
          <div className="-mx-4 sm:-mx-6 min-w-0 overflow-x-auto pb-0 scrollbar-none">
            <div className="flex min-w-max bg-card/10 select-none">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const label = cat === "الكل" ? (pageType === "tracks" ? "جميع المسارات" : "جميع الكورسات") : cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={cn(
                      "relative shrink-0 border-l-2 border-line px-4 sm:px-6 py-3.5 sm:py-4 font-sans text-xs sm:text-[13px] transition-colors cursor-pointer select-none",
                      isSelected
                        ? "bg-secondary/70 text-foreground font-bold"
                        : "text-muted-foreground font-semibold hover:bg-secondary/35 hover:text-foreground"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courses/Tracks Grid */}
        <div className="relative">
          {displayedCourses.length > 0 ? (
            <>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden -translate-x-1/2 border-l-2 border-line sm:block" />

                <ul className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 p-2 sm:p-4">
                  {displayedCourses.map((course, index) => (
                    <li
                      key={`${course.title}-${index}`}
                      className={cn(
                        "p-1 sm:p-2 max-sm:screen-line-bottom-center",
                        "sm:nth-[2n+1]:screen-line-bottom-center"
                      )}
                    >
                      <PathCard path={course} />
                    </li>
                  ))}
                </ul>
              </div>

              {filteredCourses.length > visibleCount && (
                <div className="relative py-4 sm:py-6 flex items-center justify-center screen-line-top before:hidden after:hidden">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-card hover:bg-secondary px-6 py-2.5 font-sans text-xs sm:text-sm font-bold text-foreground transition-all hover:border-primary/50 cursor-pointer shadow-none group select-none"
                  >
                    <span>{pageType === "tracks" ? "عرض المزيد من المسارات" : "عرض المزيد من الكورسات"}</span>
                    <ChevronDown className="size-4 text-primary transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="screen-line-top screen-line-bottom p-8 sm:col-span-2 text-center" dir="rtl">
              <p className="font-sans text-sm font-medium text-muted-foreground select-none">
                لا توجد مسارات مطابقة للتصنيف المحدد حالياً.
              </p>
            </div>
          )}
        </div>

        {/* Levels Guide Section */}
        <CourseLevelsGuide />
      </Container>
    </div>
  );
}
