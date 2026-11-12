import { IconArrowsDiagonal, IconChevronLeft, IconX } from "@tabler/icons-react";

import { ChangesBadge } from "@/components/common/changes-badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function UnsavedChangesDialog({
	open,
	onOpenChange,
	unitTitle,
	lessonTitle,
	changedFields,
	onSave,
	onKeepDraft,
	onDiscard,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	unitTitle: string;
	lessonTitle: string;
	changedFields: string[];
	// «حفظ الدرس» يحفظ في الدورة، و«الاحتفاظ كمسودة» يبقي المسودة المحلية للرجوع إليها لاحقًا
	onSave: () => void;
	onKeepDraft?: () => void;
	onDiscard: () => void;
}) {
	const discard = () => {
		onOpenChange(false);
		onDiscard();
	};

	const keepDraft = () => {
		onOpenChange(false);
		onKeepDraft?.();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				// sm:max-w-[620px] ضروري: المكوّن الأساسي فيه sm:max-w-sm ولا يُلغيه max-w العادي
				className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") discard();
				}}
			>
				{/* الرأس — في RTL: العنوان ثم السياق يمينًا، وأزرار النافذة يسارًا */}
				<div className="flex items-center justify-between gap-4 border-b px-4 py-2">
					<div className="flex min-w-0 items-center gap-1">
						<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#08090A]">
							بيانات غير محفوظة
						</DialogTitle>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="shrink-0 text-[10px] font-bold leading-[10px] text-[#08090A]">
							{unitTitle}
						</span>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold leading-[10px] text-[#08090A]">
							{lessonTitle.trim() || "درس / صفحة جديدة"}
						</span>
						{changedFields.length > 0 && <ChangesBadge count={changedFields.length} />}
					</div>

					{/* التصميم يضع زر الإغلاق في أقصى اليسار */}
					<div className="flex shrink-0 items-center gap-1.5">
						<span className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
							<IconArrowsDiagonal className="size-3" />
						</span>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* الحقول المعدّلة */}
				<div className="flex flex-col gap-1.5 px-[15px] pt-3 pb-0">
					<DialogDescription className="sr-only">
						لديك محتوى غير محفوظ في هذا الدرس.
					</DialogDescription>
					<div className="flex flex-col items-end gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2.5 py-2">
						<span className="text-[10px] font-semibold leading-[15px] text-[#9B9B9D]">
							{changedFields.length > 0
								? "الحقول المعدّلة:"
								: "توجد مسودة مكتوبة لم تُحفظ في الدورة بعد"}
						</span>
						{changedFields.length > 0 && (
							<div className="flex flex-wrap items-center justify-start gap-[3px]">
								{changedFields.map((field) => (
									<span
										key={field}
										className="flex items-center justify-center rounded-[4px] bg-[#F59E0B]/10 px-[4.5px] py-px text-[9px] leading-[14px] text-[#F59E0B]"
									>
										{field}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* التذييل — متابعة التحرير / الاحتفاظ كمسودة / حفظ / تجاهل */}
				<div className="mt-3 flex flex-wrap items-center justify-between gap-1.5 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<button
						type="button"
						onClick={discard}
						className="flex h-[26px] items-center justify-center gap-1 rounded-[4px] border border-[#DC2626]/30 bg-[#DC2626]/5 px-2.5 text-[11px] font-semibold text-[#DC2626] hover:bg-[#DC2626]/10 cursor-pointer"
					>
						تجاهل ومسح
						<span className="rounded-[3px] bg-[#DC2626]/15 px-[3px] py-[1px] text-[8px] leading-3 text-[#DC2626]">
							⌘↵
						</span>
					</button>

					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex h-[27px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A] hover:bg-[#FAFAFA] cursor-pointer"
						>
							متابعة التعديل
						</button>
						{onKeepDraft && (
							<button
								type="button"
								onClick={keepDraft}
								className="flex h-[27px] items-center justify-center rounded-[4px] border-[0.75px] border-[#6366F1]/40 bg-[#6366F1]/5 px-[9px] text-[11px] font-medium text-[#4F46E5] hover:bg-[#6366F1]/10 cursor-pointer"
							>
								الاحتفاظ كمسودة والخروج
							</button>
						)}
						<button
							type="button"
							onClick={() => {
								onOpenChange(false);
								onSave();
							}}
							className="flex h-[27px] items-center justify-center rounded-[4px] bg-[#4F6AE0] px-3 text-[11px] font-semibold text-white hover:bg-[#4F6AE0]/90 cursor-pointer"
						>
							حفظ الدرس
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
