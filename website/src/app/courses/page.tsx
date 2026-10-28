import { Suspense } from "react";
import type { Metadata } from "next";
import { getCourses } from "@/lib/courses";
import CoursesView from "./components/courses-view";

export const metadata: Metadata = {
  title: "الكورسات | أكاديمية سند",
  description: "استكشف كورسات أكاديمية سند التعليمية للأطفال واليافعين في البرمجة والذكاء الاصطناعي والتكنولوجيا",
};

export default async function CoursesPage() {
  const { courses } = await getCourses();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CoursesView initialCourses={courses} />
    </Suspense>
  );
}
