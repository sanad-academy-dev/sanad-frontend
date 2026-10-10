// تبويبات وحدة الدورات التدريبية تُحقَن في الهيدر العلوي (جنب عنوان الصفحة) عبر portal
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
	TRAINING_CONTENT_TABS,
	TRAINING_MODULE_TABS,
	type TrainingTab,
} from "@/features/services/training/types/training-tabs.types";
import { cn } from "@/lib/utils";

export function TrainingHeader({
	active,
	onChange,
}: {
	active: TrainingTab;
	onChange: (tab: TrainingTab) => void;
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
			{/* فاصل بين عنوان الصفحة والتبويبات */}
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			<nav className="flex items-center gap-[3.49px]">
				{/* تبويبات حالة الدورات (وظيفية) */}
				{TRAINING_MODULE_TABS.map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							disabled={tab.disabled}
							title={tab.tooltip}
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[19px] items-center justify-center rounded-[4px] px-[6px] text-[11px] font-medium leading-[10px]",
								isActive
									? "rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white text-[#1F2937]"
									: "text-[#6B7280]",
								tab.disabled && "cursor-not-allowed opacity-60",
							)}
						>
							{tab.label}
						</button>
					);
				})}

				{/* أنواع المحتوى («قريباً») */}
				{TRAINING_CONTENT_TABS.map((tab) => {
					const isActive = !!tab.value && active === tab.value;
					return (
						<button
							key={tab.label}
							type="button"
							disabled={tab.disabled}
							title={tab.tooltip}
							onClick={() => tab.value && onChange(tab.value)}
							className={cn(
								"flex h-[19px] items-center justify-center rounded-[4px] px-[6px] text-[11px] font-medium leading-[10px]",
								isActive
									? "rounded-[2px] border-[0.75px] border-[#E5E5E5] bg-white text-[#1F2937]"
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
