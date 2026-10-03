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
	onDiscard,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	unitTitle: string;
	lessonTitle: string;
	changedFields: string[];
	// «متابعة التعديل» تحفظ التغييرات، و«تجاهل وخروج» يهملها
	onSave: () => void;
	onDiscard: () => void;
}) {
	const discard = () => {
		onOpenChange(false);
		onDiscard();
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
							درس: {lessonTitle}
						</span>
						<ChangesBadge count={changedFields.length} />
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
						لديك تعديلات غير محفوظة على هذا الدرس.
					</DialogDescription>
					<div className="flex flex-col items-end gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2.5 py-2">
						<span className="text-[10px] font-semibold leading-[15px] text-[#9B9B9D]">
							الحقول المعدّلة:
						</span>
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
					</div>
				</div>

				{/* التذييل — «متابعة التعديل» يمينًا و«تجاهل وخروج» يسارًا */}
				<div className="mt-3 flex items-center justify-end gap-1.5 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<button
						type="button"
						onClick={() => {
							onOpenChange(false);
							onSave();
						}}
						className="flex h-[27px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[9px] text-[11px] font-medium text-[#08090A]"
					>
						متابعة التعديل
					</button>
					<button
						type="button"
						onClick={discard}
						className="flex h-[25.5px] w-[109px] items-center justify-center gap-1.5 rounded-[4px] bg-[#DC2626] text-[11px] font-semibold text-[#F7F7FA] hover:bg-[#DC2626]/90"
					>
						تجاهل وخروج
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
							⌘↵
						</span>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
