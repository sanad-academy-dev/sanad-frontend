import {
	IconArrowBackUp,
	IconCar,
	IconCircleCheck,
	IconCoffee,
	IconMapPin,
	IconPlugConnectedX,
	type IconProps,
	IconTool,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { MobileUnitCrewRole, MobileUnitStatus } from "@/generated/prisma/enums";

export type MobileUnitStatusMeta = {
	label: string;
	icon: ComponentType<IconProps>;
	color: string;
};

/**
 * الحالة التشغيلية فقط. الإيقاف الإداري (`active = false`) ليس حالةً هنا — يُعرض كشارة
 * منفصلة، لأنّ خلطهما يُخفي أنّ المركبة موقوفة وهي معروضة بحالة «غير متصلة» البريئة.
 */
export const MOBILE_UNIT_STATUS_META: Record<MobileUnitStatus, MobileUnitStatusMeta> = {
	[MobileUnitStatus.OFFLINE]: {
		label: "غير متصلة",
		icon: IconPlugConnectedX,
		color: "text-muted-foreground",
	},
	[MobileUnitStatus.AVAILABLE]: {
		label: "متاحة",
		icon: IconCircleCheck,
		color: "text-emerald-500",
	},
	[MobileUnitStatus.EN_ROUTE]: {
		label: "في الطريق",
		icon: IconCar,
		color: "text-blue-500",
	},
	[MobileUnitStatus.ON_SITE]: {
		label: "عند العميل",
		icon: IconMapPin,
		color: "text-orange-500",
	},
	[MobileUnitStatus.RETURNING]: {
		label: "عائدة",
		icon: IconArrowBackUp,
		color: "text-indigo-500",
	},
	[MobileUnitStatus.ON_BREAK]: {
		label: "استراحة",
		icon: IconCoffee,
		color: "text-amber-500",
	},
	[MobileUnitStatus.OUT_OF_SERVICE]: {
		label: "خارج الدورة",
		icon: IconTool,
		color: "text-red-500",
	},
};

export const MOBILE_UNIT_CREW_ROLE_LABELS: Record<MobileUnitCrewRole, string> = {
	[MobileUnitCrewRole.DRIVER]: "سائق",
	[MobileUnitCrewRole.VET]: "مدرّب",
	[MobileUnitCrewRole.TECHNICIAN]: "فنّي",
	[MobileUnitCrewRole.GROOMER]: "مجمّل",
	[MobileUnitCrewRole.ASSISTANT]: "مساعد",
};

export const MOBILE_UNIT_CREW_ROLE_OPTIONS = Object.values(MobileUnitCrewRole).map(
	(value) => ({ value, label: MOBILE_UNIT_CREW_ROLE_LABELS[value] }),
);

export const MOBILE_UNIT_STATUS_OPTIONS = Object.values(MobileUnitStatus).map((value) => ({
	value,
	label: MOBILE_UNIT_STATUS_META[value].label,
}));
