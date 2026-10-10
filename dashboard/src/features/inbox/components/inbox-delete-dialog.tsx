import { IconAlertCircle, IconAlertTriangle, IconCircleX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

// نطاق الحذف — نفس اتحاد useDeleteInbox
export type InboxDeleteScope = "all" | "read" | "completed";

// نصوص كل نطاق: العنوان الظاهر والوصف داخل التأكيد
const SCOPE_TEXT: Record<InboxDeleteScope, { title: string; target: string }> = {
	all: { title: "حذف جميع الإشعارات", target: "جميع الإشعارات" },
	read: { title: "حذف الإشعارات المقروءة", target: "جميع الإشعارات المقروءة" },
	completed: { title: "حذف الإشعارات المكتملة", target: "جميع الإشعارات المكتملة" },
};

interface InboxDeleteDialogProps {
	scope: InboxDeleteScope | null;
	isPending?: boolean;
	onConfirm: (scope: InboxDeleteScope) => void;
	onClose: () => void;
}

// نافذة تأكيد حذف إشعارات الوارد — بنمط delete-owner-dialog (رأس أحمر + صندوق نتائج)
export function InboxDeleteDialog({
	scope,
	isPending = false,
	onConfirm,
	onClose,
}: InboxDeleteDialogProps) {
	const text = scope ? SCOPE_TEXT[scope] : null;

	const handleOpenChange = (open: boolean) => {
		if (!open) onClose();
	};

	return (
		<Dialog
			open={!!scope}
			onOpenChange={handleOpenChange}
		>
			<DialogContent
				className="sm:max-w-md! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-destructive font-semibold text-sm">
						{text?.title ?? "حذف الإشعارات"}
					</DialogTitle>
				</DialogHeader>

				<DialogDescription className="sr-only">
					تأكيد حذف الإشعارات من الوارد
				</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف {text?.target ?? "الإشعارات"}؟ لا يمكن التراجع عن هذا الإجراء.
					</p>

					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								ستُحذف {text?.target ?? "الإشعارات"} نهائيًا من الوارد
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لا يمكن استرجاع الإشعارات بعد حذفها
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						onClick={() => scope && onConfirm(scope)}
						disabled={isPending || !scope}
						className="gap-2 flex bg-destructive primaryhover:bg-destructive/90"
					>
						حذف
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
