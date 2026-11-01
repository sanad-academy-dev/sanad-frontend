import { DiscardConfirmDialog } from "@/components/common/discard-confirm-dialog";

export interface SaveDraftConfirmDialogProps {
	open: boolean;
	filledFields?: string[];
	fieldLabels?: Record<string, string>;
	resumeLabel?: string;
	onDiscard: () => void;
	onCancel: () => void;
	onSave?: () => void;
	isSaving?: boolean;
}

/**
 * نافذة تأكيد الخروج من نموذج إضافة الفصل الدراسي مع وجود بيانات غير محفوظة.
 * تطابق نافذة النظام المعتمدة (DiscardConfirmDialog) مثل إضافة ولي الأمر.
 */
export function SaveDraftConfirmDialog({
	open,
	filledFields = [],
	fieldLabels = {},
	resumeLabel = "متابعة إضافة الفصل",
	onDiscard,
	onCancel,
}: SaveDraftConfirmDialogProps) {
	return (
		<DiscardConfirmDialog
			open={open}
			filledFields={filledFields}
			fieldLabels={fieldLabels}
			resumeLabel={resumeLabel}
			onDiscard={onDiscard}
			onResume={onCancel}
		/>
	);
}
