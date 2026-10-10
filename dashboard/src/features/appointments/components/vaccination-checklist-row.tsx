import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AdministerVaccinationSheet } from "@/features/services/vaccinations/components/administer-vaccination-sheet";
import { VaccinationStatusBadge } from "@/features/services/vaccinations/components/vaccination-status-badge";
import { usePatientVaccinationStatus } from "@/features/services/vaccinations/hooks/use-vaccinations";
import { cn } from "@/lib/utils";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/**
 * بند «سجل التطعيمات» في بروتوكول الفحص — يستوعب الشرطة القديمة بدل أن يجاورها.
 *
 * كان البند مربّع اختيار حرًّا: يؤشّره المدرّب ولا يُسجَّل شيء — لا منتج، ولا رقم
 * دفعة، ولا جرعة قادمة. صار يعرض حالة الطفل الحقيقية المحسوبة من سجلّه، ويُؤشَّر
 * بفعل مراجعة موثّق (`ClinicalExam.vaccinationReviewedAt`) لا بإقرار مجرّد.
 * الحقل المنطقي `checklistVaccinations` بقي لأن حساب نسبة الإنجاز يعتمد على تجانس
 * المصفوفة، لكنه صار انعكاسًا للمراجعة لا مصدرًا مستقلًّا لها.
 */
export function VaccinationChecklistRow({
	patientId,
	checked,
	onReviewed,
	disabled,
}: {
	patientId?: string | null;
	checked: boolean;
	/** يُستدعى بالقيمة الجديدة — يكتب/يمسح لحظة المراجعة ومعها البند المنطقي */
	onReviewed: (reviewed: boolean) => void;
	disabled?: boolean;
}) {
	const [administerOpen, setAdministerOpen] = useState(false);
	const { status, isLoading } = usePatientVaccinationStatus(patientId ?? undefined);

	const overdue = status?.projections.filter(
		(p) => p.status === "OVERDUE" || p.status === "NOT_STARTED",
	);

	return (
		<div className="flex flex-col gap-2 rounded-[4px] border p-3">
			<div className="flex items-start justify-between gap-3">
				<span
					className={cn(
						"text-sm leading-snug",
						checked && "text-muted-foreground line-through",
					)}
				>
					سجل التطعيمات
				</span>
				<span className="shrink-0 rounded-sm bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive">
					إلزامي
				</span>
			</div>

			{isLoading ? (
				<p className="text-xs text-muted-foreground">جارٍ قراءة سجل التطعيمات...</p>
			) : !status?.protocol ? (
				<p className="text-xs text-muted-foreground">
					لا بروتوكول تطعيم منطبق على نوع هذا الطفل.
				</p>
			) : (
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center gap-2">
						<VaccinationStatusBadge status={status.status} />
						{status.nextDueAt && (
							<span className="text-xs text-muted-foreground">
								الجرعة القادمة {dateFmt.format(new Date(status.nextDueAt))}
							</span>
						)}
					</div>

					{overdue && overdue.length > 0 && (
						<p className="text-xs text-destructive">
							متأخّر عن: {overdue.map((p) => p.antigenCode).join("، ")}
						</p>
					)}

					{!status.birthDate && (
						<p className="text-xs text-muted-foreground">
							تاريخ الميلاد غير مسجَّل — لا يمكن جدولة الجرعات المرتبطة بالعمر.
						</p>
					)}

					<p className="text-xs text-muted-foreground tabular-nums">
						{status.records.filter((r) => !r.isVoided).length} جرعة مسجَّلة
					</p>
				</div>
			)}

			<div className="flex items-center gap-2">
				{/* «مراجَع» هو ما يمنح البند قيمته — لا مربّع اختيار حرّ بعد اليوم */}
				<Button
					type="button"
					size="sm"
					variant={checked ? "secondary" : "outline"}
					disabled={disabled || !patientId}
					onClick={() => onReviewed(!checked)}
				>
					{checked ? "روجع" : "تأكيد المراجعة"}
				</Button>

				<Button
					type="button"
					size="sm"
					variant="ghost"
					disabled={disabled || !patientId}
					onClick={() => setAdministerOpen(true)}
				>
					سجّل جرعة
				</Button>
			</div>

			{patientId && (
				<AdministerVaccinationSheet
					open={administerOpen}
					onOpenChange={setAdministerOpen}
					patientId={patientId}
					onSaved={() => onReviewed(true)}
				/>
			)}
		</div>
	);
}
