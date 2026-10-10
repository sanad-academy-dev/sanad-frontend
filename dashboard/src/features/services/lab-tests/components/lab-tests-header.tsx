import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { LabTestsView } from "@/server/lab-tests/lab-tests.type";

const TABS: { value: LabTestsView; label: string }[] = [
	{ value: "all", label: "الكل" },
	{ value: "for-me", label: "المخصص لي" },
];

export function LabTestsHeader({
	active,
	onChange,
}: {
	active: LabTestsView;
	onChange: (view: LabTestsView) => void;
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
				{TABS.map((tab) => {
					const isActive = active === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px]",
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
