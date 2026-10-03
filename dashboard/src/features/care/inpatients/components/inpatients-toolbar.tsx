import { TableToolbar } from "@/components/common/table-toolbar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ACUITY_META, STAY_KIND_META } from "@/features/care/inpatients/data/inpatients-data";
import { useI18n } from "@/hooks/use-i18n";

/**
 * شريط أدوات شاشة التنويم — بحث وفلاتر وزرّ الإدخال.
 *
 * مبنيّ على `TableToolbar` المشترك لا على حقول مرصوفة يدويًّا: البحث بالأيقونة في
 * بدايته والاختصار في نهايته، والأزرار القياسية بمقاسها المعتاد. شاشةٌ ترصف
 * أدواتها بنفسها تبدو غريبة عن شقيقاتها ولو تطابق كل زرّ فيها.
 *
 * مشترك بين اللوحة والخريطة لا مكرَّر فيهما — فلترٌ يُضاف هنا يظهر في الاثنين.
 */

export const INPATIENT_VIEW_LABELS: Record<string, string> = {
	active: "القائمة الآن",
	discharged: "الخارجون",
	all: "كل الإقامات",
};

export function InpatientsToolbar({
	className,
	search,
	onSearchChange,
	view,
	onViewChange,
	kind,
	onKindChange,
	acuity,
	onAcuityChange,
	actions,
}: {
	className?: string;
	search: string;
	onSearchChange: (value: string) => void;
	view: string;
	onViewChange: (value: string) => void;
	kind: string;
	onKindChange: (value: string) => void;
	acuity: string;
	onAcuityChange: (value: string) => void;
	actions?: React.ReactNode;
}) {
	const { isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";

	return (
		<TableToolbar
			className={className}
			searchValue={search}
			onSearchChange={onSearchChange}
			searchPlaceholder="ابحث برمز الإقامة أو الطفل أو وليّ الأمر..."
			// الفلاتر هنا صريحة في الشريط، فزرّ التصفية العامّ يزدوج معها
			showFilter={false}
			leftExtra={
				<div className="flex items-center gap-2">
					<Select
						value={view}
						onValueChange={onViewChange}
					>
						<SelectTrigger
							size="sm"
							className="w-32"
						>
							<SelectValue />
						</SelectTrigger>
						{/* position="popper" إلزامي — الافتراضي يخرج عن الشاشة في RTL */}
						<SelectContent
							position="popper"
							dir={dir}
						>
							{Object.entries(INPATIENT_VIEW_LABELS).map(([value, label]) => (
								<SelectItem
									key={value}
									value={value}
								>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={kind}
						onValueChange={onKindChange}
					>
						<SelectTrigger
							size="sm"
							className="w-32"
						>
							<SelectValue placeholder="كل الأنواع" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir={dir}
						>
							<SelectItem value="ALL">كل الأنواع</SelectItem>
							{Object.entries(STAY_KIND_META)
								// الإقامة الفندقية خارج هذا الإصدار (القرار D2)
								.filter(([value]) => value !== "BOARDING")
								.map(([value, meta]) => (
									<SelectItem
										key={value}
										value={value}
									>
										{meta.label}
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					<Select
						value={acuity}
						onValueChange={onAcuityChange}
					>
						<SelectTrigger
							size="sm"
							className="w-32"
						>
							<SelectValue placeholder="كل الدرجات" />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir={dir}
						>
							<SelectItem value="ALL">كل الدرجات</SelectItem>
							{Object.entries(ACUITY_META).map(([value, meta]) => (
								<SelectItem
									key={value}
									value={value}
								>
									{meta.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			}
			actions={actions}
		/>
	);
}
