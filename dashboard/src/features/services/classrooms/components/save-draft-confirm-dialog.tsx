import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface SaveDraftConfirmDialogProps {
	open: boolean;
	onSave: () => void;
	onDiscard: () => void;
	onCancel: () => void;
}

export function SaveDraftConfirmDialog({
	open,
	onSave,
	onDiscard,
	onCancel,
}: SaveDraftConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={(val) => !val && onCancel()}>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="sm:max-w-[420px] w-[92vw] p-6 rounded-2xl gap-0 border border-border bg-white dark:bg-card shadow-xl"
			>
				<DialogHeader className="p-0 text-right space-y-1.5">
					<DialogTitle className="text-base sm:text-lg font-bold text-foreground">
						حفظ في المسودات؟
					</DialogTitle>
					<DialogDescription className="text-xs sm:text-sm text-muted-foreground">
						يمكنك إكمال هذه المهمة لاحقًا من مسوداتك.
					</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-between mt-6 pt-1">
					{/* زر تجاهل على اليمين */}
					<button
						type="button"
						onClick={onDiscard}
						className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-1 py-1"
					>
						تجاهل
					</button>

					{/* أزرار إلغاء وحفظ على اليسار */}
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="rounded-full px-5 h-8.5 text-xs font-medium border-border cursor-pointer hover:bg-muted"
						>
							إلغاء
						</Button>
						<Button
							type="button"
							onClick={onSave}
							className="rounded-full px-6 h-8.5 text-xs font-medium bg-[#5b6bf0] hover:bg-[#4a59d9] text-white shadow-xs cursor-pointer"
						>
							حفظ
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
