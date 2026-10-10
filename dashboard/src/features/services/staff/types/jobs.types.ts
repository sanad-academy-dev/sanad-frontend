import { z } from "zod";

import type { JobForm } from "@/features/services/staff/components/jobs/add-job-sheet";

// وظيفة منشورة: بيانات النموذج + حقول مُولّدة عند النشر
export type PublishedJob = JobForm & { id: string; code: string; createdAt: Date };

// مستند مرفق بطلب المرشّح
export type CandidateDocument = {
	id: string;
	name: string;
	kind: "pdf" | "image";
	size: string;
	uploadedAt: string;
};

// طريقة إجراء المقابلة كما في التصميم: عبر اتصال أو في مقر الشركة
export const INTERVIEW_MODES = [
	{ value: "call", label: "عبر اتصال" },
	{ value: "onsite", label: "في مقر الشركة" },
] as const;

// نموذج «إنشاء مقابلة» — المخطّط هو مصدر الحقيقة لنوع النموذج.
// مكانه الطبيعي src/server/interviews/interviews.type.ts عند إضافة الـ backend،
// وهو هنا مؤقتًا لأن مسار التوظيف كلّه واجهة بلا ربط خلفي بعد.
export const createInterviewSchema = z
	.object({
		date: z.string({ error: "تاريخ المقابلة مطلوب" }).min(1, "تاريخ المقابلة مطلوب"),
		timezone: z.string({ error: "المنطقة الزمنية مطلوبة" }).min(1, "المنطقة الزمنية مطلوبة"),
		startTime: z.string({ error: "وقت البدء مطلوب" }).min(1, "وقت البدء مطلوب"),
		endTime: z.string({ error: "وقت الانتهاء مطلوب" }).min(1, "وقت الانتهاء مطلوب"),
		mode: z.enum(["call", "onsite"], { error: "طريقة الإجراء مطلوبة" }),
		meetingUrl: z.string().optional(),
		reviewer: z.string({ error: "المراجع مطلوب" }).min(1, "المراجع مطلوب"),
		candidateId: z.string({ error: "المرشح مطلوب" }).min(1, "المرشح مطلوب"),
		note: z.string().optional(),
	})
	// رابط الاجتماع مطلوب للمقابلات عبر الاتصال فقط
	.refine((v) => v.mode !== "call" || !!v.meetingUrl?.trim(), {
		path: ["meetingUrl"],
		message: "رابط الاجتماع مطلوب",
	})
	.refine((v) => v.mode !== "call" || URL.canParse(v.meetingUrl ?? ""), {
		path: ["meetingUrl"],
		message: "أدخل رابطًا صحيحًا",
	})
	.refine((v) => !v.startTime || !v.endTime || v.endTime > v.startTime, {
		path: ["endTime"],
		message: "وقت الانتهاء يجب أن يكون بعد وقت البدء",
	});

export type CreateInterviewFormInput = z.infer<typeof createInterviewSchema>;

// ملاحظة مسؤول مكتوبة من سجل النشاط — حالة واجهة فقط (لا يوجد نموذج قاعدة بيانات لها بعد)
export type AdminNote = {
	id: string;
	// المجال الذي تنتمي إليه الملاحظة: معرّف الوظيفة أو معرّف المرشّح
	scope: string;
	text: string;
	author: string;
	createdAt: string;
};

// ملف المرشّح كما يظهر في لوحة تفاصيله — بيانات عيّنة (لا يوجد ربط خلفي بعد)
export type CandidateProfile = {
	phone: string;
	email: string;
	education: string;
	documents: CandidateDocument[];
	skills: string[];
};
