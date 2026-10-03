import { IconDownload } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useGrossProfit,
	useInvoiceTrends,
	useLedgerDebug,
	usePartyLedgerSummary,
} from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";

/**
 * [P9.4] «تحليلات الدفاتر» — the four remaining §18 reports in one tab with in-page
 * pills (§7.8 hub rule): ملخص أرصدة الأطراف (PLE)، الربح الإجمالي (بذرة تقييم قابلة
 * للاستبدال)، اتجاهات الفواتير الشهرية، وفحص الدفاتر (توازن القيود + انحراف سجل الذمم).
 */

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const TABS = [
	{ value: "parties", label: "ملخص أرصدة الأطراف" },
	{ value: "grossProfit", label: "الربح الإجمالي" },
	{ value: "trends", label: "اتجاهات الفواتير" },
	{ value: "debug", label: "فحص الدفاتر" },
] as const;
type Tab = (typeof TABS)[number]["value"];

const MONTHS_AR = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
] as const;

export const LedgerAnalyticsPage = () => {
	const [tab, setTab] = useState<Tab>("parties");
	const [search, setSearch] = useState("");
	const [side, setSide] = useState<"RECEIVABLE" | "PAYABLE">("RECEIVABLE");
	const [trendSide, setTrendSide] = useState<"sales" | "purchase">("sales");
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [year, setYear] = useState(String(new Date().getFullYear()));

	const { report: parties, isLoading: partiesLoading } = usePartyLedgerSummary({
		side,
		fromDate,
		toDate,
	});
	const { report: grossProfit, isLoading: gpLoading } = useGrossProfit({ fromDate, toDate });
	const { report: trends, isLoading: trendsLoading } = useInvoiceTrends({
		side: trendSide,
		year,
	});
	const { report: debug, isLoading: debugLoading } = useLedgerDebug();

	const q = search.trim().toLowerCase();
	const visibleParties = useMemo(
		() =>
			(parties?.rows ?? []).filter(
				(row) => !q || (row.partyName ?? "").toLowerCase().includes(q),
			),
		[parties, q],
	);
	const visibleGp = useMemo(
		() =>
			(grossProfit?.rows ?? []).filter(
				(row) =>
					!q ||
					row.itemName.toLowerCase().includes(q) ||
					(row.documentNo ?? "").toLowerCase().includes(q),
			),
		[grossProfit, q],
	);

	const exportCsv = () => {
		if (tab === "parties" && parties) {
			downloadCsv(
				`party-ledger-summary-${side.toLowerCase()}`,
				["الطرف", "رصيد أول المدة", "المفوتر", "المدفوع", "المرتجعات", "رصيد آخر المدة"],
				visibleParties.map((row) => [
					row.partyName ?? row.partyId,
					row.openingBalance,
					row.invoiced,
					row.paid,
					row.returns,
					row.closingBalance,
				]),
			);
			return;
		}
		if (tab === "grossProfit" && grossProfit) {
			downloadCsv(
				"gross-profit",
				[
					"الفاتورة",
					"التاريخ",
					"الصنف",
					"الكمية",
					"السعر",
					"المبيع",
					"سعر التقييم",
					"التكلفة",
					"الربح الإجمالي",
				],
				visibleGp.map((row) => [
					row.documentNo ?? row.invoiceId,
					isoDay(row.postingDate.toString()),
					row.itemName,
					row.qty,
					row.rate,
					row.amount,
					row.valuationRate,
					row.buyingAmount,
					row.grossProfit,
				]),
			);
			return;
		}
		if (tab === "trends" && trends) {
			downloadCsv(
				`invoice-trends-${trendSide}-${year}`,
				["الشهر", "عدد الفواتير", "الصافي", "الإجمالي"],
				trends.months.map((bucket) => [
					MONTHS_AR[bucket.month - 1] ?? String(bucket.month),
					String(bucket.count),
					bucket.netTotal,
					bucket.grandTotal,
				]),
			);
			return;
		}
		if (debug) {
			downloadCsv(
				"ledger-debug",
				["النوع", "المرجع", "التفاصيل", "الفرق"],
				[
					...debug.voucherwiseImbalance.map((row) => [
						"قيد غير متوازن",
						`${row.voucherType}:${row.voucherId}`,
						"",
						row.difference,
					]),
					...debug.pleGlDrift.map((row) => [
						"انحراف سجل الذمم",
						row.accountName,
						`GL ${row.glBalance} / PLE ${row.pleBalance}`,
						row.drift,
					]),
				],
			);
		}
	};

	const loading =
		tab === "parties"
			? partiesLoading
			: tab === "grossProfit"
				? gpLoading
				: tab === "trends"
					? trendsLoading
					: debugLoading;
	const debugClean =
		debug && debug.voucherwiseImbalance.length === 0 && debug.pleGlDrift.length === 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">تحليلات الدفاتر</h1>
				<p className="text-muted-foreground text-sm">
					§18 — ملخص أرصدة الأطراف من سجل الذمم، الربح الإجمالي (تقييم بآخر سعر شراء)، اتجاهات
					الفواتير الشهرية، وفحص توازن الدفاتر.
				</p>
			</div>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث بالطرف أو الصنف أو الفاتورة..."
				showFilter={false}
				showExport={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1">
							{TABS.map((entry) => (
								<button
									key={entry.value}
									type="button"
									onClick={() => setTab(entry.value)}
									className={cn(
										"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
										tab === entry.value
											? "border-primary bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted",
									)}
								>
									{entry.label}
								</button>
							))}
						</div>
						{tab === "parties" ? (
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
							</div>
						) : null}
						{tab === "trends" ? (
							<div className="flex items-center gap-1">
								{(
									[
										["sales", "مبيعات"],
										["purchase", "مشتريات"],
									] as const
								).map(([value, label]) => (
									<button
										key={value}
										type="button"
										onClick={() => setTrendSide(value)}
										className={cn(
											"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
											trendSide === value
												? "border-primary bg-primary text-primary-foreground"
												: "text-muted-foreground hover:bg-muted",
										)}
									>
										{label}
									</button>
								))}
							</div>
						) : null}
						{tab === "parties" || tab === "grossProfit" ? (
							<>
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
							</>
						) : null}
						{tab === "trends" ? (
							<input
								dir="ltr"
								value={year}
								onChange={(event) => setYear(event.target.value)}
								aria-label="السنة"
								className="h-8 w-20 rounded-md border border-input bg-transparent px-2 text-end text-xs tabular-nums"
							/>
						) : null}
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={exportCsv}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{loading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : tab === "parties" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الطرف</TableHead>
								<TableHead className="text-end">رصيد أول المدة</TableHead>
								<TableHead className="text-end">المفوتر</TableHead>
								<TableHead className="text-end">المدفوع</TableHead>
								<TableHead className="text-end">المرتجعات</TableHead>
								<TableHead className="text-end">رصيد آخر المدة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleParties.map((row) => (
								<TableRow key={`${row.partyType}-${row.partyId}`}>
									<TableCell>{row.partyName ?? row.partyId}</TableCell>
									{[
										row.openingBalance,
										row.invoiced,
										row.paid,
										row.returns,
										row.closingBalance,
									].map((value, i) => (
										<TableCell
											key={`${row.partyId}-${i}`}
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(value)}
										</TableCell>
									))}
								</TableRow>
							))}
							{parties && visibleParties.length > 0 ? (
								<TableRow className="bg-muted/60 font-semibold">
									<TableCell>الإجمالي</TableCell>
									{[
										parties.totals.openingBalance,
										parties.totals.invoiced,
										parties.totals.paid,
										parties.totals.returns,
										parties.totals.closingBalance,
									].map((value, i) => (
										<TableCell
											key={`totals-${i}`}
											className="text-end tabular-nums"
											dir="ltr"
										>
											{formatAmount(value)}
										</TableCell>
									))}
								</TableRow>
							) : null}
							{visibleParties.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="py-8 text-center text-muted-foreground"
									>
										لا أطراف في النطاق.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				) : tab === "grossProfit" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الفاتورة</TableHead>
								<TableHead>التاريخ</TableHead>
								<TableHead>الصنف</TableHead>
								<TableHead className="text-end">الكمية</TableHead>
								<TableHead className="text-end">المبيع</TableHead>
								<TableHead className="text-end">سعر التقييم</TableHead>
								<TableHead className="text-end">التكلفة</TableHead>
								<TableHead className="text-end">الربح الإجمالي</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleGp.map((row, index) => (
								<TableRow key={`${row.invoiceId}-${index}`}>
									<TableCell dir="ltr">{row.documentNo ?? ""}</TableCell>
									<TableCell dir="ltr">{isoDay(row.postingDate.toString())}</TableCell>
									<TableCell>{row.itemName}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{row.qty}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.amount)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.valuationRate)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.buyingAmount)}
									</TableCell>
									<TableCell
										className="text-end font-medium tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.grossProfit)}
									</TableCell>
								</TableRow>
							))}
							{grossProfit && visibleGp.length > 0 ? (
								<TableRow className="bg-muted/60 font-semibold">
									<TableCell colSpan={4}>الإجمالي</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(grossProfit.totals.selling)}
									</TableCell>
									<TableCell />
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(grossProfit.totals.buying)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(grossProfit.totals.grossProfit)}
									</TableCell>
								</TableRow>
							) : null}
							{visibleGp.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="py-8 text-center text-muted-foreground"
									>
										لا فواتير مبيعات معتمدة في النطاق.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				) : tab === "trends" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الشهر</TableHead>
								<TableHead className="text-end">عدد الفواتير</TableHead>
								<TableHead className="text-end">الصافي</TableHead>
								<TableHead className="text-end">الإجمالي</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{(trends?.months ?? []).map((bucket) => (
								<TableRow key={bucket.month}>
									<TableCell>{MONTHS_AR[bucket.month - 1]}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{bucket.count}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(bucket.netTotal)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(bucket.grandTotal)}
									</TableCell>
								</TableRow>
							))}
							{trends ? (
								<TableRow className="bg-muted/60 font-semibold">
									<TableCell>إجمالي {year}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{trends.totals.count}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(trends.totals.netTotal)}
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(trends.totals.grandTotal)}
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				) : (
					<div className="flex flex-col gap-4 p-4">
						{debugClean ? (
							<div className="flex items-center gap-2">
								<Badge variant="secondary">الدفاتر سليمة</Badge>
								<p className="text-muted-foreground text-sm">
									كل القيود المعتمدة متوازنة، وسجل الذمم مطابق لدفتر الأستاذ على حسابات الذمم.
								</p>
							</div>
						) : null}
						{debug && debug.voucherwiseImbalance.length > 0 ? (
							<div>
								<h2 className="mb-2 font-medium text-sm">قيود غير متوازنة (§6)</h2>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>نوع المستند</TableHead>
											<TableHead>المعرّف</TableHead>
											<TableHead className="text-end">الفرق (مدين − دائن)</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{debug.voucherwiseImbalance.map((row) => (
											<TableRow key={`${row.voucherType}-${row.voucherId}`}>
												<TableCell dir="ltr">{row.voucherType}</TableCell>
												<TableCell dir="ltr">{row.voucherId}</TableCell>
												<TableCell
													className="text-end tabular-nums"
													dir="ltr"
												>
													{row.difference}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : null}
						{debug && debug.pleGlDrift.length > 0 ? (
							<div>
								<h2 className="mb-2 font-medium text-sm">انحراف سجل الذمم عن دفتر الأستاذ</h2>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>الحساب</TableHead>
											<TableHead className="text-end">رصيد الأستاذ</TableHead>
											<TableHead className="text-end">رصيد سجل الذمم</TableHead>
											<TableHead className="text-end">الانحراف</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{debug.pleGlDrift.map((row) => (
											<TableRow key={row.accountId}>
												<TableCell>
													{/* drill-through → GL report (§18.2 target) */}
													<Link
														to="/management/accounting/general-ledger"
														search={{ accountId: row.accountId }}
														className="underline-offset-2 hover:text-primary hover:underline"
													>
														{row.accountName}
													</Link>
												</TableCell>
												<TableCell
													className="text-end tabular-nums"
													dir="ltr"
												>
													{formatAmount(row.glBalance)}
												</TableCell>
												<TableCell
													className="text-end tabular-nums"
													dir="ltr"
												>
													{formatAmount(row.pleBalance)}
												</TableCell>
												<TableCell
													className="text-end tabular-nums"
													dir="ltr"
												>
													{row.drift}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
};
