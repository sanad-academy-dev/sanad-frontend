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

export interface DiscardConfirmDialogProps {
	open: boolean;
	filledFields?: string[];
	onDiscard?: () => void;
	onResume?: () => void;
	onConfirm?: () => void;
	onCancel?: () => void;
	fieldLabels?: Record<string, string>;
	resumeLabel?: string;
	title?: string;
	description?: string;
}

/**
 * نافذة تأكيد موحدة للبيانات غير المحفوظة عند الخروج من النماذج في نظام سند.
 * تعرض أيقونة التحذير والحقول المدخلة التي ستفقد مع أزرار تجاهل والخروج / متابعة الإضافة.
 */
export function DiscardConfirmDialog({
	open,
	filledFields = [],
	onDiscard,
	onResume,
	onConfirm,
	onCancel,
	fieldLabels = {},
	resumeLabel = "متابعة الإضافة",
	title = "بيانات غير محفوظة",
	description = "ستفقد البيانات المدخلة إذا خرجت الآن",
}: DiscardConfirmDialogProps) {
	const handleDiscard = onDiscard ?? onConfirm ?? (() => {});
	const handleResume = onResume ?? onCancel ?? (() => {});
	const labels = fieldLabels ?? {};
	const fields = filledFields ?? [];

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) handleResume();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-md p-0 gap-0"
				dir="rtl"
			>
				<div className="flex gap-4 items-center px-5 pt-5 pb-4">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
						<IconAlertTriangle className="size-5 text-amber-500" />
					</div>

					<DialogHeader className="gap-0 text-start">
						<DialogTitle className="text-lg font-bold text-foreground">{title}</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							{description}
						</DialogDescription>
					</DialogHeader>
				</div>

				<Separator />

				{fields.length > 0 && (
					<div className="px-5 py-4">
						<div className="rounded-lg bg-muted/60 px-4 py-3">
							<p className="text-xs text-muted-foreground mb-2.5 font-medium">
								الحقول المدخلة:
							</p>
							<div className="flex flex-wrap gap-2">
								{fields.map((field) => (
									<span
										key={field}
										className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
									>
										{labels[field] ?? field}
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
						onClick={handleDiscard}
					>
						تجاهل والخروج
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleResume}
					>
						{resumeLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

