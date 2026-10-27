import type { PathCardData } from "@/components/path-card";
import { getSanadBackendUrl } from "@/lib/api-config";

const ACADEMY_SLUG = process.env.ACADEMY_SLUG ?? "sanad";

const IMAGES = [
  "/tracks/programming.jpg",
  "/tracks/ai.jpg",
  "/tracks/robotics.jpg",
  "/tracks/game-dev.jpg",
  "/tracks/data-analysis.jpg",
  "/tracks/entrepreneurship.jpg",
];
const PROVIDERS = ["framer", "meta"] as const;

type ApiCourse = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number | null;
};

const FALLBACK: PathCardData[] = [
  // ==================== مسار البرمجة والمنطق (جاهزة للإطلاق ومكتملة) ====================
  {
    title: "التفكير المنطقي وحل المشكلات",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "410",
    rating: "5.0",
    level: "تمهيدي",
    age: "7–9 سنوات",
    lectures: "6 أسابيع",
    hours: "6 ساعات",
    seatsBooked: 7,
    seatsTotal: 8,
    description: "تأسيس التفكير المنطقي والتسلسلات بدون شاشة في بعض الأنشطة، وحل المشكلات وصناعة أول لعبة تفاعلية بأنفسهم.",
    skillsList: ["التسلسلات والأوامر", "الحلقات والأنماط", "الشروط المنطقية", "تصحيح الأخطاء"],
    comingSoon: false,
    animation: "Branches",
  },
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
    title: "بكتو بلوكس AI",
    category: "البرمجة والمنطق",
    provider: "meta",
    image: "/tracks/programming.jpg",
    reviews: "320",
    rating: "4.9",
    level: "متوسط",
    age: "9–13 سنة",
    lectures: "12 حصة",
    hours: "24 ساعة",
    seatsBooked: 5,
    seatsTotal: 8,
    description: "دمج الذكاء الاصطناعي مع البرمجة المرئية؛ التعرف على الوجوه، الإيماءات، وتطبيقات الرؤية الحاسوبية التفاعلية.",
    skillsList: ["خوارزميات AI", "التعرف على الوجه والصوت", "تدريب النماذج", "ألعاب ذكية"],
    comingSoon: false,
    animation: "Phosphor",
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
    title: "جافا (Java Programming)",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "260",
    rating: "4.9",
    level: "متقدم",
    age: "13–17 سنة",
    lectures: "12 حصة",
    hours: "18 ساعة",
    seatsBooked: 4,
    seatsTotal: 6,
    description: "البرمجة كائنية التوجه (OOP) بلغة Java وحل المشكلات البرمجية وبناء تطبيقات وبرمجيات حاسوبية متكاملة.",
    skillsList: ["أساسيات Java", "مفاهيم OOP", "هياكل البيانات", "بناء التطبيقات"],
    comingSoon: false,
    animation: "Stack",
  },
  {
    title: "بايثون للأطفال (Python for Kids)",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "350",
    rating: "4.9",
    level: "مبتدئ",
    age: "12–17 سنة",
    lectures: "8 حصص",
    hours: "12 ساعة",
    seatsBooked: 7,
    seatsTotal: 8,
    description: "كتابة الكود النصي الحقيقي خطوة بخطوة؛ بناء التفكير الخوارزمي وصناعة ألعاب وتطبيقات تفاعلية بلغة بايثون.",
    skillsList: ["أساسيات بايثون", "المتغيرات والشروط", "الحلقات التكرارية", "حل المشكلات"],
    comingSoon: false,
    animation: "Keyboard",
  },
  {
    title: "البايثون للكبار والمتقدم",
    category: "البرمجة والمنطق",
    provider: "framer",
    image: "/tracks/programming.jpg",
    reviews: "280",
    rating: "4.8",
    level: "مبتدئ متقدم",
    age: "12–17 سنة",
    lectures: "8 حصص",
    hours: "12 ساعة",
    seatsBooked: 5,
    seatsTotal: 8,
    description: "تطوير مهارات بايثون المتقدمة بعد الأساسيات؛ التعامل مع الدوال المهيكلة، أتمتة المهام، وبناء مشاريع برمجية متكاملة.",
    skillsList: ["الدوال المتقدمة", "هياكل البيانات", "التعامل مع الملفات", "مشاريع وأتمتة"],
    comingSoon: false,
    animation: "Terminal",
  },

  // ==================== مسار الذكاء الاصطناعي ====================
  {
    title: "مدخل إلى الذكاء الاصطناعي",
    category: "الذكاء الاصطناعي",
    provider: "meta",
    image: "/tracks/ai.jpg",
    reviews: "210",
    rating: "4.8",
    level: "مبتدئ",
    age: "9–14 سنة",
    lectures: "8 محاضرات",
    hours: "12 ساعة",
    seatsBooked: 4,
    seatsTotal: 8,
    description: "استكشاف عالم الذكاء الاصطناعي ونماذج التوليد والتعرف على البيانات وتطبيقاته العملية في حياتنا اليومية.",
    skillsList: ["مفاهيم AI الأساسية", "تدريب النماذج", "التعرف على الصور", "Prompt Engineering"],
    comingSoon: true,
    animation: "Phosphor",
  },
  {
    title: "بناء تطبيقات باستخدام AI",
    category: "الذكاء الاصطناعي",
    provider: "meta",
    image: "/tracks/ai.jpg",
    reviews: "195",
    rating: "4.9",
    level: "متوسط",
    age: "12–17 سنة",
    lectures: "10 محاضرات",
    hours: "15 ساعة",
    seatsBooked: 5,
    seatsTotal: 8,
    description: "دمج أدوات ونماذج الذكاء الاصطناعي داخل التطبيقات البرمجية لبناء مساعدين أذكياء وحلول مؤتمتة ومبتكرة.",
    skillsList: ["واجهات برمجة AI APIs", "بناء المساعد الذكي", "التعامل مع البيانات", "تطبيقات ذكية"],
    comingSoon: true,
    animation: "Hub",
  },

  // ==================== مسار الروبوتيكس ====================
  {
    title: "LEGO Basics: أول روبوت",
    category: "الروبوتيكس",
    provider: "framer",
    image: "/tracks/robotics.jpg",
    reviews: "230",
    rating: "4.9",
    level: "مبتدئ",
    age: "7–9 سنوات",
    lectures: "10 جلسات",
    hours: "10 ساعات",
    seatsBooked: 6,
    seatsTotal: 8,
    description: "بناء أول روبوت حقيقي باستخدام أطقم LEGO التعليمية مع ميكانيكا التروس والحركة والبرمجة البسيطة الممتعة.",
    skillsList: ["تركيب ميكانيكي", "المحركات والتروس", "البرمجة الحركية", "التفكير الهندسي"],
    comingSoon: true,
    animation: "Exploded",
  },
  {
    title: "Circuits & Sensors: دوائر وحساسات",
    category: "الروبوتيكس",
    provider: "framer",
    image: "/tracks/robotics.jpg",
    reviews: "185",
    rating: "4.8",
    level: "متوسط",
    age: "9–12 سنة",
    lectures: "10 جلسات",
    hours: "10 ساعات",
    seatsBooked: 5,
    seatsTotal: 8,
    description: "استكشاف الدوائر الكهربائية والحساسات والتحكم الإلكتروني وبناء أجهزة تفاعلية وأجهزة إنذار ذكية.",
    skillsList: ["الدوائر الكهربائية", "الحساسات الإلكترونية", "قوانين التوصيل", "أجهزة تفاعلية"],
    comingSoon: true,
    animation: "Patch",
  },
  {
    title: "Arduino Basics: أساسيات أردوينو",
    category: "الروبوتيكس",
    provider: "framer",
    image: "/tracks/robotics.jpg",
    reviews: "220",
    rating: "4.9",
    level: "متوسط",
    age: "11–14 سنة",
    lectures: "10 جلسات",
    hours: "10 ساعات",
    seatsBooked: 7,
    seatsTotal: 8,
    description: "برمجة المتحكمات الدقيقة عبر Arduino وبناء مشاريع الأتمتة والأنظمة الذكية المتصلة بالعالم الحقيقي.",
    skillsList: ["لوحة أردوينو", "البرمجة بالسي/C++", "التحكم بالمحركات", "مشاريع الأتمتة"],
    comingSoon: true,
    animation: "Turntable",
  },
  {
    title: "Line Follower Lab: روبوت يتبع الخط",
    category: "الروبوتيكس",
    provider: "framer",
    image: "/tracks/robotics.jpg",
    reviews: "170",
    rating: "4.8",
    level: "متقدم",
    age: "12–15 سنة",
    lectures: "8 جلسات",
    hours: "8 ساعات",
    seatsBooked: 4,
    seatsTotal: 6,
    description: "بناء وبرمجة روبوت ذاتي القيادة يتبع المسارات المحددة بواسطة حساسات الأشعة تحت الحمراء وخوارزميات التحكم.",
    skillsList: ["حساسات التتبع IR", "خوارزميات التوجيه", "التحكم بسرعة المحركات", "معايرة الروبوت"],
    comingSoon: true,
    animation: "Rail",
  },
  {
    title: "Competition Robotics: تحدي الروبوتات",
    category: "الروبوتيكس",
    provider: "framer",
    image: "/tracks/robotics.jpg",
    reviews: "190",
    rating: "4.9",
    level: "متقدم",
    age: "13–17 سنة",
    lectures: "6 جلسات",
    hours: "9 ساعات",
    seatsBooked: 5,
    seatsTotal: 6,
    description: "إعداد وتأهيل الطلاب للمسابقات والبطولات الروبوتية الدولية وبناء استراتيجيات المنافسة والعمل الجماعي.",
    skillsList: ["تصميم روبوتات المسابقات", "استراتيجيات الحلبة", "العمل الجماعي", "البرمجة الدقيقة"],
    comingSoon: true,
    animation: "Rebuild",
  },

  // ==================== مسار تطوير الألعاب ====================
  {
    title: "أساسيات الألعاب (Game Dev Basics)",
    category: "تطوير الألعاب",
    provider: "framer",
    image: "/tracks/game-dev.jpg",
    reviews: "310",
    rating: "4.9",
    level: "مبتدئ",
    age: "9–13 سنة",
    lectures: "8 أسابيع",
    hours: "12 ساعة",
    seatsBooked: 6,
    seatsTotal: 8,
    description: "مبادئ تصميم وتطوير الألعاب ثنائية الأبعاد 2D، فيزياء الحركة وتصميم الشخصيات والمراحل وجمع النقاط.",
    skillsList: ["تصميم الألعاب 2D", "فيزياء الحركة والجاذبية", "تصميم الشخصيات", "أنظمة النقاط"],
    comingSoon: true,
    animation: "Riffle",
  },
  {
    title: "تصميم الألعاب باستخدام محرك Godot",
    category: "تطوير الألعاب",
    provider: "framer",
    image: "/tracks/game-dev.jpg",
    reviews: "275",
    rating: "4.9",
    level: "متقدم",
    age: "11–17 سنة",
    lectures: "12 أسبوع",
    hours: "18 ساعة",
    seatsBooked: 5,
    seatsTotal: 8,
    description: "صناعة ألعاب متطورة عبر محرك Godot ولغة GDScript؛ بناء عوالم تفاعلية وأنظمة حركة وتحكم متقدمة.",
    skillsList: ["محرك Godot", "لغة GDScript", "فيزياء ومؤثرات الألعاب", "تصدير ونشر اللعبة"],
    comingSoon: true,
    animation: "Terrain",
  },

  // ==================== مسار تحليل البيانات ====================
  {
    title: "علم وتحليل البيانات الاستكشافي",
    category: "تحليل البيانات",
    provider: "meta",
    image: "/tracks/data-analysis.jpg",
    reviews: "165",
    rating: "4.7",
    level: "متوسط",
    age: "12–18 سنة",
    lectures: "10 محاضرات",
    hours: "15 ساعة",
    seatsBooked: 6,
    seatsTotal: 8,
    description: "استكشاف البيانات وفهمها؛ تنظيف البيانات وبناء الرسوم البيانية التفاعلية باستخدام بايثون ومكتبة Pandas.",
    skillsList: ["بايثون للبيانات", "مكتبة Pandas", "الرسوم البيانية Matplotlib", "لوحات التحكم"],
    comingSoon: true,
    animation: "Plot",
  },

  // ==================== مسار ريادة الأعمال ====================
  {
    title: "ريادة الأعمال والابتكار التقني",
    category: "ريادة الأعمال",
    provider: "framer",
    image: "/tracks/entrepreneurship.jpg",
    reviews: "220",
    rating: "4.8",
    level: "جميع المستويات",
    age: "12–18 سنة",
    lectures: "8 محاضرات",
    hours: "12 ساعة",
    seatsBooked: 5,
    seatsTotal: 6,
    description: "تحويل الأفكار البرمجية إلى منتجات وشركات ناشئة، وفهم نماذج العمل التجاري ومهارات العرض والإلقاء.",
    skillsList: ["التفكير التصميمي", "نماذج الأعمال للشركات", "تصميم تجربة المستخدم UI/UX", "العرض الاستثماري Pitch"],
    comingSoon: true,
    animation: "Elevator",
  },
];

