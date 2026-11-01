import { CloseDraftDialog as CommonCloseDraftDialog } from "@/components/common/close-draft-dialog";

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
		<CommonCloseDraftDialog
			open={open}
			onOpenChange={onOpenChange}
			onSaveDraft={onSaveDraft}
			onDiscard={onDiscard}
			isSaving={isSaving}
			title="إغلاق إنشاء الدورة؟"
			description="يمكنك حفظ تقدّمك كمسودة والعودة لاحقًا، أو تجاهل التغييرات ومغادرة المعالج."
			saveLabel="احفظ كمسودة"
			discardLabel="تجاهل"
			cancelLabel="إلغاء"
		/>
	);
}
