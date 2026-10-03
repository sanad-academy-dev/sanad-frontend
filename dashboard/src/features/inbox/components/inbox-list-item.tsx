import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import { InboxIconBadge } from "@/features/inbox/components/inbox-icon";
import type { InboxNotification } from "@/features/inbox/types/inbox.type";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function InboxListItem({
	notification,
	isActive,
	onSelect,
}: {
	notification: InboxNotification;
	isActive: boolean;
	onSelect: (id: string) => void;
}) {
	const { lang } = useI18n();
	const navigate = useNavigate();
	const relative = formatDistanceToNow(new Date(notification.createdAt), {
		addSuffix: true,
		locale: lang === "ar" ? arSA : enUS,
	});

	const handleClick = () => {
		onSelect(notification.id); // يعرض التفاصيل ويعلّمه مقروءًا
		// إشعار مرتبط بزيارة → افتح تفاصيلها مباشرة
		if (notification.appointmentId) {
			void navigate({
				to: "/appointments",
				search: { period: "day", view: "all", openAppointment: notification.appointmentId },
			});
		} else if (notification.taskId) {
			// إشعار مرتبط بمهمة → افتح تفاصيلها مباشرة
			void navigate({
				to: "/tasks",
				search: { view: "all", openTask: notification.taskId },
			});
		} else if (notification.conversationId) {
			// إشعار رسالة → افتح المحادثة نفسها في «الرسائل»
			void navigate({
				to: "/management/messages",
				search: { openConversation: notification.conversationId },
			});
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={cn(
				"flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-muted/60",
				isActive && "bg-muted",
			)}
		>
			{/* الأيقونة على اليمين (تدفق RTL) مع نقطة "غير مقروء" أعلى يمينها */}
			<span className="relative shrink-0">
				<InboxIconBadge icon={notification.icon} />
				{!notification.read ? (
					<span
						className="absolute -top-0.5 inset-e-0 size-1.5 rounded-full bg-primary ring-2 ring-background"
						title="غير مقروء"
					/>
				) : null}
			</span>

			{/* العنوان + الوقت */}
			<span className="flex min-w-0 flex-1 flex-col gap-1">
				<span
					className={cn(
						"truncate text-[11px] leading-none",
						notification.read
							? "font-normal text-foreground"
							: "font-semibold text-foreground",
					)}
				>
					{notification.title}
				</span>
				<span className="text-[10px] leading-none text-muted-foreground">{relative}</span>
			</span>
		</button>
	);
}
