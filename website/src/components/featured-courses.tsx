import Image from "next/image";
import { ArrowLeft, Bookmark, Calendar, Star } from "lucide-react";
import { JoinButton } from "@/components/join-button";

import Container from "@/components/container";

// قسم "الدورات الأكثر طلباً" — Desktop - 4 من التصميم
type Course = {
  title: string;
  provider: "framer" | "meta";
  image: string;
  reviews: string;
  rating: string;
  level: string;
  lectures: string;
  hours: string;
};

const COURSES: Course[] = [
  {
    title: "دورة تطوير مواقع الويب",
    provider: "framer",
    image: "/courses/course-1.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
  {
    title: "دورة تطوير مواقع الويب",
    provider: "framer",
    image: "/courses/course-2.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
  {
    title: "دورة الذكاء الاصطناعي",
    provider: "meta",
    image: "/courses/course-3.jpg",
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: "20 ساعة",
  },
];

function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`size-[2px] shrink-0 rounded-full ${className ?? "bg-background0"}`}
    />
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="relative flex flex-col justify-center gap-4 rounded-3xl border border-border bg-card p-4">
      {/* زر الحفظ */}
      <button
        type="button"
        aria-label="حفظ الدورة"
        className="absolute left-[15px] top-[15px] z-10 flex items-center justify-center rounded bg-secondary p-1.5 transition-colors hover:bg-secondary/80"
      >
        <Bookmark className="size-4 text-foreground" />
      </button>

      {/* المعلومات + الصورة */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-[112px] flex-col items-end gap-2 text-right">
          <span className="inline-flex h-[23px] items-center justify-center rounded-full border border-border px-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${course.provider}.svg`}
              alt={course.provider}
              width={course.provider === "meta" ? 37 : 39}
              height={14}
              className="h-3.5 w-auto"
            />
          </span>

          <h3 className="whitespace-nowrap text-xl font-semibold text-foreground">
            {course.title}
          </h3>

          {/* التقييم */}
          <div className="flex items-center gap-1">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              {`( ${course.reviews} )`}
            </span>
            <Dot />
            <span className="flex items-center gap-0.5">
              <Star className="size-2.5 fill-primary text-primary" />
              <span className="text-sm font-medium text-primary">
                {course.rating}
              </span>
            </span>
          </div>

          {/* التفاصيل */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">{course.level}</span>
            <Dot className="bg-muted-foreground" />
            <span className="whitespace-nowrap">{course.lectures}</span>
            <Dot className="bg-muted-foreground" />
            <span className="whitespace-nowrap">{course.hours}</span>
          </div>
        </div>

        {/* الصورة المصغّرة */}
        <div className="relative size-[120px] shrink-0 overflow-hidden rounded bg-[#d9d9d9]">
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
      </div>

      {/* الأزرار */}
      <div className="flex items-center gap-3">
        <JoinButton
          className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-8 py-2 text-base font-medium transition-colors hover:bg-primary/90 h-auto"
        >
          قيم ابنك
          <Calendar className="size-5" />
        </JoinButton>
        <a
          href="#"
          className="flex flex-1 items-center justify-center gap-2 rounded bg-secondary px-8 py-2 text-base font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          التفاصيل
          <ArrowLeft className="size-5" />
        </a>
      </div>
    </article>
  );
}

export default function FeaturedCourses({
  courses = COURSES,
}: {
  courses?: Course[];
}) {
  return (
    <section className="w-full bg-card">
      <Container className="flex flex-col gap-8 border-t border-border py-16">
        {/* العنوان */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-3 text-right">
            <h2 className="text-2xl font-bold text-foreground">
              الدورات الأكثر طلباً
            </h2>
            <p className="text-base text-muted-foreground">
              اختيارات أولياء الأمور المفضلة
            </p>
          </div>
          <a
            href="#"
            className="flex shrink-0 items-center gap-2 text-xl font-medium text-primary transition-opacity hover:opacity-80"
          >
            جميع الدورات
            <ArrowLeft className="size-6" />
          </a>
        </div>

        {/* البطاقات */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <CourseCard key={i} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}
