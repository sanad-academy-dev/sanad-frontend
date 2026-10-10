import {
	IconBolt,
	IconDownload,
	IconFilter,
	IconLayoutGrid,
	IconQuestionMark,
	IconSearch,
} from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TableToolbarProps {
	/** يُضاف على الحاوية الخارجية (مثل border-t للفصل عمّا فوقه) */
	className?: string;
	/** قيمة البحث ومُعالجها — اتركهما فارغين لحقل بحث ثابت (غير موصول بعد) */
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	searchPlaceholder?: string;
	searchClassName?: string;
	/** مقاس الأزرار القياسية — "xs" ليطابق ارتفاع قوائم التصفية/العرض (h-6) */
	buttonSize?: ComponentProps<typeof Button>["size"];
	/** حقل البحث يظهر افتراضيًا؛ أخفِه في شاشة تصفيتها من الخادم — حقل يصفّي المحمّل وحده يكذب */
	showSearch?: boolean;
	/** الأزرار القياسية تظهر افتراضيًا؛ أخفِ زرًّا عندما يوجد بديل وظيفي له داخل leftExtra */
	showFilter?: boolean;
	showHelp?: boolean;
	showExport?: boolean;
	showView?: boolean;
	/** عناصر تحكّم فريدة تُضاف للمجموعة اليسرى بعد الأزرار القياسية (تبويبات، مُنقّل تواريخ، فلاتر) */
	leftExtra?: ReactNode;
	/** المجموعة اليمنى — أزرار أيقونات ثانوية + زر الإضافة الأساسي */
	actions?: ReactNode;
}

// شريط أدوات موحّد لجداول العرض — بحث (يسار) + أزرار قياسية + إجراءات (يمين)
export function TableToolbar({
	className,
	searchValue,
	onSearchChange,
	searchPlaceholder = "ابحث...",
	searchClassName = "w-64",
	buttonSize = "sm",
	showSearch = true,
	showFilter = true,
	showHelp = true,
	showExport = true,
	showView = true,
	leftExtra,
	actions,
}: TableToolbarProps) {
	return (
		<div className={cn("flex items-center justify-between gap-3 px-4 py-2", className)}>
			<div className="flex flex-wrap items-center gap-2">
				{showSearch && (
					<>
						{/* أيقونة البحث في بداية الحقل (يمينه في RTL) والاختصار في نهايته — كبقية حقول البحث */}
						<InputGroup className={searchClassName}>
							<InputGroupAddon align="inline-start">
								<IconSearch />
							</InputGroupAddon>
							<InputGroupInput
								placeholder={searchPlaceholder}
								value={searchValue}
								onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
							/>
							<InputGroupAddon align="inline-end">
								<Kbd className="bg-primary/10 text-primary">/</Kbd>
								<IconBolt className="text-primary" />
							</InputGroupAddon>
						</InputGroup>

						<Separator
							orientation="vertical"
							className="my-auto h-5"
						/>
					</>
				)}

				{showFilter && (
					<Button
						size={buttonSize}
						variant="outline"
					>
						<IconFilter />
						فلترة
					</Button>
				)}
				{showHelp && (
					<Button
						size={buttonSize}
						variant="outline"
					>
						<IconQuestionMark />
						نساعدك
					</Button>
				)}
				{showExport && (
					<Button
						size={buttonSize}
						variant="outline"
					>
						<IconDownload />
						تصدير
					</Button>
				)}
				{showView && (
					<Button
						size={buttonSize}
						variant="outline"
					>
						<IconLayoutGrid />
						العرض
					</Button>
				)}

				{leftExtra}
			</div>

			<div className="flex items-center gap-2">{actions}</div>
		</div>
	);
}
