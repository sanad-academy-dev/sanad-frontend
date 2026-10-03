import {
	IconCircleCheck,
	IconCircleX,
	IconDotsVertical,
	IconDownload,
	IconEye,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExpenseMiniStepper } from "@/features/finance/expenses/components/expense-mini-stepper";
import {
	EXPENSE_CARD_STATUS_META,
	type ExpenseCardAction,
	type ExpenseRecord,
} from "@/features/finance/expenses/data/expense-records";
import { cn } from "@/lib/utils";

// نقطة لون الحالة داخل الجدول
const STATUS_DOT: Record<string, string> = {
	"pending-review": "bg-amber-500",
	"under-review": "bg-blue-500",
	draft: "bg-muted-foreground",
	approved: "bg-emerald-500",
	rejected: "bg-rose-500",
};

function RowActionChip({
	action,
	onClick,
}: {
	action: ExpenseCardAction;
	onClick: () => void;
}) {
	const isReject = action.kind === "reject";
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-medium transition-colors",
				isReject ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50",
			)}
		>
			{action.label}
			{isReject ? (
				<IconCircleX className="size-3.5" />
			) : (
				<IconCircleCheck className="size-3.5" />
			)}
		</button>
	);
}

const HEADERS = [
	"اسم المصروف / المصروف",
	"مقدم الطلب",
	"الفئة",
	"القسم",
	"الفرع",
	"المبلغ",
	"الحالة",
	"المسار",
	"التاريخ",
	"الإجراءات",
];

