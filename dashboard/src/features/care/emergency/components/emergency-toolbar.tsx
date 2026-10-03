import type { ReactNode } from "react";

import { TableToolbar } from "@/components/common/table-toolbar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { TRIAGE_CATEGORY_LABELS } from "@sanad/contracts/runtime/server/emergency/emergency.rules";

/**
 * شريط أدوات شاشة الطوارئ — بحث وفلاتر وزرّ تسجيل الوصول.
 *
 * مبنيّ على `TableToolbar` المشترك لا على حقول مرصوفة يدويًّا: البحث بالأيقونة في
 * بدايته والاختصار في نهايته، والأزرار القياسية بمقاسها المعتاد. شاشةٌ ترصف
 * أدواتها بنفسها تبدو غريبة عن شقيقاتها ولو تطابق كل زرّ فيها.
 *
 * مشترك بين التبويبات الثلاثة لا مكرَّر فيها — فلترٌ يُضاف هنا يظهر في كلّها.
 */

export const EMERGENCY_CATEGORY_FILTER = "ALL";

export function EmergencyToolbar({
	className,
	search,
	onSearchChange,
	category,
	onCategoryChange,
	actions,
}: {
	className?: string;
	search: string;
	onSearchChange: (value: string) => void;
	category: string;
	onCategoryChange: (value: string) => void;
	actions?: ReactNode;
}) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	return (
		<TableToolbar
			className={className}
			searchValue={search}
			onSearchChange={onSearchChange}
			searchPlaceholder="ابحث باسم الطفل أو وليّ الأمر أو سبب الحضور..."
			// الفلتر صريح في الشريط، فزرّ التصفية العامّ يزدوج معه
			showFilter={false}
			leftExtra={
				<Select
					value={category}
					onValueChange={onCategoryChange}
				>
					<SelectTrigger
						size="sm"
						className="w-36"
					>
						<SelectValue placeholder="كل الألوان" />
					</SelectTrigger>
					{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
					<SelectContent
						position="popper"
						dir={dir}
					>
						<SelectItem value={EMERGENCY_CATEGORY_FILTER}>كل الألوان</SelectItem>
						{Object.entries(TRIAGE_CATEGORY_LABELS).map(([value, label]) => (
							<SelectItem
								key={value}
								value={value}
							>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			}
			actions={actions}
		/>
	);
}
