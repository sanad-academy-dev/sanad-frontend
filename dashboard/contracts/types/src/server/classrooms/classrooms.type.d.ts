import type { z } from "zod";

export type LearningMode = "REMOTE" | "IN_PERSON" | "HYBRID";

export interface ClassroomTeacher {
	id: string;
	name: string;
	image?: string | null;
	phone?: string | null;
	email?: string | null;
	role?: string | null;
	branch?: string | null;
	employmentType?: string | null;
}

export interface ClassroomStudentInfo {
	id: string;
	name: string;
	code?: string | null;
	gender?: string | null;
	avatar?: string | null;
	active?: boolean;
	age?: number | null;
	birthDate?: string | Date | null;
	guardianName?: string | null;
	guardianPhone?: string | null;
	guardianRelationship?: string | null;
	preferredShift?: string | null;
}

export interface ClassroomResponse {
	id: string;
	code: string;
	clinicId: string;
	name: string;
	ageGroup?: string | null;
	category?: string | null;
	classification?: string | null;
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

export interface CreateClassroomInput {
	name: string;
	code?: string;
	ageGroup?: string | null;
	category: string;
	classification?: string | null;
	learningMode?: LearningMode;
	capacity: number;
	active?: boolean;
	notes?: string | null;
	staffIds?: string[];
	studentIds?: string[];
}

export interface UpdateClassroomInput extends Partial<CreateClassroomInput> {}
