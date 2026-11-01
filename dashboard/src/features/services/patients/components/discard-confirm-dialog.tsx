import { FIELD_LABELS } from "@/features/services/patients/data/constants";
import {
	DiscardConfirmDialog as CommonDiscardConfirmDialog,
	type DiscardConfirmDialogProps,
} from "@/components/common/discard-confirm-dialog";

export type { DiscardConfirmDialogProps };

export function DiscardConfirmDialog(props: DiscardConfirmDialogProps) {
	return (
		<CommonDiscardConfirmDialog
			fieldLabels={props.fieldLabels ?? FIELD_LABELS}
			resumeLabel={props.resumeLabel ?? "متابعة إضافة الطفل"}
			{...props}
		/>
	);
}
