import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Stats } from "@/components/common/stats";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { CancelExpenseRequestDialog } from "@/features/finance/expenses/components/cancel-expense-request-dialog";
import { CreateExpenseSheet } from "@/features/finance/expenses/components/create-expense-sheet";
import { DeleteExpenseRequestDialog } from "@/features/finance/expenses/components/delete-expense-request-dialog";
import { ExpenseApprovalsSheet } from "@/features/finance/expenses/components/expense-approvals-sheet";
import { ExpenseRejectionSummaryDialog } from "@/features/finance/expenses/components/expense-rejection-summary-dialog";
import { ExpensesEmpty } from "@/features/finance/expenses/components/expenses-empty";
import { ExpensesGrid } from "@/features/finance/expenses/components/expenses-grid";
import { ExpensesList } from "@/features/finance/expenses/components/expenses-list";
import { ExpensesToolbar } from "@/features/finance/expenses/components/expenses-toolbar";
import {
	type ReviewDecision,
	ReviewDecisionDialog,
} from "@/features/finance/expenses/components/review-decision-dialog";
import {
	type ExpenseCardAction,
	type ExpensesViewMode,
	fromExpenseListItem,
} from "@/features/finance/expenses/data/expense-records";
import {
	findCurrentActionableStep,
	fromExpenseResponse,
} from "@/features/finance/expenses/data/expense-review";
import { useExpense } from "@/features/finance/expenses/hooks/use-expense";
import { useExpenseMutations } from "@/features/finance/expenses/hooks/use-expense-mutations";
import { useExpenseStats } from "@/features/finance/expenses/hooks/use-expense-stats";
import { useExpenses } from "@/features/finance/expenses/hooks/use-expenses";
import { usePendingApprovals } from "@/features/finance/expenses/hooks/use-pending-approvals";
import { useSession } from "@/lib/auth/client";

