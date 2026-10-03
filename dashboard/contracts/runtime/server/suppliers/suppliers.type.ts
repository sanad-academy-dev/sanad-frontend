import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

export const createSupplierSchema = z.object({
	// معلومات الأساسية
	logo: z.string().optional(),
	legalName: z
		.string({ error: "اسم المورد القانوني مطلوب" })
		.min(1, "اسم المورد القانوني مطلوب"),
	type: z.string({ error: "نوع المورد مطلوب" }).min(1, "نوع المورد مطلوب"),
	commercialReg: z
		.string({ error: "رقم السجل التجاري مطلوب" })
		.min(1, "رقم السجل التجاري مطلوب"),
	supplierCode: z.string({ error: "كود المورد مطلوب" }).min(1, "كود المورد مطلوب"),
	description: z.string().optional(),
	// معلومات التوريد
	categories: z.array(z.string()).min(1, "اختر فئة واحدة على الأقل"),
	products: z.array(z.string()).optional().default([]),
	leadTimeDays: z.coerce
		.number({ error: "مدة التوريد مطلوبة" })
		.int("مدة التوريد يجب أن تكون عددًا صحيحًا")
		.min(0, "مدة التوريد لا يمكن أن تكون سالبة"),
	minOrderQty: z.coerce
		.number({ error: "الحد الأدنى للطلب مطلوب" })
		.int("الحد الأدنى يجب أن يكون عددًا صحيحًا")
		.min(0, "الحد الأدنى لا يمكن أن يكون سالبًا"),
	supportsReturns: z.boolean().optional().default(false),
	returnPolicy: z.string().optional(),
	// معلومات التواصل
	contactName: z.string({ error: "اسم جهة الاتصال مطلوب" }).min(1, "اسم جهة الاتصال مطلوب"),
	contactTitle: z.string().optional(),
	phone: z.string({ error: "رقم الجوال مطلوب" }).min(1, "رقم الجوال مطلوب"),
	email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
	website: z.string().optional(),
	// معلومات العنوان
	country: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	mapUrl: z.string().optional(),
});

export type CreateSupplierFormInput = z.infer<typeof createSupplierSchema>;

export type CreateSupplierInput = Pick<
	Prisma.SupplierUncheckedCreateInput,
	| "clinicId"
	| "logo"
	| "legalName"
	| "type"
	| "commercialReg"
	| "supplierCode"
	| "description"
	| "categories"
	| "products"
	| "leadTimeDays"
	| "minOrderQty"
	| "supportsReturns"
	| "returnPolicy"
	| "contactName"
	| "contactTitle"
	| "phone"
	| "email"
	| "website"
	| "country"
	| "city"
	| "address"
	| "mapUrl"
>;

export const supplierSelect = {
	id: true,
	code: true,
	legalName: true,
	type: true,
	logo: true,
	commercialReg: true,
	supplierCode: true,
	description: true,
	rating: true,
	categories: true,
	products: true,
	leadTimeDays: true,
	minOrderQty: true,
	supportsReturns: true,
	returnPolicy: true,
	contactName: true,
	contactTitle: true,
	phone: true,
	email: true,
	website: true,
	country: true,
	city: true,
	address: true,
	mapUrl: true,
	active: true,
	createdAt: true,
} as const;

export type SupplierResponse = Prisma.SupplierGetPayload<{ select: typeof supplierSelect }>;

// موردو منتج محدّد — شكل مُجمّع مُشتقّ من سجل المشتريات + قائمة المنتجات لدى المورد
export type ItemSupplierResponse = Pick<SupplierResponse, "id" | "legalName" | "rating"> & {
	isPrimary: boolean;
	lastOrderAt: Date | null;
	price: number | null;
};
