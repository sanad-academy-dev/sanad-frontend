import { RadiologyModality } from "@/generated/prisma/enums";
import type { BranchSettings } from "@/server/branches/branches.type";
import { MODALITY_META } from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

export type RadiologySettings = BranchSettings["radiology"];
export type RadiologyMachine = RadiologySettings["machines"][number];

export const RADIOLOGY_AI_FEATURES = [
	{
		key: "autoDraftReport",
		title: "مسودّة التقرير بالذكاء الاصطناعي",
		description: "هيكل تقرير منهجي من سياق الفحص يملؤه مدرّب الأشعة بقراءته للصور",
	},
	{
		key: "criticalAlerts",
		title: "تنبيهات النتائج الحرجة",
		description: "إشعار فوري للمدرّب الطالب عند اعتماد تقرير مُعلَّم بنتيجة حرجة",
	},
	{
		key: "doseOutlierDetection",
		title: "كشف شذوذ الجرعة الإشعاعية",
		description: "تنبيه عند تجاوز معاملات التعريض النطاق المعتاد للفحص المماثل",
	},
	{
		key: "autoQualityCheck",
		title: "فحص جودة الصور التلقائي",
		description: "تقييم أولي لوضوح الصور واكتمال الإسقاطات قبل كتابة التقرير",
	},
] as const satisfies readonly {
	key: keyof RadiologySettings["ai"];
	title: string;
	description: string;
}[];

/** خيارات طريقة التصوير لحوار إضافة جهاز — القيمة قيمة RadiologyModality نصًا */
export const RADIOLOGY_MODALITY_OPTIONS = Object.values(RadiologyModality).map((value) => ({
	value,
	label: MODALITY_META[value].label,
}));
