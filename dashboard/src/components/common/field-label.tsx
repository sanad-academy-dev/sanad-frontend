import { IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function FieldLabel({
	children,
	required,
	info,
	action,
	className,
}: {
	children: ReactNode;
	required?: boolean;
	info?: string;
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
			{info ? (
				<TooltipProvider delayDuration={150}>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="inline-flex cursor-help">
								<IconInfoCircle className="size-3.5 text-muted-foreground/50 shrink-0 hover:text-muted-foreground transition-colors" />
							</span>
						</TooltipTrigger>
						<TooltipContent side="top">
							<p className="text-xs max-w-xs">{info}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			) : (
				required && <IconInfoCircle className="size-3.5 text-muted-foreground/40 shrink-0" />
			)}
			{action && <div className="ms-auto">{action}</div>}
		</div>
	);
}
