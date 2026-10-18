import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type AttendanceTab = "students" | "staff";

export function AttendanceHeader({
	active,
	onChange,
}: {
	active: AttendanceTab;
	onChange: (tab: AttendanceTab) => void;
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
	    <button
					type="button"
					onClick={() => active !== "staff" && onChange("staff")}
					className={cn(
						"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px] transition-colors",
						active === "staff"
							? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
							: "text-[#6B7280] hover:text-[#1F2937]",
					)}
				>
					الموظفين
				</button>

				<button
					type="button"
					onClick={() => active !== "students" && onChange("students")}
					className={cn(
						"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px] transition-colors",
						active === "students"
							? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
							: "text-[#6B7280] hover:text-[#1F2937]",
					)}
				>
					الطلاب
				</button>
			
			</nav>
		</div>,
		slot,
	);
}
