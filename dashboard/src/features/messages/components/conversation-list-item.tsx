import { IconPinFilled, IconUserOff, IconVolumeOff } from "@tabler/icons-react";

import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import type { Conversation } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

/**
 * صف محادثة في القائمة: الأفاتار في جهة البداية (يمين)، ثم الاسم/آخر رسالة،
 * والوقت وعدّاد غير المقروء في جهة النهاية (يسار).
 */
export function ConversationListItem({
	conversation,
	isActive,
	onSelect,
}: {
	conversation: Conversation;
	isActive: boolean;
	onSelect: (id: string) => void;
}) {
	const isUnread = conversation.unreadCount > 0;

	return (
		<button
			type="button"
			onClick={() => onSelect(conversation.id)}
			className={cn(
				"flex h-[68px] w-full items-center gap-3 border-b border-border/50 px-3 text-start transition-colors hover:bg-muted/60",
				isActive && "bg-muted",
			)}
		>
			<ChatAvatar
				name={conversation.title}
				kind={conversation.kind}
				online={conversation.online}
				size={42}
			/>

			<span className="flex min-w-0 flex-1 flex-col justify-center gap-1">
				{/* السطر الأول: الاسم (يمين) والوقت (يسار) */}
				<span className="flex items-center gap-2">
					<span
						className={cn(
							"min-w-0 flex-1 truncate text-[14px] leading-[20px]",
							isUnread ? "font-semibold text-foreground" : "font-medium text-foreground",
						)}
					>
						{conversation.title}
					</span>
					{conversation.pinned && (
						<IconPinFilled className="size-3 shrink-0 text-muted-foreground" />
					)}
					<span className="shrink-0 text-[12px] leading-none text-muted-foreground tabular-nums">
						{conversation.timeLabel}
					</span>
				</span>

				{/* السطر الثاني: آخر رسالة (يمين) والحالة (يسار) */}
				<span className="flex items-center gap-2">
					<span className="min-w-0 flex-1 truncate text-[13px] leading-[18px] text-muted-foreground">
						{conversation.preview}
					</span>
					{conversation.muted && (
						<span className="flex shrink-0 items-center gap-1 text-muted-foreground">
							<IconUserOff className="size-3.5" />
							<IconVolumeOff className="size-3.5" />
						</span>
					)}
					{isUnread && (
						<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground tabular-nums">
							{conversation.unreadCount}
						</span>
					)}
				</span>
			</span>
		</button>
	);
}
