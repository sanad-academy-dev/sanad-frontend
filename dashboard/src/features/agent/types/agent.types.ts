// حالة رسائل واجهة المحادثة فقط (لا يوجد مخطط Zod/Prisma خلفها)
export type AgentChatRole = "user" | "assistant";

export type AgentChatMessage = {
	id: string;
	role: AgentChatRole;
	content: string;
};
