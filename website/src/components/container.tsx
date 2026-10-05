import { cn } from "@/lib/utils";

// حاوية موحّدة لكل الأقسام — تملأ عرض الشاشة بشكل مريح وتقلّل الفراغ على الجوانب
export default function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1540px] px-4 sm:px-8 lg:px-12 ",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