function mapCourse(c: ApiCourse, i: number): PathCardData {
  const seatsConfig = [
    { booked: 6, total: 8 },
    { booked: 5, total: 8 },
    { booked: 7, total: 8 },
    { booked: 4, total: 6 },
    { booked: 8, total: 10 },
    { booked: 5, total: 6 },
  ];
  const categories = [
    "البرمجة والمنطق",
    "الذكاء الاصطناعي",
    "الروبوتيكس",
    "تطوير الألعاب",
    "تحليل البيانات",
    "ريادة الأعمال",
  ];
  const seat = seatsConfig[i % seatsConfig.length];
  return {
    title: c.name,
    category: categories[i % categories.length],
    provider: PROVIDERS[i % PROVIDERS.length],
    image: IMAGES[i % IMAGES.length],
    reviews: "215",
    rating: "4.8",
    level: "مبتدئ",
    lectures: "12 محاضرة",
    hours: `${Math.max(1, Math.round(c.durationMinutes / 60))} ساعة`,
    seatsBooked: seat.booked,
    seatsTotal: seat.total,
  };
}

export async function getCourses(): Promise<{
  courses: PathCardData[];
  live: boolean;
}> {
  try {
    const res = await fetch(
      `${getSanadBackendUrl()}/public/clinic/${ACADEMY_SLUG}/services`,
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

export type CategoryCard = { title: string; count: string; icon: string };

type ApiCategory = { id: string; name: string; courseCount: number };

const CATEGORY_FALLBACK: CategoryCard[] = [
  { title: "البرمجة والمنطق", count: "8 دورات مكتملة", icon: "web-programming" },
  { title: "الذكاء الاصطناعي", count: "دورتان (قريباً)", icon: "ai-network" },
  { title: "الروبوتيكس", count: "5 دورات (قريباً)", icon: "ai-network" },
  { title: "تطوير الألعاب", count: "دورتان (قريباً)", icon: "web-design" },
  { title: "تحليل البيانات", count: "دورة واحدة (قريباً)", icon: "database" },
  { title: "ريادة الأعمال", count: "دورة واحدة (قريباً)", icon: "briefcase-dollar" },
];

function iconFor(name: string): string {
  if (name.includes("بيانات")) return "database";
  if (name.includes("ذكاء") || name.includes("روبوت")) return "ai-network";
  if (name.includes("ويب") || name.includes("برمجة") || name.includes("php"))
    return "web-programming";
  if (name.includes("تصميم") || name.includes("ألعاب") || name.includes("واجهة"))
    return "web-design";
  if (name.includes("تسويق") || name.includes("ريادة")) return "briefcase-dollar";
  if (name.includes("أمن") || name.includes("سيبراني")) return "web-protection";
  return "web-programming";
}

function countText(n: number): string {
  if (n === 1) return "دورة واحدة";
  if (n === 2) return "دورتان";
  if (n >= 3 && n <= 10) return `${n} دورات`;
  return `${n} دورة`;
}

export async function getCategories(): Promise<{
  categories: CategoryCard[];
  live: boolean;
}> {
  try {
    const res = await fetch(
      `${getSanadBackendUrl()}/public/clinic/${ACADEMY_SLUG}/categories`,
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
