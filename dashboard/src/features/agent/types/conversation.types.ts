// أنواع سجلّ محادثات المساعد على الواجهة — مشتقّة من أنواع الخادم القانونية.
import type {
	AgentConversationDetail,
	AgentConversationListItem,
} from "@/server/agent/agent.type";

// عنصر في قائمة السجلّ الجانبي (بلا رسائل)
export type AgentConversationSummary = Pick<
	AgentConversationListItem,
	"id" | "title" | "createdAt" | "updatedAt"
>;

// محادثة كاملة مع رسائلها — الأدوار تصل من الخادم مطبّعة لحالة الأحرف الصغيرة،
// لذا نشتقّ شكل الرسالة ونضيّق الدور إلى الاتحاد المتوقّع على الواجهة.
export type AgentConversationMessage = Omit<
	AgentConversationDetail["messages"][number],
	"role"
> & {
	role: "user" | "assistant";
};
