import { useChat } from "@livekit/components-react";
import { IconChecks, IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// لوحة المحادثة داخل الجلسة — تنزلق على الجهة اليمنى من منطقة الفيديو.
// فقاعات فاتحة محايدة للطرفين: رسائلي على اليسار والطرف الآخر على اليمين،
// مع علامتي التسليم والوقت داخل الفقاعة كما في التصميم.
// تستخدم قناة بيانات LiveKit نفسها التي تستخدمها واجهة الضيف الجاهزة
export const SessionChatPanel = ({ onClose }: { onClose: () => void }) => {
	const { chatMessages, send, isSending } = useChat();
	const [draft, setDraft] = useState("");
	const listRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: التمرير للأسفل عند وصول رسالة جديدة
	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [chatMessages.length]);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		const text = draft.trim();
		if (!text || isSending) return;
		await send(text);
		setDraft("");
	};

	return (
		// inset-s-0 في صفحة RTL = الجهة اليمنى، وحدّها الفاصل عن الفيديو على جهة النهاية
		<div className="absolute inset-y-0 inset-s-0 z-10 flex w-[400px] flex-col border-e bg-background shadow-lg">
			<div className="flex h-12 shrink-0 items-center justify-between px-3">
				<span className="text-sm font-semibold">المحادثة</span>
				<Button
					type="button"
					size="icon-sm"
					variant="ghost"
					aria-label="إغلاق المحادثة"
					onClick={onClose}
				>
					<IconX className="size-4" />
				</Button>
			</div>

			<div
				ref={listRef}
				className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3"
			>
				{chatMessages.length === 0 && (
					<p className="m-auto text-center text-xs text-muted-foreground">
						لا توجد رسائل بعد — ابدأ المحادثة
					</p>
				)}
				{chatMessages.map((msg) => {
					const isOwn = !!msg.from?.isLocal;
					return (
						<div
							key={msg.id ?? msg.timestamp}
							className={cn(
								"flex max-w-[85%] flex-col gap-1 rounded-lg bg-muted px-2.5 py-1.5",
								isOwn ? "self-start" : "self-end",
							)}
						>
							<p className="text-sm text-gray-800">{msg.message}</p>
							<div className="flex items-center gap-1">
								{isOwn && <IconChecks className="size-3.5 text-blue-500" />}
								<span
									className="text-[10px] text-muted-foreground"
									dir="ltr"
								>
									{format(msg.timestamp, "HH:mm")}
								</span>
							</div>
						</div>
					);
				})}
			</div>

			{/* الإرسال بمفتاح الإدخال — بلا زر إرسال كما في التصميم */}
			<form
				className="shrink-0 bg-muted/50 p-2"
				onSubmit={(e) => void submit(e)}
			>
				<Input
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					placeholder="اكتب رسالة..."
					className="h-9 text-gray-900 w-full rounded-lg bg-background"
				/>
			</form>
		</div>
	);
};
