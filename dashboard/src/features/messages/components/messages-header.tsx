// تبويبات تصفية المحادثات تُحقن في هيدر النظام بجانب عنوان «الرسائل» عبر portal
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useMessagesStore } from "@/features/messages/stores/messages.store";
import { MESSAGES_FILTERS } from "@/features/messages/types/messages.type";
import { cn } from "@/lib/utils";

export function MessagesHeader() {
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	const filter = useMessagesStore((s) => s.filter);
	const setFilter = useMessagesStore((s) => s.setFilter);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-2"
			dir="rtl"
		>
			{/* فاصل بين عنوان الصفحة والتبويبات */}
			<span className="h-4 w-px bg-border" />

			<nav className="flex items-center gap-1">
				{MESSAGES_FILTERS.map((item) => (
					<button
						key={item.value}
						type="button"
						onClick={() => setFilter(item.value)}
						className={cn(
							"rounded-[4px] px-2 py-0.5 text-[13px] font-medium transition-colors",
							filter === item.value
								? "border-[0.75px] border-border bg-muted text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{item.label}
					</button>
				))}
			</nav>
		</div>,
		slot,
	);
}
