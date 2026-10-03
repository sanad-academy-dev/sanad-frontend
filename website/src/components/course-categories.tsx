import Container from "@/components/container";

const CAMPS = [
  { id: "01", title: "Coding Camp", desc: "من الفكرة إلى أول برنامج" },
  { id: "02", title: "AI Camp", desc: "اصنع تجربة ذكية" },
  { id: "03", title: "Robotics Camp", desc: "برمج شيئًا يتحرك" },
  { id: "04", title: "Future Tech Camp", desc: "اكتشف تقنيات المستقبل" },
];

export default function CourseCategories() {
  return (
    <section className="w-full bg-card">
      <Container className="flex flex-col gap-8 border-t border-border py-16">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-3 text-right">
            <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              تجربة قصيرة بهدف واضح
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                معسكرات سَنَد
              </h2>
              <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                قريباً
              </span>
            </div>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              برنامج مكثّف يركّز على مهارة محددة وينتهي بمشروع، مناسب للإجازات
              واستكشاف مجال جديد.
            </p>
          </div>
          <a
            href="https://cb58e96a-80e5-44e0-ba3c-3eb7cca9cc3d-figmacachedpreview.figma.site/#assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            اعرف المعسكر المناسب
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAMPS.map((camp) => (
            <a
              key={camp.id}
              href="#"
              className="group flex items-center gap-4 rounded border border-border bg-muted/30 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-accent/40 hover:shadow-sm"
            >
              {/* Icon / Number (Right in RTL) */}
              <div className="flex size-14 shrink-0 items-center justify-center rounded bg-secondary text-xl font-black text-foreground/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary/20 group-hover:text-primary">
                {camp.id}
              </div>
              {/* Text (Left in RTL) */}
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
                <span className="truncate text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {camp.title}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {camp.desc}
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
