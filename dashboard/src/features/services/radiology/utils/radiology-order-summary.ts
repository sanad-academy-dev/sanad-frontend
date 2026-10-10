import type { RadiologyStatus } from "@/generated/prisma/enums";
import {
	type RadiologyOrderResponse,
	type RadiologyPaymentStatus,
	radiologyPaymentStatus,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import { deriveRadiologyOrderStatus } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

export type RadiologyOrderSummary = {
	/** حالة الطلب المشتقّة من أقلّ فحوصاته تقدّمًا */
	status: RadiologyStatus;
	payment: RadiologyPaymentStatus;
	/** أي فحص يحمل أثر رفض لم يُمسح بعد */
	wasRejected: boolean;
	/** أي تقرير مُعلَّم بنتيجة حرجة */
	hasCriticalFinding: boolean;
};

/** ملخّص الطلب للوحة التفاصيل — مشتق كله من استجابة الخادم، لا حالة محلية */
export const summarizeRadiologyOrder = (
	order: RadiologyOrderResponse,
): RadiologyOrderSummary => ({
	status: deriveRadiologyOrderStatus(order.items),
	payment: radiologyPaymentStatus(order),
	wasRejected: order.items.some((item) => item.rejectedAt !== null),
	hasCriticalFinding: order.items.some((item) => item.report?.criticalFinding === true),
});
