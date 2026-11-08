"use client";

import { User, Phone, GraduationCap, CheckCircle2 } from "lucide-react";
import type { PaymentViewData } from "../types";

export function StudentPlanCard({ data }: { data: PaymentViewData }) {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-5 shadow-sm backdrop-blur-md">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg shadow-inner">
						{data.studentName ? data.studentName.charAt(0) : "ط"}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h2 className="text-base font-bold text-foreground sm:text-lg">{data.studentName}</h2>
							<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
								<CheckCircle2 className="h-3 w-3" />
								مجتاز المقابلة
							</span>
						</div>
						<p className="text-xs text-muted-foreground font-mono mt-0.5">رمز الطلب: #{data.code}</p>
					</div>
				</div>

				<div className="rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
					{data.clinic.name}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
				<div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-2.5">
					<User className="h-4 w-4 shrink-0 text-muted-foreground" />
					<div className="min-w-0">
						<span className="block text-[10px] text-muted-foreground">ولي الأمر</span>
						<span className="block truncate text-xs font-semibold text-foreground">{data.guardianName}</span>
					</div>
				</div>

				<div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-2.5">
					<Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
					<div className="min-w-0">
						<span className="block text-[10px] text-muted-foreground">رقم الهاتف</span>
						<span className="block truncate font-mono text-xs font-semibold text-foreground" dir="ltr">
							{data.guardianPhoneMasked}
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2.5 rounded-xl bg-muted/30 p-2.5">
					<GraduationCap className="h-4 w-4 shrink-0 text-muted-foreground" />
					<div className="min-w-0">
						<span className="block text-[10px] text-muted-foreground">المرحلة / الفصل</span>
						<span className="block truncate text-xs font-semibold text-foreground">
							{data.targetClass || "المستوى الأكاديمي المعتمد"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
