import {
	IconCircleCheckFilled,
	IconPlus,
	IconSearch,
	IconSparkles,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { ChatAvatar } from "@/features/messages/components/chat-avatar";
import { useChatDirectory } from "@/features/messages/hooks/use-messages";
import type { ChatMember } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

/**
 * قائمة اختيار الأعضاء — تُستخدم داخل Popover في تبويب «الأعضاء»
 * وداخل لوحة «رسالة جديدة». الاختيار مفرد أو متعدد حسب `multiple`.
 */
export function MemberPicker({
	selectedIds,
	onToggle,
	multiple = true,
	excludeIds = [],
	className,
}: {
	selectedIds: string[];
	onToggle: (member: ChatMember) => void;
	multiple?: boolean;
	excludeIds?: string[];
	className?: string;
}) {
	const [query, setQuery] = useState("");
	const { directory, isLoading } = useChatDirectory();

	const people = useMemo(() => {
		const needle = query.trim().toLowerCase();
		return directory
			.filter((member) => !excludeIds.includes(member.id))
			.filter(
				(member) =>
					!needle ||
					member.name.toLowerCase().includes(needle) ||
					member.role.toLowerCase().includes(needle),
			);
	}, [directory, excludeIds, query]);

	return (
		<div className={cn("flex flex-col", className)}>
			{/* الترويسة */}
			<div className="flex items-center justify-between gap-2 px-3 py-2">
				<span className="text-[13px] font-medium text-foreground">
					{multiple ? "اختر المستلمون" : "اختر المستلم"}
				</span>
				<Button
					type="button"
					variant="outline"
					size="xs"
					className="gap-1 px-1.5 text-[12px] font-medium"
				>
					<span>إضافة مستلم جديد</span>
					<IconPlus className="size-2.5" />
				</Button>
			</div>

			{/* البحث */}
			<div className="flex items-center gap-1.5 border-y px-3 py-1.5">
				<IconSearch className="size-4 shrink-0 text-muted-foreground" />
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="ابحث عن عضو..."
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

			<p className="px-3 pt-2 pb-1 text-[11px] text-muted-foreground">الأشخاص المتاحون</p>

			<div className="max-h-[320px] min-h-0 flex-1 overflow-y-auto">
				{isLoading ? (
					<p className="py-6 text-center text-[12px] text-muted-foreground">
						جارِ تحميل الفريق...
					</p>
				) : people.length === 0 ? (
					<p className="px-4 py-6 text-center text-[12px] leading-5 text-muted-foreground">
						لا يوجد زملاء يمكن مراسلتهم بعد — ادعُ فريقك من صفحة الموظفين حتى تظهر حساباتهم هنا
					</p>
				) : (
					people.map((member) => {
						const isSelected = selectedIds.includes(member.id);
						const disabled = !member.hasAccount;
						return (
							<button
								key={member.id}
								type="button"
								disabled={disabled}
								onClick={() => onToggle(member)}
								className={cn(
									"flex w-full items-center gap-2 px-3 py-2 text-start transition-colors hover:bg-muted/60",
									isSelected && "bg-muted/60",
									disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
								)}
							>
								<ChatAvatar
									name={member.name}
									online={member.online}
								/>
								<span className="flex min-w-0 flex-1 flex-col gap-0.5">
									<span className="truncate text-[13px] font-semibold text-foreground">
										{member.name}
									</span>
									<span className="truncate text-[11px] text-muted-foreground">
										{member.role}
									</span>
								</span>

								{/* مؤشّر الاختيار في جهة النهاية (يسار) */}
								{disabled ? (
									<span className="shrink-0 rounded-[4px] bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
										بلا حساب دخول
									</span>
								) : isSelected ? (
									<IconCircleCheckFilled className="size-4 shrink-0 text-primary" />
								) : (
									<span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/40 text-primary">
										<IconPlus className="size-2.5" />
									</span>
								)}
							</button>
						);
					})
				)}
			</div>
		</div>
	);
}
