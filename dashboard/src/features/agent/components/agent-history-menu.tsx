import { IconHistory, IconTrash } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAgentConversations } from "@/features/agent/hooks/use-agent-conversations";
import { useI18n } from "@/hooks/use-i18n";

// قائمة سجلّ المحادثات — زر بأيقونة يفتح قائمة بمحادثات المستخدم السابقة.
// اختيار محادثة يحمّلها في اللوحة؛ زر الحذف يزيلها من الخادم.
export const AgentHistoryMenu = ({
	activeId,
	onSelect,
}: {
	activeId: string | null;
	onSelect: (id: string) => void;
}) => {
	const { t, isRtl } = useI18n();
	const { conversations, remove } = useAgentConversations();

	return (
		<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="rounded-md"
					aria-label={t("agent.history")}
				>
					<IconHistory className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-72"
			>
				<DropdownMenuLabel>{t("agent.history")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{conversations.length === 0 ? (
					<div className="px-2 py-6 text-center text-xs text-muted-foreground">
						{t("agent.noHistory")}
					</div>
				) : (
					conversations.map((conv) => (
						<DropdownMenuItem
							key={conv.id}
							className="group flex items-center gap-2"
							data-active={conv.id === activeId}
							onSelect={() => onSelect(conv.id)}
						>
							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm">{conv.title}</span>
								<span className="text-[11px] text-muted-foreground">
									{formatDistanceToNow(new Date(conv.updatedAt), {
										addSuffix: true,
										locale: isRtl ? arSA : enUS,
									})}
								</span>
							</div>
							<button
								type="button"
								className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
								aria-label={t("agent.deleteChat")}
								onClick={(e) => {
									// لا نغلق القائمة ولا نحمّل المحادثة عند الحذف
									e.stopPropagation();
									e.preventDefault();
									void remove(conv.id);
								}}
							>
								<IconTrash className="size-3.5" />
							</button>
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
