import { createFileRoute } from "@tanstack/react-router";
import {
	type ColumnDef,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import { TableDataView } from "@/components/common/table-data-view";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { TierPill } from "@/features/loyalty/components/tier-pill";
import {
	useLoyaltyActivity,
	useLoyaltyExpiringSoon,
	useLoyaltyLiability,
	useLoyaltyTierDistribution,
} from "@/features/loyalty/hooks/use-loyalty-reports";
import { useLoyaltySettings } from "@/features/loyalty/hooks/use-loyalty-settings";

/**
 * [LY-P4] «تقارير الولاء» (BRD §11.1 و§11.2).
 *
 * **الملاحظة المحاسبية ليست حاشية بل جزءٌ من التقرير** (BR-L7.2): رقم الالتزام تقديرُ
 * تعرّضٍ لا رصيدٌ في دفتر الأستاذ، وعرضُه بلا هذا التحفّظ يجعل قارئه يظنّ أنّ الكتب
 * تحمله. تصل الملاحظة من الخادم مع الرقم نفسه، فلا تنفصل عنه عند التصدير.
 *
 * [UI] على عقد `/services/staff`: العنوان من مسار التخطيط، `Stats` مشتقّة من المحمَّل،
 * `TableToolbar` ثمّ `TableDataView` بحالاته الثلاث.
 */
export const Route = createFileRoute("/_pathless-layout/management/loyalty-reports")({
	component: LoyaltyReportsRoute,
});

type BucketRow = { key: string; labelAr: string; points: number; value: string };

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

function LoyaltyReportsRoute() {
	const { settings } = useLoyaltySettings();
	const enabled = settings?.enableLoyaltyModule ?? false;

	const [from, setFrom] = useState(() =>
		isoDay(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
	);
	const [to, setTo] = useState(() => isoDay(new Date()));

	const { liability, isLoading: loadingLiability } = useLoyaltyLiability(enabled);
	const { activity, isLoading: loadingActivity } = useLoyaltyActivity(enabled, from, to);
	const { distribution } = useLoyaltyTierDistribution(enabled);
	const { expiring } = useLoyaltyExpiringSoon(enabled);

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "النقاط القائمة",
				value: liability?.points ?? 0,
				tooltip: "غير المنتهية وغير المستهلَكة — ما يمكن استبداله فعلًا اليوم",
			},
			{
				title: "قيمتها التقديرية",
				value: Number(liability?.value ?? 0),
				valueLabel: `${liability?.value ?? "0.00"} ر.س`,
				tooltip:
					"بمعدّل الاستبدال الحالي. تقديرُ تعرّضٍ مستقبليّ لا رصيدٌ في دفتر الأستاذ (BR-L7.2)",
			},
			{
				title: "مُلّاك لهم رصيد",
				value: liability?.owners ?? 0,
				tooltip: "عدد أصحاب النقاط القابلة للاستبدال",
			},
			{
				title: "معدّل الاستبدال",
				value: Number(activity?.redemptionRatePercent ?? 0),
				valueLabel: activity?.redemptionRatePercent
					? `${activity.redemptionRatePercent}%`
					: "—",
				percentage: true,
				tooltip: "نسبة ما استُعمل من النقاط الممنوحة خلال الفترة — مقياس صحّة البرنامج لا ربحه",
			},
		],
		[liability, activity],
	);

	const columns = useMemo<ColumnDef<BucketRow>[]>(
		() => [
			{ accessorKey: "labelAr", header: "الاستحقاق" },
			{
				accessorKey: "points",
				header: "النقاط",
				cell: ({ row }) => (
					<span className="tabular-nums">{row.original.points.toLocaleString("ar-EG")}</span>
				),
			},
			{
				accessorKey: "value",
				header: "القيمة التقديرية",
				cell: ({ row }) => <span className="tabular-nums">{row.original.value} ر.س</span>,
			},
		],
		[],
	);

	const table = useReactTable({
		data: liability?.buckets ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	if (!enabled) {
		return (
			<div
				className="flex flex-col gap-4 p-6"
				dir="rtl"
			>
				<p className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
					وحدة الولاء غير مفعّلة — فعّلها من شاشة «برنامج الولاء» لتظهر التقارير.
				</p>
			</div>
		);
	}

	return (
		<div
			className="flex flex-col gap-6 p-6"
			dir="rtl"
		>
			<Stats
				className="grid-cols-2 px-4 md:grid-cols-4"
				stats={stats}
			/>

			{/* BR-L7.2 — التحفّظ يرافق الرقم ولا يُترك للقارئ أن يفترضه */}
			{liability?.noteAr ? (
				<p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900 text-xs leading-relaxed">
					{liability.noteAr}
				</p>
			) : null}

			<TableToolbar
				className="border-t"
				showSearch={false}
				showFilter={false}
				showExport={false}
				showView={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex items-end gap-2">
						<div className="flex flex-col gap-1">
							<Label
								className="text-xs"
								htmlFor="loyalty-activity-from"
							>
								من
							</Label>
							<Input
								id="loyalty-activity-from"
								type="date"
								className="h-7 w-36 text-xs"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<Label
								className="text-xs"
								htmlFor="loyalty-activity-to"
							>
								إلى
							</Label>
							<Input
								id="loyalty-activity-to"
								type="date"
								className="h-7 w-36 text-xs"
								value={to}
								onChange={(e) => setTo(e.target.value)}
							/>
						</div>
					</div>
				}
			/>

			<TableDataView
				table={table}
				columns={columns}
				isPending={loadingLiability}
				emptyState={{
					title: "لا نقاط قائمة بعد",
					description:
						"لم يُمنح شيء، أو انتهى واستُبدل كلّ ما مُنح — الجدول يعرض ما يمكن استبداله اليوم فقط",
				}}
			/>

			{/* [LY-P5] §11.3 — توزيع المستويات، من لقطة المهمّة ومعه ختمها */}
			{distribution && distribution.rows.length > 0 ? (
				<section className="flex flex-col gap-2">
					<h2 className="font-semibold text-sm">توزيع المستويات</h2>
					<p className="text-muted-foreground text-xs">{distribution.noteAr}</p>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="text-muted-foreground text-xs">
								<tr>
									<th className="p-2 text-start">المستوى</th>
									<th className="p-2 text-start">أولياء الأمور</th>
									<th className="p-2 text-start">الإنفاق المؤهِّل</th>
									<th className="p-2 text-start">حصّته</th>
								</tr>
							</thead>
							<tbody>
								{distribution.rows.map((row) => (
									<tr
										key={row.tierId ?? "none"}
										className="border-t"
									>
										<td className="p-2">
											{row.colorToken ? (
												<TierPill
													name={row.name}
													colorToken={row.colorToken}
												/>
											) : (
												<span className="text-muted-foreground">{row.name}</span>
											)}
										</td>
										<td className="p-2 tabular-nums">{row.owners.toLocaleString("ar-EG")}</td>
										<td className="p-2 tabular-nums">{row.spend} ر.س</td>
										<td className="p-2 tabular-nums">{row.spendSharePercent}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			) : null}

			{/* [LY-P5] §11.4 — من توشك نقاطهم أن تنتهي */}
			{expiring && expiring.owners.length > 0 ? (
				<section className="flex flex-col gap-2">
					<h2 className="font-semibold text-sm">
						نقاط توشك أن تنتهي خلال {expiring.days} يومًا
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="text-muted-foreground text-xs">
								<tr>
									<th className="p-2 text-start">وليّ الأمر</th>
									<th className="p-2 text-start">الهاتف</th>
									<th className="p-2 text-start">النقاط</th>
									<th className="p-2 text-start">أقربها انتهاءً</th>
								</tr>
							</thead>
							<tbody>
								{expiring.owners.map((row) => (
									<tr
										key={row.ownerId}
										className="border-t"
									>
										<td className="p-2">
											{row.name}{" "}
											<span className="text-muted-foreground text-xs">{row.code}</span>
										</td>
										<td className="p-2 tabular-nums">{row.phone ?? "—"}</td>
										<td className="p-2 font-semibold tabular-nums">
											{row.points.toLocaleString("ar-EG")}
										</td>
										<td className="p-2 tabular-nums">
											{new Date(row.soonestAt).toLocaleDateString("ar-EG")}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			) : null}

			{/* §11.2 — الحركة: ممنوح/مستبدَل/منتهٍ/معكوس خلال الفترة */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-5">
				{[
					{ label: "ممنوح", value: activity?.granted },
					{ label: "مستبدَل", value: activity?.redeemed },
					{ label: "منتهٍ", value: activity?.expired },
					{ label: "معكوس", value: activity?.reversed },
					{ label: "مردود", value: activity?.restored },
				].map((cell) => (
					<div
						key={cell.label}
						className="rounded-md border px-3 py-2"
					>
						<p className="text-muted-foreground text-xs">{cell.label}</p>
						<p className="font-semibold text-sm tabular-nums">
							{loadingActivity ? "…" : (cell.value ?? 0).toLocaleString("ar-EG")}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
