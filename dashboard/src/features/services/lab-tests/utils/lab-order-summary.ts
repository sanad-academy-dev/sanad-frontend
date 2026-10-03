import { LabResultFlag, type LabSampleStage, LabTestStatus } from "@/generated/prisma/enums";
import {
	type LabPaymentStatus,
	type LabTestItemResponse,
	type LabTestOrderResponse,
	labPaymentStatus,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import { deriveOrderStatus } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

// ملخّص الطلب المشتقّ من عناصره — مصدر واحد تقرأ منه البطاقة واللوحة
// وشريط التنبيهات، بدل أن يُعيد كل مكوّن الاشتقاق بطريقته.

export type LabOrderSummary = {
	/** حالة الطلب = أقلّ تحاليله تقدّمًا */
	status: LabTestStatus;
	/** التحاليل غير الملغاة */
	activeItems: LabTestItemResponse[];
	testNames: string[];
	totalCount: number;
	completedCount: number;
	resultCount: number;
	criticalCount: number;
	/** أي تحليل رُفضت نتائجه ولم يُعتمد بعد */
	wasRejected: boolean;
	payment: LabPaymentStatus;
	/** كل التحاليل النشطة في حالة واحدة — شرط سحب البطاقة على اللوحة */
	isUniform: boolean;
	/** مرحلة العيّنة المشتركة، أو null عند اختلافها */
	stage: LabSampleStage | null;
	assignees: { id: string; name: string }[];
};

export const summarizeLabOrder = (order: LabTestOrderResponse): LabOrderSummary => {
	const activeItems = order.items.filter((i) => i.status !== LabTestStatus.CANCELLED);
	const scope = activeItems.length > 0 ? activeItems : order.items;

	const statuses = new Set(scope.map((i) => i.status));
	const stages = new Set(scope.map((i) => i.sampleStage));

	const assignees = new Map<string, { id: string; name: string }>();
	for (const item of scope) {
		if (item.assignedTo) assignees.set(item.assignedTo.id, item.assignedTo);
	}

	return {
		status: deriveOrderStatus(order.items),
		activeItems,
		testNames: scope.map((i) => i.service.name),
		totalCount: scope.length,
		completedCount: scope.filter((i) => i.status === LabTestStatus.COMPLETED).length,
		resultCount: scope.reduce((sum, i) => sum + i.results.length, 0),
		criticalCount: scope.reduce(
			(sum, i) => sum + i.results.filter((r) => r.flag !== LabResultFlag.NORMAL).length,
			0,
		),
		wasRejected: scope.some((i) => i.rejectedAt !== null),
		payment: labPaymentStatus(order),
		isUniform: statuses.size === 1,
		stage: stages.size === 1 ? scope[0].sampleStage : null,
		assignees: [...assignees.values()],
	};
};

/** عنوان الطلب على البطاقة: اسم التحليل، أو "CBC +2" عند تعدّدها */
export const labOrderTitle = (summary: LabOrderSummary): string => {
	const [first, ...rest] = summary.testNames;
	if (!first) return "طلب تحاليل";
	return rest.length > 0 ? `${first} +${rest.length}` : first;
};

export const MIXED_STAGES_MESSAGE =
	"تحاليل هذا الطلب في مراحل مختلفة — افتح الطلب وانقل كل تحليل على حدة";
