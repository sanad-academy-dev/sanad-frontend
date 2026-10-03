import { IconSearch, IconSparkles, IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { InboxEmpty } from "@/features/inbox/components/inbox-empty";
import { InboxListItem } from "@/features/inbox/components/inbox-list-item";
import type { InboxGroup } from "@/features/inbox/hooks/use-inbox";
import { useInboxInsight } from "@/features/inbox/hooks/use-inbox-insight";
import { useInboxStore } from "@/features/inbox/stores/inbox.store";
import { INBOX_CATEGORIES, type InboxCategory } from "@/features/inbox/types/inbox.type";
import { cn } from "@/lib/utils";

export function InboxList({
	groups,
	activeCategory,
	selectedId,
	onSelect,
	onCategoryChange,
	hasSearch = false,
}: {
	groups: InboxGroup[];
	activeCategory: InboxCategory;
	selectedId: string | null;
	onSelect: (id: string) => void;
	onCategoryChange: (category: InboxCategory) => void;
	hasSearch?: boolean;
}) {
	const { insight } = useInboxInsight();
	const searchOpen = useInboxStore((s) => s.searchOpen);
	const searchQuery = useInboxStore((s) => s.searchQuery);
	const setSearchQuery = useInboxStore((s) => s.setSearchQuery);
	const closeSearch = useInboxStore((s) => s.closeSearch);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// ركّز على حقل البحث فور فتحه (محلّ شريط الفئات)
	useEffect(() => {
		if (searchOpen) searchInputRef.current?.focus();
	}, [searchOpen]);

	// حد واحد فقط على الجانب الملاصق للتفاصيل — الحافة الأخرى يرسمها إطار الصفحة
	return (
		<div className="flex h-full w-[340px] shrink-0 flex-col border-e">
			{/* شريط الفئات — أو حقل البحث في مكانه عند فتحه */}
			{searchOpen ? (
				<div className="flex items-center gap-1 border-b border-border px-2 py-2">
					<div className="flex flex-1 items-center gap-1.5 rounded-[4px] border border-border bg-background ps-2 pe-1">
						<IconSearch className="size-3.5 shrink-0 text-muted-foreground" />
						<input
							ref={searchInputRef}
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Escape") closeSearch();
							}}
							placeholder="بحث في الوارد…"
							className="h-6 min-w-0 flex-1 bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="إغلاق البحث"
							onClick={closeSearch}
						>
							<IconX className="size-3.5" />
						</Button>
					</div>
				</div>
			) : (
				<div className="flex items-center gap-1 overflow-x-auto border-b border-border px-2 py-2">
					{INBOX_CATEGORIES.map((cat) => {
						const isActive = cat.value === activeCategory;
						return (
							<button
								key={cat.value}
								type="button"
								onClick={() => onCategoryChange(cat.value)}
								className={cn(
									"shrink-0 rounded-[4px] px-2.5 py-1 text-[11px] font-medium transition-colors",
									isActive
										? "border-[0.75px] border-border bg-muted text-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{cat.label}
							</button>
						);
					})}
				</div>
			)}

			{/* شريط الرؤى الذكية (AI) */}
			<div className="flex items-center gap-1.5 border-b border-border bg-amber-50/60 px-3.5 py-2 dark:bg-amber-500/10">
				<IconSparkles className="size-3.5 shrink-0 text-amber-500" />
				<p className="min-w-0 flex-1 truncate text-[11px] leading-tight text-amber-600 dark:text-amber-400">
					{insight}
				</p>
			</div>

			{/* القائمة المجمّعة زمنيًا */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{groups.length === 0 ? (
					hasSearch ? (
						<InboxEmpty
							title="لا توجد نتائج"
							description="لا يوجد إشعار يطابق بحثك"
						/>
					) : (
						<InboxEmpty />
					)
				) : (
					groups.map((group) => (
						<section key={group.group}>
							<h3 className="px-3 pt-4 pb-1.5 text-[11px] font-medium text-muted-foreground">
								{group.label}
							</h3>
							<ul>
								{group.items.map((notification) => (
									<li key={notification.id}>
										<InboxListItem
											notification={notification}
											isActive={notification.id === selectedId}
											onSelect={onSelect}
										/>
									</li>
								))}
							</ul>
						</section>
					))
				)}
			</div>
		</div>
	);
}
