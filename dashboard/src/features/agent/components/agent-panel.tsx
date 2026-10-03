import {
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize2,
	IconPlus,
	IconSparkles,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgentComposer } from "@/features/agent/components/agent-composer";
import { AgentHistoryMenu } from "@/features/agent/components/agent-history-menu";
import { AgentLauncher } from "@/features/agent/components/agent-launcher";
import { buildPresetMessage } from "@/features/agent/components/inline-prompt";
import { MessageItem } from "@/features/agent/components/message-item";
import { useAgentChat } from "@/features/agent/hooks/use-agent-chat";
import { useAgentPanelStore } from "@/features/agent/stores/agent-panel.store";
import type { SlotValues } from "@/features/agent/types/preset.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const AgentPanel = () => {
	const { t } = useI18n();
	const isOpen = useAgentPanelStore((s) => s.isOpen);
	const close = useAgentPanelStore((s) => s.close);
	const activePreset = useAgentPanelStore((s) => s.activePreset);
	const clearPreset = useAgentPanelStore((s) => s.clearPreset);
	const {
		messages,
		input,
		setInput,
		send,
		sendText,
		isStreaming,
		conversationId,
		newConversation,
		loadConversation,
	} = useAgentChat();
	// قيم فراغات الأمر الجاهز المعروضة داخل حقل الإدخال
	const [slotValues, setSlotValues] = useState<SlotValues>({});
	// توسيع اللوحة لملء الشاشة
	const [expanded, setExpanded] = useState(false);

	if (!isOpen) return null;

	// محادثة جديدة — يمسح اللوحة والأمر الجاهز المُختار
	const handleNewChat = () => {
		newConversation();
		clearPreset();
		setSlotValues({});
	};

	// إرسال: إن كان هناك أمر جاهز نبني نصّه من الفراغات، وإلا نرسل نصّ الإدخال الحر
	const handleSend = () => {
		if (activePreset) {
			void sendText(buildPresetMessage(activePreset, slotValues));
			setSlotValues({});
			clearPreset();
		} else {
			void send();
		}
	};

	return (
		<aside
			dir="rtl"
			className={cn(
				"fixed inset-y-0 end-0 z-50 flex flex-col border-s bg-background shadow-lg transition-[width,max-width] duration-200",
				expanded ? "w-[50vw] max-w-[50vw]" : "w-[760px] max-w-[92vw]",
			)}
		>
			{/* الرأس */}
			<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
				<IconSparkles className="size-6 text-primary" />
				<span className="text-base font-semibold">{t("agent.title")}</span>
				<Badge variant="secondary">{t("agent.beta")}</Badge>

				{/* أدوات: محادثة جديدة، السجل، توسيع، إغلاق */}
				<div className="ms-auto flex items-center gap-0.5">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-md"
						aria-label={t("agent.newChat")}
						title={t("agent.newChat")}
						onClick={handleNewChat}
					>
						<IconPlus className="size-5" />
					</Button>
					<AgentHistoryMenu
						activeId={conversationId}
						onSelect={loadConversation}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-md"
						aria-label={expanded ? t("agent.collapse") : t("agent.expand")}
						title={expanded ? t("agent.collapse") : t("agent.expand")}
						onClick={() => setExpanded((v) => !v)}
					>
						{expanded ? (
							<IconArrowsDiagonalMinimize2 className="size-5" />
						) : (
							<IconArrowsDiagonal className="size-5" />
						)}
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-md"
						aria-label={t("common.actions.hide")}
						onClick={close}
					>
						<IconX />
					</Button>
				</div>
			</header>

			{/* المحتوى: شاشة البداية أو قائمة الرسائل */}
			{messages.length === 0 ? (
				<AgentLauncher />
			) : (
				<div className="min-h-0 flex-1 overflow-y-auto">
					<div className="flex flex-col gap-3 p-4">
						{messages.map((message, i) => (
							<MessageItem
								key={message.id}
								message={message}
								// البثّ يخصّ الرسالة الأخيرة فقط (ردّ المساعد الجاري)،
								// وإلا تحوّلت كل البطاقات المكتملة السابقة إلى "جاري العمل".
								isStreaming={isStreaming && i === messages.length - 1}
							/>
						))}
					</div>
				</div>
			)}

			{/* المُحرّر — نفس المكوّن دائمًا؛ عند وجود أمر جاهز نعرض فراغاته القابلة للتعبئة داخل الحقل */}
			<div className="border-t">
				<AgentComposer
					input={input}
					setInput={setInput}
					onSend={handleSend}
					disabled={isStreaming}
					activePreset={activePreset}
					slotValues={slotValues}
					onSlotChange={setSlotValues}
					onClearPreset={clearPreset}
				/>
			</div>
		</aside>
	);
};
