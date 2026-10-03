import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { PolicySheet } from "@/features/accounting/insurance/components/policy-sheet";
import { usePatientPolicies } from "@/features/accounting/insurance/hooks/use-insurance";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { PatientPolicyStatus } from "@/generated/prisma/enums";
import type { PatientPolicyResponse } from "@/server/accounting/insurance/patient-policy.type";

/**
 * [MI-P3] Tab «بوالص الأطفال» (MI §8.3). Status chips show the DERIVED status (AR-M4):
 * an ACTIVE row past its end date reads EXPIRED here whether or not the daily job ran.
 */

const STATUS_META: Record<
	PatientPolicyStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	ACTIVE: { label: "سارية", variant: "default" },
	EXPIRED: { label: "منتهية", variant: "secondary" },
	SUSPENDED: { label: "معلّقة", variant: "outline" },
	CANCELLED: { label: "ملغاة", variant: "destructive" },
};

export const PoliciesTab = () => {
	const { policies, isLoading } = usePatientPolicies();
	const [sheet, setSheet] = useState(false);
	const [editing, setEditing] = useState<PatientPolicyResponse | null>(null);

	return (
		<>
			<TabIntro
				title="بوالص الأطفال"
				hint="بوليصة نشطة واحدة لكل طفل (BR-I8.3.1). التغطية تسري فقط داخل نافذة البوليصة وحالتها «سارية» — الانتهاء يُشتق من التاريخ تلقائيًا."
			/>
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<Button
					size="sm"
					className="ms-auto"
					onClick={() => {
						setEditing(null);
						setSheet(true);
					}}
				>
					<IconPlus className="size-4" />
					بوليصة جديدة
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "الطفل" },
						{ label: "وليّ الأمر", className: "w-32" },
						{ label: "المنتج / الشركة", className: "w-48" },
						{ label: "رقم البوليصة", className: "w-32" },
						{ label: "النافذة", className: "w-44" },
						{ label: "المستهلك من السقف", className: "w-28 text-end" },
						{ label: "الحالة", className: "w-20" },
						{ label: "", className: "w-20" },
					]}
					rows={policies}
					isLoading={isLoading}
					emptyMessage="لا بوالص بعد. اربط طفلًا بمنتج تأمين برقم بوليصة ونافذة صلاحية."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>
								<span className="font-medium">{row.patient.name}</span>
							</TableCell>
							<TableCell>{row.patient.owner?.name ?? "—"}</TableCell>
							<TableCell>
								{row.product.name}
								<span className="ms-1 text-muted-foreground text-xs">
									({row.product.insurer.name})
								</span>
							</TableCell>
							<TableCell>
								<span dir="ltr">{row.policyNumber}</span>
							</TableCell>
							<TableCell className="text-xs tabular-nums">
								{formatDisplayDate(row.policyStart)} ← {formatDisplayDate(row.policyEnd)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(row.capConsumed.toString())}
								{row.product.annualCap
									? ` / ${formatAmount(row.product.annualCap.toString())}`
									: ""}
							</TableCell>
							<TableCell>
								<Badge variant={STATUS_META[row.status].variant}>
									{STATUS_META[row.status].label}
								</Badge>
							</TableCell>
							<TableCell>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										setEditing(row);
										setSheet(true);
									}}
								>
									تعديل
								</Button>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<PolicySheet
				open={sheet}
				onOpenChange={setSheet}
				policy={editing}
			/>
		</>
	);
};
