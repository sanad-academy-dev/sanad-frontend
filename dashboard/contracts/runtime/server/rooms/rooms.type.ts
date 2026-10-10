import { z } from "zod";
import type { Prisma, Room } from "@/generated/prisma/client";
import { RoomType } from "@/generated/prisma/enums";

export type { RoomType };

export const createRoomSchema = z.object({
	name: z.string({ error: "اسم القاعة مطلوب" }).min(1, "اسم القاعة مطلوب"),
	type: z.enum(RoomType, { error: "نوع القاعة مطلوب" }),
	capacity: z.coerce
		.number({ error: "السعة يجب أن تكون رقمًا" })
		.int("السعة يجب أن تكون عددًا صحيحًا")
		.min(1, "السعة يجب أن تكون 1 على الأقل"),
	availableDevices: z.array(z.string()).min(1, "الأجهزة المتاحة مطلوبة"),
	abilities: z.array(z.string()).min(1, "القدرات مطلوبة"),
	managerId: z.string().optional().nullable(),
	notes: z.string().optional(),
	active: z.boolean({ error: "حالة القاعة مطلوبة" }),
});

export type CreateRoomFormInput = z.infer<typeof createRoomSchema>;

export type RoomWriteFields = Omit<
	Room,
	"id" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt"
>;

export type CreateRoomInput = Pick<
	RoomWriteFields,
	"branchId" | "clinicId" | "name" | "type" | "capacity"
> &
	Partial<
		Pick<RoomWriteFields, "availableDevices" | "abilities" | "managerId" | "notes" | "active">
	>;

export type UpdateRoomInput = Partial<Omit<RoomWriteFields, "branchId" | "clinicId">>;

export type RoomResponse = Prisma.RoomGetPayload<{
	select: {
		id: true;
		name: true;
		type: true;
		capacity: true;
		managerId: true;
		manager: { select: { id: true; name: true; image: true; phone: true } };
		availableDevices: true;
		abilities: true;
		notes: true;
		active: true;
		createdAt: true;
		updatedAt: true;
	};
}>;
