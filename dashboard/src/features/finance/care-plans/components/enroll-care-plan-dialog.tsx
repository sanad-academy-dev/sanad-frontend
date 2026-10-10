import { IconCalendar, IconChevronLeft } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCarePlan } from "@/features/finance/care-plans/hooks/use-care-plan";
import { useEnrollmentMutations } from "@/features/finance/care-plans/hooks/use-enrollment-mutations";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

// يحوّل فاصل (يوم/أسبوع) إلى أيام — مطابق للخادم
function intervalToDays(unit: "DAY" | "WEEK", value: number) {
	return unit === "WEEK" ? value * 7 : value;
}

export function EnrollCarePlanDialog({
	plan,
	onOpenChange,
}: {
	plan: CarePlanListItemResponse | null;
	onOpenChange: (open: boolean) => void;
}) {
	const open = !!plan;
	const [patientId, setPatientId] = useState<string | undefined>(undefined);
	const [startedAt, setStartedAt] = useState<string>("");
	const [notes, setNotes] = useState("");
	const [error, setError] = useState<string | null>(null);

	const { patients, isLoading: patientsLoading } = usePatients();
	const { plan: planDetail } = useCarePlan(plan?.id);
	const { enroll, isEnrolling } = useEnrollmentMutations();

	useEffect(() => {
		if (!open) return;
		setPatientId(undefined);
		setStartedAt(new Date().toISOString().slice(0, 10));
		setNotes("");
		setError(null);
	}, [open]);

	// جدول الزيارات المتوقّع — من فواصل الخطة التراكمية بدءًا من تاريخ البدء
	const schedule = useMemo(() => {
		if (!planDetail || !startedAt) return [];
		const base = new Date(startedAt);
		let cumulative = 0;
		return planDetail.visits.map((v, idx) => {
			const d = new Date(base);
			d.setDate(d.getDate() + cumulative);
			cumulative += intervalToDays(v.intervalUnit, v.intervalValue);
			return {
				id: v.id,
				label: `الزيارة ${idx + 1} — ${v.service?.name ?? v.consultationType?.name ?? ""}`,
				date: d.toLocaleDateString("ar-SA"),
			};
		});
	}, [planDetail, startedAt]);

	const handleSubmit = async () => {
		if (!plan) return;
		if (!patientId) {
			setError("اختر الطفل أولاً");
			return;
		}
		try {
			await enroll(plan.id, {
				patientId,
				startedAt: startedAt ? new Date(startedAt).toISOString() : undefined,
				notes: notes.trim() ? notes : null,
			});
			onOpenChange(false);
		} catch {
			// toast handled by hook
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="gap-0 p-0 sm:max-w-lg"
			>
				<DialogHeader className="border-b px-4 py-2">
					<DialogTitle className="flex items-center gap-1.5 text-sm font-medium">
						<span className="text-primary">استخدام الخطة</span>
						<IconChevronLeft className="size-3.5 text-muted-foreground" />
						<span className="text-foreground">{plan?.name}</span>
						{plan?.code && (
							<span className="rounded-md border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
								{plan.code}
							</span>
						)}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 p-4">
					<Field data-invalid={!!error}>
						<Label className="justify-start">الطفل المستفيد</Label>
						<Select
							value={patientId}
							onValueChange={(v) => {
								setPatientId(v);
								setError(null);
							}}
							disabled={patientsLoading}
							dir="rtl"
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="اختر الطفل..." />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{patients.map((p) => (
									<SelectItem
										key={p.id}
										value={p.id}
										className="text-right"
									>
										{p.name}
										{p.owner ? ` — ${p.owner.name}` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{error && <FieldError errors={[{ message: error }]} />}
					</Field>

					<Field>
						<Label className="justify-start">تاريخ بدء الخطة</Label>
						<Input
							type="date"
							value={startedAt}
							onChange={(e) => setStartedAt(e.target.value)}
						/>
					</Field>

					{schedule.length > 0 && (
						<div className="space-y-2 rounded-lg border bg-muted/40 p-3">
							<p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
								<IconCalendar className="size-3.5" />
								جدول الزيارات المتوقّع
							</p>
							<ul className="space-y-1">
								{schedule.map((s) => (
									<li
										key={s.id}
										className="flex items-center justify-between text-[11px] text-muted-foreground"
									>
										<span>{s.label}</span>
										<span className="tabular-nums">{s.date}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<Field>
						<Label className="justify-start">ملاحظات (اختياري)</Label>
						<Textarea
							className="min-h-16"
							placeholder="أضف ملاحظة على الاشتراك..."
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</Field>
				</div>

				<div className="flex items-center justify-end gap-3 border-t px-4 py-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isEnrolling}
					>
						إلغاء
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isEnrolling || !patientId}
					>
						تأكيد الاشتراك
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
