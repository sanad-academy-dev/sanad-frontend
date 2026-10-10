import { IconDownload, IconFileSpreadsheet } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { TableToolbar } from "@/components/common/table-toolbar";
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
import { useReceivablePayable } from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import { downloadXlsx } from "@/features/accounting/utils/export-xlsx";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";

/**
 * [P9.5] «أعمار الذمم» (§18.3) — AR/AP with configurable ageing buckets, detail +
 * per-party summary, all figures PLE-derived server-side. Drill-through: every detail
 * row links to دفتر الأستاذ العام filtered by the row's account (the GL report is the
 * §18.2 drill target).
 */

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export const ReceivablesPage = () => {
	const [side, setSide] = useState<"RECEIVABLE" | "PAYABLE">("RECEIVABLE");
	const [search, setSearch] = useState("");
	const [asOf, setAsOf] = useState(today());
	const [basedOn, setBasedOn] = useState("Posting");
	const [ranges, setRanges] = useState("30,60,90,120");
	const [view, setView] = useState<"detail" | "summary">("detail");
	// [MI-P5] FR-R12.2 «أعمار ذمم شركات التأمين» is this report narrowed to a party TYPE —
	// the BRD's "zero new engine" line, honoured literally: one filter, no second screen
	const [partyType, setPartyType] = useState<string>("all");

	const { report, isLoading } = useReceivablePayable({
		side,
		asOf,
		basedOn,
		ranges,
		summary: view === "summary",
		...(partyType === "all" ? {} : { partyType }),
	});

	const labels = report?.bucketLabels ?? [];
	const q = search.trim().toLowerCase();
	const visibleRows = (report?.rows ?? []).filter(
		(row) =>
			!q ||
			(row.voucherNo ?? "").toLowerCase().includes(q) ||
			(row.partyName ?? "").toLowerCase().includes(q),
	);

	const exportData = () => {
		if (!report) return { name: "ar-ap", headers: [] as string[], rows: [] as string[][] };
		if (view === "summary") {
			return {
				name: `${side.toLowerCase()}-summary`,
				headers: ["الطرف", "المستحق", ...labels],
				rows: report.summary.map((row) => [
					row.partyName ?? row.partyId ?? "",
					row.outstanding,
					...row.buckets,
				]),
			};
		}
		return {
			name: side.toLowerCase(),
			headers: [
				"المستند",
				"التاريخ",
				"الاستحقاق",
				"الطرف",
				"المفوتر",
				"المدفوع",
				"الإشعارات",
				"المستحق",
				"العمر",
				"الفئة",
			],
			rows: report.rows.map((row) => [
				row.voucherNo ?? row.voucherId,
				row.postingDate ? formatDisplayDate(row.postingDate.toString()) : "",
				row.dueDate ? formatDisplayDate(row.dueDate.toString()) : "",
				row.partyName ?? "",
				row.invoiced,
				row.paid,
				row.creditNotes,
				row.outstanding,
				String(row.ageDays),
				labels[row.bucketIndex] ?? "",
			]),
		};
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">أعمار الذمم</h1>
				<p className="text-muted-foreground text-sm">
					§18.3 — الذمم المدينة والدائنة من سجل الذمم حصريًا؛ الفئات قابلة للضبط ومجموعها يساوي
					المستحق ({report?.rows.length ?? 0}).
				</p>
			</div>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث بالمستند أو الطرف..."
				showFilter={false}
				showExport={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1">
							{(
								[
									["RECEIVABLE", "مدينة"],
									["PAYABLE", "دائنة"],
								] as const
							).map(([value, label]) => (
								<button
									key={value}
									type="button"
									onClick={() => setSide(value)}
									className={cn(
										"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
										side === value
											? "border-primary bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted",
									)}
								>
									{label}
								</button>
							))}
							{(
								[
									["detail", "تفصيلي"],
									["summary", "حسب الطرف"],
								] as const
							).map(([value, label]) => (
								<button
									key={value}
									type="button"
									onClick={() => setView(value)}
									className={cn(
										"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
										view === value
											? "border-primary bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted",
									)}
								>
									{label}
								</button>
							))}
						</div>
						{side === "RECEIVABLE" && (
							<div className="flex items-center gap-1">
								{(
									[
										["all", "كل الأطراف"],
										["Insurer", "شركات التأمين"],
										["Owner", "أولياء الأمور"],
									] as const
								).map(([value, label]) => (
									<button
										key={value}
										type="button"
										onClick={() => setPartyType(value)}
										className={cn(
											"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
											partyType === value
												? "border-primary bg-primary text-primary-foreground"
												: "text-muted-foreground hover:bg-muted",
										)}
									>
										{label}
									</button>
								))}
							</div>
						)}
						<DateField
							value={asOf}
							onChange={setAsOf}
							placeholder="حتى تاريخ"
						/>
						<div className="w-36">
							<Select
								value={basedOn}
								onValueChange={setBasedOn}
								dir="rtl"
							>
								<SelectTrigger className="h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									<SelectItem value="Posting">حسب تاريخ الترحيل</SelectItem>
									<SelectItem value="Due">حسب تاريخ الاستحقاق</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<input
							dir="ltr"
							value={ranges}
							onChange={(event) => setRanges(event.target.value)}
							aria-label="نطاقات الأعمار"
							className="h-8 w-32 rounded-md border border-input bg-transparent px-2 text-end text-xs tabular-nums"
						/>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5 px-2"
							onClick={() => {
								const data = exportData();
								downloadCsv(data.name, data.headers, data.rows);
							}}
						>
							<IconDownload className="size-3.5" /> CSV
						</Button>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5 px-2"
							onClick={() => {
								const data = exportData();
								void downloadXlsx(data.name, "أعمار الذمم", data.headers, data.rows);
							}}
						>
							<IconFileSpreadsheet className="size-3.5" /> Excel
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{isLoading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : view === "summary" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الطرف</TableHead>
								<TableHead className="text-end">المستحق</TableHead>
								{labels.map((label) => (
									<TableHead
										key={label}
										className="text-end"
										dir="ltr"
									>
										{label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{(report?.summary ?? []).map((row) => (
								<TableRow key={`${row.partyType}-${row.partyId}`}>
									<TableCell>{row.partyName ?? row.partyId}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.outstanding)}
									</TableCell>
									{row.buckets.map((bucket, i) => (
										<TableCell
											key={`${row.partyId}-${i}`}
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(bucket)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المستند</TableHead>
								<TableHead>الطرف</TableHead>
								<TableHead>الاستحقاق</TableHead>
								<TableHead className="text-end">المفوتر</TableHead>
								<TableHead className="text-end">المدفوع</TableHead>
								<TableHead className="text-end">الإشعارات</TableHead>
								<TableHead className="text-end">المستحق</TableHead>
								<TableHead className="text-end">العمر</TableHead>
								<TableHead>الفئة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleRows.map((row) => (
								<TableRow key={`${row.voucherType}-${row.voucherId}`}>
									<TableCell dir="ltr">
										{/* §18.3 drill-through → the GL report (§18.2 target) */}
										<Link
											to="/management/accounting/general-ledger"
											search={{ accountId: row.accountId }}
											className="text-primary underline-offset-2 hover:underline"
										>
											{row.voucherNo ?? row.voucherId}
										</Link>
									</TableCell>
									<TableCell>{row.partyName ?? ""}</TableCell>
									<TableCell dir="ltr">
										{row.dueDate ? formatDisplayDate(row.dueDate.toString()) : "—"}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.invoiced)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.paid)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.creditNotes)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.outstanding)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{row.ageDays}
									</TableCell>
									<TableCell dir="ltr">{labels[row.bucketIndex]}</TableCell>
								</TableRow>
							))}
							{visibleRows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={9}
										className="py-8 text-center text-muted-foreground"
									>
										لا ذمم مفتوحة حتى هذا التاريخ.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				)}
			</div>

			{report && view === "detail" ? (
				<div className="flex flex-wrap items-center gap-3 border-t px-4 py-2 text-xs">
					{/* roll-ups sum BASE currency only (dossier risk 4) */}
					<span className="font-semibold">
						الإجمالي (بعملة الشركة):{" "}
						<span
							dir="ltr"
							className="tabular-nums"
						>
							{formatAmount(report.totalOutstandingBase)}
						</span>
					</span>
					{labels.map((label, i) => (
						<span
							key={label}
							className="text-muted-foreground"
						>
							<span dir="ltr">{label}</span>:{" "}
							<span
								dir="ltr"
								className="tabular-nums"
							>
								{formatAmount(report.bucketTotals[i] ?? "0")}
							</span>
						</span>
					))}
				</div>
			) : null}
		</div>
	);
};
