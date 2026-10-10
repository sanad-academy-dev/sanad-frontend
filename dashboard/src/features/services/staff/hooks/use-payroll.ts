import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	PayrollEarningType,
	PayrollPaymentMethod,
	PayrollRunDetail,
	PayrollRunSummary,
	PayrollRunType,
	PayrollScope,
} from "@/server/payroll/payroll.type";

// مدخلات المسير خارج الدورة — مشتقة من موديل الخادم "payroll.run.offCycle"
export type OffCycleInput = {
	periodYear: number;
	periodMonth: number;
	payDate?: string | null;
	reason: string;
	lines: { staffId: string; type: PayrollEarningType; amount: number; note?: string | null }[];
};

const RUNS_KEY = ["payroll", "runs"];
const runKey = (id: string) => ["payroll", "run", id];

const errorMessage = (error: unknown, fallback: string) =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

// قائمة المسيرات — تغذّي الجدول الرئيسي وحوار السجل
export const usePayrollRuns = () => {
	const { data, isLoading } = useQuery<PayrollRunSummary[]>({
		queryKey: RUNS_KEY,
		queryFn: async () => {
			const res = await api.payroll.runs.get();
			if (res.error) throw new Error("فشل تحميل مسيرات الرواتب");
			return res.data;
		},
	});
	return { runs: data ?? [], isLoading };
};

// تفاصيل مسير واحد بأسطره — مصدر كل خطوات المعالج بعد الإنشاء
export const usePayrollRun = (runId: string | null) => {
	const { data, isLoading, refetch } = useQuery<PayrollRunDetail | null>({
		queryKey: runKey(runId ?? ""),
		enabled: !!runId,
		queryFn: async () => {
			const res = await api.payroll.runs({ id: runId as string }).get();
			if (res.error) throw new Error("فشل تحميل المسير");
			return res.data;
		},
	});
	return { run: data ?? null, isLoading, refetch };
};

// صافي رواتب آخر مسير معتمد — null يعني لا يوجد، فيُخفى عمود الفرق
export const usePreviousNets = (runId: string | null) => {
	const { data } = useQuery<Record<string, number> | null>({
		queryKey: ["payroll", "previous-nets", runId],
		enabled: !!runId,
		queryFn: async () => {
			const res = await api.payroll.runs({ id: runId as string })["previous-nets"].get();
			if (res.error) return null;
			return res.data;
		},
	});
	return { previousNets: data ?? null };
};

// معاينة ساعات الموظفين قبل إنشاء المسير
export interface PayrollPreviewRow {
	staffId: string;
	totalHours: number;
	overtimeHours: number;
	paymentMethod: PayrollPaymentMethod;
	isActive: boolean;
	hasCompensation: boolean;
}

export const usePayrollPreview = (period: { year: number; month: number }) => {
	const { data, isLoading } = useQuery<PayrollPreviewRow[]>({
		queryKey: ["payroll", "preview", period.year, period.month],
		queryFn: async () => {
			const res = await api.payroll.preview.get({
				query: { year: String(period.year), month: String(period.month) },
			});
			if (res.error) throw new Error("فشل تحميل معاينة الموظفين");
			return res.data;
		},
	});
	return { preview: data ?? [], isLoading };
};

// تفصيل إجازات الفترة لكل موظف + الرصيد المتبقي
export interface RunLeaveCell {
	slug: string;
	name: string;
	payPercent: number;
	periodDays: number;
	remaining: number | null;
	entitlementDays: number | null;
}

export interface RunLeaves {
	types: { slug: string; name: string }[];
	rows: { staffId: string; staffName: string; leaves: RunLeaveCell[] }[];
}

export const useRunLeaves = (runId: string | null) => {
	const { data, isLoading } = useQuery<RunLeaves | null>({
		queryKey: ["payroll", "leaves", runId],
		enabled: !!runId,
		queryFn: async () => {
			const res = await api.payroll.runs({ id: runId as string }).leaves.get();
			if (res.error) throw new Error("فشل تحميل بيانات الإجازات");
			return res.data as RunLeaves;
		},
	});
	return { leaves: data ?? null, isLoading };
};

