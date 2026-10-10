import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useBenefitUsage,
	useClaimsRegister,
	useMembershipRevenue,
} from "@/features/accounting/reports/hooks/use-accounting-reports";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import { cn } from "@/lib/utils";

/**
 * [MI-P6] The three MI §12 reports that needed a screen. «أعمار ذمم شركات التأمين»
 * (FR-R12.2) is NOT here on purpose — the BRD defines it as the existing «أعمار الذمم»
 * report filtered to party type Insurer, and MI-P5 shipped that filter. FR-R12.5 is [P2].
 *
 * Read-only, Arabic, design tokens only; each screen is a thin table over a server-side
 * report — the client formats, it never computes (C2).
 */

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => `${new Date().toISOString().slice(0, 7)}-01`;

const PageShell = ({
	title,
	hint,
	from,
	to,
	onFrom,
	onTo,
	children,
	extra,
}: {
	title: string;
	hint: string;
	from: string;
	to: string;
	onFrom: (value: string) => void;
	onTo: (value: string) => void;
	children: React.ReactNode;
	extra?: React.ReactNode;
}) => (
	<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
		<div className="px-4 pt-3">
			<h1 className="font-medium text-lg">{title}</h1>
			<p className="text-muted-foreground text-sm">{hint}</p>
		</div>
		<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
			<DateField
				value={from}
				onChange={onFrom}
				placeholder="من"
			/>
			<DateField
				value={to}
				onChange={onTo}
				placeholder="إلى"
			/>
			{extra}
		</div>
		<div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
	</div>
);

const Empty = ({ message }: { message: string }) => (
	<p className="p-6 text-center text-muted-foreground text-sm">{message}</p>
);

/* ── FR-R12.1 ───────────────────────────────────────────────────────────────────────── */

const CLAIM_STATUS_LABEL: Record<string, string> = {
	DRAFT: "مسودة",
	SUBMITTED: "مُرسلة",
	APPROVED: "معتمدة",
	PARTIALLY_APPROVED: "معتمدة جزئيًا",
	REJECTED: "مرفوضة",
	SETTLED: "مُسوّاة",
	CANCELLED: "ملغاة",
};

export const InsuranceClaimsRegisterReportPage = () => {
	const [fromDate, setFromDate] = useState(monthStart());
	const [toDate, setToDate] = useState(today());
	const [status, setStatus] = useState("");
	const { report, isLoading } = useClaimsRegister({
		fromDate,
		toDate,
		status: status || undefined,
	});

	return (
		<PageShell
			title="سجل المطالبات التأمينية"
			hint="المُطالَب به والمعتمد والمحصَّل لكل مطالبة، وعمرها منذ الإرسال مقابل مهلة السداد المتفق عليها مع الشركة."
			from={fromDate}
			to={toDate}
			onFrom={setFromDate}
			onTo={setToDate}
			extra={
				<div className="flex items-center gap-1">
					{[
						["", "الكل"],
						["SUBMITTED", "مُرسلة"],
						["PARTIALLY_APPROVED", "معتمدة جزئيًا"],
						["SETTLED", "مُسوّاة"],
					].map(([value, label]) => (
						<button
							key={value || "all"}
							type="button"
							onClick={() => setStatus(value)}
							className={cn(
								"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
								status === value
									? "border-primary bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted",
							)}
						>
							{label}
						</button>
					))}
					{report && report.overdueCount > 0 && (
						<Badge
							variant="destructive"
							className="ms-2"
						>
							{report.overdueCount} متأخرة عن المهلة
						</Badge>
					)}
				</div>
			}
		>
			{isLoading ? (
				<Empty message="جارٍ التحميل…" />
			) : !report || report.rows.length === 0 ? (
				<Empty message="لا مطالبات في هذه الفترة." />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>المطالبة</TableHead>
							<TableHead>شركة التأمين</TableHead>
							<TableHead>الطفل / وليّ الأمر</TableHead>
							<TableHead>الفاتورة</TableHead>
							<TableHead>تاريخ الدورة</TableHead>
							<TableHead className="text-end">المُطالَب به</TableHead>
							<TableHead className="text-end">المعتمد</TableHead>
							<TableHead className="text-end">المحصَّل</TableHead>
							<TableHead className="text-end">المتبقي</TableHead>
							<TableHead className="text-end">العمر / المهلة</TableHead>
							<TableHead>الحالة</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{report.rows.map((row) => (
							<TableRow
								key={row.claimId}
								className={cn(row.overdue && "bg-destructive/5")}
							>
								<TableCell className="font-medium">{row.documentNo ?? "مسودة"}</TableCell>
								<TableCell>{row.insurerName}</TableCell>
								<TableCell className="text-xs">
									{row.patientName}
									<span className="ms-1 text-muted-foreground">({row.ownerName})</span>
								</TableCell>
								<TableCell className="text-xs">{row.invoiceCode}</TableCell>
								<TableCell className="text-xs tabular-nums">
									{formatDisplayDate(row.serviceDate)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.claimedAmount)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{row.approvedAmount === null ? "—" : formatAmount(row.approvedAmount)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.settledAmount)}
								</TableCell>
								<TableCell className="text-end font-medium tabular-nums">
									{formatAmount(row.openAmount)}
								</TableCell>
								<TableCell
									className={cn(
										"text-end text-xs tabular-nums",
										row.overdue && "font-semibold text-destructive",
									)}
								>
									{row.ageDays === null
										? "لم تُرسل"
										: `${row.ageDays} / ${row.settlementDays ?? "—"} يوم`}
								</TableCell>
								<TableCell className="text-xs">
									{CLAIM_STATUS_LABEL[row.status] ?? row.status}
								</TableCell>
							</TableRow>
						))}
						<TableRow className="border-t-2 font-semibold">
							<TableCell colSpan={5}>الإجمالي</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.claimed)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.approved)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.settled)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.open)}
							</TableCell>
							<TableCell colSpan={2} />
						</TableRow>
					</TableBody>
				</Table>
			)}
		</PageShell>
	);
};

