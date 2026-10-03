import { IconCircleCheck, IconPhone } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const BookingSuccess = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
	<Dialog
		open={open}
		onOpenChange={(next) => {
			if (!next) onClose();
		}}
	>
		<DialogContent
			className="max-w-lg! gap-6 px-6 py-8"
			showCloseButton={false}
		>
			<div className="flex flex-col items-center gap-5 text-center">
				<div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
					<IconCircleCheck className="size-12 text-emerald-500" />
				</div>

				<div className="flex flex-col gap-2">
					<DialogTitle className="text-2xl font-bold text-foreground">
						تم إرسال الطلب بنجاح!
					</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground">
						شكراً لك! تم استلام طلب الحجز وسيتم مراجعته من قبل فريقنا
					</DialogDescription>
				</div>

				<div className="flex w-full flex-col gap-3 rounded-xl border border-border bg-card/40 p-4 text-sm">
					<div className="flex items-center justify-start gap-3">
						<IconCircleCheck className="size-5 shrink-0 text-emerald-500" />
						<span className="text-foreground">
							سيتم التواصل معك خلال 30 دقيقة لتأكيد الزيارة
						</span>
					</div>
					<div className="flex items-center justify-start gap-3">
						<IconPhone className="size-5 shrink-0 text-sky-500" />
						<span className="text-foreground">سيتم إرسال رسالة نصية بتفاصيل الزيارة</span>
					</div>
				</div>
			</div>
		</DialogContent>
	</Dialog>
);
