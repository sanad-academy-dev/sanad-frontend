import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export const EMERGENCY_TABS = [
	{ value: "board", label: "اللوحة" },
	{ value: "arrivals", label: "بانتظار الفرز" },
	{ value: "history", label: "السجلّ" },
] as const;

export type EmergencyTab = (typeof EMERGENCY_TABS)[number]["value"];

/**
 * مبدّل تبويبات شاشة الطوارئ — يُنقل إلى فتحة رأس الصفحة كما تفعل شاشات التنويم
 * والتجميل والتغذية والتطعيمات والأشعّة.
 *
 * مكان التبويبات جزء من هوية الشاشة: وضعها في الجسم يزحزح المحتوى عن موضعه
 * المعتاد ويجعل الشاشة غريبة عن شقيقاتها ولو تطابق كل زرّ فيها.
 */
export function EmergencyHeader({
	active,
	onChange,
}: {
	active: EmergencyTab;
	onChange: (tab: EmergencyTab) => void;
}) {
	const { isRtl } = useI18n();
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir={isRtl ? "rtl" : "ltr"}
		>
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			<nav className="flex items-center gap-[3.49px]">
				{EMERGENCY_TABS.map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px] leading-[16px]",
								isActive
									? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
									: "text-[#6B7280]",
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
