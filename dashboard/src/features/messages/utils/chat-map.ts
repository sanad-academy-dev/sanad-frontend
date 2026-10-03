// تحويل صفوف الخادم إلى نماذج عرض وحدة «الرسائل» + منسّقات الوقت العربية.
// الخادم يرسل التواريخ كنصوص ISO عبر JSON — نتعامل معها كنصوص/Date بالتساوي.
import type {
	ChatAttachment,
	ChatDayGroup,
	ChatMember,
	ChatMessage,
	Conversation,
	SharedDocument,
	SharedMedia,
} from "@/features/messages/types/messages.type";
import type {
	ChatDirectoryEntry,
	ChatMessageRow,
	ConversationListItem,
	ConversationThread,
} from "@/server/chat/chat.type";
import { backendUrl } from "@/lib/backend-fetch";

const timeFormatter = new Intl.DateTimeFormat("ar-SA", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});
const dateFormatter = new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short" });
const monthYearFormatter = new Intl.DateTimeFormat("ar-SA", {
	month: "long",
	year: "numeric",
});

const asDate = (value: Date | string) => (value instanceof Date ? value : new Date(value));

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** اليوم → HH:mm، أمس → «أمس»، الأقدم → تاريخ قصير */
export const listTimeLabel = (value: Date | string): string => {
	const date = asDate(value);
	const today = startOfDay(new Date());
	const day = startOfDay(date);
	if (day === today) return timeFormatter.format(date);
	if (today - day === 86_400_000) return "أمس";
	return dateFormatter.format(date);
};

/** عنوان مجموعة اليوم داخل المجرى */
const dayLabel = (value: Date): string => {
	const today = startOfDay(new Date());
	const day = startOfDay(value);
	if (day === today) return "اليوم";
	if (today - day === 86_400_000) return "أمس";
	return dateFormatter.format(value);
};

export type DirectoryView = ChatMember & {
	email: string;
	phone: string | null;
	location: string | null;
	joinedLabel: string;
	/** false = موظف بلا حساب دخول — يظهر معطّلًا في المنتقي */
	hasAccount: boolean;
};

export const mapDirectoryEntry = (entry: ChatDirectoryEntry): DirectoryView => ({
	id: entry.id,
	name: entry.name,
	role: entry.title ?? "عضو الفريق",
	online: entry.online,
	email: entry.email,
	phone: entry.phone,
	location: entry.location,
	joinedLabel: `انضم ${monthYearFormatter.format(asDate(entry.joinedAt))}`,
	hasAccount: entry.hasAccount,
});

/** صف قائمة المحادثات → نموذج العرض (بدون المجرى — يُحمَّل عند الفتح) */
export const mapConversation = (
	row: ConversationListItem,
	myId: string,
	directoryById: Map<string, DirectoryView>,
): Conversation => {
	const others = row.members.filter((m) => m.userId !== myId);
	const peers = others.map((m) => directoryById.get(m.userId));
	const firstPeer = peers[0];

	const me = row.members.find((m) => m.userId === myId);
	const isDirect = row.kind === "DIRECT";
	const title = isDirect
		? (others[0]?.user.name ?? "محادثة")
		: (row.title ?? others.map((m) => m.user.name.split(" ")[0]).join("، "));

	const lastMessage = row.messages[0];
	const preview = lastMessage
		? lastMessage.body ||
			(lastMessage.attachmentName ? `📎 ${lastMessage.attachmentName}` : "")
		: "";

	return {
		id: row.id,
		kind: isDirect ? "direct" : "group",
		title,
		preview,
		timeLabel: listTimeLabel(row.lastMessageAt),
		unreadCount: row.unreadCount,
		pinned: me?.pinned ?? false,
		muted: me?.muted ?? false,
		online: peers.some((p) => p?.online),
		joinedLabel: isDirect ? (firstPeer?.joinedLabel ?? "—") : "محادثة جماعية",
		email: (isDirect && firstPeer?.email) || "—",
		phone: (isDirect && firstPeer?.phone) || "—",
		location: (isDirect && firstPeer?.location) || "—",
		members: others.map((m) => {
			const entry = directoryById.get(m.userId);
			return {
				id: m.userId,
				name: m.user.name,
				role: entry?.role ?? "عضو الفريق",
				online: entry?.online ?? false,
			};
		}),
		groups: [],
		// لا نموذج مرفقات بعد — التبويبات تعرض حالاتها الفارغة
		media: [],
		links: [],
		documents: [],
		visits: [],
	};
};

