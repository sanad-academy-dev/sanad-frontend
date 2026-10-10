import { useMemo, useState } from "react";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { CarePlansEmpty } from "@/features/finance/care-plans/components/care-plans-empty";
import { CarePlansTable } from "@/features/finance/care-plans/components/care-plans-table";
import { CarePlansToolbar } from "@/features/finance/care-plans/components/care-plans-toolbar";
import { CreateCarePlanSheet } from "@/features/finance/care-plans/components/create-care-plan-sheet";
import { DeleteCarePlanDialog } from "@/features/finance/care-plans/components/delete-care-plan-dialog";
import { DisableCarePlanDialog } from "@/features/finance/care-plans/components/disable-care-plan-dialog";
import { EnrollCarePlanDialog } from "@/features/finance/care-plans/components/enroll-care-plan-dialog";
import { useCarePlanMutations } from "@/features/finance/care-plans/hooks/use-care-plan-mutations";
import { useCarePlanStats } from "@/features/finance/care-plans/hooks/use-care-plan-stats";
import { useCarePlans } from "@/features/finance/care-plans/hooks/use-care-plans";
import type { CarePlanListItemResponse } from "@/server/care-plans/care-plans.type";

export function CarePlansTab() {
	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [activePlan, setActivePlan] = useState<CarePlanListItemResponse | null>(null);
	const [sheetReadOnly, setSheetReadOnly] = useState(false);
	const [enrolling, setEnrolling] = useState<CarePlanListItemResponse | null>(null);
	const [deleting, setDeleting] = useState<CarePlanListItemResponse | null>(null);
	const [disabling, setDisabling] = useState<CarePlanListItemResponse | null>(null);

	const { plans, isLoading } = useCarePlans();
	const { stats } = useCarePlanStats();
	const { duplicate, remove, setStatus, isDeleting, isSettingStatus } = useCarePlanMutations();

	const filtered = useMemo(() => {
		if (!search.trim()) return plans;
		const q = search.toLowerCase();
		return plans.filter(
			(p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
		);
	}, [plans, search]);

	const averageRating = stats?.averageRating ?? null;
	const carePlanStats: StatItem[] = [
		{
			title: "التقييم",
			value: averageRating ?? 0,
			valueLabel: averageRating ? `${averageRating.toFixed(1)} (٥/٥)` : "لا يوجد تقييم",
			tooltip: "متوسط تقييم خطط الرعاية",
		},
		{
			title: "الإيرادات",
			value: stats?.revenue ?? 0,
			valueLabel: `${(stats?.revenue ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س`,
			tooltip: "إجمالي إيرادات خطط الرعاية",
		},
		{
			title: "# الزيارات المجدولة",
			value: stats?.scheduledVisits ?? 0,
			tooltip: "إجمالي الزيارات المجدولة عبر الخطط",
		},
		{
			title: "# الأطفال المشتركين",
			value: stats?.subscribedPatients ?? 0,
			tooltip: "عدد الأطفال المشتركين في خطط رعاية",
		},
		{
			title: "# الاستخدامات",
			value: stats?.usages ?? 0,
			tooltip: "إجمالي مرّات استخدام خطط الرعاية",
		},
		{
			title: "# الخطط",
			value: stats?.total ?? plans.length,
			tooltip: "إجمالي عدد خطط الرعاية المسجّلة",
		},
	];

	const openCreate = () => {
		setActivePlan(null);
		setSheetReadOnly(false);
		setSheetOpen(true);
	};

	const handleView = (plan: CarePlanListItemResponse) => {
		setActivePlan(plan);
		setSheetReadOnly(true);
		setSheetOpen(true);
	};

	const handleEdit = (plan: CarePlanListItemResponse) => {
		setActivePlan(plan);
		setSheetReadOnly(false);
		setSheetOpen(true);
	};

	const handleToggleStatus = (plan: CarePlanListItemResponse) => {
		if (plan.status === "ACTIVE") {
			setDisabling(plan);
			return;
		}
		void setStatus(plan.id, "ACTIVE", plan.name);
	};

	const handleConfirmDisable = async () => {
		if (!disabling) return;
		try {
			await setStatus(disabling.id, "INACTIVE", disabling.name);
			setDisabling(null);
		} catch {
			// toast handled by hook
		}
	};

	const handleConfirmDelete = async () => {
		if (!deleting) return;
		try {
			await remove(deleting.id, deleting.name);
			setDeleting(null);
		} catch {
			// toast handled by hook
		}
	};

	return (
		<>
			<Stats
				className="px-[9px]"
				stats={carePlanStats}
				variant="inventory"
			/>
			<hr className="my-2" />
			<CarePlansToolbar
				search={search}
				onSearchChange={setSearch}
				onCreate={openCreate}
			/>
			<hr className="my-2" />

			{!isLoading && filtered.length === 0 ? (
				<CarePlansEmpty onCreate={openCreate} />
			) : (
				<CarePlansTable
					plans={filtered}
					onView={handleView}
					onEdit={handleEdit}
					onEnroll={setEnrolling}
					onDuplicate={(plan) => void duplicate(plan.id)}
					onDelete={setDeleting}
					onToggleStatus={handleToggleStatus}
				/>
			)}

			<CreateCarePlanSheet
				open={sheetOpen}
				onOpenChange={(open) => {
					setSheetOpen(open);
					if (!open) setActivePlan(null);
				}}
				plan={activePlan}
				readOnly={sheetReadOnly}
			/>

			<EnrollCarePlanDialog
				plan={enrolling}
				onOpenChange={(open) => !open && setEnrolling(null)}
			/>

			<DisableCarePlanDialog
				plan={disabling}
				onOpenChange={(open) => !open && setDisabling(null)}
				onConfirm={handleConfirmDisable}
				isPending={isSettingStatus}
			/>

			<DeleteCarePlanDialog
				plan={deleting}
				onOpenChange={(open) => !open && setDeleting(null)}
				onConfirm={handleConfirmDelete}
				isDeleting={isDeleting}
			/>
		</>
	);
}
