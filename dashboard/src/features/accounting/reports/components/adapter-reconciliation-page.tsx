import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAdapterReconciliation } from "@/features/accounting/reports/hooks/use-adapter-reconciliation";
import {
	formatAmount,
	formatDisplayDate,
	toNano,
} from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";
import type { AdapterKey } from "@/server/accounting/adapters/adapter.type";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const ADAPTER_OPTIONS: { key: AdapterKey; label: string }[] = [
	{ key: "clinic_invoice", label: "محول فواتير الأكاديمية" },
	{ key: "expense", label: "محول المصروفات" },
];

// float-free ≠ 0 check — the bank-reports pattern (contract C2: no JS floats on money)
const isNonZero = (value: string): boolean => toNano(value.replace("-", "")) !== 0n;

/**
 * [P12A.2e] «تقرير المطابقة (المحولات)» — the §C3 per-adapter parallel-run report:
 * source-module totals vs adapter postings vs live GL, with the unposted and orphan lists.
 * Zero diff (residual = 0, both lists empty) is the adapter's DoD and gates the external
 * pilot. Read-only — runs happen in «الحوكمة ← المحولات».
 */
export const AdapterReconciliationPage = () => {
	const [adapterKey, setAdapterKey] = useState<AdapterKey | null>(null);
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [showRows, setShowRows] = useState(false);

	const { report, isLoading } = useAdapterReconciliation({ adapterKey, fromDate, toDate });

	const residualNonZero = !!report && isNonZero(report.residual);
	const zeroDiff =
		!!report &&
		!residualNonZero &&
		report.unpostedDocs.length === 0 &&
		report.orphanPostings.length === 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">تقرير المطابقة (المحولات)</h1>
				<p className="text-muted-foreground text-sm">
					§C3 — التشغيل المتوازي: إجمالي الوحدة التشغيلية مقابل المرحّل مقابل دفتر الأستاذ، مع
					المستندات غير المرحّلة والترحيلات اليتيمة. صفر فرق هو شرط اكتمال المحول.
				</p>
			</div>

			{/* toolbar — adapter + date range */}
			<div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
				<div className="w-56">
					<Select
						value={adapterKey ?? ""}
						onValueChange={(value) => setAdapterKey(value as AdapterKey)}
						dir="rtl"
					>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="المحول..." />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{ADAPTER_OPTIONS.map((option) => (
								<SelectItem
									key={option.key}
									value={option.key}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DateField
					value={fromDate}
					onChange={setFromDate}
					placeholder="من تاريخ"
				/>
				<DateField
					value={toDate}
					onChange={setToDate}
					placeholder="إلى تاريخ"
				/>
			</div>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{!adapterKey ? (
					<p className="py-10 text-center text-muted-foreground text-sm">
						اختر محولًا لعرض التقرير.
					</p>
				) : isLoading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : report ? (
					<div className="flex flex-col">
						{/* the three legs + the residual */}
						<div className="grid grid-cols-2 gap-2 px-4 py-3 md:grid-cols-4">
							{(
								[
									["إجمالي المصدر", report.sourceTotal, false],
									["إجمالي المرحّل", report.postedTotal, false],
									["إجمالي دفتر الأستاذ", report.glTotal, false],
									["الفرق المتبقي", report.residual, residualNonZero],
								] as const
							).map(([label, value, highlight]) => (
								<div
									key={label}
									className={cn(
										"rounded-md border border-border p-2",
										highlight && "border-destructive bg-destructive/5",
									)}
								>
									<p className="text-muted-foreground text-xs">{label}</p>
									<p
										dir="ltr"
										className={cn(
											"text-end font-semibold tabular-nums",
											highlight && "text-destructive",
										)}
									>
										{formatAmount(value)}
									</p>
								</div>
							))}
						</div>
						{residualNonZero ? (
							<p className="px-4 pb-2 text-destructive text-xs">
								الفرق المتبقي ≠ صفر — توجد مستندات غير مرحّلة أو ترحيلات لا يقابلها مستند مصدر
								في هذا النطاق.
							</p>
						) : zeroDiff ? (
							<p className="px-4 pb-2 text-muted-foreground text-xs">
								مطابقة تامة — صفر فرق بين المصدر والمرحّل ودفتر الأستاذ في هذا النطاق.
							</p>
						) : null}

						<p className="px-3 pt-1 font-semibold text-muted-foreground text-xs">
							غير مرحّل — مستندات مؤهلة بلا ترحيل ساري
						</p>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>المستند</TableHead>
									<TableHead>تاريخ الترحيل</TableHead>
									<TableHead className="text-end">المبلغ</TableHead>
									<TableHead className="text-end">الفرق</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{report.unpostedDocs.map((row) => (
									<TableRow key={row.sourceId}>
										<TableCell dir="ltr">{row.sourceCode}</TableCell>
										<TableCell dir="ltr">
											{formatDisplayDate(row.postingDate?.toString())}
										</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.sourceAmount)}
										</TableCell>
										<TableCell
											className={cn(
												"text-end tabular-nums",
												isNonZero(row.diff) && "text-destructive",
											)}
											dir="ltr"
										>
											{formatAmount(row.diff)}
										</TableCell>
									</TableRow>
								))}
								{report.unpostedDocs.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											className="py-8 text-center text-muted-foreground"
										>
											لا مستندات غير مرحّلة في هذا النطاق.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>

						<p className="px-3 pt-3 font-semibold text-muted-foreground text-xs">
							ترحيلات يتيمة — ترحيلات سارية لا يقابلها مستند مصدر مؤهل
						</p>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>المستند</TableHead>
									<TableHead className="text-end">المبلغ المرحّل</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{report.orphanPostings.map((row) => (
									<TableRow key={row.sourceId}>
										<TableCell dir="ltr">{row.sourceCode}</TableCell>
										<TableCell
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(row.postedAmount)}
										</TableCell>
									</TableRow>
								))}
								{report.orphanPostings.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={2}
											className="py-8 text-center text-muted-foreground"
										>
											لا ترحيلات يتيمة في هذا النطاق.
										</TableCell>
									</TableRow>
								) : null}
							</TableBody>
						</Table>

						<div className="flex items-center gap-2 px-3 pt-3">
							<p className="font-semibold text-muted-foreground text-xs">
								كل صفوف المطابقة ({report.rows.length})
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setShowRows((current) => !current)}
							>
								{showRows ? "إخفاء الصفوف" : "عرض الصفوف"}
							</Button>
						</div>
						{showRows ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>المستند</TableHead>
										<TableHead>تاريخ الترحيل</TableHead>
										<TableHead className="text-end">مبلغ المصدر</TableHead>
										<TableHead className="text-end">المبلغ المرحّل</TableHead>
										<TableHead className="text-end">الفرق</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{report.rows.map((row) => (
										<TableRow key={row.sourceId}>
											<TableCell dir="ltr">{row.sourceCode}</TableCell>
											<TableCell dir="ltr">
												{formatDisplayDate(row.postingDate?.toString())}
											</TableCell>
											<TableCell
												className="text-end tabular-nums"
												dir="ltr"
											>
												{formatAmount(row.sourceAmount)}
											</TableCell>
											<TableCell
												className="text-end tabular-nums"
												dir="ltr"
											>
												{row.postedAmount == null ? "—" : formatAmount(row.postedAmount)}
											</TableCell>
											<TableCell
												className={cn(
													"text-end tabular-nums",
													isNonZero(row.diff) && "text-destructive",
												)}
												dir="ltr"
											>
												{formatAmount(row.diff)}
											</TableCell>
										</TableRow>
									))}
									{report.rows.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="py-8 text-center text-muted-foreground"
											>
												لا صفوف في هذا النطاق.
											</TableCell>
										</TableRow>
									) : null}
								</TableBody>
							</Table>
						) : null}
					</div>
				) : null}
			</div>
		</div>
	);
};
