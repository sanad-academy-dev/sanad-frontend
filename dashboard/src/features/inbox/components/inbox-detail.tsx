import { InboxActivityItem } from "@/features/inbox/components/inbox-activity-item";
import { InboxCommentForm } from "@/features/inbox/components/inbox-comment-form";
import { useAddInboxComment } from "@/features/inbox/hooks/use-inbox-mutations";
import type { InboxNotification } from "@/features/inbox/types/inbox.type";

export function InboxDetail({ notification }: { notification: InboxNotification }) {
	// إضافة تعليق فعلي عبر الـ API (يُعيد الجلب بعد النجاح فيظهر التعليق)
	const addComment = useAddInboxComment(notification.id);

	return (
		<div className="flex h-full min-w-0 flex-1 flex-col">
			{/* جسم التفاصيل */}
			<div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
				<p className="text-[15px] leading-relaxed font-medium text-foreground">
					{notification.title}
				</p>
			</div>

			{/* قسم النشاط + إضافة تعليق */}
			<div className="border-t px-8 py-3">
				<h3 className="mb-3 text-sm font-semibold text-foreground">النشاط</h3>
				<div className="mb-3 flex flex-col gap-3">
					{notification.activity.map((item) => (
						<InboxActivityItem
							key={item.id}
							activity={item}
						/>
					))}
				</div>
				<InboxCommentForm onSubmit={(comment) => void addComment(comment)} />
			</div>
		</div>
	);
}
