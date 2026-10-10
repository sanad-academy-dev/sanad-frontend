// تبويبات وحدة الموارد البشرية تُحقَن في الهيدر العلوي (جنب عنوان "الموارد البشرية") عبر portal
import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
	STAFF_MODULE_TABS,
	type StaffModuleTab,
} from "@/features/services/staff/types/staff-tabs.types";
import { cn } from "@/lib/utils";

export function StaffHeader({
	active,
	onChange,
	attendanceEnabled = true,
}: {
	active: StaffModuleTab;
	onChange: (tab: StaffModuleTab) => void;
	// تبويب الحضور والانصراف مقفول ما لم يُفعَّل من الإعدادات
	attendanceEnabled?: boolean;
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
			{/* فاصل بين عنوان "الموارد البشرية" والتبويبات */}
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			<nav className="flex items-center gap-[3.49px]">
				{STAFF_MODULE_TABS.map((tab) => {
					const isActive = active === tab.value;
					const isLocked = tab.value === "attendance" && !attendanceEnabled;
					return (
						<button
							key={tab.value}
							type="button"
							disabled={tab.disabled}
							// نُبقيه قابلًا للنقر عند القفل لعرض رسالة، ونمنع الانتقال في الأب
							onClick={() => onChange(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center gap-[4px] rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px]",
								isActive
									? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
									: "text-[#6B7280]",
								tab.disabled && "cursor-not-allowed opacity-60",
								isLocked && "cursor-not-allowed text-[#9B9B9D]",
							)}
						>
							{isLocked && <IconLock className="size-[12px]" />}
							{tab.label}
						</button>
					);
				})}
			</nav>
		</div>,
		slot,
	);
}
