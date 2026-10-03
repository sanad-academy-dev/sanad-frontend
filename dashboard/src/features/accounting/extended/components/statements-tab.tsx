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
import {
	PsoaConfigSheet,
	PsoaPreviewDialog,
} from "@/features/accounting/extended/components/statements-sheets";
import { usePsoaConfigs } from "@/features/accounting/extended/hooks/use-extended";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P12.14] Tab «كشوف الحسابات» (FR-17.4) — the saved send configurations.
 *
 * «آخر إرسال» records the ATTEMPT, not a success, and the column says so in its tooltip: a
 * config whose mail server was down still advances the timestamp, and reading it as proof of
 * delivery is exactly the mistake that lets a customer go three months without a statement.
 *
 * No send button in the ROW, on purpose. An emailed statement cannot be recalled, so sending
 * happens inside the preview ([P12.15]), where the operator has just seen exactly what each
 * customer will receive — the preview/send split exists on the server for the same reason.
 */

export const StatementsTab = () => {
	const { configs, isLoading } = usePsoaConfigs();
	const [sheet, setSheet] = useState(false);
	const [preview, setPreview] = useState<{ id: string; title: string } | null>(null);

	return (
		<>
			<TabIntro
				title="كشوف حسابات العملاء"
				hint="تهيئات محفوظة تُرسل كشف الحساب دوريًا: حركة الطرف أو أعمار ديونه. الفترة تُشتقّ من موضع تاريخ التشغيل في التقويم، فكشفان متتاليان يتلاصقان بلا فجوة ولا تداخل."
			/>
			<div className="flex items-center gap-2 border-b px-4 py-2">
				<span className="text-muted-foreground text-xs">
					الإرسال يمرّ بالمعاينة دائمًا — الكشف المُرسَل لا يُستعاد.
				</span>
				<Button
					size="xs"
					className="ms-auto"
					onClick={() => setSheet(true)}
				>
					<IconPlus className="size-3.5" />
					تهيئة جديدة
				</Button>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "العنوان" },
						{ label: "العرض", className: "w-32" },
						{ label: "التكرار", className: "w-24" },
						{ label: "العملاء", className: "w-20 text-end" },
						{ label: "آخر محاولة إرسال", className: "w-36" },
						{ label: "الحالة", className: "w-24" },
						{ label: "إجراءات", className: "w-24" },
					]}
					rows={configs}
					isLoading={isLoading}
					emptyMessage="لا تهيئات كشوف حساب. اضغط «تهيئة جديدة» واختر العملاء الذين يتلقّون الكشف."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell className="truncate">{row.title}</TableCell>
							<TableCell>
								{row.reportType === "RECEIVABLE_AGEING" ? "أعمار الديون" : "حركة الطرف"}
							</TableCell>
							<TableCell>
								{{ MANUAL: "يدوي", WEEKLY: "أسبوعي", MONTHLY: "شهري", QUARTERLY: "ربعي" }[
									row.frequency
								] ?? row.frequency}
							</TableCell>
							<TableCell className="text-end">{row.customers.length}</TableCell>
							<TableCell>
								{row.lastSentAt ? (
									<span title="يسجّل المحاولة لا نجاح التسليم">
										{formatDisplayDate(row.lastSentAt)}
									</span>
								) : (
									<span className="text-muted-foreground">لم تُرسل بعد</span>
								)}
							</TableCell>
							<TableCell>
								<Badge variant={row.enabled ? "default" : "secondary"}>
									{row.enabled ? "مفعّلة" : "معطّلة"}
								</Badge>
							</TableCell>
							<TableCell>
								<Button
									size="xs"
									variant="outline"
									onClick={() => setPreview({ id: row.id, title: row.title })}
								>
									معاينة
								</Button>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<PsoaConfigSheet
				open={sheet}
				onOpenChange={setSheet}
			/>
			<PsoaPreviewDialog
				psoaId={preview?.id ?? null}
				title={preview?.title ?? ""}
				onClose={() => setPreview(null)}
			/>
		</>
	);
};
