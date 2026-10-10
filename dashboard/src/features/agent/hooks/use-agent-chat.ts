import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import type { AgentChatMessage } from "@/features/agent/types/agent.types";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import { backendUrl } from "@/lib/backend-fetch";

const makeId = () => Math.random().toString(36).slice(2);

// عنوان المحادثة = أول رسالة مقتطعة (سلوك مطابق لـ Claude Code)
const titleFromMessage = (text: string) => text.trim().slice(0, 80);

export const useAgentChat = () => {
	const { t } = useI18n();
	const queryClient = useQueryClient();
	const [messages, setMessages] = useState<AgentChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);
	// معرّف المحادثة المحفوظة الحالية (null = محادثة جديدة لم تُحفظ بعد)
	const [conversationId, setConversationId] = useState<string | null>(null);

	const invalidateList = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: ["agent", "conversations"] });
	}, [queryClient]);

	// إلحاق رسالة بالمحادثة المحفوظة (best-effort: فشل الحفظ لا يوقف الدردشة)
	const persistMessage = useCallback(
		async (convId: string, message: Pick<AgentChatMessage, "role" | "content">) => {
			try {
				await api.agent.conversations({ id: convId }).messages.post({
					role: message.role,
					content: message.content,
				});
			} catch (err) {
				console.error("[agent] failed to persist message (non-blocking):", err);
			}
		},
		[],
	);

	// يرسل نصًّا محدّدًا (من المُحرّر الحر أو من قالب أمر جاهز)
	const sendText = useCallback(
		async (text: string) => {
			const trimmed = text.trim();
			if (!trimmed || isStreaming) return;

			const userMessage: AgentChatMessage = { id: makeId(), role: "user", content: trimmed };
			const assistantId = makeId();

			setMessages((prev) => [
				...prev,
				userMessage,
				{ id: assistantId, role: "assistant", content: "" },
			]);
			setIsStreaming(true);

			const history = [...messages, userMessage]
				.filter((m) => Boolean(m.content && m.content.trim()))
				.map(({ role, content }) => ({
					role,
					content,
				}));

			// أنشئ المحادثة عند أول رسالة (العنوان من أول رسالة)، وإلا استخدم القائمة الحالية
			let convId = conversationId;
			try {
				if (!convId) {
					const { data, error } = await api.agent.conversations.post({
						title: titleFromMessage(trimmed),
					});
					if (!error && data) {
						convId = data.id;
						setConversationId(data.id);
						invalidateList();
					}
				}
				if (convId) void persistMessage(convId, userMessage);
			} catch (err) {
				console.error("[agent] failed to create conversation (non-blocking):", err);
			}

			try {
				const response = await fetch(backendUrl("/api/agent/chat"), {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ messages: history }),
				});

				if (!response.ok) {
					const errText = await response.text().catch(() => "");
					console.error("[agent] chat failed", response.status, errText);
					throw new Error(`bad response ${response.status}`);
				}
				if (!response.body) {
					console.error("[agent] chat: no response body (stream missing)");
					throw new Error("no body");
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();

				let received = 0;
				let assistantText = "";
				while (true) {
					const { value, done } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					received += chunk.length;
					assistantText += chunk;
					setMessages((prev) =>
						prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
					);
				}
				// بثّ انتهى فارغًا = خطأ ابتلعه الخادم — نسجّله (الواجهة تعرض بطاقة "لم يصل ردّ")
				if (received === 0) {
					console.error("[agent] اكتمل البثّ بلا أي محتوى — راجع سجلّ الخادم (onError)");
				}
				// احفظ ردّ المساعد بعد اكتمال البثّ
				if (convId && assistantText) {
					void persistMessage(convId, { role: "assistant", content: assistantText });
					invalidateList();
				}
			} catch (err) {
				console.error("[agent] chat error:", err);
				setMessages((prev) =>
					prev.map((m) => (m.id === assistantId ? { ...m, content: t("agent.error") } : m)),
				);
			} finally {
				setIsStreaming(false);
			}
		},
		[isStreaming, messages, conversationId, invalidateList, persistMessage, t],
	);

	// يرسل ما في حقل الإدخال الحر
	const send = useCallback(async () => {
		const text = input.trim();
		if (!text) return;
		setInput("");
		await sendText(text);
	}, [input, sendText]);

	// محادثة جديدة — يمسح الرسائل ومعرّف المحادثة (لا يحذف من الخادم)
	const newConversation = useCallback(() => {
		setMessages([]);
		setInput("");
		setConversationId(null);
	}, []);

	// تحميل محادثة محفوظة من السجلّ إلى اللوحة
	const loadConversation = useCallback(async (id: string) => {
		try {
			const { data, error } = await api.agent.conversations({ id }).get();
			if (error || !data) return;

			// Elysia Eden Treaty قد يفشل في استنتاج النوع الصحيح ويخلط بين مصفوفة المحادثات ومحادثة واحدة
			const conv = data as unknown as {
				id: string;
				messages: Array<{ id: string; role: string; content: string }>;
			};

			if (!conv.id || !Array.isArray(conv.messages)) return;

			setConversationId(conv.id);
			setMessages(
				conv.messages.map((m) => ({
					id: m.id,
					role: m.role?.toLowerCase() === "assistant" ? "assistant" : "user",
					content: m.content,
				})),
			);
			setInput("");
		} catch (err) {
			console.error("[agent] failed to load conversation:", err);
		}
	}, []);

	return {
		messages,
		input,
		setInput,
		send,
		sendText,
		isStreaming,
		conversationId,
		newConversation,
		loadConversation,
	};
};
