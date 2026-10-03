import { IconPlus, IconScaleOutline } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TabsContent } from "@/components/ui/tabs";
import { NutritionPlanSheet } from "@/features/care/nutrition/components/nutrition-plan-sheet";
import { PlanDetailSheet } from "@/features/care/nutrition/components/plan-detail-sheet";
import { RecordRecheckDialog } from "@/features/care/nutrition/components/record-recheck-dialog";
import { WeightTrend } from "@/features/care/nutrition/components/weight-trend";
import {
	useNutritionPlan,
	useNutritionPlans,
	useWeightHistory,
} from "@/features/care/nutrition/hooks/use-nutrition";
import type { PatientTabProps } from "@/features/services/patients/types/tabs.types";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { NutritionPlanStatus } from "@/generated/prisma/enums";
import { GOAL_LABELS, PLAN_STATUS_LABELS } from "@sanad/contracts/runtime/server/nutrition/nutrition.type";

// تبويب التغذية في ملف الطفل — الخطة السارية أولًا، ثم منحنى الوزن، ثم التاريخ.
//
// الترتيب مقصود: من يفتح الملف يسأل «بماذا يُغذَّى الآن؟» قبل «ماذا كان قبل سنة؟».

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const at = (v: Date | string | null | undefined) => (v ? dateFmt.format(new Date(v)) : "—");
const num = (v: unknown) => (v == null ? "—" : String(Number(v)));

const STATUS_TONE: Record<
	NutritionPlanStatus,
	"default" | "secondary" | "outline" | "destructive"
> = {
	DRAFT: "outline",
	ACTIVE: "default",
	COMPLETED: "secondary",
	DISCONTINUED: "destructive",
};

export function NutritionTab({ patientId }: PatientTabProps) {
	const { plans, isLoading } = useNutritionPlans({ patientId: patientId || undefined });
	const { points } = useWeightHistory(patientId || undefined);
	const { clinicInfo } = useClinicInfo();

	const [createOpen, setCreateOpen] = useState(false);
	const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
	const [detailPlanId, setDetailPlanId] = useState<string | null>(null);
	const [recheckPlanId, setRecheckPlanId] = useState<string | null>(null);

	const { plan: editingPlan } = useNutritionPlan(editingPlanId ?? undefined);

	const active = plans.find((p) => p.status === "ACTIVE");
	const others = plans.filter((p) => p.id !== active?.id);

	if (!patientId || isLoading) {
		return (
			<TabsContent
				value="nutrition"
				className="space-y-3 p-4"
			>
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-32 w-full" />
			</TabsContent>
		);
	}

	return (
		<TabsContent
			value="nutrition"
			className="space-y-4 p-4"
		>
			<div className="flex items-center justify-between gap-3">
				<span className="text-sm font-semibold">التغذية</span>
				<Button
					size="sm"
					onClick={() => {
						setEditingPlanId(null);
						setCreateOpen(true);
					}}
				>
					<IconPlus className="size-4" />
					خطة تغذية
				</Button>
			</div>

			{active ? (
				<button
					type="button"
					onClick={() => setDetailPlanId(active.id)}
					className="flex w-full flex-col gap-2 rounded-[4px] border border-primary/40 bg-primary/5 p-3 text-start"
				>
					<div className="flex flex-wrap items-center gap-2">
						<Badge>{PLAN_STATUS_LABELS[active.status]}</Badge>
						<Badge variant="outline">{GOAL_LABELS[active.goal]}</Badge>
						<span className="text-xs tabular-nums text-muted-foreground">{active.code}</span>
					</div>
					<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm tabular-nums">
						<span className="font-semibold text-primary">{num(active.derKcal)} سعرة/يوم</span>
						<span>
							الوزن {num(active.currentWeightKg)} كجم
							{active.idealWeightKg && ` ← ${num(active.idealWeightKg)}`}
						</span>
						{active.bodyConditionScore && <span>BCS {active.bodyConditionScore}/٩</span>}
						<span className="text-muted-foreground">
							المراجعة القادمة {at(active.nextRecheckAt)}
						</span>
					</div>
				</button>
			) : (
				<p className="rounded-[4px] border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
					لا خطة تغذية سارية — التقييم الغذائي يُوصى به في كل زيارة (WSAVA)
				</p>
			)}

			{active && (
				<Button
					variant="outline"
					size="sm"
					className="w-full"
					onClick={() => setRecheckPlanId(active.id)}
				>
					<IconScaleOutline className="size-4" />
					تسجيل وزن ومراجعة
				</Button>
			)}

			{points.length > 1 && (
				<WeightTrend
					points={points}
					idealWeightKg={active?.idealWeightKg ? Number(active.idealWeightKg) : null}
				/>
			)}

			{others.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="text-xs font-semibold text-muted-foreground">خطط سابقة</span>
					{others.map((plan) => (
						<button
							key={plan.id}
							type="button"
							onClick={() => setDetailPlanId(plan.id)}
							className="flex items-center justify-between gap-3 rounded-[4px] border px-3 py-2 text-start"
						>
							<div className="flex min-w-0 flex-col">
								<span className="flex items-center gap-1.5 text-sm">
									<Badge variant={STATUS_TONE[plan.status]}>
										{PLAN_STATUS_LABELS[plan.status]}
									</Badge>
									{GOAL_LABELS[plan.goal]}
								</span>
								<span className="text-xs tabular-nums text-muted-foreground">
									{plan.code} · {at(plan.createdAt)}
								</span>
							</div>
							<span className="shrink-0 text-sm tabular-nums text-muted-foreground">
								{num(plan.derKcal)} سعرة
							</span>
						</button>
					))}
				</div>
			)}

			<NutritionPlanSheet
				open={createOpen}
				onOpenChange={(next) => {
					setCreateOpen(next);
					if (!next) setEditingPlanId(null);
				}}
				patientId={patientId}
				plan={editingPlanId ? editingPlan : null}
				onSaved={(planId) => setDetailPlanId(planId)}
			/>

			<PlanDetailSheet
				open={!!detailPlanId}
				onOpenChange={(next) => !next && setDetailPlanId(null)}
				planId={detailPlanId ?? undefined}
				clinicName={clinicInfo?.name ?? "الأكاديمية"}
				onEdit={(planId) => {
					setDetailPlanId(null);
					setEditingPlanId(planId);
					setCreateOpen(true);
				}}
				onRecheck={(planId) => {
					setDetailPlanId(null);
					setRecheckPlanId(planId);
				}}
			/>

			<RecordRecheckDialog
				open={!!recheckPlanId}
				onOpenChange={(next) => !next && setRecheckPlanId(null)}
				planId={recheckPlanId ?? undefined}
			/>
		</TabsContent>
	);
}
