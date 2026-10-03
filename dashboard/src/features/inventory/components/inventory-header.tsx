// التبويبات تُحقَن في الهيدر العلوي (جنب عنوان "المخزون") عبر portal
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type InventoryTab =
	| "products"
	| "movements"
	| "warehouses"
	| "purchases"
	| "batches"
	| "reports"
	| "suppliers"
	| "pos";

// تبويبات الشريط — اقتُصرت على الأساسية بعد تغيير الفلو؛ باقي الشاشات
// (الحركات/المستودعات/المشتريات/الصلاحية/التقارير) تُفتح عبر الأزرار والبوب أب.
const TABS: { value: InventoryTab; label: string; disabled: boolean }[] = [
	{ value: "products", label: "المنتجات", disabled: false },
	{ value: "purchases", label: "طلب الشراء", disabled: false },
	{ value: "suppliers", label: "الموردون", disabled: false },
	{ value: "pos", label: "نقطة البيع", disabled: false },
];

export function InventoryHeader({
	active,
	onChange,
	hiddenTabs,
}: {
	active: InventoryTab;
	onChange: (tab: InventoryTab) => void;
	/** تبويبات تُخفى حسب إعدادات الفروع (مثل طلب الشراء عند تعطيله لكل المستودعات) */
	hiddenTabs?: InventoryTab[];
}) {
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir="rtl"
		>
			{/* فاصل بين عنوان "المخزون" والتبويبات */}
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			<nav className="flex items-center gap-[3.49px]">
				{TABS.filter((tab) => !hiddenTabs?.includes(tab.value)).map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							disabled={tab.disabled}
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px]",
								isActive
									? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
									: "text-[#6B7280]",
								tab.disabled && "cursor-not-allowed opacity-60",
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
