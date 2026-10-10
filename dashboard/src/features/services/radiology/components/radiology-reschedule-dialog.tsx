import { useEffect, useState } from "react";

import { DateTimePopover, nextQuarterHourDate } from "@/components/common/date-time-popover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRescheduleRadiology } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { formatScheduleLabel } from "@/features/services/radiology/utils/schedule-label";
import type { RadiologyItemResponse } from "@/server/radiology/radiology.type";

// تغيير موعد فحص مجدول. السبب اختياري لكنه يُسجَّل في سجل النشاط — إعادة
// الجدولة قرار تشغيلي يُسأل عنه لاحقًا.

export function RadiologyRescheduleDialog({
	item,
	open,
	onOpenChange,
}: {
	item: RadiologyItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { reschedule, isPending } = useRescheduleRadiology();
	const [schedule, setSchedule] = useState<Date>(nextQuarterHourDate);
	const [reason, setReason] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: الضبط عند الفتح فقط
	useEffect(() => {
		if (!open) return;
		setSchedule(item.scheduledAt ? new Date(item.scheduledAt) : nextQuarterHourDate());
		setReason("");
	}, [open, item.id]);

	const unchanged =
		!!item.scheduledAt && new Date(item.scheduledAt).getTime() === schedule.getTime();

	const submit = async () => {
		try {
			await reschedule({
				itemId: item.id,
				scheduledAt: schedule,
				reason: reason.trim() || null,
			});
		} catch {
			return; // التوست يعرض السبب — تبقى النافذة مفتوحة لإعادة المحاولة
		}
		onOpenChange(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="gap-0 overflow-hidden p-0 sm:max-w-md"
				dir="rtl"
			>
				<div className="flex flex-col gap-0.5 border-b px-4 py-2 pe-10">
					<DialogTitle className="text-sm font-semibold">تغيير موعد الفحص</DialogTitle>
					<DialogDescription className="text-xs">
						{item.service.name}
						{item.scheduledAt
							? ` — الموعد الحالي ${formatScheduleLabel(item.scheduledAt)}`
							: ""}
					</DialogDescription>
				</div>

				<div className="flex flex-col gap-3 px-4 py-3">
					<div className="flex flex-col gap-1.5">
						<Label className="text-xs font-semibold">الموعد الجديد</Label>
						<DateTimePopover
							value={schedule}
							onChange={setSchedule}
							placeholder="الموعد الجديد"
							disabled={isPending}
							timeLabel="وقت الفحص"
							className="w-full justify-start"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="reschedule-reason"
							className="text-xs font-semibold"
						>
							السبب (اختياري)
						</Label>
						<Textarea
							id="reschedule-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							disabled={isPending}
							placeholder="مثال: تأجيل بطلب وليّ الأمر"
							className="min-h-20 text-sm"
						/>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						size="sm"
						disabled={isPending || unchanged}
						onClick={() => void submit()}
					>
						حفظ الموعد
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
