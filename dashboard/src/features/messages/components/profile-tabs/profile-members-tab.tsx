import { IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { MemberPicker } from "@/features/messages/components/member-picker";
import type { ChatMember } from "@/features/messages/types/messages.type";

export function ProfileMembersTab({
	members,
	onAddMember,
}: {
	members: ChatMember[];
	onAddMember: (member: ChatMember) => void;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className="px-3 py-3">
			<div className="flex items-center justify-between gap-2 pb-2">
				<h3 className="text-[13px] font-semibold text-foreground">
					الأعضاء ({members.length})
				</h3>

				<Popover
					open={open}
					onOpenChange={setOpen}
				>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="xs"
							className="gap-1 px-1.5 text-[12px] font-medium"
						>
							<span>إضافة</span>
							<IconUserPlus className="size-3" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						dir="rtl"
						className="w-[262px] p-0"
					>
						<MemberPicker
							selectedIds={members.map((m) => m.id)}
							excludeIds={[]}
							onToggle={onAddMember}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<ul className="flex flex-col">
				{members.map((member) => (
					<li
						key={member.id}
						className="flex items-center gap-2 py-2"
					>
						<ChatAvatar
							name={member.name}
							online={member.online}
						/>
						<span className="flex min-w-0 flex-1 flex-col gap-0.5">
							<span className="truncate text-[13px] font-semibold text-foreground">
								{member.name}
							</span>
							<span className="truncate text-[11px] text-muted-foreground">{member.role}</span>
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
