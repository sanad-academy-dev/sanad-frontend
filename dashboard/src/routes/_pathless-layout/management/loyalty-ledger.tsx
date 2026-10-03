import { IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { FormFooter } from "@/components/common/form-footer";
import { FormHeader } from "@/components/common/form-header";
import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { useLoyaltySettings } from "@/features/loyalty/hooks/use-loyalty-settings";
import {
	type StatementQuery,
	useClinicLoyaltyStatement,
	useLoyaltyAdjustment,
} from "@/features/loyalty/hooks/use-loyalty-statement";
import {
	LEDGER_KIND_LABEL,
	LEDGER_SOURCE_LABEL,
} from "@/features/loyalty/utils/ledger-labels";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import { cn } from "@/lib/utils";

/**
 * [LY-P5] «حركة النقاط» (BRD §10.5) — كشفٌ عبر أولياء الأمور، وسطحُ الدعم الذي يجيب
 * «لماذا لهذا وليّ الأمر ٣٤٠ نقطة».
 *
 * **ومعه التسوية اليدوية** (BR-L9.2). المسار وشاشته يصلان معًا عمدًا: مسارٌ يمنح قيمةً
 * بلا سطحٍ يستدعيه هو إمّا مسارٌ ميت أو بابٌ يُفتح بـcurl — والتدقيق الآليّ يمنع الأوّل،
 * وحُسن التصميم يمنع الثاني.
 *
 * [UI] على عقد `/services/staff`: العنوان من مسار التخطيط، `Stats` من المحمَّل،
 * `TableToolbar` بالمرشِّحات في `leftExtra` والإجراء الأساسي في `actions`،
 * `TableDataView` بحالاته الثلاث، والمحرّر في لوحٍ جانبيّ.
 */
export const Route = createFileRoute("/_pathless-layout/management/loyalty-ledger")({
	component: LoyaltyLedgerRoute,
});

const KIND_FILTERS = [
	{ value: "", label: "كل الأنواع" },
	{ value: "EARN", label: "كسب" },
	{ value: "REDEEM", label: "استبدال" },
	{ value: "EXPIRY", label: "انتهاء" },
	{ value: "REVERSAL", label: "عكس" },
	{ value: "REDEMPTION_RESTORE", label: "ردّ نقاط" },
	{ value: "ADJUSTMENT", label: "تسوية" },
] as const;

function LoyaltyLedgerRoute() {
	const { settings } = useLoyaltySettings();
	const enabled = settings?.enableLoyaltyModule ?? false;
	const { hasPermission, isAdmin } = usePermissions();
	const canAdjust = isAdmin || hasPermission(PERMISSIONS.LOYALTY_SETTINGS_EDIT);

	const [kind, setKind] = useState<StatementQuery["kind"] | undefined>(undefined);
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [ownerIdInput, setOwnerIdInput] = useState("");
	const [pointsInput, setPointsInput] = useState("");
	const [reasonInput, setReasonInput] = useState("");

	const query = useMemo<StatementQuery>(
		() => ({ kind, ...(from ? { from } : {}), ...(to ? { to } : {}) }),
		[kind, from, to],
	);
	const { entries, isLoading } = useClinicLoyaltyStatement(enabled, query);
	const { adjust, isAdjusting } = useLoyaltyAdjustment();

	type Row = (typeof entries)[number];

	const stats = useMemo<StatItem[]>(() => {
		const granted = entries
			.filter((e) => e.kind === "EARN")
			.reduce((sum, e) => sum + e.points, 0);
		const redeemed = entries
			.filter((e) => e.kind === "REDEEM")
			.reduce((sum, e) => sum + Math.abs(e.points), 0);
		const adjusted = entries.filter((e) => e.kind === "ADJUSTMENT").length;
		return [
			{ title: "صفوف معروضة", value: entries.length, tooltip: "ضمن المرشِّحات الحالية" },
			{ title: "ممنوح", value: granted, tooltip: "مجموع نقاط الكسب في الصفوف المعروضة" },
			{ title: "مستبدَل", value: redeemed, tooltip: "مجموع ما أُنفق في الصفوف المعروضة" },
			{
				title: "تسويات يدوية",
				value: adjusted,
				tooltip: "كل تسوية تحمل سببًا إلزاميًّا وتظهر في كشف وليّ الأمر (BR-L9.2)",
			},
		];
	}, [entries]);

	const columns = useMemo<ColumnDef<Row>[]>(
		() => [
			{
				accessorKey: "earnedAt",
				header: "التاريخ",
				cell: ({ row }) => (
					<span className="tabular-nums">
						{new Date(row.original.earnedAt).toLocaleDateString("ar-EG")}
					</span>
				),
			},
			{
				id: "owner",
				header: "وليّ الأمر",
				cell: ({ row }) => (
					<span>
						{row.original.owner.name}{" "}
						<span className="text-muted-foreground text-xs">{row.original.owner.code}</span>
					</span>
				),
			},
			{
				accessorKey: "kind",
				header: "الحركة",
				cell: ({ row }) => LEDGER_KIND_LABEL[row.original.kind],
			},
			{
				accessorKey: "sourceType",
				header: "المصدر",
				cell: ({ row }) => LEDGER_SOURCE_LABEL[row.original.sourceType],
			},
			{
				accessorKey: "points",
				header: "النقاط",
				cell: ({ row }) => (
					<span
						className={cn(
							"font-semibold tabular-nums",
							row.original.points < 0 ? "text-destructive" : "text-chart-4",
						)}
					>
						{row.original.points > 0 ? "+" : ""}
						{row.original.points.toLocaleString("ar-EG")}
					</span>
				),
			},
			{
				accessorKey: "note",
				header: "الملاحظة",
				cell: ({ row }) => (
					<span className="text-muted-foreground text-xs">{row.original.note ?? "—"}</span>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data: entries,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const submitAdjustment = async () => {
		await adjust({
			ownerId: ownerIdInput.trim(),
			points: Number(pointsInput) || 0,
			reason: reasonInput,
		});
		setSheetOpen(false);
		setOwnerIdInput("");
		setPointsInput("");
		setReasonInput("");
	};

	return (
		<div
			className="flex flex-col gap-6 p-6"
			dir="rtl"
		>
			<Stats
				className="grid-cols-2 px-4 md:grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex flex-wrap items-end gap-2">
						<div className="flex flex-col gap-1">
							<Label
								className="text-xs"
								htmlFor="loyalty-ledger-kind"
							>
								النوع
							</Label>
							<select
								id="loyalty-ledger-kind"
								className="h-7 rounded-md border bg-background px-2 text-xs"
								value={kind ?? ""}
								onChange={(e) =>
									setKind((e.target.value || undefined) as StatementQuery["kind"])
								}
							>
								{KIND_FILTERS.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-1">
							<Label
								className="text-xs"
								htmlFor="loyalty-ledger-from"
							>
								من
							</Label>
							<Input
								id="loyalty-ledger-from"
								type="date"
								className="h-7 w-36 text-xs"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label
								className="text-xs"
								htmlFor="loyalty-ledger-to"
							>
								إلى
							</Label>
							<Input
								id="loyalty-ledger-to"
								type="date"
								className="h-7 w-36 text-xs"
								value={to}
								onChange={(e) => setTo(e.target.value)}
							/>
						</div>
					</div>
				}
				actions={
					canAdjust ? (
						<Button
							size="xs"
							onClick={() => setSheetOpen(true)}
							disabled={!enabled}
						>
							<IconPlus className="size-4" />
							تسوية يدوية
						</Button>
					) : null
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={enabled && isLoading}
				emptyState={
					enabled
						? {
								title: "لا حركة نقاط ضمن المرشِّحات",
								description: "وسّع المدى أو أزِل مرشِّح النوع — الكشف يعرض ما يطابق المرشِّحات وحده",
							}
						: {
								title: "وحدة الولاء غير مفعّلة",
								description: "فعّلها من شاشة «برنامج الولاء» ليبدأ الدفتر بالامتلاء",
							}
				}
			/>

			<Sheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			>
				<SheetContent
					className="w-full gap-0 p-0 sm:max-w-md"
					showCloseButton={false}
				>
					<FormHeader
						title="تسوية يدوية"
						onClose={() => setSheetOpen(false)}
					/>
					<div
						className="flex flex-col gap-4 overflow-y-auto px-4 py-4"
						dir="rtl"
					>
						<p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 text-xs leading-relaxed">
							التسوية تمنح أو تخصم قيمةً بلا مقابلٍ محصَّل. السبب إلزاميّ ويظهر في كشف وليّ الأمر كأيّ
							صفّ، والخصم لا يتجاوز الرصيد القابل للاستبدال.
						</p>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="loyalty-adjust-owner">معرّف وليّ الأمر</Label>
							<Input
								id="loyalty-adjust-owner"
								value={ownerIdInput}
								onChange={(e) => setOwnerIdInput(e.target.value)}
								disabled={isAdjusting}
								placeholder="انسخه من ملفّ وليّ الأمر"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="loyalty-adjust-points">النقاط (سالب للخصم)</Label>
							<Input
								id="loyalty-adjust-points"
								type="number"
								step={1}
								value={pointsInput}
								onChange={(e) => setPointsInput(e.target.value)}
								disabled={isAdjusting}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="loyalty-adjust-reason">السبب</Label>
							<Textarea
								id="loyalty-adjust-reason"
								rows={3}
								value={reasonInput}
								onChange={(e) => setReasonInput(e.target.value)}
								disabled={isAdjusting}
								placeholder="مثال: تعويض عن حادثة دعم رقم ١٢٣"
							/>
						</div>
					</div>
					<FormFooter
						className="mt-auto"
						disabled={isAdjusting}
					>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setSheetOpen(false)}
							disabled={isAdjusting}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							onClick={() => void submitAdjustment()}
							disabled={isAdjusting}
						>
							تسجيل التسوية
						</Button>
					</FormFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
