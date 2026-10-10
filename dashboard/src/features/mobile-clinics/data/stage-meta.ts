import {
	IconCar,
	IconCircleCheck,
	IconCircleX,
	IconClockPause,
	IconMapPin,
	IconPlayerPlay,
	type IconProps,
	IconTruckDelivery,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { MobileDispatchStage, MobileVisitFailureReason } from "@/generated/prisma/enums";
import { DISPATCH_STAGE_LABELS } from "@sanad/contracts/runtime/server/mobile-clinics/mobile-visits/mobile-visit.workflow";

export type DispatchStageMeta = {
	label: string;
	icon: ComponentType<IconProps>;
	color: string;
};

/** التسميات تأتي من آلة الحالات نفسها — نصٌّ واحد لا نسختان تتباعدان. */
export const DISPATCH_STAGE_META: Record<MobileDispatchStage, DispatchStageMeta> = {
	[MobileDispatchStage.PENDING]: {
		label: DISPATCH_STAGE_LABELS.PENDING,
		icon: IconClockPause,
		color: "text-muted-foreground",
	},
	[MobileDispatchStage.ASSIGNED]: {
		label: DISPATCH_STAGE_LABELS.ASSIGNED,
		icon: IconTruckDelivery,
		color: "text-indigo-500",
	},
	[MobileDispatchStage.EN_ROUTE]: {
		label: DISPATCH_STAGE_LABELS.EN_ROUTE,
		icon: IconCar,
		color: "text-blue-500",
	},
	[MobileDispatchStage.ARRIVED]: {
		label: DISPATCH_STAGE_LABELS.ARRIVED,
		icon: IconMapPin,
		color: "text-orange-500",
	},
	[MobileDispatchStage.IN_SERVICE]: {
		label: DISPATCH_STAGE_LABELS.IN_SERVICE,
		icon: IconPlayerPlay,
		color: "text-amber-500",
	},
	[MobileDispatchStage.COMPLETED]: {
		label: DISPATCH_STAGE_LABELS.COMPLETED,
		icon: IconCircleCheck,
		color: "text-emerald-500",
	},
	[MobileDispatchStage.FAILED]: {
		label: DISPATCH_STAGE_LABELS.FAILED,
		icon: IconCircleX,
		color: "text-destructive",
	},
	[MobileDispatchStage.CANCELLED]: {
		label: DISPATCH_STAGE_LABELS.CANCELLED,
		icon: IconCircleX,
		color: "text-muted-foreground",
	},
};

export const FAILURE_REASON_LABELS: Record<MobileVisitFailureReason, string> = {
	[MobileVisitFailureReason.NO_ANSWER]: "لا أحد يجيب",
	[MobileVisitFailureReason.ADDRESS_NOT_FOUND]: "العنوان غير موجود",
	[MobileVisitFailureReason.ACCESS_DENIED]: "تعذّر الدخول",
	[MobileVisitFailureReason.PET_UNAVAILABLE]: "الطفل غير متاح",
	[MobileVisitFailureReason.OWNER_CANCELLED]: "ألغى وليّ الأمر",
	[MobileVisitFailureReason.VEHICLE_ISSUE]: "عطل بالمركبة",
	[MobileVisitFailureReason.WEATHER]: "ظروف جوّية",
	[MobileVisitFailureReason.OTHER]: "سبب آخر",
};

export const FAILURE_REASON_OPTIONS = Object.values(MobileVisitFailureReason).map((value) => ({
	value,
	label: FAILURE_REASON_LABELS[value],
}));
