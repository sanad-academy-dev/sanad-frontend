import type { Prisma } from "@/generated/prisma/client";

// دقائق يوم العمل القياسي — لتحويل الرصيد التعويضي من دقائق إلى أيام عمل.
export const WORK_DAY_MINUTES = 8 * 60;

// اسم نوع الإجازة التعويضية — مصدر واحد يُستخدم في الخادم والواجهة (خصم الرصيد عند الاعتماد).
export const COMPENSATORY_LEAVE_TYPE = "إجازة تعويضية";

export const compensatorySelect = {
	id: true,
	staffId: true,
	minutes: true,
	source: true,
	reason: true,
	date: true,
	createdAt: true,
} as const;

export type CompensatoryEntryResponse = Prisma.CompensatoryEntryGetPayload<{
	select: typeof compensatorySelect;
}>;

// مصدر قيد الرصيد التعويضي
export type CompensatorySource = "shift_extension" | "leave" | "manual";
