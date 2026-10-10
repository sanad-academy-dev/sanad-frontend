import {
	IconDots,
	IconHelpCircle,
	IconLogout2,
	IconPin,
	IconPinnedOff,
	IconSearch,
	IconTrash,
	IconUser,
	IconVideo,
	IconVolume,
	IconVolumeOff,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { Conversation } from "@/features/messages/types/messages.type";

export function ChatHeader({
	conversation,
	onTogglePin,
	onToggleMute,
	onStartCall,
	onExport,
	onDelete,
}: {
	conversation: Conversation;
	onTogglePin: () => void;
	onToggleMute: () => void;
	/** بدء مكالمة فيديو للمحادثة */
	onStartCall: () => void;
	onExport: () => void;
	onDelete: () => void;
}) {
	const openProfile = useMessagesStore((s) => s.openProfile);
	const openChatSearch = useMessagesStore((s) => s.openChatSearch);

	return (
		<div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b px-3">
			{/* هوية المحادثة (يمين) */}
			<button
				type="button"
				onClick={openProfile}
				className="flex min-w-0 items-center gap-1.5 rounded-[4px] text-start transition-colors hover:text-primary"
			>
				<ChatAvatar
					name={conversation.title}
					kind={conversation.kind}
					online={conversation.online}
					size={21}
				/>
				<span className="truncate text-[13px] font-semibold">{conversation.title}</span>
			</button>

			{/* الإجراءات (يسار) — أول عنصر في RTL هو الأيمن */}
			<div className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="مكالمة فيديو"
					onClick={onStartCall}
				>
					<IconVideo className="size-3" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="بحث في الرسائل"
					onClick={openChatSearch}
				>
					<IconSearch className="size-3" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="مساعدة"
				>
					<IconHelpCircle className="size-3" />
				</Button>

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="خيارات المحادثة"
						>
							<IconDots className="size-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-[151px]"
					>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={openProfile}
						>
							<IconUser className="size-4 text-muted-foreground" />
							بروفايل المحادثة
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={onTogglePin}
						>
							{conversation.pinned ? (
								<IconPinnedOff className="size-4 text-muted-foreground" />
							) : (
								<IconPin className="size-4 text-muted-foreground" />
							)}
							{conversation.pinned ? "إلغاء التثبيت" : "تثبيت المحادثة"}
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={onToggleMute}
						>
							{conversation.muted ? (
								<IconVolume className="size-4 text-muted-foreground" />
							) : (
								<IconVolumeOff className="size-4 text-muted-foreground" />
							)}
							{conversation.muted ? "تشغيل الاشعارات" : "كتم الاشعارات"}
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={onExport}
						>
							<IconLogout2 className="size-4 text-muted-foreground" />
							تصدير المحادثة
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							className="gap-2 text-[13px]"
							onSelect={onDelete}
						>
							<IconTrash className="size-4" />
							حذف المحادثة
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
