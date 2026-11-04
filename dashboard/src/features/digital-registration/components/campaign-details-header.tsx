import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type RegistrationView = "requests" | "info" | "activity";
export type CampaignView = RegistrationView | "stats";

export function CampaignDetailsHeader({
	activeView,
	onChangeView,
	requestsCount = 0,
	campaignId,
}: {
	activeView: RegistrationView | CampaignView;
	onChangeView: (view: any) => void;
	requestsCount?: number;
	campaignId?: string;
}) {
	const { isRtl } = useI18n();
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	const tabs: { value: RegistrationView; label: string }[] = [
		{ value: "requests", label: "الطلبات" },
		{ value: "info", label: "المعلومات" },
		{ value: "activity", label: "سجل النشاط" },
	];

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir={isRtl ? "rtl" : "ltr"}
		>
			{/* فاصل بين عنوان "التسجيل الرقمي" والتبويبات */}
			<span className="h-[18px] w-px bg-[#E5E7EB] dark:bg-zinc-700" />

			{/* ألسنة التنقل (الطلبات، المعلومات، سجل النشاط) بنفس تصميم الموارد البشرية */}
			<nav className="flex items-center gap-[3.49px]">
				{tabs.map((tab) => {
					const isTabActive = activeView === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChangeView(tab.value)}
							className={cn(
								"flex h-[25px] items-center justify-center gap-[4px] rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px] transition-colors cursor-pointer",
								isTabActive
									? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
									: "text-[#6B7280] hover:text-[#1F2937] dark:text-zinc-400 dark:hover:text-zinc-200",
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
