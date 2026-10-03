import type { Icon } from "@tabler/icons-react";
import {
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandLinkedin,
	IconBrandPinterest,
	IconBrandSnapchat,
	IconBrandTiktok,
	IconBrandX,
} from "@tabler/icons-react";

import type { AdPlatform } from "@/generated/prisma/enums";

/**
 * منصّات الإعلان كما في قائمة «انشاء حملة اعلانية» (شاشة 548053).
 *
 * القرار D2: فيسبوك وإنستغرام فقط في الإصدار الأول. الخمس الباقية تبقى **معروضة**
 * معطَّلة بسبب معلن، لا محذوفة — القائمة في التصميم تعد بسبع منصّات، وحذف خمس منها
 * يجعل الوعد يختفي بلا تفسير، بينما تعطيلها بسبب يقول للمستخدم متى يعود.
 *
 * `badgeClassName` يطابق شارات عمود «المكان» في التصميم (شاشة 537787): خلفية باهتة
 * بلون العلامة ونصّ داكن منها — عدا TikTok فشارتها سوداء صريحة في التصميم.
 */
export type AdPlatformMeta = {
	value: AdPlatform;
	label: string;
	icon: Icon;
	badgeClassName: string;
	/** غير مدعومة بعد — السبب يُعرض في تلميح العنصر المعطَّل */
	disabledReason?: string;
};

const COMING_SOON = "قريبًا — لم تُصمَّم شاشات هذه المنصّة بعد";

export const AD_PLATFORMS: AdPlatformMeta[] = [
	{
		value: "FACEBOOK",
		label: "Facebook",
		icon: IconBrandFacebook,
		badgeClassName: "bg-[#E8F0FE] text-[#1877F2]",
	},
	{
		value: "INSTAGRAM",
		label: "Instagram",
		icon: IconBrandInstagram,
		badgeClassName: "bg-[#FDE8F3] text-[#C13584]",
	},
	{
		value: "LINKEDIN",
		label: "Linkedin",
		icon: IconBrandLinkedin,
		badgeClassName: "bg-[#E5F1F8] text-[#0A66C2]",
		disabledReason: COMING_SOON,
	},
	{
		value: "TIKTOK",
		label: "TikTok",
		icon: IconBrandTiktok,
		badgeClassName: "bg-[#111111] text-white",
		disabledReason: COMING_SOON,
	},
	{
		value: "X",
		label: "New-twitter",
		icon: IconBrandX,
		badgeClassName: "bg-[#F1F1F1] text-[#111111]",
		disabledReason: COMING_SOON,
	},
	{
		value: "PINTEREST",
		label: "Pinterest",
		icon: IconBrandPinterest,
		badgeClassName: "bg-[#FDE7E9] text-[#E60023]",
		disabledReason: COMING_SOON,
	},
	{
		value: "SNAPCHAT",
		label: "Snapchat",
		icon: IconBrandSnapchat,
		badgeClassName: "bg-[#FFFBE5] text-[#8A7A00]",
		disabledReason: COMING_SOON,
	},
];

export const AD_PLATFORM_BY_VALUE = new Map(AD_PLATFORMS.map((p) => [p.value, p]));