/** حجم ملف مقروء: بايت → ك.ب/م.ب */
export const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} بايت`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} ك.ب`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
};

const attachmentUrl = (messageId: string) => backendUrl(`/api/chat/attachments/${messageId}`);

const mapAttachment = (row: ChatMessageRow): ChatAttachment | undefined => {
	if (!row.attachmentName || !row.attachmentMime) return undefined;
	return {
		name: row.attachmentName,
		mime: row.attachmentMime,
		sizeLabel: formatFileSize(row.attachmentSize ?? 0),
		url: attachmentUrl(row.id),
		isImage: row.attachmentMime.startsWith("image/"),
	};
};

const mapMessage = (
	row: ChatMessageRow,
	myId: string,
	peersLastReadAt: Date | string | null,
): ChatMessage => {
	const createdAt = asDate(row.createdAt);
	const outgoing = row.authorId === myId;
	const read =
		peersLastReadAt !== null && asDate(peersLastReadAt).getTime() >= createdAt.getTime();
	return {
		id: row.id,
		authorId: row.authorId,
		authorName: row.author.name,
		body: row.body,
		attachment: mapAttachment(row),
		timeLabel: timeFormatter.format(createdAt),
		outgoing,
		// وصلت للخادم = مُسلَّمة؛ تصير مقروءة عندما يتجاوزها «آخر قراءة» لكل الأطراف
		status: outgoing ? (read ? "read" : "delivered") : "read",
	};
};

/** روابط http(s) داخل نصوص الرسائل — تغذي تبويب «الروابط» في البروفايل */
export const extractThreadLinks = (
	thread: ConversationThread,
): { id: string; title: string; url: string }[] => {
	const links: { id: string; title: string; url: string }[] = [];
	const seen = new Set<string>();
	for (const row of thread.messages) {
		for (const url of row.body.match(/https?:\/\/[^\s<>"]+/g) ?? []) {
			if (seen.has(url)) continue;
			seen.add(url);
			let title = url;
			try {
				title = new URL(url).hostname.replace(/^www\./, "");
			} catch {}
			links.push({ id: `${row.id}-${links.length}`, title, url });
		}
	}
	return links;
};

const docDateFormatter = new Intl.DateTimeFormat("ar-SA", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** صور المجرى → تبويب «الوسائط»، وبقية المرفقات → تبويب «المستندات» */
export const extractThreadAttachments = (
	thread: ConversationThread,
): { media: SharedMedia[]; documents: SharedDocument[] } => {
	const media: SharedMedia[] = [];
	const documents: SharedDocument[] = [];
	for (const row of thread.messages) {
		if (!row.attachmentName || !row.attachmentMime) continue;
		if (row.attachmentMime.startsWith("image/")) {
			media.push({
				id: row.id,
				alt: row.attachmentName,
				url: attachmentUrl(row.id),
			});
		} else {
			documents.push({
				id: row.id,
				name: row.attachmentName,
				sizeLabel: formatFileSize(row.attachmentSize ?? 0),
				dateLabel: docDateFormatter.format(asDate(row.createdAt)),
				url: attachmentUrl(row.id),
			});
		}
	}
	// الأحدث أولًا في التبويبات
	return { media: media.reverse(), documents: documents.reverse() };
};

/** مجرى الخادم → مجموعات أيام جاهزة للعرض */
export const mapThread = (thread: ConversationThread, myId: string): ChatDayGroup[] => {
	const groups: ChatDayGroup[] = [];
	for (const row of thread.messages) {
		const label = dayLabel(asDate(row.createdAt));
		const last = groups.at(-1);
		const message = mapMessage(row, myId, thread.peersLastReadAt);
		if (last && last.label === label) last.messages.push(message);
		else groups.push({ label, messages: [message] });
	}
	return groups;
};
