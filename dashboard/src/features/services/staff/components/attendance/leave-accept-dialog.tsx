import { IconArrowsDiagonal, IconCircleCheckFilled, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { SubstitutePickerPopover } from "@/features/services/staff/components/attendance/substitute-picker-popover";
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

// توست نجاح اعتماد الطلب (بطاقة بيضاء + علامة خضراء + زر إغلاق) — أسفل يسار
function showAcceptedToast(code: string) {
	toast.custom(
		(id) => (
			<div className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]">
				<button
					type="button"
					onClick={() => toast.dismiss(id)}
					aria-label="إغلاق"
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] text-[#9B9B9D] opacity-40 hover:opacity-100"
				>
					<IconX className="size-3" />
				</button>
				<span className="flex-1 text-right text-[12px] font-semibold leading-[18px] text-[#08090A]">
					تم اعتماد طلب الإجازة (#{code}) من HR بنجاح
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ position: "bottom-left", duration: 5000 },
	);
}

export function LeaveAcceptDialog({
	requestId,
	open,
	onClose,
	onAccepted,
}: {
	requestId: string | null;
	open: boolean;
	onClose: () => void;
	onAccepted?: () => void;
}) {
	const { request } = useLeaveRequest(requestId);
	const { approve, isPending } = useLeaveRequestActions(requestId);
	const [comment, setComment] = useState("");
	const [notifyByEmail, setNotifyByEmail] = useState(false);
	const [substituteId, setSubstituteId] = useState<string | null>(null);

	// إعادة ضبط الحالة المحلية عند فتح الحوار
	useEffect(() => {
		if (open) {
			setComment("");
			setNotifyByEmail(false);
			setSubstituteId(null);
		}
	}, [open]);

	const onAccept = async () => {
		try {
			await approve({ silent: true });
			showAcceptedToast(request?.code ?? "");
			onClose();
			onAccepted?.();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "فشل الاعتماد", {
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
				<DialogTitle className="sr-only">قبول طلب الإجازة</DialogTitle>
				<DialogDescription className="sr-only">
					قبول طلب الإجازة الخاص بالموظف
				</DialogDescription>

				{/* الرأس */}
				<div className="flex h-[34px] shrink-0 items-center justify-between border-b-[0.75px] border-[#E5E5E5] px-[11px]">
					<div className="flex items-center gap-1.5">
						<span className="text-[10px] font-bold text-[#08090A]">قبول طلب الإجازة:</span>
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{request ? initialsOf(request.staff.name) : ""}
						</span>
						<span className="text-[13px] font-bold text-[#08090A]">{request?.staff.name}</span>
						<span className="font-mono text-[10px] text-[#9B9B9D]">
							{request?.code ? `${request.code} ·` : ""}
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

				{/* نص التعليق */}
				<textarea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					dir="rtl"
					placeholder="أضف تعليقًا"
					className="min-h-0 w-full flex-1 resize-none bg-transparent px-[15px] pt-3 text-right text-[14px] font-semibold leading-[21px] text-[#08090A] outline-none placeholder:text-[#08090A]/50"
				/>

				{/* تعيين موظف بديل */}
				<div className="flex h-[35px] shrink-0 items-center justify-start border-t-[0.75px] border-[#E5E5E5] px-3">
					<SubstitutePickerPopover
						value={substituteId}
						onChange={setSubstituteId}
					/>
				</div>

				{/* التذييل */}
				<div className="flex h-[41px] shrink-0 items-center justify-between border-t-[0.75px] border-[#E5E5E5] px-3">
					<span className="text-[12px] text-[#08090A]/50">حدد موظف بديل قبل قبول الإجازة</span>
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
							onClick={onAccept}
							disabled={isPending}
							className="h-[25px] gap-1.5 rounded-[4px] bg-[#6366F1] px-3 text-[11px] font-semibold text-[#F7F7FA] hover:bg-[#6366F1]/90"
						>
							قبول
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
