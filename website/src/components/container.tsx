import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  innerClassName?: string;
}

// حاوية موحّدة لكل الأقسام — تملأ عرض الشاشة بشكل مريح وتقلّل الفراغ على الجوانب
export default function Container({
  className,
  withBorder = false,
  innerClassName,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1340px] px-4 sm:px-8 lg:px-12",
        !withBorder && "py-16 md:py-24",
        className,
      )}
      {...props}
    >
      {withBorder ? (
        <div className={cn("w-full border-t border-border py-16 md:py-24 flex flex-col gap-8", innerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
