// كومبوننتس العرض المشتركة لشاشات الرواتب — تُعرَّف مرة وتستهلكها الخطوات.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { type PayrollRunStatus, RUN_STATUS_LABEL } from "@sanad/contracts/runtime/server/payroll/payroll.type";

// ─── كرت إحصائية موحّد ────────────────────────────────────────

export function PayrollStat({
	icon,
	label,
	value,
	hint,
	accent,
}: {
	icon?: ReactNode;
	label: string;
	value: string;
	hint?: string;
	accent?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 rounded-lg border p-3.5",
				accent ? "border-primary/30 bg-primary/[0.06]" : "border-border bg-card",
			)}
		>
			{icon && (
				<span
					className={cn(
						"flex size-8 items-center justify-center rounded-full",
						accent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
					)}
				>
					{icon}
				</span>
			)}
			<span className="text-xs text-muted-foreground">{label}</span>
			<span
				className={cn(
					"font-heading text-lg font-bold tabular-nums",
					accent ? "text-primary" : "text-foreground",
				)}
			>
				{value}
			</span>
			{hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
		</div>
	);
}

// ─── شارة حالة المسير ─────────────────────────────────────────

// ألوان دلالية: نشط primary · مسودة محايد · مصروف نجاح · ملغى destructive
const STATUS_TONE: Record<PayrollRunStatus, string> = {
	DRAFT: "bg-muted text-muted-foreground [--dot:var(--color-muted-foreground)]",
	CALCULATED: "bg-primary/10 text-primary [--dot:var(--color-primary)]",
	PENDING_APPROVAL: "bg-primary/10 text-primary [--dot:var(--color-primary)]",
	APPROVED: "bg-emerald-500/10 text-emerald-700 [--dot:var(--color-emerald-600)]",
	PAID: "bg-emerald-500/10 text-emerald-700 [--dot:var(--color-emerald-600)]",
	CANCELLED: "bg-destructive/10 text-destructive [--dot:var(--color-destructive)]",
};

export function RunStatusPill({ status }: { status: PayrollRunStatus }) {
	return (
		<span
			className={cn(
				"inline-flex h-6 items-center gap-1.5 rounded px-2 text-[11px] font-medium",
				STATUS_TONE[status],
			)}
		>
			<span className="size-1.5 rounded-full bg-[var(--dot)]" />
			{RUN_STATUS_LABEL[status]}
		</span>
	);
}

// ─── رأس قسم داخل الخطوة ──────────────────────────────────────

export function SectionHeader({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<div className="flex flex-wrap items-start justify-between gap-3">
			<div className="flex flex-col gap-0.5">
				<h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
				{description && <p className="text-xs text-muted-foreground">{description}</p>}
			</div>
			{action}
		</div>
	);
}

// ─── جدول موحّد ───────────────────────────────────────────────

export function DataTable({
	headers,
	children,
	minWidth,
}: {
	headers: string[];
	children: ReactNode;
	minWidth?: string;
}) {
	return (
		<div className="overflow-x-auto rounded-lg border border-border">
			<table
				className="w-full"
				style={minWidth ? { minWidth } : undefined}
			>
				<thead className="bg-muted/60">
					<tr>
						{headers.map((h) => (
							<th
								key={h}
								className="px-3 py-2.5 text-start text-[11px] font-medium text-muted-foreground"
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{children}</tbody>
			</table>
		</div>
	);
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
	return (
		<tr>
			<td
				colSpan={colSpan}
				className="py-10 text-center text-xs text-muted-foreground"
			>
				{message}
			</td>
		</tr>
	);
}

// ─── هيكل تحميل بنفس بنية الشاشة ──────────────────────────────

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
	return (
		<div className="overflow-hidden rounded-lg border border-border">
			<div className="flex gap-3 border-b border-border bg-muted/60 px-3 py-2.5">
				{Array.from({ length: cols }, (_, i) => (
					<div
						key={`h-${i}`}
						className="h-3 flex-1 animate-pulse rounded bg-muted-foreground/20"
					/>
				))}
			</div>
			{Array.from({ length: rows }, (_, r) => (
				<div
					key={`r-${r}`}
					className="flex items-center gap-3 border-b border-border px-3 py-3 last:border-0"
				>
					{Array.from({ length: cols }, (_, c) => (
						<div
							key={`c-${c}`}
							className="h-3.5 flex-1 animate-pulse rounded bg-muted"
						/>
					))}
				</div>
			))}
		</div>
	);
}
