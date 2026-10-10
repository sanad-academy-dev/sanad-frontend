import { IconAlertTriangleFilled, IconPrinter } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RadiologyAddenda } from "@/features/services/radiology/components/radiology-addenda";
import { RadiologyReportPreviewDialog } from "@/features/services/radiology/components/radiology-report-preview-dialog";
import { RadiologyStatus } from "@/generated/prisma/enums";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";

// عرض التقرير للقراءة — يُستعمل داخل لوحة الفحص بعد كتابته، وخارج قسم الأشعة
// (خطة علاج الزيارة مثلًا) حيث يُطالَع التقرير دون صلاحية تعديله.

const REPORT_SECTIONS: {
	key: "technique" | "comparison" | "findings" | "impression" | "recommendations";
	label: string;
}[] = [
	{ key: "technique", label: "التقنية" },
	{ key: "comparison", label: "المقارنة" },
	{ key: "findings", label: "الموجودات" },
	{ key: "impression", label: "الانطباع" },
	{ key: "recommendations", label: "التوصيات" },
];

export function RadiologyReportView({
	item,
	order,
}: {
	item: RadiologyItemResponse;
	/** الطلب — تحتاجه المعاينة لبيانات الطفل والمنشأة */
	order?: RadiologyOrderResponse;
}) {
	const [previewOpen, setPreviewOpen] = useState(false);
	const filled = REPORT_SECTIONS.filter(({ key }) => item.report?.[key]);

	if (filled.length === 0) {
		return (
			<p className="rounded-[4px] border bg-muted/30 p-3 text-xs text-muted-foreground">
				لم يُكتب التقرير بعد — يُكتب من لوحة الفحص في قسم الأشعة.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* الطباعة متاحة بعد الاعتماد — قبله التقرير مسوّدة لا وثيقة */}
			{item.status === RadiologyStatus.COMPLETED && order && (
				<div className="flex justify-end">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-7 gap-1.5 text-[11px]"
						onClick={() => setPreviewOpen(true)}
					>
						<IconPrinter className="size-3.5" />
						طباعة التقرير
					</Button>
				</div>
			)}

			{item.report?.criticalFinding && (
				<p className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700">
					<IconAlertTriangleFilled className="size-4 shrink-0" />
					نتيجة حرجة
					{item.report.criticalNotifiedTo
						? ` — أُبلغ: ${item.report.criticalNotifiedTo}`
						: " — لم يُوثَّق تبليغها بعد"}
				</p>
			)}
			<div className="flex flex-col gap-3">
				{filled.map(({ key, label }) => (
					<div
						key={key}
						className="flex flex-col gap-1"
					>
						<p className="text-xs font-semibold text-muted-foreground">{label}</p>
						<p className="whitespace-pre-wrap rounded-md border bg-muted/30 p-2.5 text-sm leading-relaxed">
							{item.report?.[key]}
						</p>
					</div>
				))}
			</div>
			{item.reviewedBy && item.status === RadiologyStatus.COMPLETED && (
				<p className="text-xs text-muted-foreground">
					اعتمده {item.reviewedBy.name}
					{item.reviewedAt
						? ` — ${new Date(item.reviewedAt).toLocaleDateString("ar-EG")}`
						: ""}
				</p>
			)}

			{/* الملاحق أسفل التقرير — بعد الاعتماد لا يُعدَّل الأصل بل يُلحق به */}
			<RadiologyAddenda item={item} />

			{order && (
				<RadiologyReportPreviewDialog
					order={order}
					item={item}
					open={previewOpen}
					onOpenChange={setPreviewOpen}
				/>
			)}
		</div>
	);
}
