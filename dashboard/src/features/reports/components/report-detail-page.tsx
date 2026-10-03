import {
	IconBookmark,
	IconDownload,
	IconEye,
	IconFileTypePdf,
	IconPlus,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DateField } from "@/components/common/date-field";
import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { ReportDetailBreadcrumb } from "@/features/reports/components/report-detail-breadcrumb";
import { ReportWidgetCard } from "@/features/reports/components/report-widget-card";
import { useReport } from "@/features/reports/hooks/use-report";
import { useReportsStore } from "@/features/reports/stores/reports.store";
import { formatReportValue } from "@/features/reports/utils/format-report-value";
import { exportReportCsv, exportWidgetCsv } from "@/features/reports/utils/report-csv";
import {
	defaultReportRange,
	presetRange,
	type ReportPreset,
} from "@/features/reports/utils/report-range";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportDef } from "@/server/reports/reports.catalog";

const PRESETS: { value: ReportPreset; labelKey: string }[] = [
	{ value: "30d", labelKey: "reports.presets.last30" },
	{ value: "90d", labelKey: "reports.presets.last90" },
	{ value: "ytd", labelKey: "reports.presets.ytd" },
	{ value: "12m", labelKey: "reports.presets.last12m" },
];

/**
 * One report: its four headline figures, then its widget grid over the chosen window.
 *
 * The grid is driven entirely by the catalogue entry — the page never names a widget. A new
 * widget appears here the moment its key exists in both the catalogue and the builder, which
 * is what keeps «reports are code» from meaning «reports need UI work».
 */
export function ReportDetailPage({ report }: { report: ReportDef }) {
	const { t, lang } = useI18n();
	const savedView = useReportsStore((state) => state.views[report.id]);
	const saveView = useReportsStore((state) => state.saveView);
	const resetView = useReportsStore((state) => state.resetView);
	const toggleWidget = useReportsStore((state) => state.toggleWidget);

	// النطاق يبدأ من العرض المحفوظ لهذا التقرير، وإلا الافتراضي. الصفحة تُركَّب من جديد لكل
	// تقرير (مفتاح `reportId` في المسار)، فلا حاجة لمزامنة لاحقة تُلغي تعديلات المستخدم.
	const fallback = useMemo(() => defaultReportRange(), []);
	const [from, setFrom] = useState(savedView?.from || fallback.from);
	const [to, setTo] = useState(savedView?.to || fallback.to);

	const hidden = useMemo(() => new Set(savedView?.hiddenWidgets ?? []), [savedView]);
	const { report: payload, isLoading, isFetching } = useReport(report.id, from, to);

	const stats = useMemo<StatItem[]>(
		() =>
			(payload?.kpis ?? []).map((kpi) => ({
				title: kpi.label[lang],
				value: kpi.value,
				valueLabel: formatReportValue(kpi.value, kpi.format, lang),
				tooltip: kpi.tooltip[lang],
			})),
		[payload, lang],
	);

	const visibleWidgets = report.widgets.filter((widget) => !hidden.has(widget.key));

	const onSave = () => {
		saveView(report.id, { from, to, hiddenWidgets: [...hidden] });
		toast.success(t("reports.toast.viewSaved"));
	};

	const onExport = () => {
		if (!payload) return;
		exportReportCsv(report.id, report.title[lang], payload, visibleWidgets, lang);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden print:overflow-visible">
			<ReportDetailBreadcrumb title={report.title[lang]} />

			{/* شريط المؤشرات يحجز ارتفاعه أثناء التحميل حتى لا تقفز الشبكة تحته */}
			{stats.length > 0 ? (
				<Stats
					className="gap-3 px-3 py-3"
					variant="compact"
					stats={stats}
				/>
			) : (
				<div className="grid grid-cols-4 gap-3 px-3 py-3">
					{Array.from({ length: 4 }, (_, index) => (
						<Skeleton
							// عناصر هيكلية ثابتة العدد بلا هوية — الفهرس مفتاح مستقر لها
							// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder row
							key={index}
							className="h-[45px] rounded-[4px]"
						/>
					))}
				</div>
			)}

			<TableToolbar
				className="border-y print:hidden"
				buttonSize="xs"
				searchValue=""
				searchPlaceholder={report.description[lang]}
				searchClassName="w-72"
				showExport={false}
				leftExtra={
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1">
							{PRESETS.map((preset) => {
								const range = presetRange(preset.value);
								const active = range.from === from && range.to === to;
								return (
									<ToggleChip
										key={preset.value}
										active={active}
										onClick={() => {
											setFrom(range.from);
											setTo(range.to);
										}}
										className="h-6 px-2.5"
									>
										{t(preset.labelKey)}
									</ToggleChip>
								);
							})}
						</div>
						<DateField
							value={from}
							onChange={setFrom}
							placeholder={t("reports.detail.from")}
							className="h-6"
						/>
						<DateField
							value={to}
							onChange={setTo}
							placeholder={t("reports.detail.to")}
							className="h-6"
						/>
						{hidden.size > 0 ? (
							<Button
								type="button"
								variant="ghost"
								size="xs"
								className="gap-1.5"
								onClick={() => resetView(report.id)}
							>
								<IconEye className="size-3.5" />
								{t("reports.detail.showHidden", { count: hidden.size })}
							</Button>
						) : null}
					</div>
				}
				actions={
					<div className="flex items-center gap-2">
						<DisabledReasonTooltip reason={t("reports.detail.devOnlyWidget")}>
							<Button
								type="button"
								variant="outline"
								size="xs"
								disabled
								className="gap-1.5"
							>
								<IconPlus className="size-3.5" />
								{t("reports.detail.addWidget")}
							</Button>
						</DisabledReasonTooltip>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5"
							onClick={onExport}
							disabled={!payload}
						>
							<IconDownload className="size-3.5" />
							{t("reports.detail.exportCsv")}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5"
							onClick={() => window.print()}
						>
							<IconFileTypePdf className="size-3.5" />
							{t("reports.detail.exportPdf")}
						</Button>
						<Button
							type="button"
							size="xs"
							className="gap-1.5"
							onClick={onSave}
						>
							<IconBookmark className="size-3.5" />
							{t("reports.detail.save")}
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto p-3 print:overflow-visible">
				{isLoading ? (
					<p className="py-16 text-center text-muted-foreground text-sm">
						{t("reports.detail.loading")}
					</p>
				) : !payload ? (
					<p className="py-16 text-center text-muted-foreground text-sm">
						{t("reports.errors.load")}
					</p>
				) : (
					<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						{visibleWidgets.map((def) => {
							const widget = payload.widgets[def.key];
							if (!widget) return null;
							return (
								<ReportWidgetCard
									key={def.key}
									title={def.title[lang]}
									widget={widget}
									span={def.span}
									onExport={() =>
										exportWidgetCsv(`${report.id}-${def.key}`, def.title[lang], widget, lang)
									}
									onHide={() => toggleWidget(report.id, def.key, true)}
								/>
							);
						})}
					</div>
				)}
				{isFetching && !isLoading ? (
					<p className="py-3 text-center text-muted-foreground text-xs">
						{t("reports.detail.refreshing")}
					</p>
				) : null}
			</div>
		</div>
	);
}
