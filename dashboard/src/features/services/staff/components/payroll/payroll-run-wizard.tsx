// معالج تشغيل مسير الرواتب — 6 مراحل داخل حوار مركزي.
// كل البيانات حقيقية من الخادم: المسير يُنشأ عند مغادرة مرحلة النطاق،
// ثم تعمل بقية المراحل على معرّفه.
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
	currentPeriod,
	defaultPayDateLabel,
	formatPeriod,
	lineIssues,
	periodRangeLabel,
} from "@/features/services/staff/components/payroll/payroll-ui";
import type { LineActions } from "@/features/services/staff/components/payroll/wizard/payroll-lines-table";
import { StepApproval } from "@/features/services/staff/components/payroll/wizard/step-approval";
import { StepCalculate } from "@/features/services/staff/components/payroll/wizard/step-calculate";
import { StepFinish } from "@/features/services/staff/components/payroll/wizard/step-finish";
import { StepIssues } from "@/features/services/staff/components/payroll/wizard/step-issues";
import { StepPeriodScope } from "@/features/services/staff/components/payroll/wizard/step-period-scope";
import { StepSummary } from "@/features/services/staff/components/payroll/wizard/step-summary";
import {
	WIZARD_STEPS,
	WizardShell,
} from "@/features/services/staff/components/payroll/wizard/wizard-shell";
import {
	usePayrollMutations,
	usePayrollPreview,
	usePayrollRun,
	usePreviousNets,
} from "@/features/services/staff/hooks/use-payroll";
import type { PayrollScope } from "@/server/payroll/payroll.type";
import type { StaffResponse } from "@/server/staff/staff.type";

