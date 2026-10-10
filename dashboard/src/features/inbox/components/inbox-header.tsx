// شريط الوارد يُحقَن في هيدر النظام (جنب عنوان "الوارد") عبر portal
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InboxRowActions } from "@/features/inbox/components/inbox-row-actions";
import { InboxSettingsMenu } from "@/features/inbox/components/inbox-settings-menu";
import { useInboxStore } from "@/features/inbox/stores/inbox.store";
import type { InboxTab } from "@/features/inbox/types/inbox.type";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const TABS: { value: InboxTab; label: string }[] = [
	{ value: "notifications", label: "الإشعارات" },
	{ value: "approvals", label: "الموافقات" },
];

export function InboxHeader() {
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	const { isRtl } = useI18n();
	const activeTab = useInboxStore((s) => s.activeTab);
	const setTab = useInboxStore((s) => s.setTab);
	// حالة البحث في المتجر: الزر هنا يبدّلها، وحقل البحث نفسه يظهر داخل القائمة
	// (محلّ شريط الفئات) — راجع inbox-list.tsx
	const searchOpen = useInboxStore((s) => s.searchOpen);
	const openSearch = useInboxStore((s) => s.openSearch);
	const closeSearch = useInboxStore((s) => s.closeSearch);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-2"
			dir="rtl"
		>
			{/* فاصل بين عنوان "الوارد" (عنوان الصفحة) والتبويبات */}
			<span className="h-4 w-px bg-border" />

			{/* التبويبات */}
			<nav className="flex items-center gap-1">
				{TABS.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => setTab(tab.value)}
						className={cn(
							"rounded-[4px] px-2 py-0.5 text-[12px] font-medium transition-colors",
							activeTab === tab.value
								? "border-[0.75px] border-border bg-muted text-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{tab.label}
					</button>
				))}
			</nav>

			{/* أزرار صغيرة خاصة بالوارد */}
			<div className="flex items-center gap-0.5 text-muted-foreground">
				{/* زر إعدادات العرض (يفتح قائمة الترتيب والإظهار وخصائص العرض) */}

				{/* زر البحث — يبدّل ظهور حقل البحث داخل القائمة (محلّ شريط الفئات) */}
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					aria-label="بحث"
					data-active={searchOpen}
					onClick={() => (searchOpen ? closeSearch() : openSearch())}
				>
					<IconSearch className="size-3.5" />
				</Button>
				{/* زر "المزيد" يفتح قائمة إجراءات الوارد (حذف/تعليم كمقروء) */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon-xs"
							aria-label="عرض القائمة"
						>
							<IconAdjustmentsHorizontal className="size-3.5" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						align="start"
						dir={isRtl ? "rtl" : "ltr"}
						className="w-auto p-3"
					>
						<InboxSettingsMenu />
					</PopoverContent>
				</Popover>

				<InboxRowActions />
			</div>
		</div>,
		slot,
	);
}
