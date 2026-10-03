import { IconPrinter } from "@tabler/icons-react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RadiologyReportDocument } from "@/features/services/radiology/components/radiology-report-document";
import { useRadiologyAddenda } from "@/features/services/radiology/hooks/use-radiology-extras";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";

// معاينة التقرير قبل طباعته.
//
// الطباعة لا تطبع نسخة المعاينة: تلك مدفونة تحت لوحة الطلب (Sheet) ولوحة
// الفحص ثم الحوار — وكلها مواضع ثابتة وتحويلات وارتفاعات مقيّدة بتمرير
// داخلي، فتخرج الورقة بيضاء أو يُزاح المحتوى خارجها. وإخفاء الأشقّاء بـ
// visibility يُبقي حيّزهم فيُخرج صفحات بيضاء زائدة. لذا نرسم نسخة ثانية من
// الوثيقة ونضعها عبر Portal ابنًا مباشرًا لـ <body>، ونُخفي أشقّاءها بـ
// display عند الطباعة (راجع #report-print-root في styles.css).

export function RadiologyReportPreviewDialog({
	order,
	item,
	open,
	onOpenChange,
}: {
	order: RadiologyOrderResponse;
	item: RadiologyItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { clinicInfo, isLoading } = useClinicInfo();
	const { addenda } = useRadiologyAddenda(open ? item.id : null);

	const reportDocument = (
		<RadiologyReportDocument
			order={order}
			item={item}
			addenda={addenda}
			clinic={clinicInfo ?? null}
		/>
	);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={onOpenChange}
			>
				<DialogContent
					className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-3xl"
					dir="rtl"
				>
					<div className="flex flex-col gap-0.5 border-b px-4 py-2 pe-10">
						<DialogTitle className="text-sm font-semibold">معاينة التقرير</DialogTitle>
						<DialogDescription className="text-xs">
							{item.service.name} — {item.accession}. راجعه ثم اطبعه أو احفظه PDF.
						</DialogDescription>
					</div>

					<div className="max-h-[74vh] overflow-y-auto bg-muted/30 p-4">
						{isLoading ? (
							<Skeleton className="h-96 w-full rounded-[4px]" />
						) : (
							<div className="mx-auto w-full max-w-[760px] rounded-[4px] bg-white shadow-sm">
								{reportDocument}
							</div>
						)}
					</div>

					<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
						>
							إغلاق
						</Button>
						<Button
							type="button"
							size="sm"
							className="gap-1.5"
							disabled={isLoading}
							onClick={() => window.print()}
						>
							<IconPrinter className="size-4" />
							طباعة
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* نسخة الطباعة — مخفيّة على الشاشة، وهي وحدها ما يظهر على الورق */}
			{open &&
				!isLoading &&
				typeof document !== "undefined" &&
				createPortal(<div id="report-print-root">{reportDocument}</div>, document.body)}
		</>
	);
}
