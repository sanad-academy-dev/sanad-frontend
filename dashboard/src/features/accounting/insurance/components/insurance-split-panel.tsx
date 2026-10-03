import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	type InsurancePreview,
	useInvoiceInsurancePreview,
} from "@/features/accounting/insurance/hooks/use-insurance";
import { formatAmount } from "@/features/accounting/utils/format-amount";

/**
 * [MI-P4] BR-I9.1.2 — the split preview inside the pay modal. The operator sees exactly
 * what the server will do, may push LINES to the owner's copay (reduce — the computed
 * figure is the ceiling, enforced server-side), and confirms. Renders nothing when the
 * patient has no live coverage or the module is off, so it is safe to mount always.
 */

export type InsuranceSelection = {
	apply: boolean;
	excludedLineRefs: string[];
	/** what the counter should collect when apply=true */
	copayShare: string;
} | null;

export const InsuranceSplitPanel = ({
	invoiceId,
	onSelectionChange,
}: {
	invoiceId: string | null | undefined;
	onSelectionChange: (selection: InsuranceSelection) => void;
}) => {
	const [apply, setApply] = useState(true);
	const [excluded, setExcluded] = useState<string[]>([]);
	const { previewState } = useInvoiceInsurancePreview(invoiceId, excluded);

	const preview: InsurancePreview | null =
		previewState && previewState.kind === "ok" ? previewState.preview : null;

	useEffect(() => {
		onSelectionChange(
			preview && apply
				? { apply: true, excludedLineRefs: excluded, copayShare: preview.copayShare }
				: null,
		);
	}, [apply, preview, onSelectionChange, excluded]);

	if (previewState && previewState.kind === "already-claimed") {
		return (
			<div className="rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
				توجد مطالبة تأمين على هذه الفاتورة بالفعل — التحصيل هنا لحصة وليّ الأمر المتبقية فقط.
			</div>
		);
	}
	if (!preview) return null;

	const toggleLine = (lineRef: string, exclude: boolean) =>
		setExcluded((current) =>
			exclude ? [...new Set([...current, lineRef])] : current.filter((ref) => ref !== lineRef),
		);

	return (
		<div className="flex flex-col gap-2 rounded-md border border-emerald-200 bg-emerald-50/50 p-3">
			<Label className="flex cursor-pointer items-center gap-2 font-normal">
				<Checkbox
					checked={apply}
					onCheckedChange={(value) => setApply(value === true)}
				/>
				<span className="text-sm font-medium">
					مطالبة تأمين — {preview.policy.insurerName}
					<span
						className="ms-2 text-xs text-muted-foreground"
						dir="ltr"
					>
						{preview.policy.policyNumber}
					</span>
				</span>
			</Label>

			{apply && (
				<>
					<div className="flex flex-col gap-1 text-xs">
						{preview.lines.map((line) => (
							<div
								key={line.lineRef}
								className="flex items-center justify-between gap-2"
							>
								<Label className="flex min-w-0 cursor-pointer items-center gap-2 font-normal">
									<Checkbox
										checked={!line.excludedByOperator}
										disabled={line.excludedByPolicy}
										onCheckedChange={(value) => toggleLine(line.lineRef, value !== true)}
									/>
									<span className="truncate">
										{line.label}
										{line.excludedByPolicy && (
											<span className="ms-1 text-muted-foreground">(مستثناة بالبوليصة)</span>
										)}
									</span>
								</Label>
								<span className="shrink-0 tabular-nums">
									{Number(line.coveragePercent)}% ← {formatAmount(line.insurerAmount)}
								</span>
							</div>
						))}
					</div>
					<div className="flex items-center justify-between border-t border-emerald-200 pt-2 text-sm">
						<span>
							حصة المؤمِّن
							{preview.workings.perClaimCapApplied && " (سقف المطالبة طُبّق)"}
							{preview.workings.annualCapApplied && " (السقف السنوي طُبّق)"}
						</span>
						<span className="font-semibold tabular-nums">
							{formatAmount(preview.insurerShare)} ر.س
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span>حصة وليّ الأمر (تُحصَّل الآن)</span>
						<span className="font-semibold tabular-nums">
							{formatAmount(preview.copayShare)} ر.س
						</span>
					</div>
					{Number(preview.workings.deductibleFixedApplied) +
						Number(preview.workings.deductiblePercentApplied) >
						0 && (
						<p className="text-xs text-muted-foreground">
							التحمّل المطبَّق:{" "}
							{formatAmount(
								(
									Number(preview.workings.deductibleFixedApplied) +
									Number(preview.workings.deductiblePercentApplied)
								).toFixed(2),
							)}{" "}
							ر.س
						</p>
					)}
				</>
			)}
		</div>
	);
};
