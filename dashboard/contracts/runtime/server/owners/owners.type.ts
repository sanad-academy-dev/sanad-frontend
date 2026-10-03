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
	notes: z.string().optional(),
	active: z.boolean(),
	patientIds: z.array(z.string()).optional(),
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
	| "notes"
	| "active"
> & { patientIds?: string[] };

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
		| "notes"
		| "active"
	>
> & { patientIds?: string[] };

export type DisableOwnerInput = { newOwnerId?: string };
export type DeleteOwnerInput = { newOwnerId?: string };

export type OwnerResponse = Prisma.OwnerGetPayload<{
	select: {
		id: true;
		code: true;
		name: true;
		phone: true;
		email: true;
		gender: true;
		ownerType: true;
		relationship: true;
		country: true;
		city: true;
		address: true;
		notes: true;
		active: true;
		editsCount: true;
		createdAt: true;
		updatedAt: true;
		patients: {
			select: {
				id: true;
				animalType: { select: { arName: true; enName: true } };
			};
		};
	};
}>;
