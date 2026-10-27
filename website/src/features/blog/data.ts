import type { BlogPost } from "./types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "programming-second-language",
    title: "لماذا أصبحت البرمجة اللغة الثانية التي يحتاجها كل طفل في عصر الذكاء الاصطناعي؟",
    description: "لم تعد البرمجة مهارة مقتصرة على مهندسي المستقبل، بل أداة تفكير تأسيسية تبني عقلية حل المشكلات، والمنطق التحليلي، والمرونة الفكرية منذ الصغر.",
    image: "/blog/chanhdai-brand.webp",
    createdAt: "2026-03-01",
    new: true,
    category: "تعليم البرمجة",
    author: "فريق سند الأكاديمي",
    readTime: "4 دقائق",
  },
  {
    slug: "python-vs-scratch",
    title: "بايثون أم سكراتش: أيهما أنسب كنقطة انطلاق حقيقية لطفلك؟",
    description: "مقارنة عملية وشاملة تساعد أولياء الأمور على اختيار المسار التعليمي الأنسب بناءً على عمر الطفل، قدراته الاستيعابية، واهتماماته الفعلية.",
    image: "/blog/react-wheel-picker-joins-vercel-open-source-program.webp",
    createdAt: "2026-02-22",
    category: "مسارات التعلم",
    author: "م. كريم عادل",
    readTime: "5 دقائق",
  },
  {
    slug: "ai-for-kids-guide",
    title: "الذكاء الاصطناعي للأطفال: كيف نحوّل الاستهلاك السلبي إلى إبداع وبناء؟",
    description: "كيف تفهم الأجيال الصاعدة آلية عمل خوارزميات الذكاء الاصطناعي وماهية النماذج اللغوية، بدلاً من مجرد استقبال المحتوى واستهلاكه دون وعي.",
    image: "/blog/orcdev-discovered-the-wildest-shadcn-component-libraries-ever.webp",
    createdAt: "2026-02-14",
    category: "الذكاء الاصطناعي",
    author: "د. سارة المنشاوي",
    readTime: "6 دقائق",
  },
  {
    slug: "screen-time-to-productive-time",
    title: "تحويل وقت الشاشات: من إدمان الألعاب إلى شغف برمجتها وصناعتها",
    description: "خطوات نفسية وتربوية مجربة لتحويل شغف الأطفال بألعاب الفيديو (Roblox و Minecraft) إلى شغف تصميم العوالم وفهم كود المحركات البرمجية.",
    image: "/blog/grateful-for-the-feedback-on-my-portfolio-website.webp",
    createdAt: "2026-01-28",
    category: "تربية وتقنية",
    author: "أ. منى زهران",
    readTime: "4 دقائق",
  },
  {
    slug: "student-success-first-project",
    title: "قصة نجاح: كيف بنى عمر (11 سنة) تطبيقه التفاعلي الأول خلال 3 أشهر في سند؟",
    description: "من مجرد فضول أولي إلى مشروع متكامل معتمد في هاكاثون الأكاديمية، والدروس المستفادة في بناء شغف الاستمرار والإنجاز لدى الطلاب.",
    image: "/blog/250804-manu-arora-reviewed-my-portfolio-website.webp",
    createdAt: "2026-01-15",
    updated: true,
    category: "قصص نجاح",
    author: "سند للإعلام",
    readTime: "3 دقائق",
  },
  {
    slug: "parents-tracking-guide",
    title: "دليل ولي الأمر: كيف تتابع تقدم ابنك وتطوره البرمجي دون خلفية تقنية؟",
    description: "ما هي الأسئلة التي يجب أن تسألها لطفلك بعد كل جلسة كود؟ وكيف تقيس مخرجات التعلم والمشاريع التطبيقية بدقة وموضوعية؟",
    image: "/blog/uptime-kuma.webp",
    createdAt: "2026-01-05",
    category: "دليل ولي الأمر",
    author: "فريق المتابعة الأكاديمية",
    readTime: "5 دقائق",
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
