import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconChevronLeft,
	IconInfoCircle,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
	COURSE_TYPE_OPTIONS,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import { cn } from "@/lib/utils";
import type { CourseListItemResponse } from "@/server/training/training.type";

const typeLabel = (t: CourseListItemResponse["type"]) =>
	COURSE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

// تاريخ ميلادي مضغوط بأرقام لاتينية (dd/mm/yyyy) مطابقًا للتصميم
const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString("en-GB");

// صف تفاصيل: الوسم (يمينًا) والقيمة (يسارًا) — يتّبع تدفّق RTL للصفحة
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">{label}</span>
			{children}
		</div>
	);
}

// حوار حذف الدورة التدريبية (Figma node 4422-517429) — يعرض تفاصيل الدورة والنتائج المترتبة،
// ويشترط كتابة اسم الدورة حرفيًا لتفعيل الحذف. متمركز في الشاشة وبتخطيط RTL.
export function DeleteCourseDialog({
	course,
	onClose,
	onConfirm,
}: {
	course: CourseListItemResponse | null;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const [typedName, setTypedName] = useState("");
	const [notifyManager, setNotifyManager] = useState(false);

	// الحذف لا يُفعَّل إلا بمطابقة اسم الدورة حرفيًا
	const canDelete = !!course && typedName.trim() === course.name.trim();

	const reset = () => {
		setTypedName("");
		setNotifyManager(false);
	};

	const confirm = () => {
		if (!canDelete) return;
		reset();
		onConfirm();
	};

	const cost = course ? formatTrainingCost(course.trainingCost) : null;
	const trainerName = course?.trainers[0]?.name ?? "—";

	return (
		<Dialog
			open={!!course}
			onOpenChange={(next) => {
				if (!next) {
					reset();
					onClose();
				}
			}}
		>
			<DialogContent
				showCloseButton={false}
				// sm:max-w-[620px] ضروري: المكوّن الأساسي فيه sm:max-w-sm ولا يُلغيه max-w العادي
				className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") confirm();
				}}
			>
				{course && (
					<>
						{/* الرأس — في RTL: العنوان الأحمر والمسار يمينًا، أزرار النافذة يسارًا */}
						<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
							<div className="flex min-w-0 items-center gap-1">
								<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#DC2626]">
									حذف الدورة التدريبية
								</DialogTitle>
								<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
								<span className="truncate text-[10px] font-bold leading-[14px] text-[#08090A]">
									{course.name}
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
									className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
								>
									<IconX className="size-3.5" />
								</button>
							</div>
						</div>

						{/* الجسم */}
						<div className="flex max-h-[70vh] flex-col gap-2.5 overflow-y-auto px-[15px] pt-3 pb-0">
							<DialogDescription className="text-[12px] leading-[22px] text-[#08090A]">
								هل أنت متأكد من حذف الدورة التدريبية "{course.name}" ؟ لا يمكن التراجع عن هذا
								الإجراء.
							</DialogDescription>

							{/* بطاقة تفاصيل الدورة */}
							<div className="flex flex-col gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[21.75px] py-2">
								<DetailRow label="اسم الدورة">
									<span className="text-[10px] font-medium leading-[10px] text-[#7A7A7A]">
										{course.name}
									</span>
								</DetailRow>
								<DetailRow label="نوع الدورة">
									<span className="rounded-[4px] bg-[#6366F1]/[0.125] px-1 py-[5px] text-[10px] leading-[10px] text-[#5B6ABF]">
										{typeLabel(course.type)}
									</span>
								</DetailRow>
								<DetailRow label="# المشتركين الحالين">
									<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
										{course.assignedCount}
									</span>
								</DetailRow>
								<DetailRow label="# الوحدات">
									<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
										{course.contentCount}
									</span>
								</DetailRow>
								<DetailRow label="تاريخ الإنشاء">
									<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
										{fmtDate(course.createdAt)}
									</span>
								</DetailRow>
								<DetailRow label="المدرب">
									<span className="text-[14px] font-medium leading-[21px] text-[#08090A]">
										{trainerName}
									</span>
								</DetailRow>
								<DetailRow label="سعر الدورة">
									<span className="text-[12px] leading-[18px] text-[#08090A]">
										{cost ?? "مجانية"}
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
									"سيتم حذف جميع الوحدات والدروس والاختبارات والاستبيانات التابعة للدورة.",
									"لن يتمكن الموظفون المعينون على الدورة من الوصول إلى محتواها ولا النتائج المرتبطة بها.",
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

							{/* تأكيد الاسم — في RTL: النص يمينًا يليه «مطلوب» ثم أيقونة المعلومات يسارًا */}
							<div className="flex flex-col gap-[5px] pb-3">
								<div className="flex items-center gap-1">
									<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
										ادخل لتأكيد الحذف، اكتب اسم الدورة: {course.name}
									</span>
									<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium leading-3 text-[#DC2626]">
										مطلوب
									</span>
									<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
								</div>
								<Input
									value={typedName}
									onChange={(e) => setTypedName(e.target.value)}
									placeholder="ادخل اسم الدورة هنا"
									className="h-8 rounded-[4px] px-[10.5px] text-[13px]"
								/>
							</div>
						</div>

						{/* التذييل — زر الحذف يسارًا، ومبدّل إشعار المدير يمينًا */}
						<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
							<div className="flex items-center gap-2">
								<span className="text-[10px] leading-[15px] text-[#737373]">
									إشعار المدير عبر البريد
								</span>
								<Switch
									checked={notifyManager}
									onCheckedChange={setNotifyManager}
									aria-label="إشعار المدير عبر البريد"
								/>
							</div>
							<button
								type="button"
								onClick={confirm}
								disabled={!canDelete}
								className={cn(
									"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors",
									canDelete
										? "bg-[#DC2626] hover:bg-[#DC2626]/90"
										: "cursor-not-allowed bg-[#DC2626]/[0.38]",
								)}
							>
								حذف الدورة
								<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
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
