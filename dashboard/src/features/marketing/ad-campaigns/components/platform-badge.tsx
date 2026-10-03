import { AD_PLATFORM_BY_VALUE } from "@/features/marketing/ad-campaigns/data/platforms";
import type { AdPlatform } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

/**
 * شارة عمود «المكان» — خلفية باهتة بلون المنصّة ونصّ داكن منها (شاشة 537787).
 *
 * الاسم لاتيني دائمًا (Facebook / TikTok) فهو جزيرة LTR داخل صفحة RTL؛ بلا `dir`
 * صريح يتلاعب محرّك الاتجاه بموضع الحروف الأولى حين تُجاور نصًّا عربيًّا.
 */
export function PlatformBadge({
	platform,
	className,
}: {
	platform: AdPlatform;
	className?: string;
}) {
	const meta = AD_PLATFORM_BY_VALUE.get(platform);
	if (!meta) return null;

	return (
		<span
			dir="ltr"
			className={cn(
				"inline-flex items-center rounded-[4px] px-2 py-0.5 font-medium text-xs leading-5",
				meta.badgeClassName,
				className,
			)}
		>
			{meta.label}
		</span>
	);
}
