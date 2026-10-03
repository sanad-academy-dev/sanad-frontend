import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Fragment } from "react";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { LabResultComparison } from "@/features/services/lab-tests/components/lab-result-comparison";
import { LabResultFlag } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	LAB_FLAG_LABELS,
	type LabTestItemResponse,
	type LabTestOrderResponse,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// نتائج الطلب كاملةً للقراءة — مجمّعة حسب التحليل ثم حسب القسم.
// الإدخال والتعديل يتمّان داخل لوحة التحليل المفرد لا هنا.

const rangeLabel = (low: unknown, high: unknown) => {
	const l = low == null ? null : Number(low);
	const h = high == null ? null : Number(high);
	if (l == null && h == null) return "—";
	if (l != null && h != null) return `${l} – ${h}`;
	return l != null ? `≥ ${l}` : `≤ ${h}`;
};

const FLAG_CLASS: Record<LabResultFlag, string> = {
	[LabResultFlag.NORMAL]: "border-emerald-200 bg-emerald-50 text-emerald-700",
	[LabResultFlag.LOW]: "border-amber-200 bg-amber-50 text-amber-700",
	[LabResultFlag.HIGH]: "border-red-200 bg-red-50 text-red-700",
};

export function LabOrderResults({ order }: { order: LabTestOrderResponse }) {
	const withResults = order.items.filter((item) => item.results.length > 0);

	if (withResults.length === 0) {
		return (
			<p className="rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
				لم تُدخل نتائج بعد — تُدخل من لوحة كل تحليل داخل المختبر.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{withResults.map((item) => (
				<TestResults
					key={item.id}
					item={item}
				/>
			))}
		</div>
	);
}

function TestResults({ item }: { item: LabTestItemResponse }) {
	const criticalCount = item.results.filter((r) => r.flag !== LabResultFlag.NORMAL).length;

	// النتائج مجمّعة حسب القسم مع الحفاظ على ترتيب الإدخال
	const grouped = (() => {
		const groups = new Map<string, typeof item.results>();
		for (const row of [...item.results].sort((a, b) => a.order - b.order)) {
			const key = row.section?.trim() || "";
			groups.set(key, [...(groups.get(key) ?? []), row]);
		}
		return [...groups.entries()];
	})();

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<p className="text-xs font-bold">
					{item.service.name}
					{criticalCount > 0 && (
						<span className="ms-2 text-[11px] font-medium text-red-600">
							{criticalCount} قيمة حرجة
						</span>
					)}
				</p>
				{item.reviewedAt && (
					<span className="text-[11px] text-muted-foreground">
						اعتمدها {item.reviewedBy?.name ?? "—"}
					</span>
				)}
			</div>

			<div className="rounded-[4px] border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">المُحلِّل</TableHead>
							<TableHead className="text-center">الوحدة</TableHead>
							<TableHead className="text-center">النطاق الطبيعي</TableHead>
							<TableHead className="text-center">النتيجة</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{grouped.map(([section, rows]) => (
							<Fragment key={section || "__none__"}>
								{section && (
									<TableRow className="bg-muted/40 hover:bg-muted/40">
										<TableCell
											colSpan={5}
											className="py-1.5 text-start text-xs font-bold text-foreground"
										>
											{section}
										</TableCell>
									</TableRow>
								)}
								{rows.map((row) => {
									const isCritical = row.flag !== LabResultFlag.NORMAL;
									return (
										<TableRow key={row.id}>
											<TableCell className="text-sm font-medium">{row.name}</TableCell>
											<TableCell className="text-center text-xs text-muted-foreground">
												{row.unit || "—"}
											</TableCell>
											<TableCell className="text-center text-xs tabular-nums text-muted-foreground">
												{rangeLabel(row.refLow, row.refHigh)}
											</TableCell>
											<TableCell className="text-center">
												<span
													className={cn(
														"text-sm font-semibold tabular-nums",
														isCritical && "text-red-700",
													)}
												>
													{row.value || "—"}
												</span>
											</TableCell>
											<TableCell className="text-center">
												<Badge
													variant="outline"
													className={cn("gap-1 text-[10px]", FLAG_CLASS[row.flag])}
												>
													{isCritical && <IconAlertTriangleFilled className="size-3" />}
													{LAB_FLAG_LABELS[row.flag]}
												</Badge>
											</TableCell>
										</TableRow>
									);
								})}
							</Fragment>
						))}
					</TableBody>
				</Table>
			</div>

			{/* مقارنة بالنتيجة السابقة لنفس التحليل — أسفل جدول النتائج مباشرةً */}
			<LabResultComparison item={item} />

			{/* تقرير المراجعة المعتمد يُعرض تحت نتائج تحليله */}
			{item.report && (
				<p className="whitespace-pre-wrap rounded-[4px] border bg-muted/30 p-3 text-xs leading-relaxed">
					{item.report}
				</p>
			)}
		</div>
	);
}
