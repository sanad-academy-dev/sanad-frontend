import { IconSend, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { showSuccessToast } from "@/components/common/success-toast";
import { ChatPanel } from "@/features/messages/components/chat-panel";
import { ConversationProfilePanel } from "@/features/messages/components/conversation-profile-panel";
import { ConversationsPanel } from "@/features/messages/components/conversations-panel";
import { DeleteConversationDialog } from "@/features/messages/components/delete-conversation-dialog";
import { MessagesEmpty } from "@/features/messages/components/messages-empty";
import { MessagesHeader } from "@/features/messages/components/messages-header";
import { NewConversationSheet } from "@/features/messages/components/new-conversation-sheet";
import { useMessages } from "@/features/messages/hooks/use-messages";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import { useCallWindowStore } from "@/features/video-calls/stores/call-window.store";

export function MessagesPage({ openConversationId }: { openConversationId?: string | null }) {
	const {
		conversations,
		selected,
		selectedId,
		openConversation,
		togglePin,
		toggleMute,
		removeConversation,
		addMembers,
		sendMessage,
		uploadAttachment,
		createConversation,
	} = useMessages();

	const profileOpen = useMessagesStore((s) => s.profileOpen);
	const openCallWindow = useCallWindowStore((s) => s.open);

	/**
	 * مكالمة فيديو للمحادثة: قاعة LiveKit مشتركة باسم المحادثة — نرسل رابط
	 * الانضمام كرسالة (فيصل الطرف الآخر زر انضمام + توست/إشعار) ثم نفتح
	 * النافذة العائمة دون مغادرة الصفحة.
	 */
	const startCall = (conversationId: string, conversationTitle: string) => {
		const room = `chat-${conversationId.slice(-8)}`;
		const joinUrl = `${window.location.origin}/video-call?room=${room}`;
		sendMessage(conversationId, `📞 دعوة مكالمة فيديو — انضم من هنا: ${joinUrl}`);
		openCallWindow(room, conversationTitle);
	};

	// قادم من إشعار/توست بمعرّف محادثة → افتحها مباشرة
	useEffect(() => {
		if (openConversationId) openConversation(openConversationId);
	}, [openConversation, openConversationId]);
	const [pendingDelete, setPendingDelete] = useState<typeof selected>(null);

	const confirmDelete = () => {
		if (!pendingDelete) return;
		removeConversation(pendingDelete.id, () =>
			showSuccessToast("تم حذف المحادثة", {
				icon: <IconTrash className="size-5 shrink-0 text-destructive" />,
				iconAtStart: true,
				textClassName: "text-[13px] font-medium text-foreground",
			}),
		);
		setPendingDelete(null);
	};

	return (
		<div
			className="flex h-full min-h-0 flex-1 overflow-hidden"
			dir="rtl"
		>
			{/* تبويبات التصفية داخل هيدر النظام */}
			<MessagesHeader />

			{/* اليمين: قائمة المحادثات */}
			<ConversationsPanel
				conversations={conversations}
				selectedId={selectedId}
				onSelect={openConversation}
			/>

			{/* الوسط: المحادثة المفتوحة أو حالة فارغة */}
			{selected ? (
				<ChatPanel
					conversation={selected}
					onSend={(body) => sendMessage(selected.id, body)}
					onUpload={(file) => uploadAttachment(selected.id, file)}
					onTogglePin={() => togglePin(selected.id)}
					onToggleMute={() => toggleMute(selected.id)}
					onStartCall={() => startCall(selected.id, selected.title)}
					onExport={() => showSuccessToast("تم تصدير المحادثة بنجاح", { iconAtStart: true })}
					onDelete={() => setPendingDelete(selected)}
				/>
			) : (
				<div className="flex min-w-0 flex-1 flex-col">
					<MessagesEmpty />
				</div>
			)}

			{/* اليسار: بروفايل المحادثة */}
			{selected && profileOpen && (
				<ConversationProfilePanel
					conversation={selected}
					onTogglePin={() => togglePin(selected.id)}
					onToggleMute={() => toggleMute(selected.id)}
					onStartCall={() => startCall(selected.id, selected.title)}
					onAddMember={(member) => addMembers(selected.id, [member])}
					onDelete={() => setPendingDelete(selected)}
				/>
			)}

			{/* لوحة «رسالة جديدة» */}
			<NewConversationSheet
				onCreate={(kind, members, body) => {
					createConversation(kind, members, body, () =>
						showSuccessToast("تم بدأ المحادثة بنجاح", {
							icon: <IconSend className="size-5 shrink-0 text-primary" />,
							iconAtStart: true,
							textClassName: "text-[13px] font-medium text-foreground",
						}),
					);
				}}
			/>

			<DeleteConversationDialog
				conversation={pendingDelete}
				onConfirm={confirmDelete}
				onClose={() => setPendingDelete(null)}
			/>
		</div>
	);
}
