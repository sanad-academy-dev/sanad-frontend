import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { EmploymentType, Gender, StaffPrefix, StaffStatus } from "@/generated/prisma/enums";

export { EmploymentType, Gender, StaffPrefix, StaffStatus };

export const createStaffSchema = z.object({
	name: z.string({ error: "الاسم مطلوب" }).min(1, "الاسم مطلوب"),
	email: z.string({ error: "البريد الإلكتروني مطلوب" }).email("البريد الإلكتروني غير صحيح"),
	phone: z.string({ error: "رقم الهاتف مطلوب" }).min(1, "رقم الهاتف مطلوب"),
	roleId: z.string({ error: "الدور مطلوب" }).min(1, "الدور مطلوب"),
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	licenseNumber: z.string({ error: "رقم الترخيص مطلوب" }).min(1, "رقم الترخيص مطلوب"),
	employmentType: z.enum(EmploymentType).optional(),
	gender: z.enum(Gender).optional(),
	prefix: z.enum(StaffPrefix).optional(),
	age: z.coerce.number().int("العمر يجب أن يكون رقمًا صحيحًا").min(1, "العمر مطلوب").optional(),
	primarySpecializationId: z.string().optional(),
	secondarySpecializationId: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
});

export type CreateStaffFormInput = z.infer<typeof createStaffSchema>;

export type CreateStaffInput = Pick<
	Prisma.StaffUncheckedCreateInput,
	| "clinicId"
	| "name"
	| "email"
	| "phone"
	| "roleId"
	| "branchId"
	| "licenseNumber"
	| "employmentType"
	| "gender"
	| "prefix"
	| "age"
	| "primarySpecializationId"
	| "secondarySpecializationId"
	| "country"
	| "city"
	| "address"
	| "notes"
>;

// الحقول المشتركة بين نوع الشبكة ونوع طبقة الوصول (كل شيء عدا التواريخ)
type UpdateStaffFields = Partial<
	Pick<
		Prisma.StaffUncheckedCreateInput,
		| "name"
		| "roleId"
		| "branchId"
		| "licenseNumber"
		| "employmentType"
		| "gender"
		| "prefix"
		| "age"
		| "phone"
		| "primarySpecializationId"
		| "secondarySpecializationId"
		| "country"
		| "city"
		| "address"
		| "notes"
		| "bio"
		| "educationalQualification"
		| "nationality"
		| "active"
		| "status"
	>
>;

// نوع الشبكة (الواجهة → الـ API): التاريخ يُرسل نصًا بصيغة YYYY-MM-DD
export type UpdateStaffInput = UpdateStaffFields & { hireDate?: string | null };

// نوع طبقة الوصول للبيانات: المتحكّم يحوّل التاريخ إلى Date قبل تمريره
export type UpdateStaffDaoInput = UpdateStaffFields &
	Partial<Pick<Prisma.StaffUncheckedCreateInput, "hireDate">>;

export const staffSelect = {
	id: true,
	code: true,
	name: true,
	email: true,
	phone: true,
	gender: true,
	prefix: true,
	age: true,
	licenseNumber: true,
	employmentType: true,
	hireDate: true,
	country: true,
	city: true,
	address: true,
	notes: true,
	bio: true,
	educationalQualification: true,
	nationality: true,
	avatar: true,
	status: true,
	active: true,
	createdAt: true,
	updatedAt: true,
	role: { select: { id: true, name: true } },
	branch: { select: { id: true, name: true } },
	clinic: { select: { id: true, name: true } },
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			sessions: {
				orderBy: { createdAt: "desc" },
				take: 1,
				select: { createdAt: true },
			},
		},
	},
	primarySpecialization: { select: { id: true, name: true, level: true } },
	secondarySpecialization: { select: { id: true, name: true, level: true } },
	invites: { select: { id: true, accepted: true, expiresAt: true } },
	schedulingSettings: {
		select: {
			shift: true,
			morningStartMinute: true,
			morningEndMinute: true,
			eveningStartMinute: true,
			eveningEndMinute: true,
		},
	},
} as const;

export type StaffResponse = Prisma.StaffGetPayload<{ select: typeof staffSelect }>;
