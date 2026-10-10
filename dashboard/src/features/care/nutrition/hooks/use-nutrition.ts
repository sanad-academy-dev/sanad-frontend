import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type {
	CatalogSpecies,
	DietFoodForm,
	DietFoodKind,
	NutritionGoal,
	NutritionPlanStatus,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	DietFoodResponse,
	NutritionDueRow,
	NutritionPlanDetailResponse,
	NutritionPlanListResponse,
	NutritionStats,
} from "@/server/nutrition/nutrition.type";

/** مفاتيح الاستعلام في مكان واحد — الإبطال بعد الطفرات يلمس الشجرة كلها */
export const nutritionKeys = {
	all: ["nutrition"] as const,
	stats: () => [...nutritionKeys.all, "stats"] as const,
	due: (filters?: Record<string, unknown>) =>
		[...nutritionKeys.all, "due", filters ?? {}] as const,
	plans: (filters?: Record<string, unknown>) =>
		[...nutritionKeys.all, "plans", filters ?? {}] as const,
	plan: (id: string) => [...nutritionKeys.all, "plan", id] as const,
	foods: (filters?: Record<string, unknown>) =>
		[...nutritionKeys.all, "foods", filters ?? {}] as const,
	weightHistory: (patientId: string) =>
		[...nutritionKeys.all, "weight-history", patientId] as const,
	reference: () => [...nutritionKeys.all, "reference"] as const,
};

const EMPTY_STATS: NutritionStats = {
	activePlans: 0,
	dueRechecks: 0,
	overdueRechecks: 0,
	weightManagementPlans: 0,
	goalReachedThisMonth: 0,
	dietFoods: 0,
};

export const useNutritionStats = () => {
	const { data, isLoading } = useQuery<NutritionStats>({
		queryKey: nutritionKeys.stats(),
		queryFn: async () => {
			const res = await api.nutrition.stats.get();
			if (res.error) throw new Error("فشل جلب إحصاءات التغذية");
			return res.data as NutritionStats;
		},
	});

	const stats = data ?? EMPTY_STATS;

	const statItems: StatItem[] = [
		{
			title: "خطط سارية",
			value: stats.activePlans,
			tooltip: "خطط تغذية مفعّلة يُغذّى عليها طفل الآن",
		},
		{
			title: "مراجعات مستحقّة",
			value: stats.dueRechecks,
			tooltip: "خطط حان موعد وزنها أو يحين خلال شهر — نفس مدى القائمة الافتراضي",
		},
		{
			title: "مراجعات متأخّرة",
			value: stats.overdueRechecks,
			tooltip: "خطط تجاوزت موعد المراجعة — حِمية بلا متابعة لا تُقيَّم",
		},
		{
			title: "برامج وزن",
			value: stats.weightManagementPlans,
			tooltip: "خطط هدفها إنقاص الوزن أو زيادته",
		},
		{
			title: "بلغت الهدف",
			value: stats.goalReachedThisMonth,
			tooltip: "خطط بلغت وزنها المثالي منذ بداية الشهر",
		},
		{
			title: "أغذية الكتالوج",
			value: stats.dietFoods,
			tooltip: "عدد الأغذية المفعّلة في كتالوج الأكاديمية",
		},
	];

	return { stats, statItems, isLoading };
};

/** `horizonDays: 0` مدى صالح يعني «الكل» — ليس قيمة فارغة تُحذف من الاستعلام */
export const useNutritionDue = (filters: { horizonDays?: number } = {}) => {
	const { data, isLoading, isError } = useQuery<NutritionDueRow[]>({
		queryKey: nutritionKeys.due(filters),
		queryFn: async () => {
			const res = await api.nutrition.due.get({ query: filters });
			if (res.error) throw new Error("فشل جلب المراجعات المستحقّة");
			return res.data as NutritionDueRow[];
		},
	});
	return { rows: data ?? [], isLoading, isError };
};

export const useNutritionPlans = (
	filters: {
		patientId?: string;
		status?: NutritionPlanStatus;
		goal?: NutritionGoal;
		q?: string;
		take?: number;
	} = {},
) => {
	const { data, isLoading, isError } = useQuery<NutritionPlanListResponse[]>({
		queryKey: nutritionKeys.plans(filters),
		queryFn: async () => {
			const res = await api.nutrition.plans.get({ query: filters });
			if (res.error) throw new Error("فشل جلب خطط التغذية");
			return res.data as NutritionPlanListResponse[];
		},
	});
	return { plans: data ?? [], isLoading, isError };
};

