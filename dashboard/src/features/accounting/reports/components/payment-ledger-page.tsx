import { IconDownload } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { usePaymentLedgerReport } from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

/** [P3.6] Payment Ledger audit (BRD §18.2): the raw BR-5.2.1 rows, signed, with the
 * delinked audit toggle — the receivable/payable truth before any summary touches it. */
export const PaymentLedgerPage = () => {
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [includeDelinked, setIncludeDelinked] = useState(false);
	const [search, setSearch] = useState("");

	const { rows, isLoading } = usePaymentLedgerReport({ fromDate, toDate, includeDelinked });

	const stats = useMemo<StatItem[]>(
		() => [
			{ title: "السطور", value: rows.length, tooltip: "عدد سطور سجل الذمم في النطاق." },
			{
				title: "ذمم مدينة",
				value: rows.filter((r) => r.accountType === "RECEIVABLE").length,
				tooltip: "سطور جانب العملاء.",
			},
			{
				title: "ذمم دائنة",
				value: rows.filter((r) => r.accountType === "PAYABLE").length,
				tooltip: "سطور جانب الموردين والموظفين.",
			},
			{
				title: "مفصولة",
				value: rows.filter((r) => r.delinked).length,
				tooltip: "سطور حُيّدت بالإلغاء أو فك التسوية (BR-3.2).",
			},
		],
		[rows],
	);

	const visible = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				row.partyName.toLowerCase().includes(q) ||
				row.voucherNo.toLowerCase().includes(q) ||
				(row.againstVoucherNo ?? "").toLowerCase().includes(q),
		);
	}, [rows, search]);

	const exportCsv = () =>
		downloadCsv(
			"payment-ledger",
			["التاريخ", "النوع", "الطرف", "المستند", "مقابل", "المبلغ", "العملة", "مفصول"],
			visible.map((row) => [
				isoDay(row.postingDate),
				row.accountType === "RECEIVABLE" ? "ذمم مدينة" : "ذمم دائنة",
				row.partyName,
				row.voucherNo,
				row.againstVoucherNo ?? row.againstVoucherId,
				row.amount.toString(),
				row.accountCurrencyCode,
				row.delinked ? "نعم" : "لا",
			]),
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">سجل الذمم</h1>
				<p className="text-muted-foreground text-sm">
					العرض الخام لسطور payment_ledger_entry الموقعة — للمراجعة والتدقيق (§18.2).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالطرف أو رقم المستند..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				leftExtra={
					<>
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={exportCsv}
							disabled={visible.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
						<Field className="w-36">
							<DateField
								value={fromDate}
								onChange={setFromDate}
								placeholder="من"
							/>
						</Field>
						<Field className="w-36">
							<DateField
								value={toDate}
								onChange={setToDate}
								placeholder="إلى"
							/>
						</Field>
						<div className="flex items-center gap-1.5">
							<Switch
								checked={includeDelinked}
								onCheckedChange={setIncludeDelinked}
							/>
							<Label className="text-xs">إظهار المفصولة</Label>
						</div>
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>التاريخ</TableHead>
							<TableHead>الجانب</TableHead>
							<TableHead>الطرف</TableHead>
							<TableHead>المستند</TableHead>
							<TableHead>مقابل</TableHead>
							<TableHead className="text-end">المبلغ</TableHead>
							<TableHead>الحالة</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isLoading && visible.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className="py-8 text-center text-muted-foreground text-sm"
								>
									لا سطور في النطاق المحدد.
								</TableCell>
							</TableRow>
						)}
						{visible.map((row) => (
							<TableRow
								key={row.id}
								className={row.delinked ? "opacity-60" : undefined}
							>
								<TableCell
									className="tabular-nums"
									dir="ltr"
								>
									{isoDay(row.postingDate)}
								</TableCell>
								<TableCell>
									<Badge variant="outline">
										{row.accountType === "RECEIVABLE" ? "مدينة" : "دائنة"}
									</Badge>
								</TableCell>
								<TableCell className="max-w-40 truncate">{row.partyName}</TableCell>
								<TableCell
									className="font-mono text-xs"
									dir="ltr"
								>
									{row.voucherNo}
								</TableCell>
								<TableCell
									className="font-mono text-xs"
									dir="ltr"
								>
									{row.againstVoucherNo ?? row.againstVoucherId}
								</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{row.amount.toString()}
								</TableCell>
								<TableCell>
									{row.delinked ? (
										<Badge
											variant="destructive"
											className="text-[10px]"
										>
											مفصول
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="text-[10px]"
										>
											حي
										</Badge>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
