import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import { useCrmReports } from "@/features/crm/hooks/use-crm-reports";
import { CrmModuleHeader } from "@/features/crm/navigation/crm-module-header";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

/**
 * [CRM-P6] «التقارير» (§12) — الصفّ الرابع من §11.1، المؤجَّل منذ CRM-P1 لأنّ الصفقات
 * لم تكن موجودة بعد.
 *
 * كل الأرقام من نداءٍ واحد: الشاشة تعرضها معًا وتُرشِّحها معًا، وسبع رحلاتٍ شبكية
 * بنفس المرشّحات كانت ستضع أرقامًا من لحظاتٍ مختلفة جنبًا إلى جنب.
 *
 * [UI] على عقد `/services/staff`: الهيدر المشترك، ثمّ `Stats`، ثمّ شريط المرشّحات.
 */
export const Route = createFileRoute("/_pathless-layout/crm/reports")({
	component: CrmReportsRoute,
});

const monthLabel = (month: string) => {
	const [year, index] = month.split("-");
	return new Date(Number(year), Number(index) - 1, 1).toLocaleDateString("ar", {
		month: "long",
		year: "numeric",
	});
};

function CrmReportsRoute() {
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const filters = useMemo(
		() => ({ ...(from ? { from } : {}), ...(to ? { to } : {}) }),
		[from, to],
	);
	const { reports, isLoading } = useCrmReports(filters);

	// `StatItem.value` رقم، و`valueLabel` هي ما يُعرض — فالنسب تسكن اللافتة لا القيمة
	const stats = useMemo<StatItem[]>(() => {
		const funnel = reports?.funnel;
		return [
			{
				title: "العملاء المحتملون",
				value: funnel?.totalLeads ?? 0,
				tooltip: "كل من دخل في المدّة المحدَّدة",
			},
			{
				title: "المحوَّلون",
				value: funnel?.convertedLeads ?? 0,
				valueLabel: `${funnel?.convertedLeads ?? 0} (${funnel?.conversionRate ?? 0}٪)`,
				tooltip: "النسبة من إجمالي العملاء المحتملين لا من المرحلة السابقة",
			},
			{
				title: "الصفقات المكسوبة",
				value: funnel?.wonDeals ?? 0,
				valueLabel: `${funnel?.wonDeals ?? 0} (${funnel?.winRate ?? 0}٪)`,
				tooltip: "النسبة من إجمالي العملاء المحتملين — كم بقي من مئة",
			},
			{
				title: "متوسّط التحويل / الكسب",
				value: reports?.avgDaysToConvert ?? 0,
				valueLabel: `${reports?.avgDaysToConvert ?? "—"} / ${reports?.avgDaysToWin ?? "—"} يوم`,
				tooltip: "يتجاهل ما لم يُحوَّل أو يُكسب بعد بدل عدّه صفرًا",
			},
		];
	}, [reports]);

	const pipelineTotal = useMemo(
		() =>
			(reports?.dealsByStatus ?? [])
				.filter((row) => row.kind === "OPEN")
				.reduce((sum, row) => sum + row.dealValue, 0),
		[reports],
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CrmModuleHeader active="/crm/reports" />

			<Stats
				className="grid-cols-4 px-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<Label
								htmlFor="crm-report-from"
								className="font-normal text-[12px]"
							>
								من
							</Label>
							<Input
								id="crm-report-from"
								type="date"
								className="h-8 w-auto text-[12px]"
								value={from}
								onChange={(event) => setFrom(event.target.value)}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Label
								htmlFor="crm-report-to"
								className="font-normal text-[12px]"
							>
								إلى
							</Label>
							<Input
								id="crm-report-to"
								type="date"
								className="h-8 w-auto text-[12px]"
								value={to}
								onChange={(event) => setTo(event.target.value)}
							/>
						</div>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto p-4">
				{isLoading ? (
					<div className="space-y-3">
						<Skeleton className="h-40 w-full" />
						<Skeleton className="h-40 w-full" />
					</div>
				) : (
					<div className="grid gap-4 lg:grid-cols-2">
						<section className="rounded-lg border">
							<header className="border-b px-4 py-2.5">
								<h2 className="font-medium text-sm">العملاء المحتملون بحسب الحالة</h2>
							</header>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>الحالة</TableHead>
										<TableHead className="text-end">العدد</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(reports?.leadsByStatus ?? []).map((row) => (
										<TableRow key={row.statusId}>
											<TableCell>
												<LeadStatusPill
													name={row.name}
													color={row.color}
												/>
											</TableCell>
											<TableCell className="text-end tabular-nums">{row.count}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</section>

						<section className="rounded-lg border">
							<header className="flex items-center justify-between border-b px-4 py-2.5">
								<h2 className="font-medium text-sm">خطّ الأنابيب بحسب المرحلة</h2>
								<span className="text-muted-foreground text-xs">
									المفتوح: {formatAmount(pipelineTotal)}
								</span>
							</header>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>المرحلة</TableHead>
										<TableHead className="text-end">العدد</TableHead>
										<TableHead className="text-end">القيمة</TableHead>
										<TableHead className="text-end">المتوقّعة</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(reports?.dealsByStatus ?? []).map((row) => (
										<TableRow key={row.statusId}>
											<TableCell>
												<LeadStatusPill
													name={row.name}
													color={row.color}
												/>
											</TableCell>
											<TableCell className="text-end tabular-nums">{row.count}</TableCell>
											<TableCell className="text-end tabular-nums">
												{formatAmount(row.dealValue)}
											</TableCell>
											<TableCell className="text-end tabular-nums">
												{formatAmount(row.expectedValue)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</section>

						<section className="rounded-lg border">
							<header className="border-b px-4 py-2.5">
								<h2 className="font-medium text-sm">التنبّؤ بحسب شهر الإغلاق المتوقّع</h2>
							</header>
							{(reports?.forecast ?? []).length === 0 ? (
								<p className="p-4 text-muted-foreground text-sm">
									لا صفقات بتاريخ إغلاق متوقَّع — الصفقات بلا تاريخ لا تدخل التنبّؤ.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>الشهر</TableHead>
											<TableHead className="text-end">القيمة المتوقّعة</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(reports?.forecast ?? []).map((row) => (
											<TableRow key={row.month}>
												<TableCell>{monthLabel(row.month)}</TableCell>
												<TableCell className="text-end tabular-nums">
													{formatAmount(row.total)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</section>

						<section className="rounded-lg border">
							<header className="border-b px-4 py-2.5">
								<h2 className="font-medium text-sm">أسباب الخسارة</h2>
							</header>
							{(reports?.lostReasons ?? []).length === 0 ? (
								<p className="p-4 text-muted-foreground text-sm">لا صفقات مفقودة في المدّة</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>السبب</TableHead>
											<TableHead className="text-end">العدد</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(reports?.lostReasons ?? []).map((row) => (
											<TableRow key={row.reasonId ?? "none"}>
												<TableCell>
													{row.reasonId ? (
														row.name
													) : (
														<Badge variant="secondary">{row.name}</Badge>
													)}
												</TableCell>
												<TableCell className="text-end tabular-nums">{row.count}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</section>

						<section className="rounded-lg border lg:col-span-2">
							<header className="border-b px-4 py-2.5">
								<h2 className="font-medium text-sm">أداء الموظّفين</h2>
							</header>
							{(reports?.agents ?? []).length === 0 ? (
								<p className="p-4 text-muted-foreground text-sm">
									لا سجلّات مُسنَدة في المدّة المحدَّدة
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>الموظّف</TableHead>
											<TableHead className="text-end">عملاء مُسنَدون</TableHead>
											<TableHead className="text-end">محوَّلون</TableHead>
											<TableHead className="text-end">صفقات مكسوبة</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(reports?.agents ?? []).map((row) => (
											<TableRow key={row.userId}>
												<TableCell>{row.name}</TableCell>
												<TableCell className="text-end tabular-nums">
													{row.assignedLeads}
												</TableCell>
												<TableCell className="text-end tabular-nums">
													{row.convertedLeads}
												</TableCell>
												<TableCell className="text-end tabular-nums">{row.wonDeals}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</section>
					</div>
				)}
			</div>
		</div>
	);
}
