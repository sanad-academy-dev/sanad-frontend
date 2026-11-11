"use client";

import { User, Phone, GraduationCap, CheckCircle2 } from "lucide-react";
import type { PaymentViewData } from "../types";

export function StudentPlanCard({ data }: { data: PaymentViewData }) {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-5">
			<div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
				<div className="flex items-center gap-3 min-w-0 flex-1">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg">
						{data.studentName ? data.studentName.charAt(0) : "ط"}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="text-base font-bold text-foreground sm:text-lg truncate">
								{data.studentName}
							</h2>
							<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
								<CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
								<span>مجتاز المقابلة</span>
							</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span>رمز الطلب: </span>
							<bdi dir="ltr" className="font-mono font-semibold text-foreground">
								#{data.code}
							</bdi>
						</p>
					</div>
				</div>

				<div className="shrink-0 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
					{data.clinic.name}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-2.5 pt-4 sm:grid-cols-3 sm:gap-3">
				<div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-3 min-w-0">
					<User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div className="min-w-0 flex-1">
						<span className="block text-[11px] text-muted-foreground">ولي الأمر</span>
						<span className="block truncate text-xs font-semibold text-foreground mt-0.5">
							{data.guardianName}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-3 min-w-0">
					<Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div className="min-w-0 flex-1">
						<span className="block text-[11px] text-muted-foreground">رقم الهاتف</span>
						<bdi dir="ltr" className="block truncate font-mono text-xs font-semibold text-foreground mt-0.5 text-right">
							{data.guardianPhoneMasked}
						</bdi>
					</div>
				</div>

				<div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-3 min-w-0">
					<GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<div className="min-w-0 flex-1">
						<span className="block text-[11px] text-muted-foreground">المرحلة / الفصل</span>
						<span className="block truncate text-xs font-semibold text-foreground mt-0.5">
							{data.targetClass || "المستوى الأكاديمي المعتمد"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
