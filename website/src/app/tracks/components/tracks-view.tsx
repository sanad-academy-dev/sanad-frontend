"use client";

import CoursesView from "@/app/courses/components/courses-view";
import type { PathCardData } from "@/components/path-card";

export default function TracksView({
  initialCourses = [],
}: {
  initialCourses?: PathCardData[];
}) {
  return <CoursesView initialCourses={initialCourses} pageType="tracks" />;
}
