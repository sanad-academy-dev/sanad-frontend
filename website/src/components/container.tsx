import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
  innerClassName?: string;
}

export default function Container({
  className,
  withBorder,
  innerClassName,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl border-x border-line",
        withBorder && "border-y border-line",
        className
      )}
      {...props}
    >
      {innerClassName ? (
        <div className={innerClassName}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
