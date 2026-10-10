import {
	IconAlertCircle,
	IconAlertTriangle,
	IconChevronLeft,
	IconCircleX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import type { Conversation } from "@/features/messages/types/messages.type";

/** تأكيد حذف محادثة — بنمط نوافذ الحذف في النظام (رأس أحمر + صندوق النتائج) */
export function DeleteConversationDialog({
	conversation,
	onConfirm,
	onClose,
}: {
	conversation: Conversation | null;
	onConfirm: () => void;
	onClose: () => void;
}) {
	return (
		<Dialog
			open={!!conversation}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent
				className="sm:max-w-lg! p-0 gap-0"
				dir="rtl"
			>
				<DialogHeader className="px-4 py-3 border-b flex-row items-center gap-2 space-y-0">
					<DialogTitle className="text-destructive font-semibold text-sm">
						حذف المحادثة
					</DialogTitle>
					{conversation && (
						<>
							<IconChevronLeft className="size-3.5 text-muted-foreground" />
							<div className="flex items-center gap-1.5">
								<ChatAvatar
									name={conversation.title}
									kind={conversation.kind}
									size={24}
								/>
								<span className="text-sm font-medium">{conversation.title}</span>
							</div>
						</>
					)}
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد حذف المحادثة نهائيًا</DialogDescription>

				<div className="px-5 py-5 flex flex-col gap-4">
					<p className="text-sm text-foreground leading-relaxed">
						هل أنت متأكد من حذف المحادثة &ldquo;{conversation?.title}&rdquo;؟ لا يمكن التراجع
						عن هذا الإجراء.
					</p>

					<div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex flex-col gap-2.5">
						<p className="text-sm font-semibold text-destructive flex items-center gap-1.5">
							<IconAlertCircle className="size-4" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								ستُحذف جميع الرسائل داخل المحادثة نهائيًا
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconCircleX className="size-4 text-destructive shrink-0 mt-0.5" />
								لن تظهر الوسائط والروابط والمستندات المشتركة بعد الآن
							</li>
							<li className="flex items-start gap-2 text-sm text-foreground">
								<IconAlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
								لا يمكن استرجاع المحادثة بعد حذفها
							</li>
						</ul>
					</div>
				</div>

				<div className="px-5 py-4 border-t flex gap-2 items-center justify-end">
					<Button
						variant="outline"
						onClick={onClose}
					>
						إلغاء
					</Button>
					<Button
						onClick={onConfirm}
						className="gap-2 flex bg-destructive primaryhover:bg-destructive/90"
					>
						حذف
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
