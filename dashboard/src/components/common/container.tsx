import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ContainerRow({
	title,
	badge,
	foregroundTitle,
	subtitle,
	icon,
	action,
	className,
	actionClassName,
}: {
	title: string;
	badge?: ReactNode;
	foregroundTitle?: string;
	subtitle?: string;
	icon?: ReactNode;
	action: ReactNode;
	actionClassName?: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<div className="flex items-center gap-2">
				{icon && (
					<div className="flex size-7 items-center justify-center rounded-[4px] bg-[#F5F5F5]">
						{icon}
					</div>
				)}

				<div className="space-y-0.5">
					<p className="flex items-center gap-1">
						<span className="font-bold text-xs">{title}</span>
						{badge && badge}
						{foregroundTitle && (
							<span className="text-[#7C7C7C] text-xs font-normal">{foregroundTitle}</span>
						)}
					</p>
					{subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
				</div>
			</div>

			<div className={cn("shrink-0", actionClassName)}>{action}</div>
		</div>
	);
}

export function Container({
	title,
	subtitle,
	description,
	action,
	children,
}: {
	title?: string;
	subtitle?: string;
	description?: string;
	action?: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex flex-col items-start gap-1.5">
					{title && <p className="text-lg font-bold text-foreground">{title}</p>}
					{description && <p className="text-[10px] text-muted-foreground">{description}</p>}
				</div>

				{subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
				{action && <div className="shrink-0">{action}</div>}
			</div>

			<div
				className={cn(
					"px-3 py-2 border rounded-[4px] flex flex-col gap-2 *:py-2 *:border-b *:border-border/70 *:last:border-b-0",
					"*:flex *:w-full *:items-center *:justify-between",
				)}
			>
				{children}
			</div>
		</div>
	);
}