export function ExpensesList({
	records,
	onOpen,
	onDelete,
	onAction,
	onOpenRejection,
}: {
	records: ExpenseRecord[];
	onOpen: (id: string) => void;
	onDelete?: (id: string) => void;
	/** اتخاذ قرار (اعتماد/رفض) مباشرة من الصف دون فتح اللوحة */
	onAction?: (id: string, kind: ExpenseCardAction["kind"]) => void;
	/** فتح ملخّص الرفض عند النقر على حالة "مرفوض" */
	onOpenRejection?: (id: string) => void;
}) {
	return (
		<div
			className="flex-1 overflow-auto  pb-4"
			dir="rtl"
		>
			<table className="w-full min-w-[1100px] border-collapse text-right text-[12px]">
				<thead>
					<tr className="border-b text-[11px] text-muted-foreground">
						<th className="w-8 px-2 py-3">
							<Checkbox />
						</th>
						{HEADERS.map((h) => (
							<th
								key={h}
								className="px-3 py-3 font-medium whitespace-nowrap"
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{records.map((record) => {
						const status = EXPENSE_CARD_STATUS_META[record.status];
						return (
							<tr
								key={record.id}
								onClick={() => onOpen(record.id)}
								className="cursor-pointer border-b hover:bg-muted/40"
							>
								{/* checkbox — يوقف انتشار النقر حتى لا يفتح الصف اللوحة */}
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ العناصر الداخلية قابلة للوصول بلوحة المفاتيح */}
								<td
									className="px-2 py-2"
									onClick={(e) => e.stopPropagation()}
								>
									<Checkbox />
								</td>
								{/* اسم المصروف / المصروف */}
								<td className="px-3 py-2">
									<p className="font-semibold text-foreground">{record.title}</p>
									<div className="flex items-center gap-1.5">
										<p className="text-[10px] text-muted-foreground">{record.code}</p>
										{record.sourceLabel && (
											<span className="rounded-[4px] bg-indigo-50 px-1.5 py-px text-[9px] font-medium text-indigo-600">
												{record.sourceLabel}
											</span>
										)}
									</div>
								</td>
								{/* مقدم الطلب */}
								<td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
									{record.requesterName}
								</td>
								{/* الفئة */}
								<td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
									{record.categoryLabel}
								</td>
								{/* القسم */}
								<td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
									{record.departmentLabel}
								</td>
								{/* الفرع */}
								<td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
									{record.branchLabel}
								</td>
								{/* المبلغ */}
								<td className="px-3 py-2 whitespace-nowrap font-medium text-foreground">
									{record.amountLabel}
								</td>
								{/* الحالة — عند "مرفوض" يصبح زراً يفتح ملخّص الرفض */}
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ الزر الداخلي قابل للوصول بلوحة المفاتيح */}
								<td
									className="px-3 py-2"
									onClick={(e) => {
										if (record.status === "rejected") e.stopPropagation();
									}}
								>
									{record.status === "rejected" && onOpenRejection ? (
										<button
											type="button"
											onClick={() => onOpenRejection(record.id)}
											className={cn(
												"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap transition-opacity hover:opacity-80",
												status.className,
											)}
										>
											<span className="size-1.5 rounded-full bg-rose-500" />
											{status.label}
										</button>
									) : (
										<span
											className={cn(
												"inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
												status.className,
											)}
										>
											<span
												className={cn(
													"size-1.5 rounded-full",
													STATUS_DOT[record.status] ?? "bg-current",
												)}
											/>
											{status.label}
										</span>
									)}
								</td>
								{/* المسار — من اليمين (إرسال) إلى اليسار (الدفع): نعكس الترتيب لأن الخلية RTL */}
								<td className="px-3 py-2">
									<div className="w-[150px]">
										<ExpenseMiniStepper
											steps={[...record.steps].reverse()}
											showLabels={false}
											rejected={record.rawStatus === "REJECTED"}
										/>
									</div>
								</td>
								{/* التاريخ */}
								<td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
									{record.dateLabel}
								</td>
								{/* الإجراءات */}
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ الأزرار الداخلية قابلة للوصول بلوحة المفاتيح */}
								<td
									className="px-3 py-2"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="flex items-center gap-1">
										{/* عكس الترتيب: في تدفّق RTL أول عنصر يمين، فيظهر اعتماد على اليمين */}
										{[...record.actions].reverse().map((action) => (
											<RowActionChip
												key={action.kind}
												action={action}
												onClick={() =>
													onAction ? onAction(record.id, action.kind) : onOpen(record.id)
												}
											/>
										))}
										<DropdownMenu dir="rtl">
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
												>
													<IconDotsVertical className="size-4" />
													<span className="sr-only">خيارات</span>
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="start">
												<DropdownMenuItem onClick={() => onOpen(record.id)}>
													<IconEye className="size-4" />
													عرض
												</DropdownMenuItem>
												{/* المُرحَّل تلقائيًا لا يُعدَّل — الخادم يرفضه، فلا نعرض الخيار */}
												{!record.isPosted && (
													<DropdownMenuItem onClick={() => onOpen(record.id)}>
														<IconPencil className="size-4" />
														تعديل
													</DropdownMenuItem>
												)}
												<DropdownMenuItem>
													<IconDownload className="size-4" />
													تنزيل
												</DropdownMenuItem>
												{/* الحذف/الإلغاء غير متاح للمُرحَّل من موديول آخر ولا للسجلات المنتهية.
												    [P12A-fix5] «تم الصرف» عاد متاحًا — كإلغاء لا كحذف (destructiveMode):
												    المصروف المدفوع هو بالضبط ما يرحّله محول C3، وإخفاء الإجراء تركه
												    بلا أي طريق للعكس من الشاشة. */}
												{onDelete &&
													!record.isPosted &&
													record.rawStatus !== "REJECTED" &&
													record.rawStatus !== "CANCELED" && (
														<>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																variant="destructive"
																onClick={() => onDelete(record.id)}
															>
																<IconTrash className="size-4" />
																{record.rawStatus === "DRAFT"
																	? "حذف الطلب"
																	: record.rawStatus === "PAID"
																		? "إلغاء المصروف وعكس القيد"
																		: "إلغاء الطلب"}
															</DropdownMenuItem>
														</>
													)}
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
