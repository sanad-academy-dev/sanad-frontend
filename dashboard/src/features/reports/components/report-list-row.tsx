import { IconDownload, IconFileAnalytics, IconTrash } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIsoDay } from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import type { ReportDef } from "@/server/reports/reports.catalog";

/**
 * One row in the report list.
 *
 * The delete button is present but permanently disabled, with the reason on press: reports
 * are code, so «لا يمكن حذفه» is the honest state of the action rather than an omission the
 * operator has to infer from an absent button.
 */
export function ReportListRow({
	report,
	onExport,
}: {
	report: ReportDef;
	onExport: () => void;
}) {
	const { t, lang } = useI18n();

	return (
		<div className="group relative flex items-center gap-3 rounded-[4px] border border-border bg-background px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-muted/40">
			{/* الصف كله رابط عبر طبقة ممتدة — لا نضع أزرارًا داخل <a> (تداخل عناصر تفاعلية) */}
			<Link
				to="/management/reports/$reportId"
				params={{ reportId: report.id }}
				aria-label={report.title[lang]}
				className="absolute inset-0 rounded-[4px]"
			/>

			{/* ترتيب DOM = الجهات في RTL: الأيقونة أوّلًا (يمينًا) ثم النص ثم الإجراءات (يسارًا) */}
			<span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] border border-border text-primary">
				<IconFileAnalytics className="size-4" />
			</span>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<div className="flex items-center gap-2">
					<h3 className="truncate font-medium text-sm">{report.title[lang]}</h3>
					<Badge
						variant="secondary"
						className="shrink-0 text-[10px]"
					>
						{t("reports.list.builtIn")}
					</Badge>
				</div>
				<p className="truncate text-muted-foreground text-xs">
					{t("reports.list.rowMeta", {
						count: report.widgets.length,
						date: formatIsoDay(report.updatedAt),
					})}
				</p>
			</div>

			{/* الإجراءات تظهر عند المرور — والحذف معطّل دائمًا لأن التقارير مُعرَّفة في الكود.
			    `relative` يرفعها فوق طبقة الرابط الممتدة فتستقبل الضغط بنفسها. */}
			<div className="relative flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
				<DisabledReasonTooltip reason={t("reports.list.cannotDelete")}>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						disabled
						aria-label={t("reports.list.deleteAria")}
					>
						<IconTrash className="size-4 text-destructive" />
					</Button>
				</DisabledReasonTooltip>
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					aria-label={t("reports.list.exportRow")}
					onClick={onExport}
				>
					<IconDownload className="size-4" />
				</Button>
			</div>
		</div>
	);
}
