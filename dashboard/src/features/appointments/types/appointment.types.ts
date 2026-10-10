import type { ReactNode } from "react";
import { z } from "zod";

import type { StatusAccent } from "@/features/appointments/data/status-meta";
import {
	AppointmentLocation,
	AppointmentStatus,
	type QueueStatus,
	RepeatUnit,
	TaskPriority,
} from "@/generated/prisma/enums";

export type AppointmentsPeriod = "day" | "week" | "all";
export type AppointmentsView = "all" | "for-me";

export type AppointmentColumnId =
	| "scheduled"
	| "queue"
	| "check-in"
	| "in-service"
	| "hospitalization"
	| "awaiting-payment"
	| "done"
	| "cancelled";

export type AppointmentColumn = {
	id: AppointmentColumnId;
	name: string;
	count: number;
	icon: ReactNode;
	accent: StatusAccent;
};

export type AppointmentCardData = {
	id: string;
	column: AppointmentColumnId;
	queueStatus: QueueStatus | null;
	name: string;
	code: string;
	type: string;
	// سبب الزيارة المكتوب، أو اسم الدورة عند غيابه
	reason: string;
	dateLabel: string;
	time: string;
	duration: string;
	patientName: string;
	patientInitials: string;
	ownerName: string;
	// [MI-P2] شارة العضوية على شيت الزيارة تحتاج هوية وليّ الأمر
	ownerId: string;
	doctorName: string;
	doctorInitials: string;
	commentsCount: number;
	examCompleted: boolean;
	enteredCurrentStatusAt: Date;
	startsAt: Date;
	isEmergency: boolean;
	priority: TaskPriority | null;
	branchId: string;
};

export const REPEAT_UNITS = Object.values(RepeatUnit) as [RepeatUnit, ...RepeatUnit[]];

export const addAppointmentSchema = z
	.object({
		branchId: z.string().optional(),
		ownerId: z.string({ error: "وليّ الأمر مطلوب" }).min(1, "وليّ الأمر مطلوب"),
		patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
		staffId: z.string({ error: "المدرّب مطلوب" }).min(1, "المدرّب مطلوب"),
		serviceIds: z.array(z.string()),
		date: z.date({ error: "اختر تاريخ الزيارة" }),
		startMinute: z
			.number({ error: "اختر وقت الزيارة" })
			.int()
			.min(0)
			.max(24 * 60),
		roomId: z.string().optional(),
		location: z.enum(AppointmentLocation).default(AppointmentLocation.IN_CLINIC),
		// الزيارة تولد "مجدول" (الافتراضي) أو "طابور" فقط — docs/appointments-workflow.md
		status: z
			.enum([AppointmentStatus.SCHEDULED, AppointmentStatus.WAITING])
			.default(AppointmentStatus.SCHEDULED),
		priority: z.enum(TaskPriority).nullable().optional(),
		isEmergency: z.boolean().default(false),
		consultationTypeId: z.string(),
		clinicalNotes: z.string().optional(),
		whatsappReminderEnabled: z.boolean().default(false),
		whatsappNotification: z.boolean().default(false),
		repeat: z.boolean().default(false),
		repeatCount: z.number().int().min(2).max(10).optional(),
		repeatUnit: z.enum(RepeatUnit).optional().default(RepeatUnit.WEEK),
		images: z.array(z.instanceof(File)).default([]),
	})
	// سبب الزيارة إلزامي
	.superRefine((data, ctx) => {
		if (!data.consultationTypeId) {
			ctx.addIssue({
				code: "custom",
				path: ["consultationTypeId"],
				message: "اختر سبب الزيارة",
			});
		}
	});

export type AddAppointmentFormInput = z.input<typeof addAppointmentSchema>;
export type AddAppointmentFormValues = z.output<typeof addAppointmentSchema>;
