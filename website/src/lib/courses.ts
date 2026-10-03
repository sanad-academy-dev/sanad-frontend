import type { PathCardData } from "@/components/path-card";

// مصدر البيانات: خدمة سند الخلفية المستقلة. الاسم القديم مدعوم مؤقتًا كي لا يتوقف
// أي نشر قائم قبل نقل متغير البيئة إلى SANAD_API_URL.
const SANAD_API =
  process.env.SANAD_API_URL ??
  process.env.DASHBOARD_API_URL ??
  "http://localhost:5180/api";
const ACADEMY_SLUG = process.env.ACADEMY_SLUG ?? "sanad";

const IMAGES = [
  "/courses/path-1.jpg",
  "/courses/path-2.jpg",
  "/courses/path-3.jpg",
];
const PROVIDERS = ["framer", "meta"] as const;

type ApiCourse = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

// بيانات احتياطية إذا تعذّر الوصول للداشبورد
const FALLBACK: PathCardData[] = [
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
    title: "دورة تصميم واجهة المستخدم",
    provider: "meta",
    image: "/courses/path-2.jpg",
    reviews: "150.320",
    rating: "4.8",
    level: "متوسط",
    lectures: "10 محاضرات",
    hours: "30 ساعة",
  },
  {
    title: "دورة الذكاء الاصطناعي",
    provider: "framer",
    image: "/courses/path-3.jpg",
    reviews: "95.120",
    rating: "4.9",
    level: "متقدم",
    lectures: "25 محاضرة",
    hours: "60 ساعة",
  },
  {
    title: "دورة التسويق الرقمي",
    provider: "framer",
    image: "/courses/path-1.jpg",
    reviews: "120.450",
    rating: "4.8",
    level: "متوسط",
    lectures: "12 محاضرة",
    hours: "35 ساعة",
  },
  {
    title: "دورة علم البيانات",
    provider: "meta",
    image: "/courses/path-2.jpg",
    reviews: "89.230",
    rating: "4.9",
    level: "متقدم",
    lectures: "20 محاضرة",
    hours: "50 ساعة",
  },
  {
    title: "دورة الأمن السيبراني",
    provider: "framer",
    image: "/courses/path-3.jpg",
    reviews: "150.000",
    rating: "4.7",
    level: "المبتدئين",
    lectures: "15 محاضرة",
    hours: "40 ساعة",
  },
];

function mapCourse(c: ApiCourse, i: number): PathCardData {
  return {
    title: c.name,
    provider: PROVIDERS[i % PROVIDERS.length],
    image: IMAGES[i % IMAGES.length],
    reviews: "215.624",
    rating: "4.5",
    level: "المبتدئين",
    lectures: "06 محاضرات",
    hours: `${Math.max(1, Math.round(c.durationMinutes / 60))} ساعة`,
  };
}

/** يجلب الدورات ديناميكياً من API سند (server-side، بلا CORS). */
export async function getCourses(): Promise<{
  courses: PathCardData[];
  live: boolean;
}> {
  try {
    const res = await fetch(
      `${SANAD_API}/public/clinic/${ACADEMY_SLUG}/services`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return { courses: FALLBACK, live: false };
    const data = (await res.json()) as ApiCourse[];
    if (!Array.isArray(data) || data.length === 0)
      return { courses: FALLBACK, live: false };
    return { courses: data.map(mapCourse), live: true };
  } catch {
    return { courses: FALLBACK, live: false };
  }
}

// ===== التصنيفات (ديناميكية من الداشبورد) =====
export type CategoryCard = { title: string; count: string; icon: string };

type ApiCategory = { id: string; name: string; courseCount: number };

const CATEGORY_FALLBACK: CategoryCard[] = [
  { title: "البرمجة", count: "دورات متعددة", icon: "php" },
  { title: "تطوير مواقع الويب", count: "دورات متعددة", icon: "web-programming" },
  { title: "الذكاء الاصطناعي", count: "دورات متعددة", icon: "ai-network" },
  { title: "تصميم واجهة وتجربة المستخدم", count: "دورات متعددة", icon: "web-design" },
];

function iconFor(name: string): string {
  if (name.includes("بيانات")) return "database";
  if (name.includes("ذكاء") || name.includes("روبوت")) return "ai-network";
  if (name.includes("ويب") || name.includes("برمجة") || name.includes("php"))
    return "web-programming";
  if (name.includes("تصميم") || name.includes("ألعاب") || name.includes("واجهة"))
    return "web-design";
  if (name.includes("تسويق")) return "briefcase-dollar";
  if (name.includes("أمن") || name.includes("سيبراني")) return "web-protection";
  return "web-programming";
}

function countText(n: number): string {
  if (n === 1) return "دورة واحدة";
  if (n === 2) return "دورتان";
  if (n >= 3 && n <= 10) return `${n} دورات`;
  return `${n} دورة`;
}

/** يجلب التصنيفات ديناميكياً من API سند. */
export async function getCategories(): Promise<{
  categories: CategoryCard[];
  live: boolean;
}> {
  try {
    const res = await fetch(
      `${SANAD_API}/public/clinic/${ACADEMY_SLUG}/categories`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return { categories: CATEGORY_FALLBACK, live: false };
    const data = (await res.json()) as ApiCategory[];
    if (!Array.isArray(data) || data.length === 0)
      return { categories: CATEGORY_FALLBACK, live: false };
    return {
      categories: data.map((c) => ({
        title: c.name,
        count: countText(c.courseCount),
        icon: iconFor(c.name),
      })),
      live: true,
    };
  } catch {
    return { categories: CATEGORY_FALLBACK, live: false };
  }
}
