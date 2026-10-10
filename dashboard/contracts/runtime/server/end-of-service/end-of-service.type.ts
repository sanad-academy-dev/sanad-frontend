import type { Prisma } from "@/generated/prisma/client";

export { EndOfServiceReason, EndOfServiceStatus } from "@/generated/prisma/enums";

const settlementSelect = {
	id: true,
	code: true,
	staffId: true,
	staffName: true,
	staffCode: true,
	reason: true,
	status: true,
	monthlyWage: true,
	startDate: true,
	endDate: true,
	serviceYears: true,
	serviceMonths: true,
	serviceDays: true,
	firstFiveMonths: true,
	beyondFiveMonths: true,
	fullAward: true,
	factor: true,
	finalAmount: true,
	notes: true,
	approvedAt: true,
	paidAt: true,
	createdAt: true,
} as const;

export type EosSettlementResponse = Prisma.EndOfServiceSettlementGetPayload<{
	select: typeof settlementSelect;
}>;

export const eosSelects = { settlementSelect };

// مدخلات الإنشاء — مشتقة من Prisma، والمخرجات المحسوبة تُمرَّر كما حسبها المحرك
export type CreateEosInput = Pick<
	Prisma.EndOfServiceSettlementUncheckedCreateInput,
	| "staffId"
	| "reason"
	| "monthlyWage"
	| "startDate"
	| "endDate"
	| "serviceYears"
	| "serviceMonths"
	| "serviceDays"
	| "firstFiveMonths"
	| "beyondFiveMonths"
	| "fullAward"
	| "factor"
	| "finalAmount"
> &
	Partial<Pick<Prisma.EndOfServiceSettlementUncheckedCreateInput, "notes">>;

export const EOS_STATUS_LABEL: Record<string, string> = {
	DRAFT: "مسودة",
	APPROVED: "معتمدة",
	PAID: "مصروفة",
	CANCELLED: "ملغاة",
};

export const EOS_REASON_LABEL: Record<string, string> = {
	END_OF_CONTRACT: "انتهاء مدة العقد",
	EMPLOYER_TERMINATION: "إنهاء من صاحب العمل",
	RESIGNATION: "استقالة",
	SPECIAL: "حالة استثنائية",
};
