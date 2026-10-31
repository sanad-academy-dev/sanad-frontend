import { Code2, Sparkles, Cpu, Gamepad2, BarChart3, Briefcase } from "lucide-react";

export type LearningPathData = {
  trackNumber: string;
  title: string;
  age: string;
  level: string;
  description: string;
  skills: string;
  skillsList: string[];
  finalProject: string;
  seatsTotal: number;
  seatsBooked: number;
  href: string;
  icon: React.ElementType;
  image: string;
  comingSoon?: boolean;
};

export const PATHS: LearningPathData[] = [
  {
    trackNumber: "01",
    title: "البرمجة والمنطق",
    age: "6–10 سنوات",
    level: "مبتدئ",
    description: "مدخل بصري وتطبيقي يبني التفكير المنطقي وأساسيات التكويد الإبداعي للأطفال.",
    skills: "أساسيات سكراتش • التفكير الخوارزمي • برمجة القصص والألعاب • المنطق البرمجي",
    skillsList: ["أساسيات سكراتش", "التفكير الخوارزمي", "برمجة القصص والألعاب", "المنطق البرمجي"],
    finalProject: "لعبة ذكاء وقصة تفاعلية متعددة المراحل",
    seatsBooked: 6,
    seatsTotal: 8,
    href: "/courses?category=البرمجة والمنطق",
    icon: Code2,
    image: "/tracks/programming.jpg",
    comingSoon: false,
  },
  {
    trackNumber: "02",
    title: "الذكاء الاصطناعي",
    age: "12–18 سنة",
    level: "متوسط إلى متقدم",
    description: "استكشاف نماذج التعلم الآلي والذكاء التوليدي وتطبيقات الرؤية ومعالجة اللغات.",
    skills: "أساسيات الذكاء الاصطناعي • Machine Learning • هندسة الأوامر • بايثون للذكاء الاصطناعي",
    skillsList: ["أساسيات الذكاء الاصطناعي", "Machine Learning", "هندسة الأوامر Prompt Engineering"],
    finalProject: "مساعد ذكي تفاعلي ونموذج تعرّف على الصور",
    seatsBooked: 7,
    seatsTotal: 8,
    href: "/courses?category=الذكاء الاصطناعي",
    icon: Sparkles,
    image: "/tracks/ai.jpg",
    comingSoon: false,
  },
  {
    trackNumber: "03",
    title: "الروبوتيكس",
    age: "8–16 سنة",
    level: "جميع المستويات",
    description: "دمج البرمجة بالإلكترونيات وبناء أنظمة روبوتية تفاعلية تتصل بالعالم الواقعي.",
    skills: "برمجة أردوينو • الحوسبة الفيزيائية • الحساسات والمحركات الذكية • الدوائر الإلكترونية",
    skillsList: ["برمجة متحكمات أردوينو", "الحوسبة الفيزيائية", "الحساسات والمحركات الذكية", "الدوائر الإلكترونية"],
    finalProject: "روبوت ذكي ذاتي القيادة متفادي للعقبات",
    seatsBooked: 5,
    seatsTotal: 8,
    href: "/courses?category=الروبوتيكس",
    icon: Cpu,
    image: "/tracks/robotics.jpg",
    comingSoon: false,
  },
  {
    trackNumber: "04",
    title: "تطوير الألعاب",
    age: "10–16 سنة",
    level: "مبتدئ إلى متوسط",
    description: "تصميم وبناء ألعاب 2D و3D مع ميكانيكا حركة وفيزياء تفاعلية ومؤثرات صوتية.",
    skills: "تصميم ألعاب 2D • ميكانيكا وفيزياء الألعاب • تصميم الشخصيات والمراحل • بناء ألعاب 3D",
    skillsList: ["تصميم ألعاب ثنائية الأبعاد 2D", "ميكانيكا وفيزياء الألعاب", "تصميم الشخصيات والمراحل", "بناء الألعاب 3D"],
    finalProject: "لعبة منصات 2D/3D متكاملة قابلة للنشر",
    seatsBooked: 6,
    seatsTotal: 8,
    href: "/courses?category=تطوير الألعاب",
    icon: Gamepad2,
    image: "/tracks/game-dev.jpg",
    comingSoon: true,
  },
  {
    trackNumber: "05",
    title: "تحليل البيانات",
    age: "13–18 سنة",
    level: "متوسط",
    description: "تحويل الأرقام إلى رسوم بيانية وتنبؤات ذكية تدعم اتخاذ القرارات وحل المشكلات.",
    skills: "بايثون لمعالجة البيانات • مكتبة Pandas • الرسوم البيانية التفاعلية • لوحات التحكم",
    skillsList: ["بايثون لمعالجة البيانات", "مكتبة Pandas", "تصور البيانات والرسوم البيانية", "لوحات التحكم التفاعلية"],
    finalProject: "لوحة تحكم بيانات تفاعلية (Interactive Dashboard)",
    seatsBooked: 4,
    seatsTotal: 8,
    href: "/courses?category=تحليل البيانات",
    icon: BarChart3,
    image: "/tracks/data-analysis.jpg",
    comingSoon: true,
  },
  {
    trackNumber: "06",
    title: "ريادة الأعمال",
    age: "12–18 سنة",
    level: "جميع المستويات",
    description: "تحويل الأفكار التقنيةإلى مشاريع ريادية قابلة للتطبيق ونماذج عمل ناجحة.",
    skills: "تطوير المنتجات الرقمية • نماذج الأعمال للشركات الناشئة • مهارات العرض والإلقاء • التسويق الرقمي",
    skillsList: ["تطوير المنتجات الرقمية", "نماذج الأعمال للشركات الناشئة", "مهارات الإلقاء والعرض"],
    finalProject: "نموذج عمل شركة ناشئة وعرض استثماري متكامل (Pitch Deck)",
    seatsBooked: 5,
    seatsTotal: 8,
    href: "/courses?category=ريادة الأعمال",
    icon: Briefcase,
    image: "/tracks/entrepreneurship.jpg",
    comingSoon: true,
  },
];
