import type {
	SpecializationCategoryResponse,
	SpecializationSubcategoryResponse,
} from "@/server/specializations/specializations.type";

export interface SpecializationDraft {
	name: string;
	description: string;
}

export interface SubcategoryRowProps {
	sub: SpecializationSubcategoryResponse;
	maxUsage: number;
}

export interface CategoryRowProps {
	category: SpecializationCategoryResponse;
	isOpen: boolean;
	onOpenChange: (id: string) => void;
	subAddToken?: number;
	maxUsage: number;
}

export interface CategoryAddRowProps {
	addToken: number;
	onAdded?: () => void;
}