export const useNutritionPlan = (id?: string) => {
	const { data, isLoading } = useQuery<NutritionPlanDetailResponse>({
		queryKey: nutritionKeys.plan(id ?? ""),
		enabled: !!id,
		queryFn: async () => {
			const res = await api.nutrition.plans({ id: id as string }).get();
			if (res.error) throw new Error("فشل جلب الخطة");
			return res.data as NutritionPlanDetailResponse;
		},
	});
	return { plan: data, isLoading };
};

export const useDietFoods = (
	filters: {
		q?: string;
		/** الطفل المختار — الخادم يشتقّ نوعه ويرشّح الكتالوج عليه */
		patientId?: string;
		species?: CatalogSpecies;
		kind?: DietFoodKind;
		form?: DietFoodForm;
		activeOnly?: boolean;
	} = {},
) => {
	const { data, isLoading, isError } = useQuery<DietFoodResponse[]>({
		queryKey: nutritionKeys.foods(filters),
		queryFn: async () => {
			const res = await api.nutrition.foods.get({ query: filters });
			if (res.error) throw new Error("فشل جلب كتالوج الأغذية");
			return res.data as DietFoodResponse[];
		},
	});
	return { foods: data ?? [], isLoading, isError };
};

export type WeightHistoryPoint = {
	at: string;
	weightKg: number;
	bodyConditionScore: number | null;
	source: "recheck" | "vitals";
};

export const useWeightHistory = (patientId?: string) => {
	const { data, isLoading } = useQuery<WeightHistoryPoint[]>({
		queryKey: nutritionKeys.weightHistory(patientId ?? ""),
		enabled: !!patientId,
		queryFn: async () => {
			const res = await api.nutrition["weight-history"]({
				patientId: patientId as string,
			}).get();
			if (res.error) throw new Error("فشل جلب سجلّ الوزن");
			return res.data as unknown as WeightHistoryPoint[];
		},
	});
	return { points: data ?? [], isLoading };
};

// ── الحاسبة الحيّة ─────────────────────────────────────────────────────────
// الشاشة تستدعيها مع كل تغيير، فلا مفتاح استعلام لها ولا تخزين: النتيجة تخصّ
// حالة النموذج في هذه اللحظة، وتخزينها يعني عرض حساب لمعطيات تغيّرت.

type CalculateBody = Parameters<typeof api.nutrition.calculate.post>[0];
export type NutritionCalculation = Awaited<
	ReturnType<typeof api.nutrition.calculate.post>
>["data"];

export const useNutritionCalculator = () => {
	const { mutateAsync, data, isPending, reset } = useMutation({
		mutationFn: async (body: CalculateBody) => {
			const res = await api.nutrition.calculate.post(body);
			if (res.error) throw new Error("فشل حساب الطاقة");
			return res.data;
		},
	});
	return { calculate: mutateAsync, calculation: data, isCalculating: isPending, reset };
};

// ── الطفرات ────────────────────────────────────────────────────────────────

const errorText = (error: unknown, fallback: string) => {
	if (error && typeof error === "object" && "message" in error) {
		const message = (error as { message?: unknown }).message;
		if (typeof message === "string" && message) return message;
	}
	return fallback;
};

