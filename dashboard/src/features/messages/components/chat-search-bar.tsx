import { IconChevronDown, IconChevronUp, IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useMessagesStore } from "@/features/messages/stores/messages.store";

/**
 * شريط البحث داخل المحادثة — الحقل يمينًا، وعدّاد النتائج وأسهم التنقل
 * وزر الإغلاق يسارًا (مطابق لحالات Figma: بدون بحث / لا نتائج / نتائج).
 */
export function ChatSearchBar({
	matchCount,
	activeIndex,
	onPrev,
	onNext,
}: {
	matchCount: number;
	activeIndex: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	const query = useMessagesStore((s) => s.chatQuery);
	const setQuery = useMessagesStore((s) => s.setChatQuery);
	const close = useMessagesStore((s) => s.closeChatSearch);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const hasQuery = query.trim().length > 0;

	return (
		<div className="flex shrink-0 items-center gap-1.5 border-b px-3 py-1.5">
			{/* الحقل */}
			<div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-[4px] border bg-background px-2 py-1">
				<IconSearch className="size-3.5 shrink-0 text-muted-foreground" />
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Escape") close();
						if (e.key === "Enter") (e.shiftKey ? onPrev : onNext)();
					}}
					placeholder="ابحث في الرسائل..."
					className="h-5 min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
				/>
			</div>

			{/* عدّاد النتائج والتنقل والإغلاق */}
			<div className="flex shrink-0 items-center gap-0.5">
				{hasQuery && (
					<span className="px-1 text-[11px] text-muted-foreground tabular-nums">
						{matchCount === 0 ? "لا نتائج" : `${activeIndex + 1} من ${matchCount}`}
					</span>
				)}
				{matchCount > 0 && (
					<>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="النتيجة السابقة"
							className="text-muted-foreground"
							onClick={onPrev}
						>
							<IconChevronUp className="size-3.5" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="النتيجة التالية"
							className="text-muted-foreground"
							onClick={onNext}
						>
							<IconChevronDown className="size-3.5" />
						</Button>
					</>
				)}
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="إغلاق البحث"
					className="text-muted-foreground"
					onClick={close}
				>
					<IconX className="size-3.5" />
				</Button>
			</div>
		</div>
	);
}
