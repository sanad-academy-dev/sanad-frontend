import { createFileRoute, redirect } from "@tanstack/react-router";

import { ReportDetailPage } from "@/features/reports/components/report-detail-page";
import { findReport } from "@sanad/contracts/runtime/server/reports/reports.catalog";

export const Route = createFileRoute("/_pathless-layout/management/reports/$reportId")({
	// معرّف غير موجود في الكتالوج ليس صفحة فارغة — نعيده إلى قائمة التقارير
	beforeLoad: ({ params }) => {
		if (!findReport(params.reportId)) throw redirect({ to: "/management/reports" });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { reportId } = Route.useParams();
	const report = findReport(reportId);
	if (!report) return null;
	// مفتاح التركيب: الانتقال بين تقريرين يبدأ بحالة نظيفة (النطاق المحفوظ لكل تقرير)
	return (
		<ReportDetailPage
			key={report.id}
			report={report}
		/>
	);
}
