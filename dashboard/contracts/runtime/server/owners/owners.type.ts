import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { Gender, OwnerRelationship, OwnerType } from "@/generated/prisma/enums";

export type { Gender, OwnerRelationship, OwnerType };

export const createOwnerSchema = z.object({
	name: z.string({ error: "اسم وليّ الأمر مطلوب" }).min(1, "اسم وليّ الأمر مطلوب"),
	phone: z.string({ error: "رقم الهاتف مطلوب" }).min(1, "رقم الهاتف مطلوب"),
	email: z.string({ error: "البريد الإلكتروني مطلوب" }).email("البريد الإلكتروني غير صحيح"),
	gender: z.enum(Gender).optional(),
	ownerType: z.enum(OwnerType).optional().default("ALL"),
	relationship: z.enum(OwnerRelationship).optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	emergencyContactName: z.string().optional(),
	emergencyContactPhone: z.string().optional(),
	notes: z.string().optional(),
	active: z.boolean(),
	patientIds: z.array(z.string()).optional(),
	patientRelationships: z.record(z.string(), z.string()).optional(),
	patients: z
		.array(
			z.object({
				patientId: z.string(),
				relationship: z.string().optional(),
			}),
		)
		.optional(),
});

export type CreateOwnerFormInput = z.infer<typeof createOwnerSchema>;

export type CreateOwnerInput = Pick<
	Prisma.OwnerUncheckedCreateInput,
	| "clinicId"
	| "name"
	| "phone"
	| "email"
	| "gender"
	| "ownerType"
	| "relationship"
	| "country"
	| "city"
	| "address"
	| "emergencyContactName"
	| "emergencyContactPhone"
	| "notes"
	| "active"
> & {
	patientIds?: string[];
	patientRelationships?: Record<string, string>;
	patients?: Array<{ patientId: string; relationship?: string }>;
};

export type UpdateOwnerInput = Partial<
	Pick<
		Prisma.OwnerUncheckedCreateInput,
		| "name"
		| "phone"
		| "gender"
		| "ownerType"
		| "relationship"
		| "country"
		| "city"
		| "address"
		| "emergencyContactName"
		| "emergencyContactPhone"
		| "notes"
		| "active"
	>
> & {
	patientIds?: string[];
	patientRelationships?: Record<string, string>;
	patients?: Array<{ patientId: string; relationship?: string }>;
};

export type DisableOwnerInput = { newOwnerId?: string };
export type DeleteOwnerInput = { newOwnerId?: string };

export type OwnerResponse = {
	id: string;
	code: string;
	name: string;
	phone: string;
	email: string | null;
	gender: Gender | null;
	ownerType: OwnerType;
	relationship: OwnerRelationship | null;
	country: string | null;
	city: string | null;
	address: string | null;
	emergencyContactName: string | null;
	emergencyContactPhone: string | null;
	notes: string | null;
	active: boolean;
	editsCount: number;
	createdAt: Date;
	updatedAt: Date;
	patientRelationships?: Record<string, string>;
	patients: Array<{
		id: string;
		name: string;
		gender: Gender;
		code?: string | null;
		relationship?: string | null;
	}>;
	guardianPatients?: Array<{
		id: string;
		relationship: string | null;
		patient: {
			id: string;
			name: string;
			code: string;
			gender: Gender;
		};
	}>;
};
