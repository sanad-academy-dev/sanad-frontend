export interface AcademicStageItem {
	id: string;
	name: string;
	description: string;
	classroomsCount: number;
	usageCount: number;
	isActive: boolean;
	createdAt?: string;
	isDefault?: boolean;
}

export interface StageDraft {
	name: string;
	description: string;
}

