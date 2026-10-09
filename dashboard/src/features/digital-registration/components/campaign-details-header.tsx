import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { IconCheck, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type CampaignView = "requests" | "info" | "stats";

const TABS: { value: CampaignView; label: React.ReactNode }[] = [
	{ 
		value: "requests", 
		label: (
			<span className="flex items-center gap-1.5">
				الطلبات <span className="bg-muted px-1.5 py-0.5 rounded-full text-[9px] font-bold">5</span>
			</span>
		)
	},
	{ value: "info", label: "معلومات الحملة" },
	{ value: "stats", label: "الإحصائيات" },
];

export function CampaignDetailsHeader({ 
	campaignId,
	activeView,
	onChangeView
}: { 
	campaignId: string;
	activeView: CampaignView;
	onChangeView: (view: CampaignView) => void;
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
			<Link
				to="/digital-registration"
				className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			>
				{isRtl ? <IconArrowRight size={18} /> : <IconArrowLeft size={18} />}
			</Link>
			
			<span className="h-[18px] w-px bg-[#E5E7EB]" />
			
			<div className="flex items-center gap-2">
				<h1 className="text-sm font-bold text-foreground">حملة التسجيل - الفصل الأول 2026</h1>
				<Badge variant="outline" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 font-semibold text-[10px] px-1.5 py-0 h-5">
					<IconCheck size={12} className="me-1" />
					نشط
				</Badge>
				<span className="text-xs text-muted-foreground ms-2 border-s ps-2 border-[#E5E7EB]">
					{campaignId}
				</span>
			</div>

			<span className="h-[18px] w-px bg-[#E5E7EB] mx-1" />

			<nav className="flex items-center gap-[3.49px]">
				{TABS.map((tab) => {
					const isActive = activeView === tab.value;
					return (
						<button
							key={tab.value}
							type="button"
							onClick={() => onChangeView(tab.value)}
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
