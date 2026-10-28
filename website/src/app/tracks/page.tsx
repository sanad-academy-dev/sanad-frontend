import { Suspense } from "react";
import type { Metadata } from "next";
import { getCourses } from "@/lib/courses";
import CoursesView from "@/app/courses/components/courses-view";

export const metadata: Metadata = {
  title: "مسارات التعلم التخصصية | أكاديمية سند",
  description: "استكشف مسارات أكاديمية سند التعليمية للأطفال واليافعين في البرمجة والذكاء الاصطناعي والروبوتيكس والتكنولوجيا",
};

export default async function TracksPage() {
  const { courses } = await getCourses();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CoursesView initialCourses={courses} pageType="tracks" />
    </Suspense>
  );
}
