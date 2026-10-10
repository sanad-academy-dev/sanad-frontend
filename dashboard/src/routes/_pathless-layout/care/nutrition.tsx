import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Stats } from "@/components/common/stats";
import { DietFoodSheet } from "@/features/care/nutrition/components/diet-food-sheet";
import { DietFoodsTable } from "@/features/care/nutrition/components/diet-foods-table";
import { NutritionDueTable } from "@/features/care/nutrition/components/nutrition-due-table";
import {
	NUTRITION_TABS,
	NutritionHeader,
	type NutritionTab,
} from "@/features/care/nutrition/components/nutrition-header";
import { NutritionPlanSheet } from "@/features/care/nutrition/components/nutrition-plan-sheet";
import { NutritionPlansTable } from "@/features/care/nutrition/components/nutrition-plans-table";
import { PlanDetailSheet } from "@/features/care/nutrition/components/plan-detail-sheet";
import { RecordRecheckDialog } from "@/features/care/nutrition/components/record-recheck-dialog";
import {
	useDietFoods,
	useNutritionDue,
	useNutritionPlan,
	useNutritionPlans,
	useNutritionStats,
} from "@/features/care/nutrition/hooks/use-nutrition";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { DietFoodKind, NutritionPlanStatus } from "@/generated/prisma/enums";
import type { DietFoodResponse } from "@/server/nutrition/nutrition.type";

const VALID_STATUS = ["ALL", "DRAFT", "ACTIVE", "COMPLETED", "DISCONTINUED"];
const VALID_KIND = ["ALL", "MAINTENANCE", "THERAPEUTIC", "TREAT", "SUPPLEMENT"];
const VALID_HORIZON = ["7", "14", "30", "90", "0"];

type NutritionSearch = {
	tab: NutritionTab;
	q: string;
	status: string;
	kind: string;
	horizon: string;
};

export const Route = createFileRoute("/_pathless-layout/care/nutrition")({
	// حالة الشاشة تعيش في الرابط: الصفحة تُشارَك وتُعاد بحالتها بعد التحديث
	validateSearch: (search): NutritionSearch => {
		const rawTab = (search as { tab?: string }).tab;
		const tab = NUTRITION_TABS.some((t) => t.value === rawTab)
			? (rawTab as NutritionTab)
			: "due";
		const status = String((search as { status?: string }).status ?? "ALL");
		const kind = String((search as { kind?: string }).kind ?? "ALL");
		const horizon = String((search as { horizon?: string }).horizon ?? "30");
		return {
			tab,
			q: String((search as { q?: string }).q ?? "").slice(0, 120),
			status: VALID_STATUS.includes(status) ? status : "ALL",
			kind: VALID_KIND.includes(kind) ? kind : "ALL",
			horizon: VALID_HORIZON.includes(horizon) ? horizon : "30",
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { tab, q, status, kind, horizon } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const [planSheetOpen, setPlanSheetOpen] = useState(false);
	const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
	const [detailPlanId, setDetailPlanId] = useState<string | null>(null);
	const [recheckPlanId, setRecheckPlanId] = useState<string | null>(null);
	const [foodSheetOpen, setFoodSheetOpen] = useState(false);
	const [editingFood, setEditingFood] = useState<DietFoodResponse | null>(null);

	const { stats, statItems } = useNutritionStats();
	const { clinicInfo } = useClinicInfo();
	const clinicName = clinicInfo?.name ?? "الأكاديمية";

	const {
		rows,
		isLoading: dueLoading,
		isError: dueError,
	} = useNutritionDue({ horizonDays: Number(horizon) });
	const {
		plans,
		isLoading: plansLoading,
		isError: plansError,
	} = useNutritionPlans({
		status: status === "ALL" ? undefined : (status as NutritionPlanStatus),
	});
	const {
		foods,
		isLoading: foodsLoading,
		isError: foodsError,
	} = useDietFoods({ kind: kind === "ALL" ? undefined : (kind as DietFoodKind) });

	// الخطة المحرَّرة تُحمَّل كاملة — الشيت يحتاج البنود والتقييم لا صفّ القائمة
	const { plan: editingPlan } = useNutritionPlan(editingPlanId ?? undefined);

	const setSearch = (patch: Partial<NutritionSearch>) =>
		void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });

	const openCreate = () => {
		setEditingPlanId(null);
		setPlanSheetOpen(true);
	};

	const openEdit = (planId: string) => {
		setDetailPlanId(null);
		setEditingPlanId(planId);
		setPlanSheetOpen(true);
	};

	const openRecheck = (planId: string) => {
		setDetailPlanId(null);
		setRecheckPlanId(planId);
	};

	const openFood = (food: DietFoodResponse | null) => {
		setEditingFood(food);
		setFoodSheetOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<NutritionHeader
				active={tab}
				// البحث حالة خاصة بكل تبويب — تبديل التبويب يُفرغه بدل أن يرشّح جدولًا
				// بمصطلح كُتب لجدول آخر
				onChange={(next) => setSearch({ tab: next, q: "" })}
			/>

			<Stats
				className="px-4"
				stats={statItems}
			/>

			{tab === "due" && (
				<NutritionDueTable
					rows={rows}
					isLoading={dueLoading}
					isError={dueError}
					clinicName={clinicName}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					onRecheck={openRecheck}
					onOpenPlan={setDetailPlanId}
					horizon={horizon}
					onHorizonChange={(value) => setSearch({ horizon: value })}
					activePlanCount={stats.activePlans}
				/>
			)}

			{tab === "plans" && (
				<NutritionPlansTable
					plans={plans}
					isLoading={plansLoading}
					isError={plansError}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					status={status}
					onStatusChange={(value) => setSearch({ status: value })}
					onOpenPlan={setDetailPlanId}
					onCreate={openCreate}
				/>
			)}

			{tab === "foods" && (
				<DietFoodsTable
					foods={foods}
					isLoading={foodsLoading}
					isError={foodsError}
					search={q}
					onSearchChange={(value) => setSearch({ q: value })}
					kind={kind}
					onKindChange={(value) => setSearch({ kind: value })}
					onEdit={openFood}
					onCreate={() => openFood(null)}
				/>
			)}

			<NutritionPlanSheet
				open={planSheetOpen}
				onOpenChange={(next) => {
					setPlanSheetOpen(next);
					if (!next) setEditingPlanId(null);
				}}
				plan={editingPlanId ? editingPlan : null}
				onSaved={(planId) => setDetailPlanId(planId)}
			/>

			<PlanDetailSheet
				open={!!detailPlanId}
				onOpenChange={(next) => !next && setDetailPlanId(null)}
				planId={detailPlanId ?? undefined}
				clinicName={clinicName}
				onEdit={openEdit}
				onRecheck={openRecheck}
			/>

			<RecordRecheckDialog
				open={!!recheckPlanId}
				onOpenChange={(next) => !next && setRecheckPlanId(null)}
				planId={recheckPlanId ?? undefined}
			/>

			<DietFoodSheet
				open={foodSheetOpen}
				onOpenChange={setFoodSheetOpen}
				food={editingFood}
			/>
		</div>
	);
}
