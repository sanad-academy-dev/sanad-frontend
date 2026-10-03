import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// عند إغلاق المعالج بالضغط على X: احفظ كمسودة / تجاهل / إلغاء
export function CloseDraftDialog({
	open,
	onOpenChange,
	onSaveDraft,
	onDiscard,
	isSaving,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaveDraft: () => void;
	onDiscard: () => void;
	isSaving?: boolean;
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="max-w-[420px] gap-4 rounded-2xl"
			>
				<DialogHeader className="space-y-1.5 text-start">
					<DialogTitle className="text-[15px] font-bold text-[#08090A]">
						إغلاق إنشاء الدورة؟
					</DialogTitle>
					<DialogDescription className="text-[13px] leading-6 text-[#6B6B67]">
						يمكنك حفظ تقدّمك كمسودة والعودة لاحقًا، أو تجاهل التغييرات ومغادرة المعالج.
					</DialogDescription>
				</DialogHeader>
				{/* في RTL أول عنصر يمين */}
				<DialogFooter className="flex-row justify-start gap-2 sm:justify-start">
					<Button
						type="button"
						onClick={onSaveDraft}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-semibold"
					>
						{isSaving ? "جارٍ الحفظ..." : "احفظ كمسودة"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onDiscard}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-medium text-[#DC2626]"
					>
						تجاهل
					</Button>
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						disabled={isSaving}
						className="h-9 rounded-lg px-4 text-[13px] font-medium"
					>
						إلغاء
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
