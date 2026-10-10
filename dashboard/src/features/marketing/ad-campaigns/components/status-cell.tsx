import { IconChevronDown } from "@tabler/icons-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdCampaignStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { AD_CAMPAIGN_STATUS_LABELS } from "@sanad/contracts/runtime/server/ad-campaigns/ad-campaigns.type";

/**
 * ألوان الحالة. التصميم يعرض حالتين (نشيط أخضر / غير نشيط أحمر)، لكن دورة حياة
 * الحملة أطول — و`FAILED` تحديدًا لا يجوز أن ترتدي ثوب «غير نشيط»، لأن الفرق بين
 * «أوقفتُها» و«لم تُطلَق أصلًا» هو كل الفرق بالنسبة للمستخدم.
 */
const STATUS_STYLES: Record<AdCampaignStatus, string> = {
	DRAFT: "bg-[#F3F4F6] text-[#6B7280]",
	PENDING: "bg-[#FEF6E7] text-[#B45309]",
	SCHEDULED: "bg-[#EEF2FF] text-[#4338CA]",
	ACTIVE: "bg-[#E7F7EF] text-[#12805C]",
	PAUSED: "bg-[#FDECEC] text-[#C63737]",
	COMPLETED: "bg-[#F3F4F6] text-[#374151]",
	FAILED: "bg-[#FDECEC] text-[#B42318]",
};

/**
 * الحالات القابلة للاختيار يدويًّا من الجدول. `PENDING` و`FAILED` نتيجتا إطلاق،
 * لا اختيار — إتاحتهما في القائمة تسمح للمستخدم أن يدّعي حالةً لم تحدث.
 */
const SELECTABLE: AdCampaignStatus[] = [
	AdCampaignStatus.ACTIVE,
	AdCampaignStatus.PAUSED,
	AdCampaignStatus.COMPLETED,
];

export function StatusCell({
	status,
	canEdit,
	onChange,
}: {
	status: AdCampaignStatus;
	canEdit: boolean;
	onChange: (status: AdCampaignStatus) => void;
}) {
	const { isRtl } = useI18n();

	const pill = (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 font-medium text-xs leading-5",
				STATUS_STYLES[status],
			)}
		>
			{AD_CAMPAIGN_STATUS_LABELS[status]}
			{canEdit && <IconChevronDown className="size-3" />}
		</span>
	);

	if (!canEdit) return pill;

	return (
		<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
			<DropdownMenuTrigger className="outline-none">{pill}</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{SELECTABLE.map((value) => (
					<DropdownMenuItem
						key={value}
						onSelect={() => value !== status && onChange(value)}
					>
						{AD_CAMPAIGN_STATUS_LABELS[value]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
