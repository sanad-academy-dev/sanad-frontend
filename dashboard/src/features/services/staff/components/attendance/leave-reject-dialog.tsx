import { IconArrowsDiagonal, IconCircleX, IconHelpCircle, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
	useLeaveRequest,
	useLeaveRequestActions,
} from "@/features/services/staff/hooks/use-leave-request";

function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

// توست نجاح رفض الطلب (بطاقة بيضاء + زر تراجع + أيقونة حمراء) — أسفل يسار
function showRejectedToast(code: string) {
	toast.custom(
		(id) => (
			<div className="flex w-[356px] items-center justify-between gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-1.5 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					className="flex h-[18px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[5px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
				>
					تراجع
				</button>
				<div className="flex items-center gap-1.5">
					<span className="text-right text-[10px] font-semibold leading-[18px] text-[#08090A]">
						تم رفض طلب الإجازة رقم (#{code}) بنجاح
					</span>
					<IconCircleX className="size-[15px] shrink-0 text-[#DC2626]" />
				</div>
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}

export function LeaveRejectDialog({
	requestId,
	open,
	onClose,
	onRejected,
}: {
	requestId: string | null;
	open: boolean;
	onClose: () => void;
	onRejected?: () => void;
}) {
	const { request } = useLeaveRequest(requestId);
	const { reject, isPending } = useLeaveRequestActions(requestId);
	const [reason, setReason] = useState("");
	const [notifyByEmail, setNotifyByEmail] = useState(false);

	// إعادة ضبط الحالة المحلية عند فتح الحوار
	useEffect(() => {
		if (open) {
			setReason("");
			setNotifyByEmail(false);
		}
	}, [open]);

	const onReject = async () => {
		try {
			await reject({ silent: true });
			showRejectedToast(request?.code ?? "");
			onClose();
			onRejected?.();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل الرفض", {
				position: "bottom-left",
			});
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="flex h-[215px] w-[620px] max-w-[620px] flex-col gap-0 overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
			>
				<DialogTitle className="sr-only">رفض طلب الإجازة</DialogTitle>
				<DialogDescription className="sr-only">
					رفض طلب الإجازة الخاص بالموظف
				</DialogDescription>

				{/* الرأس */}
				<div className="flex h-[34px] shrink-0 items-center justify-between border-b-[0.75px] border-[#E5E5E5] px-[11px]">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A]">رفض طلب الإجازة:</span>
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{request ? initialsOf(request.staff.name) : ""}
						</span>
						<span className="text-[13px] font-bold text-[#08090A]">{request?.staff.name}</span>
						<span className="font-mono text-[10px] text-[#9B9B9D]">
							{request?.code ? `#${request.code}` : ""}
						</span>
					</div>
					<div className="flex items-center gap-1.5 text-[#9B9B9D]">
						<button
							type="button"
							aria-label="تكبير"
							className="flex size-[18px] items-center justify-center rounded-[4px] hover:bg-muted"
						>
							<IconArrowsDiagonal className="size-3.5" />
						</button>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] hover:bg-muted"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* سبب الرفض */}
				<textarea
					value={reason}
					onChange={(e) => setReason(e.target.value)}
					dir="rtl"
					placeholder="أضف تعليقًا"
					className="min-h-0 w-full flex-1 resize-none bg-transparent px-[15px] pt-3 text-right text-[14px] font-semibold leading-[21px] text-[#08090A] outline-none placeholder:text-[#08090A]/50"
				/>

				{/* بدون سبب */}
				<div className="flex h-[35px] shrink-0 items-center justify-start border-t-[0.75px] border-[#E5E5E5] px-3">
					<button
						type="button"
						onClick={() => setReason("")}
						className="flex h-[23px] items-center gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 text-[10px] font-medium text-[#737373] hover:bg-muted"
					>
						بدون سبب
						<IconHelpCircle className="size-[15px]" />
					</button>
				</div>

				{/* التذييل */}
				<div className="flex h-[41px] shrink-0 items-center justify-between border-t-[0.75px] border-[#E5E5E5] px-3">
					<span className="text-[12px] text-[#08090A]/50">حدد سبب الرفض قبل إرسال</span>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<span className="text-[10px] text-[#737373]">إشعار عبر البريد</span>
							<Switch
								size="default"
								checked={notifyByEmail}
								onCheckedChange={setNotifyByEmail}
							/>
						</div>
						<Button
							type="button"
							onClick={onReject}
							disabled={isPending}
							className="h-[25px] gap-1.5 rounded-[4px] bg-[#DC2626] px-3 text-[11px] font-semibold text-[#F7F7FA] hover:bg-[#DC2626]/90"
						>
							رفض
							<span className="flex items-center rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-none text-white">
								⌘↵
							</span>
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
