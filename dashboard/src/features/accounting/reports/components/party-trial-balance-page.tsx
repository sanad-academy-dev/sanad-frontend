import { IconDownload } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
import { usePartyTrialBalance } from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { PARTY_TYPES } from "@sanad/contracts/runtime/server/accounting/party/party.type";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const typeLabelOf = (key: string) => PARTY_TYPES.find((d) => d.key === key)?.labelAr ?? key;

/** [P3.6] Trial Balance for Party (BRD §18.2): opening/period/closing per party within one
 * AR or AP account type — «من يدين لمن» before invoices even exist. */
export const PartyTrialBalancePage = () => {
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [side, setSide] = useState<"RECEIVABLE" | "PAYABLE">("RECEIVABLE");
	const [search, setSearch] = useState("");

	const { report, isLoading } = usePartyTrialBalance({ fromDate, toDate, side });

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "الأطراف المتحركة",
				value: report?.rows.length ?? 0,
				tooltip: "عدد الأطراف التي لها حركة أو رصيد في النطاق.",
			},
			{
				title: "حركة الفترة (مدين)",
				value: 0,
				valueLabel: report?.totals.periodDebit ?? "0",
				tooltip: "مجموع مدين الفترة على حسابات الذمم المحددة.",
			},
			{
				title: "حركة الفترة (دائن)",
				value: 0,
				valueLabel: report?.totals.periodCredit ?? "0",
				tooltip: "مجموع دائن الفترة على حسابات الذمم المحددة.",
			},
			{
				title: "صافي الإقفال",
				value: 0,
				valueLabel: report?.totals.closing ?? "0",
				tooltip: "مجموع أرصدة الإقفال (مدين − دائن) لكل الأطراف.",
			},
		],
		[report],
	);

	const visible = useMemo(() => {
		const rows = report?.rows ?? [];
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				row.partyName.toLowerCase().includes(q) || typeLabelOf(row.partyType).includes(q),
		);
	}, [report, search]);

	const exportCsv = () =>
		downloadCsv(
			"party-trial-balance",
			["النوع", "الطرف", "افتتاحي", "الفترة مدين", "الفترة دائن", "الإقفال"],
			(report?.rows ?? []).map((row) => [
				typeLabelOf(row.partyType),
				row.partyName,
				row.opening,
				row.periodDebit,
				row.periodCredit,
				row.closing,
			]),
		);

	const amountCell = (value: string) => (
		<TableCell
			className="text-end tabular-nums"
			dir="ltr"
		>
			{value === "0" ? "—" : value}
		</TableCell>
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">ميزان مراجعة الأطراف</h1>
				<p className="text-muted-foreground text-sm">
					افتتاحي / حركة / إقفال لكل طرف ضمن نوع ذمم واحد (§18.2).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالطرف أو النوع..."
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
							disabled={!report || report.rows.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
						<Field className="w-40">
							<Select
								value={side}
								onValueChange={(v) => setSide(v as "RECEIVABLE" | "PAYABLE")}
								dir="rtl"
							>
								<SelectTrigger size="sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="RECEIVABLE">الذمم المدينة</SelectItem>
									<SelectItem value="PAYABLE">الذمم الدائنة</SelectItem>
								</SelectContent>
							</Select>
						</Field>
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
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الطرف</TableHead>
							<TableHead className="text-end">افتتاحي</TableHead>
							<TableHead className="text-end">الفترة مدين</TableHead>
							<TableHead className="text-end">الفترة دائن</TableHead>
							<TableHead className="text-end">الإقفال</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isLoading && visible.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={5}
									className="py-8 text-center text-muted-foreground text-sm"
								>
									لا حركة أطراف في النطاق المحدد.
								</TableCell>
							</TableRow>
						)}
						{visible.map((row) => (
							<TableRow key={`${row.partyType}:${row.partyId}`}>
								<TableCell>
									<Badge
										variant="outline"
										className="me-2"
									>
										{typeLabelOf(row.partyType)}
									</Badge>
									{row.partyName}
								</TableCell>
								{amountCell(row.opening)}
								{amountCell(row.periodDebit)}
								{amountCell(row.periodCredit)}
								{amountCell(row.closing)}
							</TableRow>
						))}
						{report && report.rows.length > 0 && (
							<TableRow className="bg-muted/40 font-semibold">
								<TableCell>الإجمالي</TableCell>
								{amountCell(report.totals.opening)}
								{amountCell(report.totals.periodDebit)}
								{amountCell(report.totals.periodCredit)}
								{amountCell(report.totals.closing)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
