import { useEffect, useMemo, useRef, useState } from "react";

import { ChatHeader } from "@/features/messages/components/chat-header";
import { ChatSearchBar } from "@/features/messages/components/chat-search-bar";
import { MessageBubble } from "@/features/messages/components/message-bubble";
import { MessageComposer } from "@/features/messages/components/message-composer";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { Conversation } from "@/features/messages/types/messages.type";

export function ChatPanel({
	conversation,
	onSend,
	onUpload,
	onTogglePin,
	onToggleMute,
	onStartCall,
	onExport,
	onDelete,
}: {
	conversation: Conversation;
	onSend: (body: string) => void;
	/** رفع ملف كرسالة مرفق */
	onUpload: (file: File) => void;
	onTogglePin: () => void;
	onToggleMute: () => void;
	/** بدء مكالمة فيديو للمحادثة (قاعة LiveKit مشتركة) */
	onStartCall: () => void;
	onExport: () => void;
	onDelete: () => void;
}) {
	const searchOpen = useMessagesStore((s) => s.chatSearchOpen);
	const query = useMessagesStore((s) => s.chatQuery);
	const [activeIndex, setActiveIndex] = useState(0);
	const streamRef = useRef<HTMLDivElement>(null);
	const isGroup = conversation.kind === "group";

	// معرّفات الرسائل المطابقة للبحث بترتيب ظهورها في المجرى
	const matches = useMemo(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return [];
		return conversation.groups
			.flatMap((group) => group.messages)
			.filter((message) => message.body.toLowerCase().includes(needle))
			.map((message) => message.id);
	}, [conversation.groups, query]);

	// أي تغيير في البحث يعيد المؤشر إلى أول نتيجة
	// biome-ignore lint/correctness/useExhaustiveDependencies: إعادة الضبط مرتبطة بنص البحث فقط
	useEffect(() => {
		setActiveIndex(0);
	}, [query]);

	const activeMatchId =
		matches[Math.min(activeIndex, Math.max(matches.length - 1, 0))] ?? null;

	// انزل لآخر المجرى عند فتح محادثة أو وصول رسالة جديدة
	// biome-ignore lint/correctness/useExhaustiveDependencies: التمرير يتبع تبدّل المحادثة ورسائلها
	useEffect(() => {
		const stream = streamRef.current;
		if (stream) stream.scrollTop = stream.scrollHeight;
	}, [conversation.id, conversation.groups]);

	const step = (delta: number) => {
		if (matches.length === 0) return;
		setActiveIndex((prev) => (prev + delta + matches.length) % matches.length);
	};

	return (
		<section className="flex h-full min-w-0 flex-1 flex-col bg-muted/20">
			<ChatHeader
				conversation={conversation}
				onTogglePin={onTogglePin}
				onToggleMute={onToggleMute}
				onStartCall={onStartCall}
				onExport={onExport}
				onDelete={onDelete}
			/>

			{searchOpen && (
				<ChatSearchBar
					matchCount={matches.length}
					activeIndex={Math.min(activeIndex, Math.max(matches.length - 1, 0))}
					onPrev={() => step(-1)}
					onNext={() => step(1)}
				/>
			)}

			{/* مجرى الرسائل */}
			<div
				ref={streamRef}
				className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
			>
				{conversation.groups.map((group) => (
					<div key={group.label}>
						{/* فاصل اليوم — شارة وسط خط */}
						<div className="flex items-center gap-3 py-3">
							<span className="h-px flex-1 bg-border" />
							<span className="shrink-0 rounded-full border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground shadow-xs">
								{group.label}
							</span>
							<span className="h-px flex-1 bg-border" />
						</div>

						<div className="flex flex-col gap-2">
							{group.messages.map((message) => (
								<MessageBubble
									key={message.id}
									message={message}
									authorName={message.authorName}
									showAuthor={isGroup}
									query={query}
									isActiveMatch={message.id === activeMatchId}
								/>
							))}
						</div>
					</div>
				))}
			</div>

			<MessageComposer
				members={conversation.members}
				onSend={onSend}
				onUpload={onUpload}
			/>
		</section>
	);
}
