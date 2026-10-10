import { useEffect, useMemo, useState } from "react";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useEnrollMembership,
	useMembershipPlans,
} from "@/features/accounting/memberships/hooks/use-memberships";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { useOwners } from "@/features/services/owners/hooks/use-owners";

/**
 * [MI-P1] Enroll sheet (FR-M5.1) — owner + sellable plan + a fee preview that says what
 * the FIRST invoice will carry (fee + one-time enrollment fee) so the counter can quote
 * before committing. Submit routes the operator to payment via the success toast.
 */

export const EnrollSheet = ({
	open,
	onOpenChange,
	defaultOwnerId,
	defaultPlanId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/**
	 * [CRM-P2] §7.3 — the CRM win flow deep-links here with owner + plan chosen. PREFILL
	 * ONLY: the sheet is still submitted by hand, because enrolling on navigation would turn
	 * a link into a financial action, and MI keeps its own transaction and refusals.
	 */
	defaultOwnerId?: string;
	defaultPlanId?: string;
}) => {
	const { owners } = useOwners();
	const { plans } = useMembershipPlans("ACTIVE");
	const { enroll, isPending } = useEnrollMembership();
	const [ownerId, setOwnerId] = useState("");
	const [planId, setPlanId] = useState("");

	// applied on the open transition so a later edit by the operator is never overwritten
	useEffect(() => {
		if (!open) return;
		if (defaultOwnerId) setOwnerId(defaultOwnerId);
		if (defaultPlanId) setPlanId(defaultPlanId);
	}, [open, defaultOwnerId, defaultPlanId]);

	const plan = useMemo(() => plans.find((p) => p.id === planId) ?? null, [plans, planId]);
	const firstInvoiceTotal = plan
		? (Number(plan.fee) + Number(plan.enrollmentFee)).toFixed(2)
		: null;

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={(next) => {
				if (!next) {
					setOwnerId("");
					setPlanId("");
				}
				onOpenChange(next);
			}}
			title="تسجيل عضوية"
			description="التسجيل ينشئ اشتراكًا محاسبيًا ويولّد فاتورة الفترة الأولى فورًا — تبقى العضوية «بانتظار الدفع» حتى تحصيلها"
			onSubmit={(event) => {
				event.preventDefault();
				if (!ownerId || !planId) return;
				void enroll({ ownerId, planId }).then(() => onOpenChange(false));
			}}
			isSaving={isPending}
			submitLabel="تسجيل"
			submitDisabled={!ownerId || !planId}
		>
			<div className="flex flex-col gap-4 p-4">
				<Field>
					<Label>وليّ الأمر</Label>
					<Select
						value={ownerId || undefined}
						onValueChange={setOwnerId}
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر وليّ الأمر" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{owners.map((owner) => (
								<SelectItem
									key={owner.id}
									value={owner.id}
								>
									{owner.name} — {owner.phone}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field>
					<Label>الخطة (الفعّالة فقط تُباع)</Label>
					<Select
						value={planId || undefined}
						onValueChange={setPlanId}
					>
						<SelectTrigger>
							<SelectValue placeholder="اختر الخطة" />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{plans.map((row) => (
								<SelectItem
									key={row.id}
									value={row.id}
								>
									{row.name} — {formatAmount(row.fee.toString())} /{" "}
									{row.billingInterval === "YEAR" ? "سنة" : "شهر"}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>

				{plan && (
					<div className="rounded-md border bg-muted/30 p-3 text-sm">
						<p>
							الرسم الدوري: <b>{formatAmount(plan.fee.toString())}</b>
						</p>
						{Number(plan.enrollmentFee) > 0 && (
							<p>
								رسم التسجيل (مرة واحدة): <b>{formatAmount(plan.enrollmentFee.toString())}</b>
							</p>
						)}
						<p className="mt-1 border-t pt-1">
							فاتورة الفترة الأولى (قبل الضريبة):{" "}
							<b>{formatAmount(firstInvoiceTotal ?? "0")}</b>
						</p>
						{plan.benefits.length > 0 && (
							<p className="mt-1 text-muted-foreground text-xs">
								{plan.benefits.length} ميزة تنطبق فور تفعيل العضوية
							</p>
						)}
					</div>
				)}
			</div>
		</AccountingFormSheet>
	);
};
