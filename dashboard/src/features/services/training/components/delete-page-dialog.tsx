import { IconAlertCircle, IconChevronLeft, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { TrainingPage } from "../hooks/use-training-pages";

export function DeletePageDialog({
	page,
	onClose,
	onConfirm,
}: {
	page: TrainingPage | null;
	onClose: () => void;
	onConfirm: () => void;
}) {
	return (
		<Dialog
			open={!!page}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="w-[560px] max-w-[calc(100%-2rem)] gap-0 rounded-[8px] border-[0.75px] border-[#E5E5E5] dark:border-border p-0 sm:max-w-[560px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onConfirm();
				}}
			>
				{page && (
					<>
						{/* الرأس */}
						<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] dark:border-border px-[11px] py-2">
							<div className="flex min-w-0 items-center gap-1">
								<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#DC2626]">
									حذف الصفحة
								</DialogTitle>
								<IconChevronLeft className="size-[9px] shrink-0 text-muted-foreground" />
								<span className="truncate text-[10px] font-bold leading-[14px] text-foreground">
									{page.title || "صفحة بدون عنوان"}
								</span>
							</div>
							<button
								type="button"
								onClick={onClose}
								aria-label="إغلاق"
								className="flex size-[18px] items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
							>
								<IconX className="size-3.5" />
							</button>
						</div>

						{/* الجسم */}
						<div
							className="flex flex-col gap-2.5 px-[15px] pt-3 pb-3 text-right"
							dir="rtl"
						>
							<DialogDescription className="text-[12px] leading-[22px] text-foreground">
								هل أنت متأكد من حذف الصفحة «{page.title || "صفحة بدون عنوان"}»؟ لا يمكن التراجع
								عن هذا الإجراء.
							</DialogDescription>

							<div className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#DC2626]/50 bg-rose-50/60 dark:bg-rose-950/20 px-[10.25px] py-[9.65px]">
								<div className="flex items-center gap-[5px]">
									<IconAlertCircle className="size-3 shrink-0 text-[#DC2626]" />
									<span className="text-[12px] font-bold leading-4 text-rose-600 dark:text-rose-400">
										النتائج المترتبة:
									</span>
								</div>
								{[
									"سيتم إزالة الصفحة وكافة محتوياتها النصية والكتل التعليمية نهائياً من قاعدة البيانات.",
									"إذا كانت الصفحة مرتبطة بأي مادة توجيهية أو مسار، فلن يتمكن المتدربون من الوصول إليها بعد الحذف.",
								].map((item) => (
									<div
										key={item}
										className="flex items-start gap-1.5 text-[11px] leading-[18px] text-muted-foreground"
									>
										<span className="size-1 rounded-full bg-rose-500 shrink-0 mt-1.5" />
										<span>{item}</span>
									</div>
								))}
							</div>
						</div>

						{/* التذييل */}
						<div className="flex h-[42px] items-center justify-between border-t border-[#E5E5E5] dark:border-border bg-[#FAFAFA] dark:bg-muted/30 px-3">
							<button
								type="button"
								onClick={onClose}
								className="rounded-[4px] border border-[#E5E5E5] dark:border-border bg-white dark:bg-card px-3 py-1 text-[11px] font-semibold text-foreground hover:bg-muted/40 cursor-pointer"
							>
								إلغاء
							</button>
							<button
								type="button"
								onClick={onConfirm}
								className="rounded-[4px] bg-[#DC2626] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#DC2626]/90 cursor-pointer"
							>
								تأكيد الحذف
							</button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
