import { cn } from "@/lib/utils";

/**
 * Chanhdai signature CAD Blueprint Separator (`stripe-divider`).
 * Renders a full-bleed diagonal-hatching technical band (32px / h-8)
 * bounded by 1px CAD coordinate lines and framed by the central column's border-x.
 */
export function Separator({
  className,
  withBorder = true,
}: {
  className?: string;
  withBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        "stripe-divider h-8 w-full max-w-5xl mx-auto",
        withBorder && "border-x border-line",
        className
      )}
      aria-hidden="true"
    />
  );
}
