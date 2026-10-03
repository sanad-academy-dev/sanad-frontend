import {
	IconCircleCheckFilled,
	IconDeviceFloppy,
	IconPencil,
	IconPlus,
	IconSend,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { LeaveEmailDialog } from "@/features/services/staff/components/attendance/leave-email-dialog";
import { LeaveReviewScroll } from "@/features/services/staff/components/attendance/leave-review-dialog";
import { cn } from "@/lib/utils";

// طلب مُنشأ للمراجعة الجماعية (المعرف + اسم الموظف)
export type BulkLeaveReview = { requestId: string; name: string };

// توست مُجمّع بعد إرسال طلبات عدة موظفين — أسفل يسار (مطابق لتصميم Figma)
function showBulkSentToast(count: number) {
	toast.custom(
		(id) => (
			<div className="flex w-[310px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
				<span className="flex-1 text-right text-[10px] font-medium leading-[19px] text-black">
					تم إرسال طلب إجازة لعدد ({count}) موظفين بنجاح، وبإنتظار الموافقة علية
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

export function AttendanceBulkLeaveReviewDialog({
	requests,
	onClose,
}: {
	requests: BulkLeaveReview[] | null;
	onClose: () => void;
}) {
	const open = !!requests && requests.length > 0;
	const [active, setActive] = useState(0);
	// مؤشّر إرسال البريد: null = مغلق، أو فهرس الموظف الجاري إرسال بريده (يتنقّل تلقائيًا)
	const [emailIndex, setEmailIndex] = useState<number | null>(null);
	// عدد الطلبات التي أُرسلت فعليًا (للتوست المُجمّع)
	const [sentCount, setSentCount] = useState(0);

	// إعادة الضبط عند كل فتح
	useEffect(() => {
		if (open) {
			setActive(0);
			setEmailIndex(null);
			setSentCount(0);
		}
	}, [open]);

	const activeId = requests?.[active]?.requestId ?? null;
	const total = requests?.length ?? 0;
	const emailId = emailIndex !== null ? (requests?.[emailIndex]?.requestId ?? null) : null;

	return (
		<>
			<Sheet
				open={open && emailIndex === null}
				onOpenChange={(o) => {
					if (!o && emailIndex === null) onClose();
				}}
			>
				<SheetContent
					side="left"
					dir="rtl"
					showCloseButton={false}
					className="flex w-[603px]! max-w-[603px]! flex-col gap-0 overflow-hidden p-0"
				>
					<SheetTitle className="sr-only">مراجعة طلبات الإجازة</SheetTitle>
					<SheetDescription className="sr-only">
						مراجعة تفاصيل طلبات الإجازة لعدة موظفين وسلسلة الموافقات
					</SheetDescription>

					{/* الرأس */}
					<div className="flex items-center justify-between border-b px-4 py-2">
						<div className="flex items-center gap-1.5 text-[10px]">
							<span className="font-bold text-[#08090A]">
								مراجعة الطلبات ({requests?.length ?? 0})
							</span>
							<span className="text-[#9B9B9D]">‹</span>
							<span className="font-bold text-[#08090A]">طلبات إجازة</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconPlus className="size-3.5 rotate-45" />
						</button>
					</div>

					{/* شريط التنقّل بين الموظفين */}
					<div className="flex flex-wrap items-center justify-start gap-1.5 border-b border-[#E5E5E5] px-3 py-2">
						{requests?.map((r, i) => (
							<button
								key={r.requestId}
								type="button"
								onClick={() => setActive(i)}
								className={cn(
									"flex items-center gap-[4.5px] rounded-[4px] border-[0.75px] px-1.5 py-[3px]",
									i === active
										? "border-[#6366F1] bg-[#6366F1]/[0.06]"
										: "border-[#E5E5E5] bg-white",
								)}
							>
								<span className="text-[9px] text-[#08090A]">{r.name}</span>
								<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-[6px] font-semibold text-[#F5F5F6]">
									{initialsOf(r.name)}
								</span>
							</button>
						))}
					</div>

					<LeaveReviewScroll requestId={activeId} />

					{/* التذييل */}
					<div className="flex items-center justify-end gap-1.5 border-t px-4 py-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={onClose}
							className="h-[30px] gap-1.5 rounded-[4px] text-[12px] text-[#08090A]"
						>
							<IconPencil className="size-3.5" />
							تعديل الطلب
						</Button>
						<Button
							type="button"
							size="sm"
							variant="outline"
							onClick={onClose}
							className="h-[30px] gap-1.5 rounded-[4px] text-[12px] text-[#08090A]"
						>
							<IconDeviceFloppy className="size-3.5" />
							حفظ كمسودة
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => {
								setSentCount(0);
								setEmailIndex(0);
							}}
							className="h-[30px] gap-1.5 rounded-[4px] bg-[#6366F1] text-[12px]"
						>
							<IconSend className="size-3.5" />
							إرسال للموافقة
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			{/* بريد لكل موظف بالتتابع — يتقدّم للتالي بعد كل إرسال، وتوست مُجمّع في النهاية */}
			<LeaveEmailDialog
				requestId={emailId}
				open={emailIndex !== null}
				silent
				onClose={() => setEmailIndex(null)}
				onSent={() => {
					const newCount = sentCount + 1;
					setSentCount(newCount);
					if (emailIndex !== null && emailIndex + 1 < total) {
						setEmailIndex(emailIndex + 1);
					} else {
						setEmailIndex(null);
						showBulkSentToast(newCount);
					}
				}}
			/>
		</>
	);
}
