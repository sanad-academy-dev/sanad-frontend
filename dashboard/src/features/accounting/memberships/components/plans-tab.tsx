import { IconDots, IconPencil, IconPlus, IconToggleLeft } from "@tabler/icons-react";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabIntro } from "@/features/accounting/extended/components/extended-shared";
import { PlanSheet } from "@/features/accounting/memberships/components/plan-sheet";
import {
	useMembershipPlans,
	useSetMembershipPlanStatus,
} from "@/features/accounting/memberships/hooks/use-memberships";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { MembershipPlanResponse } from "@/server/accounting/membership/membership-plan.type";

/**
 * [MI-P1] Tab «الخطط» (FR-M4.1). No delete anywhere (P1-Q4): retirement = «تعطيل»,
 * which stops selling and touches no existing membership.
 *
 * [UI] On the `/services/staff` contract. The two per-row buttons become the standard
 * `IconDots` dropdown; «تعطيل» is NOT styled destructive because it is reversible and
 * deletes nothing — the reference reserves `text-destructive` for real deletion.
 */

const INTERVAL: Record<string, string> = { MONTH: "شهرية", YEAR: "سنوية" };

export const PlansTab = () => {
	const { plans, isLoading } = useMembershipPlans();
	const { setPlanStatus, isPending } = useSetMembershipPlanStatus();
	const [sheet, setSheet] = useState(false);
	const [editing, setEditing] = useState<MembershipPlanResponse | null>(null);

	const startCreate = () => {
		setEditing(null);
		setSheet(true);
	};

	// useCallback لا للأداء: `columns` تعتمد عليها، ومرجع جديد كل رسم يُعيد بناء الأعمدة دائمًا
	const startEdit = useCallback((plan: MembershipPlanResponse) => {
		setEditing(plan);
		setSheet(true);
	}, []);

	// الأرقام مشتقّة من القائمة المعروضة نفسها — لا استعلام جديد
	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "إجمالي الخطط",
				value: plans.length,
				tooltip: "عدد خطط العضويات المعرَّفة للأكاديمية",
			},
			{
				title: "فعّالة",
				value: plans.filter((plan) => plan.status === "ACTIVE").length,
				tooltip: "خطط متاحة للتسجيل عليها الآن",
			},
			{
				title: "معطّلة",
				value: plans.filter((plan) => plan.status !== "ACTIVE").length,
				tooltip: "خطط أُوقف بيعها — العضويات القائمة عليها لا تتأثّر",
			},
			{
				title: "الأعضاء",
				value: plans.reduce((total, plan) => total + plan._count.memberships, 0),
				tooltip: "مجموع العضويات المرتبطة بكل الخطط",
			},
		],
		[plans],
	);

	// useReactTable يشترط مرجعًا ثابتًا لـ data — مصفوفة جديدة كل رسم تُعيد ضبط الترقيم بلا نهاية
	const rows = useMemo(() => plans, [plans]);

	const columns = useMemo<ColumnDef<MembershipPlanResponse>[]>(
		() => [
			{
				accessorKey: "name",
				header: "الخطة",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<span className="font-semibold text-sm">{row.original.name}</span>
						<span className="text-muted-foreground text-xs tabular-nums">
							{row.original.code}
						</span>
					</div>
				),
			},
			{
				accessorKey: "tierRank",
				header: "الفئة",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{row.original.tierRank}</span>
				),
			},
			{
				accessorKey: "billingInterval",
				header: "الدورة",
				cell: ({ row }) => (
					<span className="text-sm">
						{row.original.intervalCount > 1 ? `${row.original.intervalCount}× ` : ""}
						{INTERVAL[row.original.billingInterval] ?? row.original.billingInterval}
					</span>
				),
			},
			{
				accessorKey: "fee",
				header: "الرسم",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatAmount(row.original.fee.toString())}
					</span>
				),
			},
			{
				accessorKey: "enrollmentFee",
				header: "رسم التسجيل",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">
						{formatAmount(row.original.enrollmentFee.toString())}
					</span>
				),
			},
			{
				id: "benefits",
				header: "المزايا",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{row.original.benefits.length}</span>
				),
			},
			{
				id: "members",
				header: "الأعضاء",
				cell: ({ row }) => (
					<span className="text-sm tabular-nums">{row.original._count.memberships}</span>
				),
			},
			{
				accessorKey: "status",
				header: "الحالة",
				cell: ({ row }) => (
					<Badge variant={row.original.status === "ACTIVE" ? "default" : "secondary"}>
						{row.original.status === "ACTIVE" ? "فعّالة" : "معطّلة"}
					</Badge>
				),
			},
			{
				id: "actions",
				header: "",
				cell: ({ row }) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: حارس انتشار فقط لإيقاف فتح الصف
					// biome-ignore lint/a11y/useKeyWithClickEvents: حارس انتشار فقط؛ عناصر القائمة قابلة للوصول بلوحة المفاتيح
					<div onClick={(e) => e.stopPropagation()}>
						<DropdownMenu dir="rtl">
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="size-8"
								>
									<IconDots className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem
									className="gap-2"
									onSelect={() => startEdit(row.original)}
								>
									<IconPencil className="size-4" />
									تعديل
								</DropdownMenuItem>
								<DropdownMenuItem
									className="gap-2"
									disabled={isPending}
									onSelect={() =>
										setPlanStatus({
											id: row.original.id,
											status: row.original.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
										})
									}
								>
									<IconToggleLeft className="size-4" />
									{row.original.status === "ACTIVE" ? "تعطيل" : "تفعيل"}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				),
			},
		],
		[isPending, setPlanStatus, startEdit],
	);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: 20 } },
	});

	return (
		<>
			<Stats
				className="px-4 grid-cols-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				actions={
					<Button
						size="sm"
						onClick={startCreate}
					>
						<IconPlus />
						خطة جديدة
					</Button>
				}
			/>

			<TabIntro
				title="خطط العضويات"
				hint="تعديل خطةٍ يسري على التجديدات القادمة فقط — العضويات القائمة تحتفظ بلقطة شروطها حتى نهاية فترتها. لا حذف: عطّل الخطة لإيقاف بيعها."
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={isLoading}
				emptyState={{
					title: "لا خطط بعد",
					description: "أنشئ خطة تحدد الرسم الدوري والمزايا التي يحصل عليها العضو.",
					action: { label: "خطة جديدة", onClick: startCreate },
				}}
			/>

			<PlanSheet
				open={sheet}
				onOpenChange={setSheet}
				plan={editing}
			/>
		</>
	);
};
