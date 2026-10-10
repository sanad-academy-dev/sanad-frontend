import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconChevronLeft,
	IconX,
} from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
	AssignmentResponse,
	AssignmentStatus,
} from "@/server/course-assignments/course-assignments.type";

// تسمية حالة التعيين (مطابقة لعمود «الحالة» في جدول المعيّنين)
const STATUS_LABEL: Record<AssignmentStatus, string> = {
	ASSIGNED: "لم يبدأ",
	IN_PROGRESS: "قيد التقدم",
	COMPLETED: "مكتمل",
};

// صف تفاصيل: الوسم (يمينًا) والقيمة (يسارًا) — يتّبع تدفّق RTL للصفحة
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">{label}</span>
			{children}
		</div>
	);
}

// حوار تأكيد إلغاء تعيين موظف عن الدورة التدريبية — نمط الحذف (أحمر/إجراء لا رجعة فيه)
// من نفس نظام تصميم DeleteCourseDialog: متمركز، بتخطيط RTL، تأكيد بمفتاح ⌘↵.
export function UnassignConfirmDialog({
	assignment,
	courseName,
	isPending = false,
	onClose,
	onConfirm,
}: {
	assignment: AssignmentResponse | null;
	courseName: string;
	isPending?: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const staff = assignment?.staff;

	return (
		<Dialog
			open={!!assignment}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				// sm:max-w-[560px] ضروري: المكوّن الأساسي فيه sm:max-w-sm ولا يُلغيه max-w العادي
				className="w-[560px] max-w-[calc(100%-2rem)] gap-0 rounded-[8px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[560px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isPending) onConfirm();
				}}
			>
				{assignment && staff && (
					<>
						{/* الرأس — في RTL: العنوان الأحمر والمسار يمينًا، أزرار النافذة يسارًا */}
						<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
							<div className="flex min-w-0 items-center gap-1">
								<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#DC2626]">
									إلغاء تعيين موظف
								</DialogTitle>
								<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
								<span className="truncate text-[10px] font-bold leading-[14px] text-[#08090A]">
									{staff.name}
								</span>
							</div>

							<div className="flex shrink-0 items-center gap-1.5">
								<span className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
									<IconArrowsDiagonal className="size-3" />
								</span>
								<button
									type="button"
									onClick={onClose}
									aria-label="إغلاق"
									className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
								>
									<IconX className="size-3.5" />
								</button>
							</div>
						</div>

						{/* الجسم */}
						<div className="flex max-h-[70vh] flex-col gap-2.5 overflow-y-auto px-[15px] pt-3 pb-3">
							<DialogDescription className="text-[12px] leading-[22px] text-[#08090A]">
								هل أنت متأكد من إلغاء تعيين الموظف "{staff.name}" من الدورة التدريبية "
								{courseName}" ؟ لا يمكن التراجع عن هذا الإجراء.
							</DialogDescription>

							{/* بطاقة تفاصيل الموظف */}
							<div className="flex flex-col gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[21.75px] py-2">
								<DetailRow label="اسم الموظف">
									<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
										{staff.name}
									</span>
								</DetailRow>
								<DetailRow label="المعرّف">
									<span className="text-[12px] leading-[18px] tabular-nums text-[#7A7A7A]">
										{staff.code ?? "—"}
									</span>
								</DetailRow>
								<DetailRow label="الوظيفة">
									<span className="text-[12px] leading-[18px] text-[#08090A]">
										{staff.role?.name ?? "—"}
									</span>
								</DetailRow>
								<DetailRow label="الفرع">
									<span className="text-[12px] leading-[18px] text-[#08090A]">
										{staff.branch?.name ?? "—"}
									</span>
								</DetailRow>
								<DetailRow label="الحالة">
									<span className="text-[12px] leading-[18px] text-[#08090A]">
										{STATUS_LABEL[assignment.status]}
									</span>
								</DetailRow>
								<DetailRow label="نسبة التقدم">
									<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
										{assignment.progress ?? 0}%
									</span>
								</DetailRow>
							</div>

							{/* صندوق النتائج المترتبة — في RTL: الأيقونة تتصدّر يمينًا والنص يليها يسارًا */}
							<div className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] px-[10.25px] py-[9.65px]">
								<div className="flex items-center gap-[5px]">
									<IconAlertCircle className="size-3 shrink-0 text-[#DC2626]" />
									<span className="text-[12px] font-bold leading-4 text-[#EF4444]">
										النتائج المترتبة:
									</span>
								</div>
								{[
									"سيتم إزالة الموظف من قائمة المعيّنين على هذه الدورة التدريبية.",
									"سيُفقد تقدّمه الحالي في الدورة والنتائج المرتبطة بها.",
								].map((line) => (
									<div
										key={line}
										className="flex items-start gap-1.5"
									>
										<IconAlertCircle className="mt-[3px] size-[11px] shrink-0 text-[#DC2626]" />
										<span className="text-[11px] leading-[18px] text-[#08090A]">{line}</span>
									</div>
								))}
							</div>
						</div>

						{/* التذييل — زر التأكيد الأحمر يسارًا وزر الإلغاء بجانبه (يتبع تدفّق RTL) */}
						<div className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-3 py-[7.5px]">
							<button
								type="button"
								onClick={onClose}
								className="flex h-[27px] items-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-muted"
							>
								إلغاء
							</button>
							<button
								type="button"
								onClick={onConfirm}
								disabled={isPending}
								className={cn(
									"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors",
									isPending
										? "cursor-not-allowed bg-[#DC2626]/[0.38]"
										: "bg-[#DC2626] hover:bg-[#DC2626]/90",
								)}
							>
								إلغاء التعيين
								<span className="rounded-[3px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
									⌘↵
								</span>
							</button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
