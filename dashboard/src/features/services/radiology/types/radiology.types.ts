import type { ReactNode } from "react";
import type { RadiologyStatus } from "@/generated/prisma/enums";
import type {
	RadiologyItemResponse,
	RadiologyOrderResponse,
} from "@/server/radiology/radiology.type";

// أعمدة اللوحة هي حالات الفحص نفسها (المصدر: radiology.workflow.ts)
export type RadiologyColumnId = RadiologyStatus;

export type RadiologyAccent = "neutral" | "amber" | "rose" | "indigo" | "blue" | "green";

export type RadiologyColumn = {
	id: RadiologyColumnId;
	name: string;
	count: number;
	icon: ReactNode;
	accent: RadiologyAccent;
};

// بطاقة اللوحة = فحص واحد في عموده الحقيقي، لا طلب كامل. عمود واحد لا
// يستطيع تمثيل فحصين في حالتين، فالطلب المختلط يظهر بطاقةً لكل فحص
// وتبقى حالة الطلب المشتقّة للقوائم والفواتير.
// الحقول المسطّحة (id/column/name) يشترطها KanbanItemProps.
export type RadiologyItemCardData = {
	/** معرّف الفحص نفسه — فريد عبر الطلبات كلها */
	id: string;
	column: RadiologyColumnId;
	name: string;
	item: RadiologyItemResponse;
	order: RadiologyOrderResponse;
};

// فلاتر الصفحة — تُعاد تصديرها من نوع الخادم لتوافق استيرادات المسار
export type { RadiologyPeriod, RadiologyView } from "@/server/radiology/radiology.type";

export const RADIOLOGY_PERIODS = ["day", "week", "all"] as const;
export const RADIOLOGY_VIEWS = ["all", "for-me"] as const;
