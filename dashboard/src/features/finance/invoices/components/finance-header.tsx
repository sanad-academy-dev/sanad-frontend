import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
	FINANCE_TABS,
	type FinanceTab,
} from "@/features/finance/invoices/types/finance-tabs.types";
import { cn } from "@/lib/utils";

export function FinanceHeader({
	active,
	onChange,
}: {
	active: FinanceTab;
	onChange: (tab: FinanceTab) => void;
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
			<span className="h-[18px] w-px bg-[#E5E7EB]" />
			<nav className="flex items-center gap-[3.49px]">
				{FINANCE_TABS.map((tab) => {
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
