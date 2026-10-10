import type { BranchSettings } from "@/server/branches/branches.type";

export type LabSettings = BranchSettings["labTests"];
export type LabAnalyzer = LabSettings["analyzers"][number];

export const AI_FEATURES = [
	{
		key: "autoInterpretation",
		title: "التفسير التلقائي للنتائج",
		description: "يفسر الذكاء الاصطناعي النتائج ويوفر ملاحظات سريرية",
	},
	{
		key: "duplicateDetection",
		title: "كشف الطلبات المكررة",
		description: "تنبيه عند وجود طلبات مشابهة لنفس الطفل خلال ٢٤ ساعة",
	},
	{
		key: "criticalAlerts",
		title: "تنبيهات القيم الحرجة الذكية",
		description: "إشعار فوري عند اكتشاف قيمة حرجة مع توصية سريرية",
	},
	{
		key: "trendAnalysis",
		title: "تحليل الاتجاهات",
		description: "مقارنة النتائج مع السجل التاريخي واكتشاف الاتجاهات",
	},
	{
		key: "predictiveMaintenance",
		title: "الصيانة التنبؤية للأجهزة",
		description: "التنبؤ بأعطال الأجهزة قبل حدوثها",
	},
] as const satisfies readonly {
	key: keyof LabSettings["ai"];
	title: string;
	description: string;
}[];

// قواعد Westgard لضبط جودة المختبر — المعرّف هو الكود المتعارف عليه
export const WESTGARD_RULES = [
	{ id: "1-2s", description: "تحذير عند تجاوز انحرافين معياريين" },
	{ id: "1-3s", description: "رفض عند تجاوز ثلاثة انحرافات معيارية" },
	{ id: "2-2s", description: "رفض عند تجاوز قياسين متتاليين لانحرافين معياريين" },
	{ id: "R-4s", description: "رفض عند فرق ٤ انحرافات بين ضوابط متتالية" },
	{ id: "4-1s", description: "رفض عند انحراف ٤ قياسات متتالية بانحراف واحد" },
	{ id: "10x", description: "رفض عند وقوع ١٠ قياسات متتالية في جهة واحدة من المتوسط" },
];

export const ANALYZER_CATEGORIES = ["Hematology", "Biochemistry", "Urinalysis", "Immunoassay"];

export const BARCODE_LABEL_SIZES = ["25x15mm", "40x20mm", "50x25mm", "57x32mm"];

export const COMPACT_INPUT_CLASS = "h-8 rounded-lg px-2.5 text-xs";
