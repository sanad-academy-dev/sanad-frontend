import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type RegistrationView = "requests" | "info" | "activity";

export function CampaignDetailsHeader({
	activeView,
	onChangeView,
	requestsCount = 0,
}: {
	activeView: RegistrationView;
	onChangeView: (view: RegistrationView) => void;
	requestsCount?: number;
}) {
	const { isRtl } = useI18n();
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	if (!slot) return null;

	const tabs: { value: RegistrationView; label: React.ReactNode }[] = [
		{
			value: "requests",
			label: (
				<span className="flex items-center gap-1.5">
					<span>الطلبات</span>
					{requestsCount > 0 && (
						<span className="bg-muted px-1.5 py-0.2 rounded-full text-[9px] font-bold">
							{requestsCount}
						</span>
					)}
				</span>
			),
		},
		{ value: "info", label: "المعلومات" },
		{ value: "activity", label: "سجل النشاط" },
	];

	return createPortal(
		<div
			className="flex items-center gap-2.5"
			dir={isRtl ? "rtl" : "ltr"}
		>
			{/* عنوان الصفحة: التسجيل الرقمي */}
			<span className="text-xs sm:text-sm font-bold text-foreground select-none whitespace-nowrap">
				التسجيل الرقمي
			</span>

			{/* فاصل رأسي */}
			<span className="h-4 w-px bg-border/70" />

			{/* ألسنة التنقل (الطلبات، المعلومات، سجل النشاط) */}
			<nav className="flex items-center gap-1 rounded-md bg-muted/50 p-0.5 border border-border/60 select-none">
				{tabs.map((tab) => {
					const isTabActive = activeView === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChangeView(tab.value)}
							className={cn(
								"flex h-6.5 items-center justify-center rounded-[4px] px-3 text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap",
								isTabActive
									? "bg-background text-foreground shadow-2xs border border-border/40 font-bold"
									: "text-muted-foreground hover:text-foreground hover:bg-background/40",
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
