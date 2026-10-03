import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Calendar, Star } from "lucide-react";
import { JoinButton } from "@/components/join-button";

// بطاقة دورة بصورة علوية — مشتركة بين "مسارات التعلم" وصفحة الدورات
export type PathCardData = {
  title: string;
  provider: "framer" | "meta";
  image: string;
  reviews: string;
  rating: string;
  level: string;
  lectures: string;
  hours: string;
};

function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`size-[2px] shrink-0 rounded-full ${className ?? "bg-background0"}`}
    />
  );
}

export default function PathCard({ path }: { path: PathCardData }) {
  return (
    <article className="group relative flex flex-col justify-between gap-4 rounded border border-border bg-muted/30 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-accent/20 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* الصورة العلوية */}
      <div className="relative h-[160px] w-full overflow-hidden rounded bg-muted">
        <Image
          src={path.image}
          alt={path.title}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* زر الحفظ */}
        <button
          type="button"
          aria-label="حفظ الدورة"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/40 primarybackdrop-blur-md transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
        >
          <Bookmark className="size-4" />
        </button>

        {/* لوجو المزود */}
        <div className="absolute bottom-3 left-3 flex h-7 items-center justify-center rounded bg-black/60 px-2.5 backdrop-blur-md border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/${path.provider}.svg`}
            alt={path.provider}
            width={path.provider === "meta" ? 40 : 45}
            height={14}
            className="h-3 w-auto brightness-0 invert"
          />
        </div>
      </div>

      {/* المعلومات */}
      <div className="flex flex-col gap-2.5 text-right px-1">
        <h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
          {path.title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5">
            <span className="text-sm font-bold text-yellow-500 pt-0.5">
              {path.rating}
            </span>
            <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
          </div>
          <span className="text-sm text-muted-foreground pt-0.5">
            ( {path.reviews} )
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1">
          <span className="text-foreground/80">{path.level}</span>
          <Dot className="bg-border" />
          <span className="text-foreground/80">{path.lectures}</span>
          <Dot className="bg-border" />
          <span className="text-foreground/80">{path.hours}</span>
        </div>
      </div>

      {/* الأزرار */}
      <div className="mt-2 flex items-center gap-3">
        <JoinButton
          className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          قيم ابنك
          <Calendar className="size-4" />
        </JoinButton>
        <Link
          href="/courses/details"
          className="flex flex-1 items-center justify-center gap-2 rounded border border-border bg-secondary/50 px-4 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
        >
          التفاصيل
          <ArrowLeft className="size-4" />
        </Link>
      </div>
    </article>
  );
}
