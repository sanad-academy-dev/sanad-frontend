import {
	IconChevronDown,
	IconFilter,
	IconPlus,
	IconSearch,
	IconSparkles,
	IconUser,
	IconUsersGroup,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { ConversationListItem } from "@/features/messages/components/conversation-list-item";
import { MessagesEmpty } from "@/features/messages/components/messages-empty";
import { useMessagesStore } from "@/features/messages/stores/messages.store";
import type { Conversation } from "@/features/messages/types/messages.type";
import { MESSAGES_FILTERS } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

export function ConversationsPanel({
	conversations,
	selectedId,
	onSelect,
}: {
	conversations: Conversation[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}) {
	const listQuery = useMessagesStore((s) => s.listQuery);
	const setListQuery = useMessagesStore((s) => s.setListQuery);
	const filter = useMessagesStore((s) => s.filter);
	const setFilter = useMessagesStore((s) => s.setFilter);
	const openComposer = useMessagesStore((s) => s.openComposer);

	return (
		<aside className="flex h-full w-[418px] shrink-0 flex-col border-e">
			{/* الترويسة: العنوان يمينًا وزر «رسالة جديدة» يسارًا */}
			<div className="flex h-8 shrink-0 items-center justify-between gap-2 px-2">
				<h2 className="text-[14px] font-semibold text-foreground">المحادثات</h2>

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1 px-1.5 text-[12px] font-medium"
						>
							<IconPlus className="size-2.5" />
							<span>رسالة جديدة</span>
							<IconChevronDown className="size-2.5 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-[125px]"
					>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={() => openComposer("direct")}
						>
							<IconUser className="size-4 text-muted-foreground" />
							محادثة فردية
						</DropdownMenuItem>
						<DropdownMenuItem
							className="gap-2 text-[13px]"
							onSelect={() => openComposer("group")}
						>
							<IconUsersGroup className="size-4 text-muted-foreground" />
							محادثة جماعية
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* شريط البحث والفلترة — البحث يمينًا، الفاصل، ثم زر الفلترة يسارًا */}
			<div className="flex h-[30px] shrink-0 items-center gap-2 border-b px-2">
				<div className="flex min-w-0 flex-1 items-center gap-1.5">
					<IconSearch className="size-4 shrink-0 text-muted-foreground" />
					<input
						type="text"
						value={listQuery}
						onChange={(e) => setListQuery(e.target.value)}
						placeholder="البحث"
						className="h-6 min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon-xs"
						aria-label="اقتراحات ذكية"
						className="text-muted-foreground"
					>
						<IconSparkles className="size-3.5" />
					</Button>
					<Kbd className="shrink-0 border bg-muted text-muted-foreground">/</Kbd>
				</div>

				<span className="h-6 w-px shrink-0 bg-border" />

				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="xs"
							className="shrink-0 gap-1 px-1.5 text-[12px] font-medium"
						>
							<span>فلترة</span>
							<IconFilter className="size-2.5 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-40"
					>
						{MESSAGES_FILTERS.map((item) => (
							<DropdownMenuItem
								key={item.value}
								className={cn("text-[13px]", filter === item.value && "bg-muted")}
								onSelect={() => setFilter(item.value)}
							>
								{item.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* القائمة */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{conversations.length === 0 ? (
					<MessagesEmpty />
				) : (
					<ul>
						{conversations.map((conversation) => (
							<li key={conversation.id}>
								<ConversationListItem
									conversation={conversation}
									isActive={conversation.id === selectedId}
									onSelect={onSelect}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</aside>
	);
}
