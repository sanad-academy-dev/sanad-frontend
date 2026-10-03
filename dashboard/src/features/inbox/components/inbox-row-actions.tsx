import { IconDots, IconMessage, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InboxDeleteDialog,
	type InboxDeleteScope,
} from "@/features/inbox/components/inbox-delete-dialog";
import {
	useDeleteInbox,
	useMarkAllInboxRead,
} from "@/features/inbox/hooks/use-inbox-mutations";

// قائمة إجراءات الوارد (حذف/تعليم كمقروء) — تصميم القائمة المنسدلة
export function InboxRowActions() {
	const deleteInbox = useDeleteInbox();
	const markAllRead = useMarkAllInboxRead();
	// نطاق الحذف المنتظر تأكيده (null = لا نافذة تأكيد مفتوحة)
	const [pendingScope, setPendingScope] = useState<InboxDeleteScope | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// إجراءات الحذف تفتح نافذة تأكيد أولًا؛ تعليم الكل كمقروء يُنفَّذ مباشرةً
	const deleteActions: { key: string; label: string; scope: InboxDeleteScope }[] = [
		{ key: "delete-all", label: "حذف جميع الإشعارات", scope: "all" },
		{ key: "delete-read", label: "حذف جميع الإشعارات المقروءة", scope: "read" },
		{ key: "delete-completed", label: "حذف جميع الإشعارات المكتملة", scope: "completed" },
	];

	const handleConfirmDelete = async (scope: InboxDeleteScope) => {
		setIsDeleting(true);
		try {
			await deleteInbox(scope);
			setPendingScope(null);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<DropdownMenu dir="rtl">
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label="إجراءات"
					>
						<IconDots className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-[200px]"
				>
					{deleteActions.map((action) => (
						<DropdownMenuItem
							key={action.key}
							onSelect={() => setPendingScope(action.scope)}
							className="justify-start gap-2 text-[12px]"
						>
							<IconTrash className="size-3.5 text-muted-foreground" />
							{action.label}
						</DropdownMenuItem>
					))}
					<DropdownMenuItem
						onSelect={() => void markAllRead()}
						className="justify-start gap-2 text-[12px]"
					>
						<IconMessage className="size-3.5 text-muted-foreground" />
						تعليم الكل كمقروء
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<InboxDeleteDialog
				scope={pendingScope}
				isPending={isDeleting}
				onConfirm={handleConfirmDelete}
				onClose={() => setPendingScope(null)}
			/>
		</>
	);
}
