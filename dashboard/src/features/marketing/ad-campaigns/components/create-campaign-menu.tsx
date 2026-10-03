import { IconPlus } from "@tabler/icons-react";

import { DisabledReasonTooltip } from "@/components/common/disabled-reason-tooltip";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AD_PLATFORMS } from "@/features/marketing/ad-campaigns/data/platforms";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { SupportedAdPlatform } from "@/server/ad-campaigns/ad-campaigns.type";

/**
 * زرّ «انشاء حملة اعلانية» وقائمته (شاشة 548053).
 *
 * القرار D2: خمس منصّات من السبع معطَّلة. تبقى معروضة كي لا يختفي وعد القائمة بلا
 * تفسير، ويقول تلميح كلٍّ منها لماذا — زرّ معطَّل بلا سبب يبدو عطلًا.
 */
export function CreateCampaignMenu({
	onSelect,
	disabled,
	disabledReason,
	size = "sm",
}: {
	onSelect: (platform: SupportedAdPlatform) => void;
	disabled?: boolean;
	disabledReason?: string;
	size?: "sm" | "xs";
}) {
	const { isRtl } = useI18n();

	const trigger = (
		<Button
			size={size}
			disabled={disabled}
		>
			<IconPlus className="size-4" />
			انشاء حملة اعلانية
		</Button>
	);

	if (disabled) {
		return <DisabledReasonTooltip reason={disabledReason}>{trigger}</DisabledReasonTooltip>;
	}

	return (
		<DropdownMenu dir={isRtl ? "rtl" : "ltr"}>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			{/* محتوى Radix يُنقل إلى portal خارج شجرة <html dir> — الاتجاه يُمرَّر صراحةً */}
			<DropdownMenuContent
				align="start"
				className="w-56"
			>
				{AD_PLATFORMS.map((platform) => {
					const Icon = platform.icon;
					const item = (
						<DropdownMenuItem
							key={platform.value}
							disabled={!!platform.disabledReason}
							onSelect={() => {
								if (platform.disabledReason) return;
								onSelect(platform.value as SupportedAdPlatform);
							}}
							className={cn("gap-2", platform.disabledReason && "opacity-50")}
						>
							{/* اسم المنصّة لاتيني — جزيرة LTR داخل عنصر عربي الاتجاه */}
							<span
								dir="ltr"
								className="flex flex-1 items-center justify-between gap-2"
							>
								<span>{platform.label}</span>
								<Icon className="size-4 shrink-0" />
							</span>
						</DropdownMenuItem>
					);

					return platform.disabledReason ? (
						<DisabledReasonTooltip
							key={platform.value}
							reason={platform.disabledReason}
							side={isRtl ? "left" : "right"}
						>
							{item}
						</DisabledReasonTooltip>
					) : (
						item
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
