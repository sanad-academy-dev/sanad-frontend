import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FieldLabel({
	children,
	required,
	action,
	className,
}: {
	children: ReactNode;
	required?: boolean;
	action?: ReactNode;
	/** للمحاذاة داخل حاويات ذات اتجاه مختلف (مثل أجسام الحوارات المضبوطة LTR) */
	className?: string;
}) {
	return (
		<div className={cn("flex items-center gap-1.5", className)}>
			{children}
			{required && (
				<span className="text-xs text-destructive bg-destructive/10 rounded px-1 py-0.5 font-medium leading-none">
					مطلوب
				</span>
			)}
			{required && <IconInfoCircle className="size-3.5 text-muted-foreground/40 shrink-0" />}
			{action && <div className="ms-auto">{action}</div>}
		</div>
	);
}
