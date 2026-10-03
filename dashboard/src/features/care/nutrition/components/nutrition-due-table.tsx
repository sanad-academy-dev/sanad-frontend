import { IconBrandWhatsapp, IconScaleOutline } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { LuCarrot } from "react-icons/lu";

import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GOAL_LABELS, type NutritionDueRow } from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

/** مدى الاستباق — الافتراضي ٣٠ يومًا ليغطّي دورة المراجعة (١٤ يومًا) لا ليقصر عنها */
const HORIZON_OPTIONS = [
	{ value: "7", label: "خلال أسبوع" },
	{ value: "14", label: "خلال أسبوعين" },
	{ value: "30", label: "خلال شهر" },
	{ value: "90", label: "خلال ٣ أشهر" },
	{ value: "0", label: "كل المتابعات" },
] as const;

/** التأخّر يُقرأ قبل التاريخ — لذلك يُصاغ نصًّا لا رقمًا مجرّدًا */
const dueLabel = (days: number | null) => {
	if (days === null) return { text: "—", tone: "outline" as const };
	if (days < 0) return { text: `متأخّرة ${Math.abs(days)} يومًا`, tone: "destructive" as const };
	if (days === 0) return { text: "اليوم", tone: "default" as const };
	return { text: `بعد ${days} يومًا`, tone: "secondary" as const };
};

/** التقدّم نحو الهدف — النسبة المقطوعة من المسافة الأصلية */
const progressPercent = (row: NutritionDueRow): number | null => {
	if (!row.idealWeightKg) return null;
	const total = row.currentWeightKg - row.idealWeightKg;
	if (Math.abs(total) < 0.01) return 100;
	const done = row.currentWeightKg - row.lastWeightKg;
	return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
};

export function NutritionDueTable({
	rows,
	isLoading,
	isError,
	clinicName,
	search,
	onSearchChange,
	onRecheck,
	onOpenPlan,
	horizon,
	onHorizonChange,
	activePlanCount,
}: {
	rows: NutritionDueRow[];
	isLoading: boolean;
	isError?: boolean;
	clinicName: string;
	search: string;
	onSearchChange: (value: string) => void;
	onRecheck: (planId: string) => void;
	onOpenPlan: (planId: string) => void;
	horizon: string;
	onHorizonChange: (value: string) => void;
	/** عدد الخطط السارية — يفصل «لا خطط بعد» عن «لا شيء مستحقّ ضمن المدى» */
	activePlanCount: number;
}) {
	const columns = useMemo<ColumnDef<NutritionDueRow>[]>(
		() => [
			{
				accessorKey: "patientName",
				header: "الطفل",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate font-medium">{row.original.patientName}</span>
						<span className="truncate text-xs tabular-nums text-muted-foreground">
							{row.original.patientCode} · {row.original.animalTypeName}
						</span>
					</div>
				),
			},
			{
				accessorKey: "ownerName",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<div className="flex min-w-0 flex-col">
						<span className="truncate">{row.original.ownerName ?? "—"}</span>
						{row.original.ownerPhone && (
							// الهاتف معرّف رقمي لا نص عربي — عزله يمنع انعكاس ترتيب خاناته
							<span
								dir="ltr"
								className="truncate text-start text-xs tabular-nums text-muted-foreground"
							>
								{row.original.ownerPhone}
							</span>
						)}
					</div>
				),
			},
			{
				accessorKey: "goal",
				header: "الهدف",
				cell: ({ row }) => <Badge variant="outline">{GOAL_LABELS[row.original.goal]}</Badge>,
			},
			{
				id: "weight",
				header: "الوزن",
				cell: ({ row }) => {
					const percent = progressPercent(row.original);
					return (
						<div className="flex min-w-0 flex-col tabular-nums">
							<span>
								{row.original.lastWeightKg} كجم
								{row.original.idealWeightKg && (
									<span className="text-muted-foreground">
										{" "}
										← {row.original.idealWeightKg}
									</span>
								)}
							</span>
							{percent !== null && (
								<span className="text-xs text-muted-foreground">أُنجز {percent}٪</span>
							)}
						</div>
					);
				},
			},
			{
				accessorKey: "derKcal",
				header: "سعرات اليوم",
				cell: ({ row }) => (
					<span className="tabular-nums">{Math.round(row.original.derKcal)}</span>
				),
			},
			{
				accessorKey: "nextRecheckAt",
				header: "موعد المراجعة",
				cell: ({ row }) => {
					const due = dueLabel(row.original.daysUntil);
					return (
						<div className="flex min-w-0 flex-col gap-0.5">
							<Badge variant={due.tone}>{due.text}</Badge>
							{row.original.nextRecheckAt && (
								<span className="text-xs tabular-nums text-muted-foreground">
									{dateFmt.format(new Date(row.original.nextRecheckAt))}
								</span>
							)}
						</div>
					);
				},
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
					<div className="flex items-center justify-end gap-1">
						{row.original.ownerPhone && (
							<Button
								variant="ghost"
								size="icon-sm"
								title="تذكير عبر واتساب"
								onClick={(e) => {
									e.stopPropagation();
									const text = encodeURIComponent(
										`مرحبًا، من ${clinicName}: حان موعد مراجعة وزن ${row.original.patientName} ضمن خطة التغذية. نرجو تحديد موعد.`,
									);
									const phone = row.original.ownerPhone?.replace(/\D/g, "");
									window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
								}}
							>
								<IconBrandWhatsapp className="size-4" />
							</Button>
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								onRecheck(row.original.planId);
							}}
						>
							<IconScaleOutline className="size-4" />
							تسجيل وزن
						</Button>
					</div>
				),
			},
		],
		[clinicName, onRecheck],
	);

	const table = useReactTable({
		data: rows,
		columns,
		state: { globalFilter: search },
		onGlobalFilterChange: (updater) =>
			onSearchChange(typeof updater === "function" ? updater(search) : String(updater)),
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	// الحالة الفارغة تقول الحقيقة: «لا خطط سارية» شيء، و«لا شيء مستحقّ ضمن المدى»
	// شيء آخر. الرسالة القديمة كانت تؤكّد أن الخطط كلها ضمن جلساتها حتى حين لا
	// توجد خطة أصلًا — نصّ يطمئن على ما لا وجود له.
	const emptyState = isError
		? {
				title: "تعذّر جلب المراجعات",
				description: "حاول تحديث الصفحة",
				icon: <LuCarrot className="size-10 text-[#9CA3AF]" />,
			}
		: activePlanCount === 0
			? {
					title: "لا خطط تغذية سارية",
					description:
						"المتابعات تظهر هنا بعد تفعيل خطة — ابدأ من تبويب «الخطط» أو من ملف الطفل",
					icon: <LuCarrot className="size-10 text-[#9CA3AF]" />,
				}
			: {
					title: "لا متابعة ضمن هذا المدى",
					description: `${activePlanCount} خطة سارية، ولا موعد منها خلال المدى المحدَّد — وسّع المدى لعرض الأبعد`,
					icon: <LuCarrot className="size-10 text-[#9CA3AF]" />,
				};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={onSearchChange}
				searchPlaceholder="ابحث باسم الطفل أو وليّ الأمر..."
				leftExtra={
					<Select
						value={horizon}
						onValueChange={onHorizonChange}
					>
						<SelectTrigger
							size="sm"
							className="w-40"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							dir="rtl"
						>
							{HORIZON_OPTIONS.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
			/>
			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				onRowClick={(row) => onOpenPlan(row.original.planId)}
				emptyState={emptyState}
			/>
		</div>
	);
}
