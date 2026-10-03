import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

const DEFAULT_PAGE_SIZE_OPTIONS = [15, 20, 50, 100];
// عدد أزرار الأرقام المعروضة قبل ظهور "…"
const ITEMS_TO_DISPLAY = 5;

interface TablePaginationProps {
	/** الصفحة الحالية بعد التقييد (0-based) */
	page: number;
	pageCount: number;
	totalRows: number;
	/** رقم أول صف معروض و آخره (1-based) */
	fromRow: number;
	toRow: number;
	onPageChange: (index: number) => void;
	/** محدّد عدد الصفوف — يظهر افتراضيًا؛ مرّر showPageSize={false} لإخفائه (صفحة ثابتة الحجم) */
	pageSize?: number;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	showPageSize?: boolean;
}

// زر تنقّل مربّع مع حالة معطّلة
function PageButton({
	children,
	disabled,
	onClick,
	"aria-label": ariaLabel,
}: {
	children: ReactNode;
	disabled?: boolean;
	onClick: () => void;
	"aria-label": string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			className="flex size-6 items-center justify-center rounded-[4px] border-[0.75px] border-border text-foreground disabled:opacity-30"
		>
			{children}
		</button>
	);
}

// فاصل "…" غير تفاعلي بين نوافذ أرقام الصفحات
function Ellipsis() {
	return (
		<span className="flex size-6 items-center justify-center text-[12px] text-muted-foreground">
			…
		</span>
	);
}

// ترقيم صفحات موحّد لكل جداول/قوائم العرض — أزرار التنقّل (يسار) + عدّاد الصفوف/الإجمالي (يمين)
export function TablePagination({
	page,
	pageCount,
	totalRows,
	fromRow,
	toRow,
	onPageChange,
	pageSize,
	onPageSizeChange,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	showPageSize = true,
}: TablePaginationProps) {
	// نافذة أرقام الصفحات مع "…" عند تجاوز العدد المعروض — تتفادى صفّ أزرار ضخم.
	// قبل أي خروج مبكّر: عدد الصفحات يتغيّر مع البحث والتصفية، فلو جاء الخطّاف بعد
	// `return null` لاختلف ترتيب الخطّافات بين رسمة وأخرى.
	const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
		currentPage: page + 1,
		totalPages: pageCount,
		paginationItemsToDisplay: ITEMS_TO_DISPLAY,
	});

	// لا نعرض الترقيم إلا عند وجود صفحتين فأكثر (عناصر تكفي لأكثر من صفحة)
	if (pageCount <= 1) return null;

	const showSelect = showPageSize && pageSize != null && onPageSizeChange != null;
	// نضمن ظهور حجم الصفحة الحالي ضمن الخيارات (بعض الجداول تبدأ بـ 10 مثلًا)
	const options =
		pageSize != null && !pageSizeOptions.includes(pageSize)
			? [...pageSizeOptions, pageSize].sort((a, b) => a - b)
			: pageSizeOptions;

	return (
		<div className="flex flex-row-reverse flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5">
			{/* أزرار التنقّل (يسار) */}
			<div
				dir="ltr"
				className="flex items-center gap-[3px]"
			>
				<PageButton
					onClick={() => onPageChange(0)}
					disabled={page === 0}
					aria-label="الصفحة الأولى"
				>
					<IconChevronsLeft className="size-3.5" />
				</PageButton>
				<PageButton
					onClick={() => onPageChange(Math.max(0, page - 1))}
					disabled={page === 0}
					aria-label="السابق"
				>
					<IconChevronLeft className="size-3.5" />
				</PageButton>

				{showLeftEllipsis && <Ellipsis />}
				{pages.map((p) => (
					<button
						key={p}
						type="button"
						onClick={() => onPageChange(p - 1)}
						className={cn(
							"flex size-6 items-center justify-center rounded-[4px] text-[12px] font-medium tabular-nums",
							p - 1 === page
								? "bg-primary text-white"
								: "border-[0.75px] border-border text-foreground",
						)}
					>
						{p}
					</button>
				))}
				{showRightEllipsis && <Ellipsis />}

				<PageButton
					onClick={() => onPageChange(Math.min(pageCount - 1, page + 1))}
					disabled={page >= pageCount - 1}
					aria-label="التالي"
				>
					<IconChevronRight className="size-3.5" />
				</PageButton>
				<PageButton
					onClick={() => onPageChange(pageCount - 1)}
					disabled={page >= pageCount - 1}
					aria-label="الصفحة الأخيرة"
				>
					<IconChevronsRight className="size-3.5" />
				</PageButton>
			</div>

			{/* عدد الصفوف + الإجمالي (يمين) */}
			<div className="flex flex-row-reverse items-center gap-[9px]">
				{showSelect && (
					<div className="flex flex-row-reverse items-center gap-[3px]">
						<Select
							value={String(pageSize)}
							onValueChange={(v) => {
								onPageSizeChange?.(Number(v));
								onPageChange(0);
							}}
							dir="rtl"
						>
							<SelectTrigger className="max-h-6 w-[55px] text-[12px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{options.map((n) => (
									<SelectItem
										key={n}
										value={String(n)}
									>
										{n}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<span className="text-[12px] text-muted-foreground">صفوف:</span>
					</div>
				)}
				<span className="text-[12px] text-muted-foreground tabular-nums">
					{fromRow} – {toRow} من أصل {totalRows}
				</span>
			</div>
		</div>
	);
}
