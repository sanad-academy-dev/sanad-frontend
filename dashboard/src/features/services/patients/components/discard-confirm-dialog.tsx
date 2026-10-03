import { IconAlertTriangle } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FIELD_LABELS } from "@/features/services/patients/data/constants";

interface DiscardConfirmDialogProps {
	open: boolean;
	filledFields: string[];
	onDiscard: () => void;
	onResume: () => void;
	fieldLabels?: Record<string, string>;
	resumeLabel?: string;
}

export function DiscardConfirmDialog({
	open,
	filledFields,
	onDiscard,
	onResume,
	fieldLabels,
	resumeLabel = "متابعة إضافة الطفل",
}: DiscardConfirmDialogProps) {
	const labels = fieldLabels ?? FIELD_LABELS;
	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onResume();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-md p-0 gap-0"
				dir="rtl"
			>
				<div className="flex gap-4 items-center px-5 pt-5 pb-4">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
						<IconAlertTriangle className="size-5 text-amber-500" />
					</div>

					<DialogHeader className="gap-0">
						<DialogTitle className="text-lg font-bold">بيانات غير محفوظة</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							ستفقد البيانات المدخلة إذا خرجت الآن
						</DialogDescription>
					</DialogHeader>
				</div>

				<Separator />

				{filledFields.length > 0 && (
					<div className="px-5 py-4">
						<div className="rounded-lg bg-muted/60 px-4 py-3">
							<p className="text-xs text-muted-foreground mb-2.5 font-medium">
								الحقول المدخلة:
							</p>
							<div className="flex flex-wrap gap-2">
								{filledFields.map((field) => (
									<span
										key={field}
										className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-100 text-amber-700"
									>
										{labels[field]}
									</span>
								))}
							</div>
						</div>
					</div>
				)}

				<Separator />

				<div className="flex items-center justify-between px-5 py-3">
					<Button
						variant="destructive"
						size="sm"
						onClick={onDiscard}
					>
						تجاهل والخروج
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={onResume}
					>
						{resumeLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
