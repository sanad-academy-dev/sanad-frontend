import { IconChevronLeft } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/hooks/use-i18n";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";

/**
 * «التقارير › اسم التقرير» in the app header.
 *
 * The layout derives its own title from the last path segment, and for `$reportId` that is
 * either meaningless or — worse — a false match: `/management/reports/staff` resolves
 * `sidebar.items.staff` and prints «الموارد البشرية» next to an attendance report. So the
 * page suppresses the derived title and injects the real trail into the header's slot (the
 * same portal the inventory tabs use).
 */
export function ReportDetailBreadcrumb({ title }: { title: string }) {
	const { t } = useI18n();
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	if (!slot) return null;

	return createPortal(
		<nav
			aria-label={t("reports.detail.breadcrumb")}
			className="flex items-center gap-1.5 text-sm"
		>
			<Link
				to="/management/reports"
				className="font-semibold text-base text-foreground hover:underline"
			>
				{t("sidebar.items.reports")}
			</Link>
			{/* السهم يشير لجهة القراءة التالية: يسارًا في RTL، يمينًا في LTR */}
			<IconChevronLeft className="size-3.5 shrink-0 text-muted-foreground ltr:rotate-180" />
			<span className="truncate text-muted-foreground">{title}</span>
		</nav>,
		slot,
	);
}