/* ── FR-R12.3 ───────────────────────────────────────────────────────────────────────── */

export const MembershipRevenueReportPage = () => {
	const [fromDate, setFromDate] = useState(monthStart());
	const [toDate, setToDate] = useState(today());
	const { report, isLoading } = useMembershipRevenue({ fromDate, toDate });

	return (
		<PageShell
			title="إيراد العضويات"
			hint="لكل خطة: المفوتر مقابل المعترف به مقابل رصيد الإيراد المؤجَّل — كل الأرقام صافية من الضريبة، لأن التأجيل يعمل على الصافي."
			from={fromDate}
			to={toDate}
			onFrom={setFromDate}
			onTo={setToDate}
		>
			{isLoading ? (
				<Empty message="جارٍ التحميل…" />
			) : !report || report.rows.length === 0 ? (
				<Empty message="لا عضويات بعد." />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الخطة</TableHead>
							<TableHead className="text-end">الأعضاء</TableHead>
							<TableHead className="text-end">الفواتير</TableHead>
							<TableHead className="text-end">المفوتر (صافي)</TableHead>
							<TableHead className="text-end">المعترف به</TableHead>
							<TableHead className="text-end">رصيد مؤجَّل</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{report.rows.map((row) => (
							<TableRow key={row.planId}>
								<TableCell className="font-medium">{row.planName}</TableCell>
								<TableCell className="text-end tabular-nums">{row.memberCount}</TableCell>
								<TableCell className="text-end tabular-nums">{row.invoiceCount}</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.billed)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.recognized)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.deferredBalance)}
								</TableCell>
							</TableRow>
						))}
						<TableRow className="border-t-2 font-semibold">
							<TableCell colSpan={3}>الإجمالي</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.billed)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.recognized)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.deferredBalance)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</PageShell>
	);
};

/* ── FR-R12.4 ───────────────────────────────────────────────────────────────────────── */

export const BenefitUsageReportPage = () => {
	const [fromDate, setFromDate] = useState(monthStart());
	const [toDate, setToDate] = useState(today());
	const { report, isLoading } = useBenefitUsage({ fromDate, toDate });

	return (
		<PageShell
			title="استخدام مزايا العضويات"
			hint="ما أعطته كل خطة مقابل ما حصّلته: الخصم الممنوح، ونسبة استهلاك الوحدات، ورسوم العضوية المحصَّلة فعلًا (لا المفوترة) — والفرق بينهما."
			from={fromDate}
			to={toDate}
			onFrom={setFromDate}
			onTo={setToDate}
		>
			{isLoading ? (
				<Empty message="جارٍ التحميل…" />
			) : !report || report.rows.length === 0 ? (
				<Empty message="لا عضويات بعد." />
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الخطة</TableHead>
							<TableHead className="text-end">الأعضاء</TableHead>
							<TableHead className="text-end">قبل الخصم</TableHead>
							<TableHead className="text-end">بعد الخصم</TableHead>
							<TableHead className="text-end">الخصم الممنوح</TableHead>
							<TableHead className="text-end">الوحدات (مستهلك/ممنوح)</TableHead>
							<TableHead className="text-end">نسبة الاستهلاك</TableHead>
							<TableHead className="text-end">رسوم محصَّلة</TableHead>
							<TableHead className="text-end">الصافي للأكاديمية</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{report.rows.map((row) => (
							<TableRow key={row.planId}>
								<TableCell className="font-medium">{row.planName}</TableCell>
								<TableCell className="text-end tabular-nums">{row.memberCount}</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.gross)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.net)}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.discountGiven)}
								</TableCell>
								<TableCell className="text-end text-xs tabular-nums">
									{row.unitsConsumed} / {row.unitsGranted}
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{row.consumptionPercent}%
								</TableCell>
								<TableCell className="text-end tabular-nums">
									{formatAmount(row.feesPaid)}
								</TableCell>
								<TableCell
									className={cn(
										"text-end font-medium tabular-nums",
										Number(row.netContribution) < 0 && "text-destructive",
									)}
								>
									{formatAmount(row.netContribution)}
								</TableCell>
							</TableRow>
						))}
						<TableRow className="border-t-2 font-semibold">
							<TableCell colSpan={4}>الإجمالي</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.discountGiven)}
							</TableCell>
							<TableCell colSpan={2} />
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.feesPaid)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(report.totals.netContribution)}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</PageShell>
	);
};
