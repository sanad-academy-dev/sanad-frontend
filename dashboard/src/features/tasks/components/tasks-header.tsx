import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type TasksView = "all" | "for-me" | "done";

const getTabs = (t: TFunction): { value: TasksView; label: string }[] => [
	{ value: "all", label: t("tasks.views.all") },
	{ value: "for-me", label: t("tasks.views.forMe") },
	{ value: "done", label: t("tasks.views.done") },
];

export function TasksHeader({
	active,
	onChange,
}: {
	active: TasksView;
	onChange: (view: TasksView) => void;
}) {
	const { t, isRtl } = useI18n();
	const [slot, setSlot] = useState<HTMLElement | null>(null);
	const tabs = getTabs(t);

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
				{tabs.map((tab) => {
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
