import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { AgentConversationSummary } from "@/features/agent/types/conversation.types";
import { api } from "@/lib/api";

const CONVERSATIONS_KEY = ["agent", "conversations"] as const;

// سجلّ محادثات المستخدم الحالي (خاصّ به) — للشريط الجانبي وقائمة السجلّ
export const useAgentConversations = () => {
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery<AgentConversationSummary[]>({
		queryKey: CONVERSATIONS_KEY,
		queryFn: async () => {
			const { data, error } = await api.agent.conversations.get();
			if (error) throw new Error("Failed to fetch conversations");
			return data;
		},
		staleTime: 1000 * 30,
	});

	// إعادة الجلب بعد إنشاء/إلحاق/حذف — تُستدعى من hook الدردشة
	const refresh = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
	}, [queryClient]);

	const remove = useCallback(
		async (id: string) => {
			await api.agent.conversations({ id }).delete();
			void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
		},
		[queryClient],
	);

	return { conversations: data ?? [], isLoading, refresh, remove };
};