export function PayrollRunWizard({
	open,
	onClose,
	staff,
	existingRunId,
}: {
	open: boolean;
	onClose: () => void;
	staff: StaffResponse[];
	// مسودة قائمة تُستأنف بدل إنشاء مسير جديد
	existingRunId?: string | null;
}) {
	const period = currentPeriod();

	const [step, setStep] = useState(0);
	const [runId, setRunId] = useState<string | null>(existingRunId ?? null);
	const [scope, setScope] = useState<PayrollScope>("ALL");
	const [branchId, setBranchId] = useState<string | null>(null);
	const [roleId, setRoleId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [ignoredIssues, setIgnoredIssues] = useState<Set<string>>(new Set());

	const { run, isLoading } = usePayrollRun(runId);
	const { preview } = usePayrollPreview(period);
	const { previousNets } = usePreviousNets(runId);
	const mutations = usePayrollMutations(runId);

	const previews = useMemo(
		() =>
			new Map(
				preview.map((p) => [
					p.staffId,
					{
						totalHours: p.totalHours,
						overtimeHours: p.overtimeHours,
						paymentMethod: p.paymentMethod,
					},
				]),
			),
		[preview],
	);

	// إجمالي ساعات الحضور غير مخزّن على سطر المسير، فيُشتق من معاينة الفترة نفسها
	const totalHours = useMemo(
		() => new Map(preview.map((p) => [p.staffId, p.totalHours])),
		[preview],
	);

	// الموظفون المشمولون حسب النطاق — معاينة قبل إنشاء المسير
	const scopedStaff = (() => {
		switch (scope) {
			case "BRANCH":
				return branchId ? staff.filter((s) => s.branch?.id === branchId) : staff;
			case "DEPARTMENT":
				return roleId ? staff.filter((s) => s.role?.id === roleId) : staff;
			case "SPECIFIC":
				return staff.filter((s) => selectedIds.has(s.id));
			default:
				return staff;
		}
	})();

	const lines = run?.lines ?? [];
	const includedLines = lines.filter((l) => !l.excluded);
	const issues = lines.flatMap((l) =>
		lineIssues(l).map((i) => ({ ...i, lineId: l.id, staffName: l.staffName })),
	);
	const blockingIssues = issues.filter(
		(i) => i.blocking && !ignoredIssues.has(`${i.lineId}-${i.code}`),
	);

	const resetState = () => {
		setStep(0);
		setRunId(existingRunId ?? null);
		setScope("ALL");
		setBranchId(null);
		setRoleId(null);
		setSelectedIds(new Set());
		setIgnoredIssues(new Set());
	};

	const handleClose = () => {
		onClose();
		setTimeout(resetState, 200);
	};

	// إجراءات تحرير السطر — كلها تحفظ على الخادم ويعاد جلب المسير
	const lineActions: LineActions = {
		setOvertime: (lineId, hours) =>
			mutations.updateLine.mutate({ lineId, overtimeHoursOverride: hours }),
		clearOvertime: (lineId) =>
			mutations.clearOverride.mutate({ lineId, field: "overtimeHours" }),
		setPaymentMethod: (lineId, method) =>
			mutations.updateLine.mutate({ lineId, paymentMethodOverride: method }),
		setNote: (lineId, note) => mutations.updateLine.mutate({ lineId, note }),
		addEarning: (lineId, type, amount, note) =>
			mutations.addEarning.mutate({ lineId, type, amount, note: note || null }),
		removeEarning: (earningId) => mutations.removeEarning.mutate(earningId),
	};

	const toggleAllSelected = (ids: string[], checked: boolean) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			for (const id of ids) {
				if (checked) next.add(id);
				else next.delete(id);
			}
			return next;
		});

	const toggleSelected = (id: string) =>
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const toggleIgnore = (id: string) =>
		setIgnoredIssues((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	// إنشاء المسير عند مغادرة مرحلة النطاق لأول مرة
	const ensureRun = async (): Promise<string | null> => {
		if (runId) return runId;
		try {
			const created = await mutations.createRun.mutateAsync({
				periodYear: period.year,
				periodMonth: period.month,
				scope,
				scopeBranchId: scope === "BRANCH" ? branchId : null,
				scopeRoleId: scope === "DEPARTMENT" ? roleId : null,
			});
			setRunId(created.id);
			return created.id;
		} catch (err) {
			toast.error((err as Error).message);
			return null;
		}
	};

	const goNext = async () => {
		if (step === 0) {
			const id = await ensureRun();
			if (!id) return;
		}
		setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1));
	};

	const goBack = () => setStep((s) => Math.max(0, s - 1));

	// المسير محفوظ على الخادم أصلًا؛ الحفظ كمسودة إغلاقٌ صريح يؤكد الاستئناف
	const handleSaveDraft = () => {
		toast.success("حُفظ المسير كمسودة — يمكنك متابعته لاحقًا");
		handleClose();
	};

	const handleApprove = async () => {
		try {
			await mutations.withToast(
				mutations.approve.mutateAsync(),
				"جارٍ اعتماد المسير...",
				"تم اعتماد المسير",
			);
			setStep(5);
		} catch {
			// الرسالة تظهر في التوست
		}
	};

	const handleFinish = async () => {
		try {
			await mutations.withToast(
				mutations.markPaid.mutateAsync(),
				"جارٍ تسجيل الصرف...",
				`تم تشغيل مسير رواتب ${formatPeriod(period.year, period.month)} بنجاح`,
			);
			handleClose();
		} catch {
			// الرسالة تظهر في التوست
		}
	};

	const canNext = (() => {
		switch (step) {
			case 0:
				return scopedStaff.length > 0 && !mutations.createRun.isPending;
			case 1:
				return run?.status !== "DRAFT" && includedLines.length > 0;
			case 2:
				return blockingIssues.length === 0;
			case 4:
				return run?.status === "APPROVED";
			default:
				return true;
		}
	})();

	const isLastStep = step === WIZARD_STEPS.length - 1;

	const stepLabel = isLastStep ? "إنهاء المسير" : "التالي";

	if (!open) return null;

	return (
		<WizardShell
			steps={WIZARD_STEPS}
			current={step}
			onStepChange={setStep}
			periodLabel={periodRangeLabel(period.year, period.month)}
			runCode={run?.code}
			onClose={handleClose}
			onSaveDraft={runId ? handleSaveDraft : undefined}
			onBack={goBack}
			onNext={isLastStep ? handleFinish : goNext}
			nextLabel={stepLabel}
			nextDisabled={isLastStep ? mutations.markPaid.isPending : !canNext}
			canGoBack={step > 0 && run?.status !== "APPROVED"}
		>
			{step === 0 && (
				<StepPeriodScope
					period={formatPeriod(period.year, period.month)}
					periodRange={periodRangeLabel(period.year, period.month)}
					payDate={defaultPayDateLabel(period.year, period.month)}
					employeeCount={scopedStaff.length}
					staff={staff}
					scope={scope}
					onScopeChange={setScope}
					branchId={branchId}
					onBranchChange={setBranchId}
					roleId={roleId}
					onRoleChange={setRoleId}
					selectedIds={selectedIds}
					onToggleSelected={toggleSelected}
					onToggleAll={toggleAllSelected}
					previews={previews}
					scopedStaff={scopedStaff}
					locked={!!runId}
				/>
			)}
			{step === 1 && (
				<StepCalculate
					runId={runId}
					run={run}
					isLoading={isLoading}
					calculate={mutations.calculate}
					actions={lineActions}
					totalHoursByStaff={totalHours}
				/>
			)}
			{step === 2 && (
				<StepIssues
					issues={issues}
					ignored={ignoredIssues}
					onToggleIgnore={toggleIgnore}
				/>
			)}
			{step === 3 && (
				<StepSummary
					run={run}
					lines={includedLines}
					previousNets={previousNets}
				/>
			)}
			{step === 4 && (
				<StepApproval
					run={run}
					onApprove={handleApprove}
					isPending={mutations.approve.isPending}
				/>
			)}
			{step === 5 && (
				<StepFinish
					run={run}
					period={formatPeriod(period.year, period.month)}
				/>
			)}
		</WizardShell>
	);
}
