// تبويبات وحدة إدارة المحتوى تُحقَن في الهيدر العلوي عبر portal
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
	CONTENT_MANAGEMENT_TABS,
	type ContentManagementTab,
} from "@/features/services/training/types/training-tabs.types";
import { cn } from "@/lib/utils";

export function TrainingHeader({
	active,
	onChange,
}: {
	active: ContentManagementTab;
	onChange: (tab: ContentManagementTab) => void;
}) {
	const [slot, setSlot] = useState<HTMLElement | null>(null);

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
			<span className="h-4 w-px bg-border shrink-0" />

			<nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
				{CONTENT_MANAGEMENT_TABS.map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChange(tab.value)}
							aria-pressed={isActive}
							className={cn(
								"flex h-[26px] items-center justify-center whitespace-nowrap rounded-[4px] border-[0.75px] px-2.5 text-xs font-medium transition-colors cursor-pointer",
								isActive
									? "border-border bg-background font-semibold text-foreground shadow-2xs"
									: "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</nav>
		</div>,
		slot,
	);
}
