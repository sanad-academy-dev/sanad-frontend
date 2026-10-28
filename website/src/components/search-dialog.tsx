"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Compass,
  Code2,
  Cpu,
  HelpCircle,
  CreditCard,
  Phone,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Users,
  MapPin,
  Layers,
  BarChart3,
  Briefcase,
  Gamepad2,
  FolderTree,
} from "lucide-react";
import Image from "next/image";

export type SearchItem = {
  id: string;
  title: string;
  description: string;
  category: "المسارات" | "المستويات" | "رحلة الطالب" | "الأسعار" | "الأسئلة الشائعة" | "الصفحات";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
};

const SEARCH_ITEMS: SearchItem[] = [
  // الصفحات الرئيسية
  {
    id: "page-home",
    title: "الصفحة الرئيسية",
    description: "علّم ابنك تقنيات المستقبل مع أكاديمية سند",
    category: "الصفحات",
    href: "/",
    icon: Compass,
    keywords: ["رئيسية", "home", "سند", "اكاديمية"],
  },
  {
    id: "page-tracks",
    title: "المسارات التعليمية والكورسات",
    description: "استكشف كافة المسارات والكورسات المعتمدة في البرمجة والذكاء الاصطناعي",
    category: "الصفحات",
    href: "/tracks",
    icon: FolderTree,
    keywords: ["مسارات", "كورسات", "tracks", "courses", "برامج", "تعليم"],
  },
  {
    id: "page-pricing",
    title: "باقات وأسعار الاشتراكات",
    description: "خطط وباقات اشتراك مرنة وشفافة أونلاين وبالمقر مع حاسبة الأسعار وخصم الأخوة",
    category: "الصفحات",
    href: "/pricing",
    icon: CreditCard,
    keywords: ["اسعار", "سعر", "باقات", "اشتراك", "pricing", "تكلفة", "حاسبة"],
  },
  {
    id: "page-contact",
    title: "تواصل معنا وحجز المواعيد",
    description: "الدعم المباشر، حجز مكالمة فيديو، والتواصل عبر الواتساب والبريد",
    category: "الصفحات",
    href: "/contact",
    icon: Phone,
    keywords: ["تواصل", "دعم", "واتساب", "اتصال", "مساعدة", "contact", "موعد"],
  },
  {
    id: "page-team",
    title: "فريق العمل والمدربين",
    description: "تعرّف على نخبة المدربين والمتخصصين المشرفين على تدريب طلاب سند",
    category: "الصفحات",
    href: "/team",
    icon: Users,
    keywords: ["فريق", "مدربين", "معلمين", "team", "اساتذة"],
  },
  {
    id: "page-blog",
    title: "المدونة التعليمية",
    description: "مقالات، أدلة تربوية، ونصائح لتعليم البرمجة والذكاء الاصطناعي للأطفال",
    category: "الصفحات",
    href: "/blog",
    icon: BookOpen,
    keywords: ["مدونة", "blog", "مقالات", "نصائح", "تربوية"],
  },
  {
    id: "page-verify",
    title: "توثيق الشهادات المعتمدة",
    description: "التحقق من صحة شهادات طلاب أكاديمية سند المعتمدة برمز QR",
    category: "الصفحات",
    href: "/verify",
    icon: CheckCircle2,
    keywords: ["توثيق", "شهادة", "شهادات", "verify", "اعتماد"],
  },

  // المسارات التعليمية المحدثة الستة
  {
    id: "track-programming",
    title: "مسار البرمجة والمنطق",
    description: "مدخل تطبيقي يبني التفكير المنطقي وأساسيات التكويد الإبداعي للأطفال (6–10 سنوات)",
    category: "المسارات",
    href: "/courses?category=البرمجة والمنطق",
    icon: Code2,
    keywords: ["scratch", "سكراتش", "منطق", "برمجة", "اطفال", "تكويد", "01"],
  },
  {
    id: "track-ai",
    title: "مسار الذكاء الاصطناعي",
    description: "استكشاف نماذج التعلم الآلي والذكاء التوليدي وتطبيقات الرؤية (12–18 سنة)",
    category: "المسارات",
    href: "/courses?category=الذكاء الاصطناعي",
    icon: Sparkles,
    keywords: ["ai", "ذكاء اصطناعي", "machine learning", "تعلم الي", "prompt", "بايثون", "02"],
  },
  {
    id: "track-robotics",
    title: "مسار الروبوتيكس",
    description: "دمج البرمجة بالإلكترونيات وبناء أنظمة روبوتية وحوسبة فيزيائية (8–16 سنة)",
    category: "المسارات",
    href: "/courses?category=الروبوتيكس",
    icon: Cpu,
    keywords: ["robotics", "روبوت", "روبوتات", "اردوينو", "arduino", "دوائر", "03"],
  },
  {
    id: "track-gamedev",
    title: "مسار تطوير الألعاب",
    description: "تصميم وبناء ألعاب 2D و3D مع ميكانيكا حركة وفيزياء تفاعلية (10–16 سنة)",
    category: "المسارات",
    href: "/courses?category=تطوير الألعاب",
    icon: Gamepad2,
    keywords: ["العاب", "تطوير العاب", "game", "gamedev", "godot", "2d", "3d", "04"],
  },
  {
    id: "track-data",
    title: "مسار تحليل البيانات",
    description: "تحويل الأرقام إلى رسوم بيانية وتنبؤات ذكية تدعم اتخاذ القرارات (13–18 سنة)",
    category: "المسارات",
    href: "/courses?category=تحليل البيانات",
    icon: BarChart3,
    keywords: ["بيانات", "تحليل بيانات", "data", "pandas", "رسوم بيانية", "05"],
  },
  {
    id: "track-entrepreneurship",
    title: "مسار ريادة الأعمال",
    description: "تحويل الأفكار التقنية إلى مشاريع ريادية قابلة للتطبيق ونماذج عمل ناجحة (12–18 سنة)",
    category: "المسارات",
    href: "/courses?category=ريادة الأعمال",
    icon: Briefcase,
    keywords: ["ريادة", "اعمال", "شركات ناشئة", "منتجات", "startup", "06"],
  },

  // المستويات الخمسة المعتمدة
  {
    id: "stage-foundation",
    title: "مرحلة المُرتاد — التأسيس (المستويات 01–07)",
    description: "يفكر بتسلسل ويصنع أول لعبة تفاعلية بدون شروط مسبقة (6–8 سنوات)",
    category: "المستويات",
    href: "/#levels",
    icon: Compass,
    keywords: ["مرتاد", "تأسيس", "01", "07", "مبتدئ", "بكتوبلوكس"],
  },
  {
    id: "stage-building",
    title: "مرحلة المُشيِّد — البناء (المستويات 08–14)",
    description: "يبني لعبة كاملة بنقاط ومستويات وتحكم متقدم وتفكير برمجي (9–11 سنة)",
    category: "المستويات",
    href: "/#levels",
    icon: Layers,
    keywords: ["مشيد", "بناء", "08", "14", "متغيرات"],
  },
  {
    id: "stage-evolution",
    title: "مرحلة المُستنبِط — التطور ★ (المستويات 15–21)",
    description: "يبتكر أداة تحل مشكلة حقيقية باستخدام الكود النصي وبايثون (12–14 سنة)",
    category: "المستويات",
    href: "/#levels",
    icon: Code2,
    keywords: ["مستنبط", "تطور", "15", "21", "بايثون", "python"],
  },
  {
    id: "stage-mastery",
    title: "مرحلة السَّنَد — الإحتراف (المستويات 22–28)",
    description: "يقود مشروع فريق ويرشد غيره في بيئة عمل تقنية حقيقية وينشر مشروع التخرج (15–17 سنة)",
    category: "المستويات",
    href: "/#levels",
    icon: Sparkles,
    keywords: ["سند", "احتراف", "22", "28", "تخرج", "ويب", "جافا"],
  },
  {
    id: "stage-custom",
    title: "مسار خاص 1:1 — تدريب فردي مكثف",
    description: "مسار مصمَّم ومفصل بالكامل حول هدف طفلك وسرعة تعلمه مع مدرب خاص مفرغ",
    category: "المستويات",
    href: "/#levels",
    icon: Users,
    keywords: ["خاص", "1:1", "فردي", "مخصص", "مكثف"],
  },

  // رحلة الطالب
  {
    id: "journey-child",
    title: "رحلة الطالب التعليمية (6 محطات متدرجة)",
    description: "من اكتشاف نقطة البداية واختيار المسار حتى إتقان الأهداف وبناء المشروع والانتقال بثقة",
    category: "رحلة الطالب",
    href: "/#journey",
    icon: MapPin,
    keywords: ["رحلة", "طالب", "محطات", "خطوات", "تقييم", "تدرج"],
  },

  // باقات الأسعار المعتمدة
  {
    id: "pricing-plans",
    title: "حاسبة باقات الاشتراك وتفاصيل الأسعار",
    description: "خطط تبدأ من 800 ج.م شهرياً مع خيارات ربع سنوية وسنوية وخصم الإخوة 10%",
    category: "الأسعار",
    href: "/pricing",
    icon: CreditCard,
    keywords: ["اسعار", "سعر", "باقة", "اشتراك", "تكلفة", "حاسبة", "شهري", "سنوي"],
  },
  {
    id: "pricing-family",
    title: "خصم الأخوة والعائلات (10%)",
    description: "خصم فوري 10% عند اشتراك أكثر من طفل مع متابعة فردية مستقلة لكل طالب",
    category: "الأسعار",
    href: "/pricing",
    icon: Users,
    keywords: ["خصم", "عائلات", "اخوة", "توفير", "family"],
  },
  {
    id: "pricing-trial",
    title: "جلسة تقييم وتجربة مجانية 100%",
    description: "احجز حصة تجريبية مجانية مدتها 45 دقيقة للتعرف على أسلوبنا وتحديد المستوى",
    category: "الأسعار",
    href: "/pricing",
    icon: Sparkles,
    keywords: ["تجربة", "مجاني", "حصة تجريبية", "تقييم", "trial"],
  },

  // الأسئلة الشائعة
  {
    id: "faq-admission",
    title: "ما الأعمار المناسبة للالتحاق بأكاديمية سند؟",
    description: "مناهجنا مصممة للأطفال والشباب من 6 إلى 18 سنة مع مسارات تمهيدية للمبتدئين",
    category: "الأسئلة الشائعة",
    href: "/#faq",
    icon: HelpCircle,
    keywords: ["عمر", "سن", "اعمار", "سنوات", "قبول"],
  },
  {
    id: "faq-experience",
    title: "هل يحتاج الطفل لخبرة سابقة في البرمجة؟",
    description: "لا، نبدأ من الصفر تماماً ونوفر مستويات تناسب كل مرحلة عمرية",
    category: "الأسئلة الشائعة",
    href: "/#faq",
    icon: HelpCircle,
    keywords: ["خبرة", "مبتدئ", "صفر", "بداية", "شروط"],
  },
  {
    id: "faq-placement",
    title: "كيف يتم تحديد مستوى طفلي؟",
    description: "من خلال تقييم مبدئي دقيق يساعدنا على تحديد المستوى والمسار الأنسب لقدراته",
    category: "الأسئلة الشائعة",
    href: "/#faq",
    icon: HelpCircle,
    keywords: ["تقييم", "تحديد مستوى", "امتحان", "مستوى"],
  },
  {
    id: "faq-credits",
    title: "ما هو رصيد الحصص المجمّدة في حال السفر أو الامتحانات؟",
    description: "نمنح كل طالب رصيد حصص مجمّدة رسمي يتراوح بين 4 إلى 7 حصص حسب باقة اشتراكه",
    category: "الأسئلة الشائعة",
    href: "/pricing",
    icon: HelpCircle,
    keywords: ["تجميد", "حصص مجمده", "سفر", "امتحانات", "غياب"],
  },
  {
    id: "faq-language",
    title: "هل التدريس باللغة العربية أم الإنجليزية؟",
    description: "الشرح باللغة العربية لضمان استيعاب المفاهيم، مع المصطلحات البرمجية بالإنجليزية",
    category: "الأسئلة الشائعة",
    href: "/#faq",
    icon: HelpCircle,
    keywords: ["لغة", "عربي", "انجليزي", "تدريس", "شرح"],
  },
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Normalize query for flexible Arabic search
  const cleanStr = (s: string) =>
    s
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/[\u064B-\u065F]/g, "");

  const filteredItems = useMemo(() => {
    const q = cleanStr(query.trim());
    if (!q) return SEARCH_ITEMS;

    return SEARCH_ITEMS.filter((item) => {
      const matchTitle = cleanStr(item.title).includes(q);
      const matchDesc = cleanStr(item.description).includes(q);
      const matchCat = cleanStr(item.category).includes(q);
      const matchKey = item.keywords?.some((k) => cleanStr(k).includes(q));
      return matchTitle || matchDesc || matchCat || matchKey;
    });
  }, [query]);

  const handleSelect = useCallback((href: string) => {
    onOpenChange(false);
    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");
      const elem = document.querySelector(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  }, [onOpenChange, router]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Scroll selected item into view smoothly
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter" && filteredItems.length > 0) {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          handleSelect(selected.href);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filteredItems, selectedIndex, handleSelect, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 max-sm:items-start max-sm:pt-16"
          dir="rtl"
        >
          {/* Backdrop — Clean transparent click-catcher without dark or blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-transparent"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative z-10 flex flex-col w-full max-w-lg rounded-2xl bg-surface border border-line p-1.5 overflow-hidden text-sm shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Command Search Input Bar */}
            <div className="flex h-11 items-center gap-2 px-3">
              <Search className="size-4 shrink-0 text-muted-foreground opacity-60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في المسارات، المستويات، الأسعار، أو الأسئلة..."
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="مسح البحث"
                >
                  <X className="size-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-line bg-secondary px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground select-none">
                Esc
              </kbd>
            </div>

            {/* Inner Content Card */}
            <div className="rounded-xl bg-background border border-line overflow-hidden">
              <div className="max-h-80 overflow-y-auto overscroll-contain p-1.5 space-y-1 [scrollbar-width:thin]">
                {filteredItems.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <p className="font-sans text-sm font-bold text-foreground">لم يتم العثور على نتائج تطابق &quot;{query}&quot;</p>
                    <p className="font-sans text-xs text-muted-foreground mt-1">
                      جرب البحث بكلمات أخرى مثل: مسارات، بايثون، ذكاء اصطناعي، أسعار، شهادات...
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;

                    // Show category header if this is first item or different from previous
                    const prevItem = filteredItems[idx - 1];
                    const showCategoryHeader = !query.trim() && (!prevItem || prevItem.category !== item.category);

                    return (
                      <div key={item.id}>
                        {showCategoryHeader && (
                          <div className="px-2.5 pt-2 pb-1 font-sans text-[11px] font-bold text-muted-foreground/80 select-none">
                            {item.category}
                          </div>
                        )}
                        <div
                          ref={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                          onClick={() => handleSelect(item.href)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`group relative flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150 select-none ${
                            isSelected
                              ? "bg-secondary text-foreground font-semibold"
                              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`size-4 shrink-0 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-sans text-sm font-medium text-foreground truncate">
                                {item.title}
                              </span>
                              {query.trim() && (
                                <span className="font-sans text-[10px] px-1.5 py-0.5 rounded border border-line bg-secondary text-muted-foreground shrink-0 font-medium">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className={`text-xs font-mono transition-opacity ${isSelected ? "opacity-100 text-primary" : "opacity-0 group-hover:opacity-60"}`}>
                            ↵
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted-foreground font-sans select-none">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/logos/Logo Black.png"
                  alt="سند"
                  width={45}
                  height={16}
                  unoptimized
                  className="block dark:hidden h-3.5 w-auto opacity-70"
                />
                <Image
                  src="/logos/Logo White.png"
                  alt="سند"
                  width={45}
                  height={16}
                  unoptimized
                  className="hidden dark:block h-3.5 w-auto opacity-70"
                />
                <span className="font-heading font-bold text-foreground/80">SANAD</span>
              </div>

              <div className="flex items-center gap-2.5 text-muted-foreground font-sans">
                <div className="flex items-center gap-1">
                  <span>انتقال</span>
                  <kbd className="inline-flex items-center justify-center rounded border border-line bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground">↵</kbd>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span>تنقل</span>
                  <kbd className="inline-flex items-center justify-center rounded border border-line bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground">↑↓</kbd>
                </div>
                <div className="flex items-center gap-1">
                  <span>إغلاق</span>
                  <kbd className="inline-flex items-center justify-center rounded border border-line bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-foreground">Esc</kbd>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