export const usePayrollMutations = (runId: string | null) => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: RUNS_KEY });
		if (runId) queryClient.invalidateQueries({ queryKey: runKey(runId) });
	};

	const createRun = useMutation({
		mutationFn: async (input: {
			periodYear: number;
			periodMonth: number;
			// OFF_CYCLE يتجاوز قيد «مسير نشط واحد للفترة»
			type?: PayrollRunType;
			scope?: PayrollScope;
			scopeBranchId?: string | null;
			scopeRoleId?: string | null;
		}) => {
			const res = await api.payroll.runs.post(input);
			if (res.error) throw new Error(errorMessage(res.error, "فشل إنشاء المسير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	// مسير خارج الدورة بمبالغ يدوية — يُنشأ مكتملًا بحالة CALCULATED
	const createOffCycle = useMutation({
		mutationFn: async (input: OffCycleInput) => {
			const res = await api.payroll.runs["off-cycle"].post(input);
			if (res.error) throw new Error(errorMessage(res.error, "فشل إنشاء المسير خارج الدورة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const calculate = useMutation({
		mutationFn: async (options: { confirmRemovals?: boolean } = {}) => {
			const res = await api.payroll
				.runs({ id: runId as string })
				.calculate.post({ confirmRemovals: options.confirmRemovals });
			if (res.error) throw new Error(errorMessage(res.error, "فشل احتساب المسير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const updateLine = useMutation({
		mutationFn: async ({
			lineId,
			...data
		}: {
			lineId: string;
			overtimeHoursOverride?: number | null;
			paymentMethodOverride?: PayrollPaymentMethod | null;
			note?: string | null;
			excluded?: boolean;
		}) => {
			const res = await api.payroll.lines({ lineId }).patch(data);
			if (res.error) throw new Error(errorMessage(res.error, "فشل حفظ التعديل"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const clearOverride = useMutation({
		mutationFn: async ({
			lineId,
			field,
		}: {
			lineId: string;
			field: "overtimeHours" | "paymentMethod";
		}) => {
			const res = await api.payroll.lines({ lineId }).override({ field }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "فشل استرجاع القيمة المقترحة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addEarning = useMutation({
		mutationFn: async ({
			lineId,
			...data
		}: {
			lineId: string;
			type: PayrollEarningType;
			amount: number;
			note?: string | null;
		}) => {
			const res = await api.payroll.lines({ lineId }).earnings.post(data);
			if (res.error) throw new Error(errorMessage(res.error, "فشل إضافة الاستحقاق"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const removeEarning = useMutation({
		mutationFn: async (earningId: string) => {
			const res = await api.payroll.earnings({ earningId }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "فشل حذف الاستحقاق"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const approve = useMutation({
		mutationFn: async () => {
			const res = await api.payroll.runs({ id: runId as string }).approve.post();
			if (res.error) throw new Error(errorMessage(res.error, "فشل اعتماد المسير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const markPaid = useMutation({
		mutationFn: async () => {
			const res = await api.payroll.runs({ id: runId as string }).pay.post();
			if (res.error) throw new Error(errorMessage(res.error, "فشل تسجيل الصرف"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const cancel = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.payroll.runs({ id }).cancel.post();
			if (res.error) throw new Error(errorMessage(res.error, "فشل إلغاء المسير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	// مغلّف توست موحّد للعمليات التي يبادر بها المستخدم صراحة
	const withToast = <T>(promise: Promise<T>, loading: string, success: string) => {
		toast.promise(promise, {
			loading,
			success,
			error: (err: Error) => err.message,
		});
		return promise;
	};

	return {
		createRun,
		createOffCycle,
		calculate,
		updateLine,
		clearOverride,
		addEarning,
		removeEarning,
		approve,
		markPaid,
		cancel,
		withToast,
	};
};