export const useNutritionMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () => void queryClient.invalidateQueries({ queryKey: nutritionKeys.all });

	const createPlan = useMutation({
		mutationFn: async (body: Parameters<typeof api.nutrition.plans.post>[0]) => {
			const res = await api.nutrition.plans.post(body);
			if (res.error) throw res.error.value ?? new Error("فشل حفظ الخطة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const updatePlan = useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: string;
			body: Parameters<ReturnType<typeof api.nutrition.plans>["put"]>[0];
		}) => {
			const res = await api.nutrition.plans({ id }).put(body);
			if (res.error) throw res.error.value ?? new Error("فشل تحديث الخطة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const activatePlan = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.nutrition.plans({ id }).activate.post();
			if (res.error) throw res.error.value ?? new Error("فشل تفعيل الخطة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const completePlan = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.nutrition.plans({ id }).complete.post();
			if (res.error) throw res.error.value ?? new Error("فشل إنهاء الخطة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const discontinuePlan = useMutation({
		mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
			const res = await api.nutrition.plans({ id }).discontinue.post({ reason });
			if (res.error) throw res.error.value ?? new Error("فشل إيقاف الخطة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const recordRecheck = useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: string;
			body: Parameters<ReturnType<typeof api.nutrition.plans>["rechecks"]["post"]>[0];
		}) => {
			const res = await api.nutrition.plans({ id }).rechecks.post(body);
			if (res.error) throw res.error.value ?? new Error("فشل تسجيل المراجعة");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const saveFood = useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id?: string;
			body: Parameters<typeof api.nutrition.foods.post>[0];
		}) => {
			const res = id
				? await api.nutrition.foods({ id }).put(body)
				: await api.nutrition.foods.post(body);
			if (res.error) throw res.error.value ?? new Error("فشل حفظ الغذاء");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteFood = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.nutrition.foods({ id }).delete();
			if (res.error) throw res.error.value ?? new Error("فشل حذف الغذاء");
			return res.data;
		},
		onSuccess: invalidate,
	});

	const draftInstructions = useMutation({
		mutationFn: async ({ id, hint }: { id: string; hint?: string | null }) => {
			const res = await api.nutrition.plans({ id })["draft-instructions"].post({
				hint: hint ?? null,
			});
			if (res.error) throw res.error.value ?? new Error("تعذّر توليد المسودّة");
			return res.data;
		},
	});

	// الصياغة من حالة النموذج — تعمل قبل الحفظ، فلا تُشترط خطة قائمة
	const draftField = useMutation({
		mutationFn: async (body: Parameters<(typeof api.nutrition)["draft-field"]["post"]>[0]) => {
			const res = await api.nutrition["draft-field"].post(body);
			if (res.error) throw res.error.value ?? new Error("تعذّر توليد المسودّة");
			return res.data;
		},
	});

	return {
		createPlan: (body: Parameters<typeof api.nutrition.plans.post>[0]) =>
			toast.promise(createPlan.mutateAsync(body), {
				loading: "جارٍ حفظ الخطة...",
				success: "حُفظت خطة التغذية",
				error: (e) => errorText(e, "فشل حفظ الخطة"),
			}),
		updatePlan: (args: {
			id: string;
			body: Parameters<ReturnType<typeof api.nutrition.plans>["put"]>[0];
		}) =>
			toast.promise(updatePlan.mutateAsync(args), {
				loading: "جارٍ تحديث الخطة...",
				success: "حُدِّثت الخطة",
				error: (e) => errorText(e, "فشل تحديث الخطة"),
			}),
		activatePlan: (id: string) =>
			toast.promise(activatePlan.mutateAsync(id), {
				loading: "جارٍ التفعيل...",
				success: "فُعِّلت الخطة وجُدولت أول مراجعة",
				error: (e) => errorText(e, "فشل تفعيل الخطة"),
			}),
		completePlan: (id: string) =>
			toast.promise(completePlan.mutateAsync(id), {
				loading: "جارٍ الإنهاء...",
				success: "اكتملت الخطة",
				error: (e) => errorText(e, "فشل إنهاء الخطة"),
			}),
		discontinuePlan: (args: { id: string; reason: string }) =>
			toast.promise(discontinuePlan.mutateAsync(args), {
				loading: "جارٍ الإيقاف...",
				success: "أُوقفت الخطة",
				error: (e) => errorText(e, "فشل إيقاف الخطة"),
			}),
		recordRecheck: (args: {
			id: string;
			body: Parameters<ReturnType<typeof api.nutrition.plans>["rechecks"]["post"]>[0];
		}) =>
			toast.promise(recordRecheck.mutateAsync(args), {
				loading: "جارٍ تسجيل المراجعة...",
				success: "سُجِّلت المراجعة وحُدِّثت السعرات",
				error: (e) => errorText(e, "فشل تسجيل المراجعة"),
			}),
		saveFood: (args: { id?: string; body: Parameters<typeof api.nutrition.foods.post>[0] }) =>
			toast.promise(saveFood.mutateAsync(args), {
				loading: "جارٍ الحفظ...",
				success: args.id ? "حُدِّث الغذاء" : "أُضيف الغذاء إلى الكتالوج",
				error: (e) => errorText(e, "فشل حفظ الغذاء"),
			}),
		deleteFood: (id: string) =>
			toast.promise(deleteFood.mutateAsync(id), {
				loading: "جارٍ الحذف...",
				success: "حُذف الغذاء من الكتالوج",
				error: (e) => errorText(e, "فشل حذف الغذاء"),
			}),
		draftInstructions: draftInstructions.mutateAsync,
		// يُعيد النتيجة لا غلاف التنبيه: المتصل يحتاج النصّ ليضعه في الحقل،
		// و`toast.promise` يعيد غلافًا لا يحمل البيانات
		draftField: (body: Parameters<(typeof api.nutrition)["draft-field"]["post"]>[0]) => {
			const promise = draftField.mutateAsync(body);
			toast.promise(promise, {
				loading: "جارٍ الصياغة...",
				success: "جاهزة — راجِعها قبل الحفظ",
				error: (e) => errorText(e, "تعذّر توليد المسودّة"),
			});
			return promise;
		},
		isDrafting: draftInstructions.isPending || draftField.isPending,
		isPending:
			createPlan.isPending ||
			updatePlan.isPending ||
			activatePlan.isPending ||
			recordRecheck.isPending ||
			saveFood.isPending,
	};
};
