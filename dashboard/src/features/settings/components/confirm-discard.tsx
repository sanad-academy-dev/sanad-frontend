import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { ConfirmDiscardProps } from "@/features/settings/types/confirm-discard.types";

export function ConfirmDiscard({
	onConfirm,
	onDiscard,
	disabled,
	confirmDisabled,
}: ConfirmDiscardProps) {
	return (
		<div className="flex items-center gap-0.5">
			<Button
				size="icon"
				variant="ghost"
				className="h-6 w-6 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
				disabled={confirmDisabled}
				onClick={onConfirm}
				type="button"
			>
				<IconCheck className="h-3.5 w-3.5" />
			</Button>
			<Button
				size="icon"
				variant="ghost"
				className="h-6 w-6 text-muted-foreground hover:text-destructive"
				disabled={disabled}
				onClick={onDiscard}
				type="button"
			>
				<IconX className="h-3.5 w-3.5" />
			</Button>
		</div>
	);
}
