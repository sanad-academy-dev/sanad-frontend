import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { AssignmentSource, AutoAssignEntity } from "@/generated/prisma/enums";

export {
	AssignmentSource,
	AssignmentStatus,
	AutoAssignEntity,
} from "@/generated/prisma/enums";

// ===== مخططات التحقق (Zod) — تُستهلك على العميل أيضًا =====

export const assignLearnersSchema = z.object({
	courseId: z.string().min(1),
	staffIds: z.array(z.string().min(1)).min(1, "اختر متدربًا واحدًا على الأقل"),
	source: z.enum(AssignmentSource).optional(),
});
export type AssignLearnersFormInput = z.infer<typeof assignLearnersSchema>;

// نافذة التعيين (الخطوة 3ب) — تُطبَّق على تعيينات الدورة
export const assignTimeSchema = z.object({
	startDate: z.string().optional(),
	dueDate: z.string().optional(),
	timezone: z.string().optional(),
});
export type AssignTimeFormInput = z.infer<typeof assignTimeSchema>;

// قاعدة تعيين تلقائي مفردة
export const autoAssignRuleSchema = z.object({
	entityType: z.enum(AutoAssignEntity),
	entityId: z.string().nullable().optional(), // null = «الكل»
});
export type AutoAssignRuleFormInput = z.infer<typeof autoAssignRuleSchema>;

// حفظ قواعد التعيين التلقائي لدورة (استبدال كامل — يطابق زر «حفظ» في النافذة)
export const saveAutoAssignRulesSchema = z.object({
	courseId: z.string().min(1),
	rules: z.array(autoAssignRuleSchema),
});
export type SaveAutoAssignRulesFormInput = z.infer<typeof saveAutoAssignRulesSchema>;

// ===== أنواع إدخال الـ DAO (مشتقة من Prisma) =====

export type CreateAssignmentInput = Pick<
	Prisma.CourseAssignmentUncheckedCreateInput,
	"clinicId" | "courseId" | "staffId"
> &
	Partial<
		Pick<
			Prisma.CourseAssignmentUncheckedCreateInput,
			"source" | "startDate" | "dueDate" | "cycle"
		>
	>;

// ===== أنواع الاستجابة (Prisma payloads) =====

// طاقم مختصر للمتدرّب في الشبكة/الشرائح
const learnerStaffSelect = {
	id: true,
	name: true,
	code: true,
	avatar: true,
	phone: true,
	email: true,
	employmentType: true,
	active: true,
	branch: { select: { id: true, name: true } },
	role: { select: { id: true, name: true } },
	primarySpecialization: { select: { id: true, name: true } },
	secondarySpecialization: { select: { id: true, name: true } },
} as const;

const assignmentSelect = {
	id: true,
	code: true,
	courseId: true,
	staffId: true,
	cycle: true,
	source: true,
	status: true,
	progress: true,
	assignedAt: true,
	startedAt: true,
	completedAt: true,
	startDate: true,
	dueDate: true,
	staff: { select: learnerStaffSelect },
} as const;

const autoAssignRuleSelect = {
	id: true,
	courseId: true,
	entityType: true,
	entityId: true,
} as const;

export type LearnerStaffResponse = Prisma.StaffGetPayload<{
	select: typeof learnerStaffSelect;
}>;
export type AssignmentResponse = Prisma.CourseAssignmentGetPayload<{
	select: typeof assignmentSelect;
}>;
export type AutoAssignRuleResponse = Prisma.CourseAutoAssignRuleGetPayload<{
	select: typeof autoAssignRuleSelect;
}>;

// عنصر شبكة الاختيار: طاقم + هل هو مُعيَّن حاليًا على الدورة
export type EligibleLearnerResponse = LearnerStaffResponse & { assigned: boolean };

export const assignmentSelects = {
	learnerStaffSelect,
	assignmentSelect,
	autoAssignRuleSelect,
};
