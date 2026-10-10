import { IconAlertCircle, IconChevronLeft, IconX } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { QuizListItemResponse } from "@/server/quizzes/quizzes.type";

// حوار حذف اختبار — بنفس ديزاين حوار حذف الدورة، بلا تأكيد كتابة الاسم (أخفّ).
export function DeleteQuizDialog({
	quiz,
	onClose,
	onConfirm,
}: {
	quiz: QuizListItemResponse | null;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const confirm = () => {
		onConfirm();
	};

	return (
		<Dialog
			open={!!quiz}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="w-[560px] max-w-[calc(100%-2rem)] gap-0 rounded-[8px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[560px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") confirm();
				}}
			>
				{quiz && (
					<>
						{/* الرأس */}
						<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
							<div className="flex min-w-0 items-center gap-1">
								<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#DC2626]">
									حذف الاختبار
								</DialogTitle>
								<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
								<span className="truncate text-[10px] font-bold leading-[14px] text-[#08090A]">
									{quiz.title}
								</span>
							</div>
							<button
								type="button"
								onClick={onClose}
								aria-label="إغلاق"
								className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
							>
								<IconX className="size-3.5" />
							</button>
						</div>

						{/* الجسم */}
						<div className="flex flex-col gap-2.5 px-[15px] pt-3 pb-3">
							<DialogDescription className="text-[12px] leading-[22px] text-[#08090A]">
								هل أنت متأكد من حذف الاختبار "{quiz.title}"؟ لا يمكن التراجع عن هذا الإجراء.
							</DialogDescription>

							<div className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] px-[10.25px] py-[9.65px]">
								<div className="flex items-center gap-[5px]">
									<IconAlertCircle className="size-3 shrink-0 text-[#DC2626]" />
									<span className="text-[12px] font-bold leading-4 text-[#EF4444]">
										النتائج المترتبة:
									</span>
								</div>
								{[
									"سيتم حذف جميع أسئلة الاختبار.",
									"سيتم حذف كل التعيينات والمحاولات والنتائج المرتبطة بهذا الاختبار.",
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

						{/* التذييل */}
						<div className="flex items-center justify-end border-t border-[#E5E5E5] px-3 py-[7.5px]">
							<button
								type="button"
								onClick={confirm}
								className="flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] bg-[#DC2626] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors hover:bg-[#DC2626]/90"
							>
								حذف الاختبار
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
