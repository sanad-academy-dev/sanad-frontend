import type { ReactNode } from "react";
import type {
	Gender,
	OperationStatus,
	OperationTier,
	OperationUrgency,
} from "@/generated/prisma/enums";
import type { OperationCaseCardResponse } from "@/server/operations/operations.type";

// أعمدة اللوحة = حالات المسار (بلا «ملغاة» — الملغاة لا تشغل عمودًا).
// المصدر الكامل للحالات والانتقالات: src/server/operations/operations.workflow.ts
export const OPERATION_COLUMN_IDS = [
	"SCHEDULED",
	"PREP",
	"ANESTHESIA",
	"SURGERY",
	"RECOVERY",
	"DISCHARGE",
	"FOLLOW_UP",
	"COMPLETED",
] as const satisfies readonly OperationStatus[];

export type OperationColumnId = (typeof OPERATION_COLUMN_IDS)[number];

export type OperationAccent =
	| "amber"
	| "orange"
	| "rose"
	| "indigo"
	| "violet"
	| "blue"
	| "teal"
	| "green";

export type OperationColumn = {
	id: OperationColumnId;
	name: string;
	count: number;
	icon: ReactNode;
	accent: OperationAccent;
};

/**
 * بيانات بطاقة العملية — نموذج عرض تبنيه mapCaseToCard من استجابة الخادم
 * (OperationCaseCardResponse). حقول العرض (timeLabel...) شأن واجهة صرف،
 * والحقول السريرية تُشتق من الاستجابة لا تُعلن يدويًا.
 */
export type OperationCardData = {
	id: string;
	/** اسم العملية (الإجراءات مفصولة بـ «،») — عنوان البطاقة */
	name: string;
	column: OperationColumnId;
	code: string;
	isUrgent: boolean;
	tier: OperationTier;
	urgency: OperationUrgency;
	patient: { name: string; age: number | null; gender: Gender };
	owner: { name: string };
	room: string;
	timeLabel: string;
	durationLabel: string;
	anesthesiaLabel: string;
	surgeon: { name: string };
	anesthetist: { name: string } | null;
	checklistDone: number;
	checklistTotal: number;
	commentsCount: number;
	/** الاستجابة الخام — للوحة التفاصيل والانتقالات */
	raw: OperationCaseCardResponse;
};

export const OPERATIONS_PERIODS = ["day", "week", "all"] as const;
export type OperationsPeriod = (typeof OPERATIONS_PERIODS)[number];

export const OPERATIONS_VIEWS = ["all", "for-me"] as const;
export type OperationsView = (typeof OPERATIONS_VIEWS)[number];
