import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatCell } from "@/features/reports/utils/format-report-value";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { ReportTableWidget as TableWidget } from "@/server/reports/reports.type";

/** The rows behind a chart — scrolls inside the widget card rather than growing it. */
export function ReportTableWidget({ widget }: { widget: TableWidget }) {
	const { lang } = useI18n();

	if (widget.rows.length === 0) {
		return (
			<p className="flex h-full items-center justify-center text-muted-foreground text-sm">
				{lang === "ar" ? "لا صفوف في النطاق." : "No rows in this window."}
			</p>
		);
	}

	return (
		<div className="h-full min-h-0 overflow-auto">
			<Table>
				<TableHeader className="sticky top-0 z-10 bg-background">
					<TableRow>
						{widget.columns.map((column) => (
							<TableHead
								key={column.key}
								className={cn("whitespace-nowrap", column.align === "end" && "text-end")}
							>
								{column.label[lang]}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{widget.rows.map((row, index) => (
						// الصفوف مجمّعة مسبقًا في الخادم بلا معرّف مستقل، وترتيبها ثابت لكل استجابة
						// biome-ignore lint/suspicious/noArrayIndexKey: pre-aggregated, order-stable rows
						<TableRow key={index}>
							{widget.columns.map((column) => (
								<TableCell
									key={column.key}
									className={cn(
										"whitespace-nowrap",
										column.align === "end" && "text-end tabular-nums",
									)}
								>
									{formatCell(row[column.key], column.format, lang)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
