import { IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	GROOMING_PERIODS,
	GROOMING_VIEWS,
	type GroomingPeriod,
	type GroomingView,
} from "@sanad/contracts/runtime/server/grooming/grooming.type";

export const GROOMING_PERIOD_LABELS: Record<GroomingPeriod, string> = {
	today: "اليوم",
	week: "هذا الأسبوع",
	all: "كل الفترات",
};

export const GROOMING_VIEW_LABELS: Record<GroomingView, string> = {
	all: "كل الجلسات",
	mine: "جلساتي",
	attention: "تحتاج انتباهًا",
};

/**
 * شريط أدوات شاشة التجميل — بحث وفترة وعرض وزرّ الإنشاء.
 *
 * مشترك بين اللوحة والجدول لا مكرَّر فيهما. اللوحة كانت تُرشَّح بنفس هذه المعايير
 * (`useGroomingBoard({ period, view, q })`) لكن بلا أي عنصر تحكّم يغيّرها: من فتح
 * الشاشة على اللوحة كان يرى «اليوم / كل الجلسات» ولا سبيل له إلى غيرها إلا بالمرور
 * على تبويب الجلسات ثم العودة. الشريط واحد كي لا ينحرف التبويبان: فلترٌ يُضاف هنا
 * يظهر في الاثنين، وترتيبٌ يتغيّر لا يصير مختلفًا بين تبويبين لنفس البيانات.
 */
export function GroomingToolbar({
	className,
	search,
	onSearchChange,
	period,
	onPeriodChange,
	view,
	onViewChange,
	onCreate,
}: {
	className?: string;
	search: string;
	onSearchChange: (value: string) => void;
	period: GroomingPeriod;
	onPeriodChange: (value: GroomingPeriod) => void;
	view: GroomingView;
	onViewChange: (value: GroomingView) => void;
	onCreate: () => void;
}) {
	return (
		<TableToolbar
			className={className}
			searchValue={search}
			onSearchChange={onSearchChange}
			searchPlaceholder="ابحث بالكود أو الطفل أو وليّ الأمر..."
			leftExtra={
				<div className="flex items-center gap-2">
					<Select
						value={period}
						onValueChange={(v) => onPeriodChange(v as GroomingPeriod)}
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
							dir="rtl"
						>
							{GROOMING_PERIODS.map((p) => (
								<SelectItem
									key={p}
									value={p}
								>
									{GROOMING_PERIOD_LABELS[p]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={view}
						onValueChange={(v) => onViewChange(v as GroomingView)}
					>
						<SelectTrigger
							size="sm"
							className="w-36"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{GROOMING_VIEWS.map((v) => (
								<SelectItem
									key={v}
									value={v}
								>
									{GROOMING_VIEW_LABELS[v]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			}
			actions={
				<Button
					size="sm"
					onClick={onCreate}
				>
					<IconPlus className="size-4" />
					جلسة تجميل
				</Button>
			}
		/>
	);
}
