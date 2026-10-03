import type {
	ServiceCategoryResponse,
	ServiceItemResponse,
	ServiceSubcategoryResponse,
} from "@/server/services/services.type";

export type TableVariant = "full" | "two-level";

/**
 * أي فئات الشجرة تُعرض. فئات «التحاليل» و«الأشعة» و«العمليات الجراحية» لها
 * صفحاتها الخاصة في إعدادات الفرع، فصفحة الدورات تستبعدها وكل صفحة قسم تعرض
 * فئتها وحدها.
 */
export type TableScope = "all" | "lab" | "radiology" | "operations" | "non-lab" | "grooming";

export interface TableConfig {
	variant: TableVariant;
	cols: string;
}

export interface ServicesTableProps {
	variant?: TableVariant;
	scope?: TableScope;
}

export interface ServiceItemDraft {
	name: string;
	price: string;
	duration: string;
	isActive: boolean;
}

export interface ItemRowProps {
	item: ServiceItemResponse;
	/** دورة ضمن فئة "التحاليل" — تعرض زر إدارة المُحلِّلات */
	isLab?: boolean;
	/** دورة ضمن فئة "الأشعة" — تعرض زر تعريف الفحص */
	isRadiology?: boolean;
	/** دورة ضمن فئة "العمليات الجراحية" — تعرض زر تعريف الإجراء */
	isOperation?: boolean;
}

export interface SubcategoryRowProps {
	sub: ServiceSubcategoryResponse;
	isOpen: boolean;
	onOpenChange: (id: string) => void;
	itemAddToken?: number;
	forceOpen?: boolean;
	isLab?: boolean;
	isRadiology?: boolean;
	isOperation?: boolean;
}

export interface CategoryRowProps {
	category: ServiceCategoryResponse;
	isOpen: boolean;
	onOpenChange: (id: string) => void;
	openSubId: string | null;
	onSubOpenChange: (id: string) => void;
	itemAddToken?: number;
	forceOpen?: boolean;
}

export interface CategoryAddRowProps {
	addToken: number;
	onAdded?: () => void;
}
