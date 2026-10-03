import {
	IconChartArcs,
	IconChartBar,
	IconChartDonut,
	IconDotsVertical,
	IconDownload,
	IconEyeOff,
	IconTable,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportBarsWidget } from "@/features/reports/components/widgets/report-bars-widget";
import { ReportBigStatWidget } from "@/features/reports/components/widgets/report-big-stat-widget";
import { ReportPieWidget } from "@/features/reports/components/widgets/report-pie-widget";
import { ReportSeriesWidget } from "@/features/reports/components/widgets/report-series-widget";
import { ReportTableWidget } from "@/features/reports/components/widgets/report-table-widget";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { ReportWidgetPayload } from "@/server/reports/reports.type";

/** Header glyph, chosen from what the widget actually draws. */
const ICONS: Record<ReportWidgetPayload["kind"], ComponentType<{ className?: string }>> = {
	series: IconChartBar,
	pie: IconChartDonut,
	bars: IconChartBar,
	table: IconTable,
	bigStat: IconChartArcs,
};

function WidgetBody({ widget }: { widget: ReportWidgetPayload }) {
	switch (widget.kind) {
		case "series":
			return <ReportSeriesWidget widget={widget} />;
		case "pie":
			return <ReportPieWidget widget={widget} />;
		case "bars":
			return <ReportBarsWidget widget={widget} />;
		case "table":
			return <ReportTableWidget widget={widget} />;
		case "bigStat":
			return <ReportBigStatWidget widget={widget} />;
		default:
			return null;
	}
}

/**
 * The chrome around every widget: title + glyph on the reading edge, an actions menu on the
 * far edge, and a fixed-height body so a grid row stays aligned whatever it contains.
 */
export function ReportWidgetCard({
	title,
	widget,
	span,
	onExport,
	onHide,
}: {
	title: string;
	widget: ReportWidgetPayload;
	span: "full" | "half";
	onExport: () => void;
	onHide: () => void;
}) {
	const { t, isRtl } = useI18n();
	const Icon = ICONS[widget.kind];

	return (
		<section
			className={cn(
				"flex h-[295px] flex-col overflow-hidden rounded-[4px] border border-border bg-background",
				span === "full" ? "lg:col-span-2" : "lg:col-span-1",
			)}
		>
			{/* رأس موحّد لكل الودجات: border-b + px-4 py-2 كبقية رؤوس اللوحات في النظام */}
			<header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
				<div className="flex min-w-0 items-center gap-1.5">
					<h3 className="truncate font-medium text-sm">{title}</h3>
					<Icon className="size-3.5 shrink-0 text-muted-foreground" />
				</div>

				<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
					<DropdownMenuTrigger
						className="rounded-[4px] p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						aria-label={t("reports.widget.actions")}
					>
						<IconDotsVertical className="size-4" />
					</DropdownMenuTrigger>
					{/* المُشغِّل يقع على الحافة الخارجية للبطاقة؛ align="start" في RTL يفتح القائمة
					    نحو الخارج فتُقتطع عند حافة النافذة — "end" يفتحها نحو داخل البطاقة */}
					<DropdownMenuContent
						align="end"
						className="w-44"
					>
						<DropdownMenuItem
							className="gap-2"
							onSelect={onExport}
						>
							<IconDownload className="size-4 text-muted-foreground" />
							{t("reports.widget.exportCsv")}
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2"
							onSelect={onHide}
						>
							<IconEyeOff className="size-4 text-muted-foreground" />
							{t("reports.widget.hide")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>

			<div className="min-h-0 flex-1 p-3">
				<WidgetBody widget={widget} />
			</div>
		</section>
	);
}
