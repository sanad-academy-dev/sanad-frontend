import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// معاينة قالب الشهادة داخل التطبيق (HTML) — تصدير PDF متابعة لاحقة.
export function CertificatePreviewModal({
	open,
	onOpenChange,
	courseName,
	signatureName,
	passMark,
	referencePattern,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	courseName: string;
	signatureName?: string | null;
	passMark?: number | null;
	referencePattern?: string | null;
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-w-[640px] gap-4 rounded-2xl"
			>
				<DialogHeader className="text-start">
					<DialogTitle className="text-[15px] font-bold text-[#08090A]">
						معاينة قالب الشهادة
					</DialogTitle>
				</DialogHeader>

				{/* بطاقة الشهادة */}
				<div className="relative overflow-hidden rounded-2xl border-[3px] border-primary/30 bg-gradient-to-b from-[#FBFBFF] to-white p-8 text-center">
					<div className="pointer-events-none absolute inset-3 rounded-xl border border-primary/15" />
					<div className="flex flex-col items-center gap-3">
						<IconRosetteDiscountCheckFilled className="size-12 text-primary" />
						<p className="text-[12px] font-medium tracking-wide text-[#9B9B9D]">شهادة إتمام</p>
						<p className="text-[20px] font-bold text-[#08090A]">
							{courseName || "اسم الدورة"}
						</p>
						<p className="max-w-[360px] text-[12px] leading-6 text-[#6B6B67]">
							تشهد الإدارة بأن حامل هذه الشهادة قد أكمل متطلبات الدورة بنجاح
							{passMark ? ` بنسبة نجاح ${passMark}%` : ""}.
						</p>
						<div className="mt-4 flex w-full items-end justify-between px-6 text-[11px] text-[#6B6B67]">
							<div className="flex flex-col items-center gap-1">
								<span className="min-w-[120px] border-b border-[#D4D4DE] pb-1 font-semibold text-[#08090A]">
									{signatureName || "التوقيع"}
								</span>
								<span>التوقيع باسم</span>
							</div>
							<div className="flex flex-col items-center gap-1">
								<span className="min-w-[120px] border-b border-[#D4D4DE] pb-1 font-semibold text-[#08090A]">
									{referencePattern || "REF-XXXX"}
								</span>
								<span>الرقم المرجعي</span>
							</div>
						</div>
					</div>
				</div>
				<p className="text-center text-[11px] text-[#9B9B9D]">
					هذه معاينة تقريبية؛ يُصدر الرقم المرجعي الفعلي عند إكمال كل متدرّب.
				</p>
			</DialogContent>
		</Dialog>
	);
}
