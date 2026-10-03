import { IconSparkles } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { ToggleChip } from "@/components/common/toggle-chip";
import { Button } from "@/components/ui/button";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { ReportListRow } from "@/features/reports/components/report-list-row";
import { formatIsoDay } from "@/features/reports/utils/format-report-value";
import { exportReportCsv } from "@/features/reports/utils/report-csv";
import { useI18n } from "@/hooks/use-i18n";
import { usePermissions } from "@/hooks/use-permissions";
import { api } from "@/lib/api";
import {
	REPORT_CATALOG,
	REPORT_CATEGORIES,
	type ReportCategoryId,
	type ReportDef,
} from "@sanad/contracts/runtime/server/reports/reports.catalog";
import type { ReportPayload } from "@/server/reports/reports.type";

/**
 * The reports index — every report the build ships, filtered to what the operator is allowed
 * to read.
 *
 * There is deliberately no «create report» here: a report is a catalogue entry plus a
 * builder, both authored by developers. The AI-authoring affordance from the design is kept
 * visible but disabled so the rule is stated where someone would go looking for it, rather
 * than leaving a gap on the toolbar.
 */
export function ReportsListPage() {
	const { t, lang } = useI18n();
	const { canView } = usePermissions();
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<ReportCategoryId | "all">("all");

	// A report reads a module's tables, so it inherits that module's view gate — the server
	// enforces the same rule, this only keeps unreachable rows off the screen.
	const allowed = useMemo(
		() => REPORT_CATALOG.filter((report) => !report.gate || canView(report.gate)),
		[canView],
	);

	const visible = useMemo(() => {
		const query = search.trim().toLowerCase();
		return allowed.filter((report) => {
			if (category !== "all" && report.category !== category) return false;
			if (!query) return true;
			return (
				report.title[lang].toLowerCase().includes(query) ||
				report.description[lang].toLowerCase().includes(query) ||
				report.id.includes(query)
			);
		});
	}, [allowed, category, search, lang]);

	const stats = useMemo<StatItem[]>(() => {
		const widgets = allowed.reduce((sum, report) => sum + report.widgets.length, 0);
		const categories = new Set(allowed.map((report) => report.category)).size;
		const lastUpdated = allowed
			.map((report) => report.updatedAt)
			.sort()
			.at(-1);
		return [
			{
				title: t("reports.stats.reports"),
				value: allowed.length,
				tooltip: t("reports.stats.reportsTooltip"),
			},
			{
				title: t("reports.stats.widgets"),
				value: widgets,
				tooltip: t("reports.stats.widgetsTooltip"),
			},
			{
				title: t("reports.stats.categories"),
				value: categories,
				tooltip: t("reports.stats.categoriesTooltip"),
			},
			{
				title: t("reports.stats.lastUpdated"),
				value: 0,
				valueLabel: lastUpdated ? formatIsoDay(lastUpdated) : "—",
				tooltip: t("reports.stats.lastUpdatedTooltip"),
			},
		];
	}, [allowed, t]);

	// تصدير صف من القائمة: نجلب التقرير بالنطاق الافتراضي ثم ننزّله CSV
	const exportReport = (report: ReportDef) =>
		toast.promise(
			(async () => {
				const { data, error } = await api.reports({ reportId: report.id }).get({
					query: { tzOffset: new Date().getTimezoneOffset() },
				});
				if (error) throw new Error(t("reports.errors.load"));
				exportReportCsv(
					report.id,
					report.title[lang],
					data as ReportPayload,
					report.widgets,
					lang,
				);
				return t("reports.toast.exported");
			})(),
			{
				loading: t("reports.toast.exporting"),
				success: (message: string) => message,
				error: (issue: Error) => issue.message || t("reports.errors.load"),
			},
		);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<Stats
				className="gap-3 px-3 py-3"
				variant="compact"
				stats={stats}
			/>

			<TableToolbar
				className="border-y"
				buttonSize="xs"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder={t("reports.list.searchPlaceholder")}
				leftExtra={
					<div className="flex flex-wrap items-center gap-1">
						<ToggleChip
							active={category === "all"}
							onClick={() => setCategory("all")}
							className="h-6 px-2.5"
						>
							{t("reports.categories.all")}
						</ToggleChip>
						{REPORT_CATEGORIES.map((entry) => (
							<ToggleChip
								key={entry.id}
								active={category === entry.id}
								onClick={() => setCategory(entry.id)}
								className="h-6 px-2.5"
							>
								{entry.label[lang]}
							</ToggleChip>
						))}
					</div>
				}
				actions={
					<DisabledReasonTooltip reason={t("reports.list.devOnly")}>
						<Button
							type="button"
							size="xs"
							disabled
							className="gap-1.5"
						>
							<IconSparkles className="size-3.5" />
							{t("reports.list.createWithAi")}
						</Button>
					</DisabledReasonTooltip>
				}
			/>

			<div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
				<div className="flex w-full flex-col gap-2">
					{visible.map((report) => (
						<ReportListRow
							key={report.id}
							report={report}
							onExport={() => exportReport(report)}
						/>
					))}
					{visible.length === 0 ? (
						<p className="py-12 text-center text-muted-foreground text-sm">
							{t("reports.list.empty")}
						</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
