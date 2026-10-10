import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// معاينة قالب الشهادة داخل التطبيق (HTML) — منقولة من المعالج المُركَن ومعاد تنسيقها برموز التطبيق.
export function CertificatePreviewDialog({
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
				className="max-w-[640px] gap-4"
			>
				<DialogHeader className="text-start">
					<DialogTitle className="text-[15px] font-bold text-foreground">
						معاينة قالب الشهادة
					</DialogTitle>
				</DialogHeader>

				{/* بطاقة الشهادة */}
				<div className="relative overflow-hidden rounded-xl border-[3px] border-primary/30 bg-gradient-to-b from-muted/40 to-card p-8 text-center">
					<div className="pointer-events-none absolute inset-3 rounded-lg border border-primary/15" />
					<div className="flex flex-col items-center gap-3">
						<IconRosetteDiscountCheckFilled className="size-12 text-primary" />
						<p className="text-[12px] font-medium tracking-wide text-muted-foreground">
							شهادة إتمام
						</p>
						<p className="text-[20px] font-bold text-foreground">
							{courseName || "اسم الدورة"}
						</p>
						<p className="max-w-[360px] text-[12px] leading-6 text-muted-foreground">
							تشهد الإدارة بأن حامل هذه الشهادة قد أكمل متطلبات الدورة بنجاح
							{passMark ? ` بنسبة نجاح ${passMark}%` : ""}.
						</p>
						<div className="mt-4 flex w-full items-end justify-between px-6 text-[11px] text-muted-foreground">
							<div className="flex flex-col items-center gap-1">
								<span className="min-w-[120px] border-b border-border pb-1 font-semibold text-foreground">
									{signatureName || "التوقيع"}
								</span>
								<span>التوقيع باسم</span>
							</div>
							<div className="flex flex-col items-center gap-1">
								<span className="min-w-[120px] border-b border-border pb-1 font-semibold text-foreground">
									{referencePattern || "REF-XXXX"}
								</span>
								<span>الرقم المرجعي</span>
							</div>
						</div>
					</div>
				</div>
				<p className="text-center text-[11px] text-muted-foreground">
					هذه معاينة تقريبية؛ يُصدر الرقم المرجعي الفعلي عند إكمال كل متدرّب.
				</p>
			</DialogContent>
		</Dialog>
	);
}
