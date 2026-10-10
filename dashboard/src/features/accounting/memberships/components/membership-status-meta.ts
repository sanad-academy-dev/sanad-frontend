import type { MembershipStatus } from "@/generated/prisma/enums";

/** [MI-P1] the six §5.2 statuses — Arabic labels + chip variants, declared once */
export const MEMBERSHIP_STATUS_META: Record<
	MembershipStatus,
	{ label: string; variant: "default" | "outline" | "secondary" | "destructive" }
> = {
	PENDING_PAYMENT: { label: "بانتظار الدفع", variant: "outline" },
	ACTIVE: { label: "نشطة", variant: "default" },
	PAST_DUE: { label: "متأخرة — ضمن السماح", variant: "destructive" },
	LAPSED: { label: "منقضية", variant: "destructive" },
	CANCELLED: { label: "ملغاة", variant: "secondary" },
	EXPIRED: { label: "منتهية", variant: "secondary" },
};
