import type { ReactNode } from "react";
import type { LabTestStatus } from "@/generated/prisma/enums";
import type {
	LabTestItemResponse,
	LabTestOrderResponse,
} from "@/server/lab-tests/lab-tests.type";

// أعمدة اللوحة هي حالات التحليل نفسها (المصدر: lab-tests.workflow.ts)
export type LabTestColumnId = LabTestStatus;

export type LabTestAccent = "neutral" | "amber" | "rose" | "indigo" | "blue" | "green";

export type LabTestColumn = {
	id: LabTestColumnId;
	name: string;
	count: number;
	icon: ReactNode;
	accent: LabTestAccent;
};

// بطاقة اللوحة = تحليل واحد في عموده الحقيقي، لا طلب كامل. عمود واحد لا
// يستطيع تمثيل تحليلَين في حالتين، فالطلب المختلط يظهر بطاقةً لكل تحليل
// وتبقى حالة الطلب المشتقّة للقوائم والفواتير.
// الحقول المسطّحة (id/column/name) يشترطها KanbanItemProps.
export type LabItemCardData = {
	/** معرّف التحليل نفسه — فريد عبر الطلبات كلها */
	id: string;
	column: LabTestColumnId;
	name: string;
	item: LabTestItemResponse;
	order: LabTestOrderResponse;
};
