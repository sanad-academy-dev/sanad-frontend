import { z } from "zod";

export const learningModeEnum = z.enum(["REMOTE", "IN_PERSON", "HYBRID"]);
export type LearningMode = z.infer<typeof learningModeEnum>;

export const createClassroomSchema = z.object({
	name: z.string({ error: "اسم الفصل مطلوب" }).min(1, "اسم الفصل مطلوب"),
	code: z.string().optional(),
	ageGroup: z.string().optional().nullable(),
	category: z.string().optional().nullable(),
	learningMode: learningModeEnum.default("REMOTE"),
	capacity: z.coerce.number().int().min(1, "السعة يجب أن تكون 1 على الأقل").default(10),
	active: z.boolean().default(true),
	notes: z.string().optional().nullable(),
	staffIds: z.array(z.string()).optional().default([]),
	studentIds: z.array(z.string()).optional().default([]),
});

export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;

export const updateClassroomSchema = createClassroomSchema.partial();
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;

export interface ClassroomTeacher {
	id: string;
	name: string;
	image?: string | null;
	phone?: string | null;
	role?: string | null;
}

export interface ClassroomStudentInfo {
	id: string;
	name: string;
	code?: string | null;
}

export interface ClassroomResponse {
	id: string;
	code: string;
	clinicId: string;
	name: string;
	ageGroup?: string | null;
	category?: string | null;
	learningMode: LearningMode;
	capacity: number;
	enrolledCount: number;
	active: boolean;
	notes?: string | null;
	createdAt: string | Date;
	updatedAt: string | Date;
	teachers: ClassroomTeacher[];
	students?: ClassroomStudentInfo[];
}

export interface ClassroomStatsResponse {
	totalClassrooms: number;
	activeClassrooms: number;
	totalCapacity: number;
	enrolledStudents: number;
}
