import type React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
	subtitle?: string;
	className?: string;
}

/**
 * بطاقة إحصاء علوية قياسية معتمدة في منصة سند (كالأعمار، الأوزان، الحضور، الإشغال)
 */
export function StatCard({ icon, label, value, subtitle, className }: StatCardProps) {
	return (
		<div className={cn("flex flex-col gap-2 rounded-lg border p-4 bg-card", className)}>
			<div className="flex items-center justify-between gap-2">
				<p className="text-xs text-muted-foreground">{label}</p>
				<span className="text-muted-foreground shrink-0">{icon}</span>
			</div>
			<div className="flex items-baseline gap-1.5">
				<p className="font-bold text-2xl tabular-nums text-foreground">{value}</p>
				{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
			</div>
		</div>
	);
}

export interface InfoFieldProps {
	label: string;
	icon?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

/**
 * حقل تفصيلي لعرض البيانات الأساسية والحيوية داخل أقسام الصفحة
 */
export function InfoField({ label, icon, children, className }: InfoFieldProps) {
	return (
		<div className={cn("flex flex-col gap-1.5 rounded-lg border p-3 bg-card", className)}>
			<div className="flex items-center gap-1.5 text-muted-foreground">
				{icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
				<p className="text-xs">{label}</p>
			</div>
			<div className="text-sm font-medium text-foreground">{children}</div>
		</div>
	);
}
