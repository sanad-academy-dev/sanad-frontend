import { IconAlertTriangle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

/**
 * THE accounting destructive-action confirmation (CONTRACT §4.2: destructive → small
 * Dialog). Deletes never fire straight from a row button and never open a Sheet — they open
 * this dialog. One shared shape so every accounting screen confirms identically.
 */
export type AccountingConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	/** defaults to "حذف" */
	confirmLabel?: string;
	onConfirm: () => void;
	isPending?: boolean;
};

export const AccountingConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "حذف",
	onConfirm,
	isPending = false,
}: AccountingConfirmDialogProps) => (
	<Dialog
		open={open}
		onOpenChange={onOpenChange}
	>
		<DialogContent
			dir="rtl"
			className="sm:max-w-sm"
		>
			<DialogHeader>
				<div className="flex items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10">
						<IconAlertTriangle className="size-5 text-destructive" />
					</div>
					<DialogTitle>{title}</DialogTitle>
				</div>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={() => onOpenChange(false)}
					disabled={isPending}
				>
					إلغاء
				</Button>
				<Button
					type="button"
					variant="destructive"
					onClick={onConfirm}
					disabled={isPending}
				>
					{confirmLabel}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
