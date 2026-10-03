import type { UpdateProtocolsInput } from "@/server/protocols/protocols.type";

// مفاتيح البروتوكولات المنطقية فقط — إعدادات العمليات الرقمية لها صفحتها الخاصة
type BooleanProtocolKey = {
	[K in keyof UpdateProtocolsInput]-?: UpdateProtocolsInput[K] extends boolean | undefined
		? K
		: never;
}[keyof UpdateProtocolsInput];

export const PROTOCOLS: {
	key: BooleanProtocolKey;
	label: string;
	description: string;
}[] = [
	{
		key: "avma",
		label: "تفعيل بروتوكول AVMA",
		description: "بروتوكول الجمعية الأمريكية للطب البيطري",
	},
	{
		key: "soapNotes",
		label: "تفعيل SOAP Notes",
		description: "نظام التوثيق الطبي المنظم",
	},
	{
		key: "avmaMedicine",
		label: "تفعيل بروتوكول دليل الأدوية AVMA",
		description: "دليل الأدوية الخاص بالجمعية الأمريكية للطب البيطري",
	},
	{
		key: "fecava",
		label: "تفعيل بروتوكول FECAVA",
		description: "بروتوكول الاتحاد الأوروبي للطب البيطري",
	},
	{
		key: "wsava",
		label: "تفعيل بروتوكول WSAVA",
		description: "بروتوكول الاتحاد الأوروبي للطب للتطعيم البيطري",
	},
	{
		key: "esccap",
		label: "تفعيل بروتوكول ESCCAP",
		description: "بروتوكول الاتحاد الأوروبي للطفيليات البيطرية",
	},
];
