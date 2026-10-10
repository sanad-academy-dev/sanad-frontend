import { IconMessage2 } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth/client";
import { backendUrl } from "@/lib/backend-fetch";
import type { ChatServerEvent } from "@/server/chat/chat-events";

const MESSAGES_PATH = "/management/messages";

/**
 * قناة أحداث «الرسائل» اللحظية — تُركَّب مرة واحدة في تخطيط الصفحات المحمية
 * فتعيش طوال الجلسة أينما تنقّل المستخدم:
 * - داخل «الرسائل»: تُبطل الاستعلامات فيتحدث كل شيء فورًا.
 * - خارجها: توست «رسالة جديدة من فلان» ينقر فيفتح المحادثة، ويُبطل وارد
 *   الإشعارات (الخادم يسجّل إشعار وارد لغير المتصلين).
 * الاتصال نفسه هو حضور المستخدم (النقطة الخضراء) على مستوى التطبيق كله.
 */
export function useChatEvents() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { data: session } = useSession();

	// مراجع حية حتى لا يُعاد فتح الاتصال عند كل تنقّل/تحديث جلسة
	const myIdRef = useRef<string | null>(null);
	myIdRef.current = session?.user.id ?? null;
	const { pathname } = useLocation();
	const pathnameRef = useRef(pathname);
	pathnameRef.current = pathname;

	useEffect(() => {
		const source = new EventSource(backendUrl("/api/chat/events"), { withCredentials: true });

		source.addEventListener("chat", (e: MessageEvent) => {
			let event: ChatServerEvent;
			try {
				event = JSON.parse(e.data);
			} catch {
				return;
			}

			if (event.type === "message") {
				void queryClient.invalidateQueries({
					queryKey: ["chat", "thread", event.conversationId],
				});
				void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
				void queryClient.invalidateQueries({ queryKey: ["inbox"] });

				// توست لحظي خارج «الرسائل» — لرسائل الآخرين فقط
				const outsideMessages = !pathnameRef.current.startsWith(MESSAGES_PATH);
				if (outsideMessages && event.authorId !== myIdRef.current) {
					const { conversationId } = event;
					toast(`رسالة جديدة من ${event.authorName}`, {
						id: `chat-${conversationId}`,
						description:
							event.preview.length > 60 ? `${event.preview.slice(0, 60)}…` : event.preview,
						icon: <IconMessage2 className="size-4 text-primary" />,
						action: {
							label: "فتح",
							onClick: () =>
								void navigate({
									to: "/management/messages",
									search: { openConversation: conversationId },
								}),
						},
					});
				}
			} else if (event.type === "conversation") {
				void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
				void queryClient.invalidateQueries({ queryKey: ["inbox"] });
				if (event.conversationId)
					void queryClient.invalidateQueries({
						queryKey: ["chat", "thread", event.conversationId],
					});
			} else if (event.type === "presence") {
				void queryClient.invalidateQueries({ queryKey: ["chat", "directory"] });
				void queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
			}
		});

		// بعد انقطاع طويل (سبات الجهاز مثلًا) أعد مزامنة كل شيء عند العودة
		source.onopen = () => {
			void queryClient.invalidateQueries({ queryKey: ["chat"] });
		};

		return () => source.close();
	}, [navigate, queryClient]);
}