export function ExpensesTab() {
	const [search, setSearch] = useState("");
	const [sheetOpen, setSheetOpen] = useState(false);
	const [openExpenseId, setOpenExpenseId] = useState<string | null>(null);
	const [view, setView] = useState<ExpensesViewMode>("list");
	// اتخاذ قرار مباشر من الجدول/الشبكة (اعتماد/رفض) دون فتح اللوحة
	const [actionTarget, setActionTarget] = useState<{
		recordId: string;
		kind: ExpenseCardAction["kind"];
	} | null>(null);
	// ملخّص الرفض يُعرض بعد رفض الطلب من القائمة
	const [rejectedId, setRejectedId] = useState<string | null>(null);
	// حذف/إلغاء من القائمة — يُعامَل كما بداخل اللوحة: حذف للمسودة، إلغاء (بسبب) لِما أُرسل
	const [destructiveId, setDestructiveId] = useState<string | null>(null);
	// لوحة "طلبات الاعتمادات"
	const [approvalsOpen, setApprovalsOpen] = useState(false);

	const { expenses, isLoading } = useExpenses(search);
	const { stats } = useExpenseStats();
	const { approvals, isLoading: approvalsLoading } = usePendingApprovals();
	const { remove, decide, cancel } = useExpenseMutations();
	const { data: session } = useSession();
	const currentUserName = session?.user.name ?? "المستخدم الحالي";

	// نجلب المصروف المستهدَف بالقرار لحلّ الخطوة الحالية القابلة للإجراء
	const { expense: actionExpense } = useExpense(actionTarget?.recordId ?? null);
	const { expense: rejectedExpense } = useExpense(rejectedId);
	const { expense: destructiveExpense } = useExpense(destructiveId);

	const records = useMemo(() => expenses.map(fromExpenseListItem), [expenses]);

	const actionView = useMemo(
		() => (actionExpense ? fromExpenseResponse(actionExpense) : null),
		[actionExpense],
	);
	const actionStep = useMemo(
		() => (actionExpense ? findCurrentActionableStep(actionExpense) : null),
		[actionExpense],
	);
	const rejectedView = useMemo(
		() => (rejectedExpense ? fromExpenseResponse(rejectedExpense) : null),
		[rejectedExpense],
	);
	const destructiveView = useMemo(
		() => (destructiveExpense ? fromExpenseResponse(destructiveExpense) : null),
		[destructiveExpense],
	);
	// DRAFT (لم يُرسل بعد) = حذف نهائي؛ بعد الإرسال = إلغاء بسبب
	const destructiveMode = destructiveExpense
		? destructiveExpense.status === "DRAFT"
			? "delete"
			: "cancel"
		: null;

	const expenseStats: StatItem[] = useMemo(
		() => [
			{ title: "مرفوضة", value: stats?.rejected ?? 0, tooltip: "المصروفات المرفوضة" },
			{
				title: "قيد المراجعة",
				value: stats?.pendingReview ?? 0,
				tooltip: "المصروفات قيد المراجعة",
			},
			{ title: "معتمدة", value: stats?.approved ?? 0, tooltip: "المصروفات المعتمدة" },
			{
				title: "إجمالي المصروفات",
				value: stats?.totalAmount ?? 0,
				valueLabel: `${(stats?.totalAmount ?? 0).toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س`,
				tooltip: "إجمالي قيمة المصروفات",
			},
		],
		[stats],
	);

	const handleCreate = () => {
		setOpenExpenseId(null);
		setSheetOpen(true);
	};

	const handleOpen = (id: string) => {
		setOpenExpenseId(id);
		setSheetOpen(true);
	};

	// حذف من القائمة — يُعامَل مثل داخل اللوحة: حذف نهائي للمسودة، وحوار إلغاء (بسبب) لِما أُرسل
	const handleDelete = (id: string) => setDestructiveId(id);
	const closeDestructive = () => setDestructiveId(null);

	const handleConfirmDelete = async () => {
		if (!destructiveId) return;
		const id = destructiveId;
		closeDestructive();
		void remove(id);
	};

	const handleConfirmCancel = async (reason: string) => {
		if (!destructiveId) return;
		const id = destructiveId;
		closeDestructive();
		void cancel({ id, cancelReason: reason });
	};

	// قرار مباشر من القائمة — يفتح حوار القرار (بعد جلب المصروف وحلّ الخطوة)
	const handleAction = (id: string, kind: ExpenseCardAction["kind"]) => {
		setActionTarget({ recordId: id, kind });
	};

	// فتح ملخّص الرفض في أي وقت (نقر على حالة "مرفوض" أو بعد رفض من اللوحة)
	const handleOpenRejection = (id: string) => setRejectedId(id);

	// إذا اكتمل جلب المصروف ولا توجد خطوة قابلة للإجراء (حالة غير متوقعة)،
	// نفتح اللوحة بدل ترك الحوار معلّقاً بلا فتح.
	useEffect(() => {
		if (actionTarget && actionExpense && !actionStep) {
			const id = actionTarget.recordId;
			setActionTarget(null);
			setOpenExpenseId(id);
			setSheetOpen(true);
		}
	}, [actionTarget, actionExpense, actionStep]);

	// إغلاق القرار عند إلغاء الحوار أو انتهائه
	const closeAction = () => setActionTarget(null);

	// القرار المُرسَل مطابق لنوع الزر المضغوط (اعتماد/رفض/صرف)
	const actionDecision: ReviewDecision =
		actionTarget?.kind === "reject"
			? "reject"
			: actionTarget?.kind === "disburse"
				? "disburse"
				: "approve";

	const handleConfirmDecision = async (signatureName: string, notes: string) => {
		if (!actionTarget || !actionExpense || !actionStep) return;
		const decision = actionDecision;
		const targetId = actionTarget.recordId;
		closeAction();
		try {
			await decide({
				id: targetId,
				stepId: actionStep.stepId,
				decision,
				signed: true,
				signatureName,
				reason: decision === "reject" ? notes : undefined,
			});
			if (decision === "approve") {
				toast.success("تم اعتماد المصروف بنجاح", {
					description:
						"تمت مراجعة واعتماد طلب المصروف، وأصبح جاهزًا للانتقال إلى المرحلة التالية من دورة الصرف.",
				});
			} else if (decision === "disburse") {
				toast.success("تم صرف المصروف بنجاح", {
					description: "تم تسجيل عملية الصرف وتحديث حالة الطلب إلى «تم الصرف».",
				});
			} else {
				toast.error("تم رفض المصروف", {
					description: "تم رفض طلب المصروف وإشعار مقدم الطلب بسبب القرار.",
				});
				// نعرض ملخّص الرفض مباشرة بعد الرفض
				setRejectedId(targetId);
			}
		} catch {
			// toast في الـ hook
		}
	};

	// عند فتح حوار القرار: القرار لم يُحسم بعد إلا عندما نصل للخطوة القابلة للإجراء
	const decisionDialogOpen = !!actionTarget && !!actionView && !!actionStep;

	return (
		<>
			<Stats
				className="px-[9px]"
				stats={expenseStats}
				variant="inventory"
			/>
			<hr className="my-2" />
			<ExpensesToolbar
				search={search}
				onSearchChange={setSearch}
				onCreate={handleCreate}
				view={view}
				onViewChange={setView}
				onOpenApprovals={() => setApprovalsOpen(true)}
				approvalsCount={approvals.length}
			/>
			<hr className="my-2" />

			{!isLoading && records.length === 0 ? (
				<ExpensesEmpty onCreate={handleCreate} />
			) : view === "grid" ? (
				<ExpensesGrid
					records={records}
					onOpen={handleOpen}
					onDelete={handleDelete}
					onAction={handleAction}
					onOpenRejection={handleOpenRejection}
				/>
			) : (
				<ExpensesList
					records={records}
					onOpen={handleOpen}
					onDelete={handleDelete}
					onAction={handleAction}
					onOpenRejection={handleOpenRejection}
				/>
			)}

			<CreateExpenseSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				expenseId={openExpenseId}
				onRejected={(id) => {
					setSheetOpen(false);
					setRejectedId(id);
				}}
			/>

			{/* لوحة "طلبات الاعتمادات" — الطلبات التي تنتظر إجراء المستخدم */}
			<ExpenseApprovalsSheet
				open={approvalsOpen}
				onOpenChange={setApprovalsOpen}
				approvals={approvals}
				isLoading={approvalsLoading}
				onDecision={(id, decision) => {
					setApprovalsOpen(false);
					handleAction(id, decision);
				}}
				onTrack={(id) => {
					setApprovalsOpen(false);
					handleOpen(id);
				}}
			/>

			{/* حوار القرار المباشر من القائمة (اعتماد/رفض/صرف) */}
			{actionView && (
				<ReviewDecisionDialog
					open={decisionDialogOpen}
					onOpenChange={(o) => !o && closeAction()}
					request={actionView.request}
					decision={actionDecision}
					signerName={currentUserName}
					onConfirm={handleConfirmDecision}
				/>
			)}

			{/* ملخّص الرفض بعد رفض الطلب من القائمة */}
			{rejectedView && (
				<ExpenseRejectionSummaryDialog
					open={!!rejectedId}
					onOpenChange={(o) => !o && setRejectedId(null)}
					request={rejectedView.request}
					rejectionReason={rejectedExpense?.rejectionReason ?? ""}
					onEdit={() => {
						const id = rejectedId;
						setRejectedId(null);
						if (id) handleOpen(id);
					}}
				/>
			)}

			{/* حذف من القائمة: حوار الحذف للمسودة، أو حوار الإلغاء (بسبب) لِما أُرسل */}
			{destructiveView && destructiveMode === "delete" && (
				<DeleteExpenseRequestDialog
					open={!!destructiveId}
					onOpenChange={(o) => !o && closeDestructive()}
					request={destructiveView.request}
					onConfirm={handleConfirmDelete}
				/>
			)}
			{destructiveView && destructiveMode === "cancel" && (
				<CancelExpenseRequestDialog
					open={!!destructiveId}
					onOpenChange={(o) => !o && closeDestructive()}
					request={destructiveView.request}
					onConfirm={handleConfirmCancel}
				/>
			)}
		</>
	);
}
