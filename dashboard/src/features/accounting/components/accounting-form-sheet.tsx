import type { FormEventHandler, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

/**
 * THE accounting create/edit sheet (CONTRACT §4.2). Every accounting master/voucher form
 * opens in this exact shell — same side, width, header, pinned footer and close behavior as
 * the Chart of Accounts sheet it was extracted from — so no screen re-invents its own
 * variation. Screens supply only the `Field` blocks; the mutation hook owns toast.promise.
 * Destructive confirmations do NOT go through this — those use the app's small confirm
 * Dialog convention (accounting-confirm-dialog.tsx).
 */
export type AccountingFormSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	/** already wrapped by react-hook-form's handleSubmit in the caller */
	onSubmit: FormEventHandler<HTMLFormElement>;
	isSaving?: boolean;
	/** footer primary label, e.g. "إنشاء" / "حفظ" */
	submitLabel: string;
	/** extra guard beyond isSaving (e.g. !isValid) */
	submitDisabled?: boolean;
	/** voucher grids (CONTRACT §4.2 form recipe) get the wider sm:max-w-xl shell */
	wide?: boolean;
	children: ReactNode;
};

export const AccountingFormSheet = ({
	open,
	onOpenChange,
	title,
	description,
	onSubmit,
	isSaving = false,
	submitLabel,
	submitDisabled = false,
	wide = false,
	children,
}: AccountingFormSheetProps) => (
	<Sheet
		open={open}
		onOpenChange={onOpenChange}
	>
		<SheetContent
			side="left"
			dir="rtl"
			className={wide ? "w-full gap-0 p-0 sm:max-w-2xl!" : "w-full gap-0 p-0 sm:max-w-md!"}
		>
			<SheetHeader className="border-b p-4">
				<SheetTitle>{title}</SheetTitle>
				{description ? <SheetDescription>{description}</SheetDescription> : null}
			</SheetHeader>

			<form
				onSubmit={onSubmit}
				className="flex min-h-0 flex-1 flex-col"
			>
				<div className="flex-1 space-y-4 overflow-y-auto p-4">{children}</div>

				<div className="flex justify-end gap-2 border-t px-4 py-3">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSaving}
					>
						إلغاء
					</Button>
					<Button
						type="submit"
						disabled={isSaving || submitDisabled}
					>
						{submitLabel}
					</Button>
				</div>
			</form>
		</SheetContent>
	</Sheet>
);
