import { IconDownload } from "@tabler/icons-react";
import { useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAccounts } from "@/features/accounting/chart-of-accounts/hooks/use-chart-of-accounts";
import { useGeneralLedger } from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

const ALL_ACCOUNTS = "__all__";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

/** [P2.6] General Ledger report (BRD §18.2): filters → opening row → entries with running
 * balance → closing row; show-cancelled audit toggle; CSV export. */
export const GeneralLedgerPage = () => {
	const { accounts } = useAccounts();
	// §18.2 drill-through: statement/ageing rows arrive with ?accountId pre-filtering
	const { accountId: drillAccountId } = useSearch({
		from: "/_pathless-layout/management/accounting/general-ledger",
	});
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [accountId, setAccountId] = useState<string>(drillAccountId ?? ALL_ACCOUNTS);
	const [showCancelled, setShowCancelled] = useState(false);
	const [search, setSearch] = useState("");

	const { report, isLoading } = useGeneralLedger({
		fromDate,
		toDate,
		accountId: accountId === ALL_ACCOUNTS ? undefined : accountId,
		showCancelled,
	});

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "عدد القيود",
				value: report?.rows.filter((r) => !r.isCancelled).length ?? 0,
				tooltip: "قيود الأستاذ الحية داخل الفترة (الملغى لا يُحتسب).",
			},
			{
				title: "الرصيد الافتتاحي",
				value: 0,
				valueLabel: report?.opening.balance ?? "0",
				tooltip: "صافي (مدين − دائن) قبل بداية الفترة — الصفوف الحية فقط.",
			},
			{
				title: "رصيد الإقفال",
				value: 0,
				valueLabel: report?.closing.balance ?? "0",
				tooltip: "الافتتاحي + حركة الفترة.",
			},
		],
		[report],
	);

	const visibleRows = useMemo(() => {
		const rows = report?.rows ?? [];
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				row.account.accountName.toLowerCase().includes(q) ||
				row.voucherNo.toLowerCase().includes(q) ||
				(row.against ?? "").toLowerCase().includes(q),
		);
	}, [report, search]);

	const exportCsv = () =>
		downloadCsv(
			"general-ledger",
			["التاريخ", "الحساب", "مدين", "دائن", "الرصيد", "المستند", "مقابل", "الحالة"],
			visibleRows.map((row) => [
				isoDay(row.postingDate.toString()),
				row.account.accountName,
				row.debit.toString(),
				row.credit.toString(),
				row.runningBalance,
				row.voucherNo,
				row.against ?? "",
				row.isCancelled ? "ملغى" : "حي",
			]),
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">دفتر الأستاذ العام</h1>
				<p className="text-muted-foreground text-sm">
					كل حركة على كل حساب، برصيد جارٍ وصفَّي افتتاح وإقفال (§18.2).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-3"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالحساب أو رقم المستند..."
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
							disabled={visibleRows.length === 0}
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
						<Select
							value={accountId}
							onValueChange={setAccountId}
							dir="rtl"
						>
							<SelectTrigger className="h-6 w-44 text-xs">
								<SelectValue placeholder="كل الحسابات" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={ALL_ACCOUNTS}>كل الحسابات</SelectItem>
								{accounts
									.filter((a) => !a.isGroup)
									.map((a) => (
										<SelectItem
											key={a.id}
											value={a.id}
										>
											{a.accountName}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
						<div className="flex items-center gap-1.5">
							<Switch
								checked={showCancelled}
								onCheckedChange={setShowCancelled}
							/>
							<Label className="text-xs">إظهار الملغى</Label>
						</div>
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>التاريخ</TableHead>
							<TableHead>الحساب</TableHead>
							<TableHead className="text-end">مدين</TableHead>
							<TableHead className="text-end">دائن</TableHead>
							<TableHead className="text-end">الرصيد الجاري</TableHead>
							<TableHead>المستند</TableHead>
							<TableHead>مقابل</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow className="bg-muted/40 font-medium">
							<TableCell colSpan={4}>الرصيد الافتتاحي</TableCell>
							<TableCell
								className="text-end tabular-nums"
								dir="ltr"
							>
								{report?.opening.balance ?? "—"}
							</TableCell>
							<TableCell colSpan={2} />
						</TableRow>
						{!isLoading && visibleRows.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className="py-8 text-center text-muted-foreground text-sm"
								>
									لا قيود في الفترة المحددة.
								</TableCell>
							</TableRow>
						)}
						{visibleRows.map((row) => (
							<TableRow
								key={row.id}
								className={row.isCancelled ? "opacity-50" : undefined}
							>
								<TableCell
									dir="ltr"
									className="tabular-nums"
								>
									{isoDay(row.postingDate.toString())}
								</TableCell>
								<TableCell>
									{row.account.accountName}
									{row.isCancelled && (
										<Badge
											variant="destructive"
											className="ms-2 text-[10px]"
										>
											ملغى
										</Badge>
									)}
								</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{row.debit.toString()}
								</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{row.credit.toString()}
								</TableCell>
								<TableCell
									className="text-end tabular-nums"
									dir="ltr"
								>
									{row.isCancelled ? "—" : row.runningBalance}
								</TableCell>
								<TableCell
									dir="ltr"
									className="font-mono text-xs"
								>
									{row.voucherNo}
								</TableCell>
								<TableCell className="max-w-40 truncate text-muted-foreground text-xs">
									{row.against ?? "—"}
								</TableCell>
							</TableRow>
						))}
						<TableRow className="bg-muted/40 font-medium">
							<TableCell colSpan={2}>الإقفال</TableCell>
							<TableCell
								className="text-end tabular-nums"
								dir="ltr"
							>
								{report?.closing.debit ?? "—"}
							</TableCell>
							<TableCell
								className="text-end tabular-nums"
								dir="ltr"
							>
								{report?.closing.credit ?? "—"}
							</TableCell>
							<TableCell
								className="text-end tabular-nums"
								dir="ltr"
							>
								{report?.closing.balance ?? "—"}
							</TableCell>
							<TableCell colSpan={2} />
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
