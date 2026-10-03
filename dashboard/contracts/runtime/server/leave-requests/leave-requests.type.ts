import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { LeaveRequestStatus } from "@/generated/prisma/enums";

export { LeaveRequestStatus };

export const leaveRequestSelect = {
	id: true,
	code: true,
	type: true,
	startDate: true,
	endDate: true,
	days: true,
	notes: true,
	status: true,
	createdAt: true,
	staff: {
		select: {
			id: true,
			name: true,
			code: true,
			email: true,
			role: { select: { name: true } },
		},
	},
	substitute: { select: { id: true, name: true } },
	attachments: {
		select: { id: true, kind: true, name: true, url: true, createdAt: true },
	},
	approvals: {
		select: { id: true, order: true, title: true, status: true, actorName: true, at: true },
	},
} as const;

export type LeaveRequestResponse = Prisma.LeaveRequestGetPayload<{
	select: typeof leaveRequestSelect;
}>;

// إنشاء طلب إجازة (من النموذج)
export const createLeaveRequestSchema = z.object({
	staffId: z.string({ error: "الموظف مطلوب" }).min(1),
	type: z.string({ error: "نوع الإجازة مطلوب" }).min(1),
	startDate: z.string({ error: "تاريخ البداية مطلوب" }).min(1),
	endDate: z.string({ error: "تاريخ النهاية مطلوب" }).min(1),
	days: z.coerce.number().int().min(1),
	notes: z.string().optional(),
	substituteStaffId: z.string().optional(),
	attachments: z
		.array(
			z.object({
				kind: z.enum(["link", "document"]),
				name: z.string().optional(),
				url: z.string(),
			}),
		)
		.optional(),
});

export type CreateLeaveRequestFormInput = z.infer<typeof createLeaveRequestSchema>;

// إرسال طلب الإجازة عبر البريد للموافقة
export const sendLeaveEmailSchema = z.object({
	recipients: z
		.array(z.email({ error: "بريد إلكتروني غير صالح" }))
		.min(1, "أضف مستلمًا واحدًا على الأقل"),
	subject: z.string({ error: "الموضوع مطلوب" }).min(1, "الموضوع مطلوب"),
	message: z.string({ error: "نص الرسالة مطلوب" }).min(1, "نص الرسالة مطلوب"),
});

export type SendLeaveEmailFormInput = z.infer<typeof sendLeaveEmailSchema>;
