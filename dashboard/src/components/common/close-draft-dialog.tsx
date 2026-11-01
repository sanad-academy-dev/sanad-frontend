import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export interface CloseDraftDialogProps {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
	onSaveDraft: () => void;
	onDiscard: () => void;
	onCancel?: () => void;
	isSaving?: boolean;
	title?: string;
	description?: string;
	saveLabel?: string;
	discardLabel?: string;
	cancelLabel?: string;
}

/**
 * نافذة تأكيد موحدة عند إغلاق النماذج التي تحتوي على مسودات غير محفوظة في نظام سند.
 * في RTL أول عنصر يمين (حفظ كمسودة بالثيم البنفسجي المعتمد) ثم تجاهل (بالأحمر التنبيهي) ثم إلغاء.
 */
export function CloseDraftDialog({
	open,
	onOpenChange,
	onSaveDraft,
	onDiscard,
	onCancel,
	isSaving = false,
	title = "إغلاق النموذج؟",
	description = "يمكنك حفظ تقدّمك كمسودة والعودة لاحقًا، أو تجاهل التغييرات ومغادرة النموذج.",
	saveLabel = "احفظ كمسودة",
	discardLabel = "تجاهل",
	cancelLabel = "إلغاء",
}: CloseDraftDialogProps) {
	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		} else if (onOpenChange) {
			onOpenChange(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				if (!val) handleCancel();
			}}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-w-[420px] w-[92vw] gap-4 rounded-2xl border border-border bg-background shadow-xl"
			>
				<DialogHeader className="space-y-1.5 text-start">
					<DialogTitle className="text-[15px] font-bold text-foreground">
						{title}
					</DialogTitle>
					<DialogDescription className="text-[13px] leading-6 text-muted-foreground">
						{description}
					</DialogDescription>
				</DialogHeader>

				{/* في RTL أول عنصر يمين: زر الحفظ بلون المنصة ثم تجاهل ثم إلغاء */}
				<DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
					<Button
						type="button"
						onClick={onSaveDraft}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-semibold cursor-pointer shadow-xs"
					>
						{isSaving ? "جارٍ الحفظ..." : saveLabel}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onDiscard}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
					>
						{discardLabel}
					</Button>
					<Button
						type="button"
						variant="ghost"
						onClick={handleCancel}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-medium cursor-pointer"
					>
						{cancelLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

