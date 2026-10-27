import Link from "next/link";
import {
  Branches,
  Elevator,
  Exploded,
  Format,
  Hub,
  Keyboard,
  Laptop,
  Loupe,
  Patch,
  Phone,
  Phosphor,
  Plot,
  Plug,
  Query,
  Rail,
  Rebuild,
  Relay,
  Riffle,
  Router,
  Stack,
  Terminal,
  Terrain,
  Turntable,
  Vault,
  type HairlineProps,
} from "@lucasmarkes/hairline/react";
import { ArrowUpLeft } from "lucide-react";
import { JoinButton } from "@/components/join-button";
import { PATHS } from "@/lib/learning-paths";
import type { ComponentType } from "react";

export type PathCardData = {
  title: string;
  category?: string;
  provider: "framer" | "meta";
  image: string;
  reviews: string;
  rating: string;
  level: string;
  age?: string;
  lectures: string;
  hours: string;
  seatsBooked?: number;
  seatsTotal?: number;
  description?: string;
  skillsList?: string[];
  comingSoon?: boolean;
  animation?: string;
};

const ANIMATION_MAP: Record<string, ComponentType<HairlineProps>> = {
  Branches,
  Query,
  Phosphor,
  Phone,
  Format,
  Stack,
  Keyboard,
  Terminal,
  Exploded,
  Patch,
  Turntable,
  Rail,
  Rebuild,
  Riffle,
  Terrain,
  Plot,
  Elevator,
  Hub,
  Laptop,
  Loupe,
  Plug,
  Relay,
  Router,
  Vault,
};

const pathCategoryAnimations: Record<string, ComponentType<HairlineProps>> = {
  "البرمجة والمنطق": Keyboard,
  "الذكاء الاصطناعي": Phosphor,
  الروبوتيكس: Turntable,
  "تطوير الألعاب": Riffle,
  "تحليل البيانات": Plot,
  "ريادة الأعمال": Hub,
};

function getPathDetails(category?: string) {
  const path = PATHS.find((item) => item.title === category);

  return {
    description:
      path?.description ??
      "تعلّم عملي يربط المهارات التقنية ببناء مشاريع حقيقية قابلة للتطبيق.",
    skills: path?.skillsList ?? ["تطبيق عملي", "مشاريع حقيقية", "حل المشكلات"],
  };
}

export default function PathCard({ path }: { path: PathCardData }) {
  const CourseAnimation =
    (path.animation && ANIMATION_MAP[path.animation])
      ? ANIMATION_MAP[path.animation]
      : (pathCategoryAnimations[path.category ?? ""] ?? Keyboard);

  const fallbackDetails = getPathDetails(path.category);
  const description = path.description ?? fallbackDetails.description;
  const skills = path.skillsList ?? fallbackDetails.skills;

  return (
    <article className="group/course relative flex h-[490px] sm:h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-300 hover:border-primary/40 shadow-none">
      <div className="relative m-2.5 flex aspect-18/10 items-center justify-center overflow-hidden rounded border border-line select-none">
        <CourseAnimation
          className="h-full w-full"
          intensity={0.35}
          label={`تفاعل كورس ${path.title}`}
        />

        {path.comingSoon && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 font-sans text-[11px] font-bold text-primary backdrop-blur-md select-none">
              قريباً
            </span>
          </div>
        )}
      </div>

      <div dir="rtl" className="grid flex-1 grid-cols-[88px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] grid-rows-[auto_auto_auto_1fr_auto] bg-card text-right">
        {/* Row 1: Title */}
        <div className="col-span-3 flex items-center justify-between border-y-2 border-line px-4 py-2.5">
          <h3 className="font-heading text-sm sm:text-base font-bold leading-snug text-foreground transition-colors group-hover/course:text-primary tracking-normal">
            {path.title}
          </h3>
        </div>

        {/* Row 2: Category & Description */}
        <div className="col-span-1 flex items-center justify-center border-b border-l border-line px-2 sm:px-2.5 py-2.5 text-center font-sans text-xs font-semibold text-foreground/80 select-none">
          {path.category ?? "مسار"}
        </div>
        <div className="col-span-2 flex items-center border-b border-line px-3 sm:px-3.5 py-2.5">
          <p className="line-clamp-2 font-sans text-xs sm:text-[13px] leading-relaxed text-foreground/80 font-normal">
            {description}
          </p>
        </div>

        {/* Row 3: Age / Level / Lectures */}
        <div className="col-span-1 flex items-center justify-center border-b border-l border-line px-1.5 sm:px-2 py-2 text-center font-sans text-[11px] sm:text-xs text-foreground/85 font-medium">
          <span className="whitespace-nowrap">{path.age ?? "—"}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center border-b border-l border-line px-1.5 sm:px-2 py-2 text-center font-sans text-xs font-semibold text-foreground">
          <span className="truncate">{path.level}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center border-b border-line px-1.5 sm:px-2 py-2 text-center font-sans text-xs font-bold text-primary">
          <span>{path.lectures}</span>
        </div>

        {/* Row 4: Skills label & chips */}
        <div className="col-span-1 flex items-center justify-center border-l border-line px-2 sm:px-2.5 py-2.5 text-center font-sans text-xs font-semibold text-muted-foreground/90 select-none">
          المهارات
        </div>
        <div className="col-span-2 flex content-center flex-wrap items-center gap-1.5 px-2.5 sm:px-3 py-2.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-sm border border-line bg-secondary/60 px-2 py-0.5 font-sans text-[11px] sm:text-xs font-medium text-foreground/90 leading-normal select-none transition-colors hover:bg-secondary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Row 5: Action Buttons */}
        <div className="col-span-3 flex h-10 items-center border-t border-line mt-auto">
          <JoinButton className="flex h-10 flex-1 items-center justify-center font-sans text-xs font-bold text-foreground bg-card hover:bg-secondary transition-colors cursor-pointer rounded-none border-0 shadow-none">
            <span>قيم ابنك</span>
          </JoinButton>
          <span
            aria-hidden="true"
            className="h-full w-px shrink-0 bg-line"
          />
          <Link
            href="/courses/details"
            className="group/course-link flex h-10 flex-1 items-center justify-center font-sans text-xs font-bold text-foreground bg-card hover:bg-secondary transition-all"
          >
            <span className="px-1.5">التفاصيل</span>
            <ArrowUpLeft className="size-3.5 transition-transform duration-200 group-hover/course-link:-translate-x-0.5 group-hover/course-link:-translate-y-0.5 text-primary" />
          </Link>
        </div>
      </div>
    </article>
  );
}
