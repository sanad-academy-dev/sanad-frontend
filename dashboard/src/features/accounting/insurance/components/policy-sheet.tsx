import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/ui/field";
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
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useInsuranceProducts,
	useSavePatientPolicy,
} from "@/features/accounting/insurance/hooks/use-insurance";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import type { PatientPolicyResponse } from "@/server/accounting/insurance/patient-policy.type";

/**
 * [MI-P3] Policy create/edit sheet (MI §8.3). The status picker offers the MANUAL states
 * only — «منتهية» derives from the end date and cannot be set by hand (AR-M4). The
 * patient is fixed after creation (moving a policy corrupts its trail); BR-I8.3.1's
 * one-ACTIVE-per-patient refusal comes back from the server as the Arabic 400.
 */

type Draft = {
	patientId: string;
	productId: string;
	policyNumber: string;
	policyStart: string;
	policyEnd: string;
	status: "ACTIVE" | "SUSPENDED" | "CANCELLED";
	notes: string;
};

const EMPTY: Draft = {
	patientId: "",
	productId: "",
	policyNumber: "",
	policyStart: "",
	policyEnd: "",
	status: "ACTIVE",
	notes: "",
};

const isoDay = (value: Date | string) => new Date(value).toISOString().slice(0, 10);

const STATUS_OPTIONS = [
	{ value: "ACTIVE", label: "سارية" },
	{ value: "SUSPENDED", label: "معلّقة" },
	{ value: "CANCELLED", label: "ملغاة" },
] as const;

export const PolicySheet = ({
	open,
	onOpenChange,
	policy,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	policy: PatientPolicyResponse | null;
}) => {
	const { savePolicy, isPending } = useSavePatientPolicy();
	const { products } = useInsuranceProducts();
	const { patients } = usePatients();
	const [draft, setDraft] = useState<Draft>(EMPTY);

	useEffect(() => {
		if (!open) return;
		setDraft(
			policy
				? {
						patientId: policy.patientId,
						productId: policy.productId,
						policyNumber: policy.policyNumber,
						policyStart: isoDay(policy.policyStart),
						policyEnd: isoDay(policy.policyEnd),
						// الحالة المشتقّة EXPIRED تُعرض كسارية هنا: المخزون يدوي والاشتقاق للقراءة
						status: policy.status === "EXPIRED" ? "ACTIVE" : policy.status,
						notes: policy.notes ?? "",
					}
				: EMPTY,
		);
	}, [open, policy]);

	const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

	const submit = async () => {
		if (!draft.patientId || !draft.productId || !draft.policyNumber.trim()) {
			toast.error("الطفل والمنتج ورقم البوليصة مطلوبة");
			return;
		}
		if (!draft.policyStart || !draft.policyEnd) {
			toast.error("نافذة البوليصة (البداية والنهاية) مطلوبة");
			return;
		}
		if (draft.policyEnd < draft.policyStart) {
			toast.error("نهاية البوليصة يجب ألا تسبق بدايتها");
			return;
		}
		await savePolicy({
			id: policy?.id,
			policy: {
				patientId: draft.patientId,
				productId: draft.productId,
				policyNumber: draft.policyNumber.trim(),
				policyStart: draft.policyStart,
				policyEnd: draft.policyEnd,
				status: draft.status,
				notes: draft.notes.trim() || null,
			},
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title={policy ? `تعديل بوليصة «${policy.patient.name}»` : "بوليصة جديدة"}
			description="بوليصة نشطة واحدة لكل طفل — التغطية تسري داخل النافذة وحالة «سارية» فقط (BR-I8.3.2)"
			onSubmit={(event) => {
				event.preventDefault();
				void submit();
			}}
			isSaving={isPending}
			submitLabel={policy ? "حفظ" : "إنشاء"}
		>
			<div className="flex flex-col gap-4 p-4">
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<Label>الطفل</Label>
						<Select
							value={draft.patientId}
							onValueChange={(value) => set({ patientId: value })}
							disabled={!!policy}
						>
							<SelectTrigger dir="rtl">
								<SelectValue placeholder="اختر الطفل" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{patients.map((row) => (
									<SelectItem
										key={row.id}
										value={row.id}
									>
										{row.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Label>منتج التأمين</Label>
						<Select
							value={draft.productId}
							onValueChange={(value) => set({ productId: value })}
						>
							<SelectTrigger dir="rtl">
								<SelectValue placeholder="اختر المنتج" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{products
									.filter((row) => row.active || row.id === draft.productId)
									.map((row) => (
										<SelectItem
											key={row.id}
											value={row.id}
										>
											{row.name} — {row.insurer.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Label htmlFor="pp-number">رقم البوليصة (معرّف الشركة)</Label>
						<Input
							id="pp-number"
							dir="ltr"
							value={draft.policyNumber}
							onChange={(e) => set({ policyNumber: e.target.value })}
						/>
					</Field>
					<Field>
						<Label>الحالة</Label>
						<Select
							value={draft.status}
							onValueChange={(value) =>
								set({ status: value as "ACTIVE" | "SUSPENDED" | "CANCELLED" })
							}
						>
							<SelectTrigger dir="rtl">
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{STATUS_OPTIONS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<Field>
						<Label htmlFor="pp-start">بداية البوليصة</Label>
						<Input
							id="pp-start"
							type="date"
							value={draft.policyStart}
							onChange={(e) => set({ policyStart: e.target.value })}
						/>
					</Field>
					<Field>
						<Label htmlFor="pp-end">نهاية البوليصة</Label>
						<Input
							id="pp-end"
							type="date"
							value={draft.policyEnd}
							onChange={(e) => set({ policyEnd: e.target.value })}
						/>
					</Field>
				</div>
				<Field>
					<Label htmlFor="pp-notes">ملاحظات</Label>
					<Textarea
						id="pp-notes"
						value={draft.notes}
						onChange={(e) => set({ notes: e.target.value })}
					/>
				</Field>
			</div>
		</AccountingFormSheet>
	);
};
