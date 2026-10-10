import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { InpatientStayStatus, PaymentMethod } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

// [IP1] استعلامات وطفرات وحدة التنويم.
//
// اللوحة تُحدَّث بالاستطلاع كل ٣٠ ثانية على نمط لوحة العمليات: العنبر يتغيّر
// بالساعة لا باللحظة، وSSE هنا قناة رابعة بلا مقابل. الإنذارات الحرجة تصل عبر
// الوارد أصلًا (قناته مشتركة ومركّبة مرّة واحدة في التخطيط).

export const INPATIENTS_POLL_MS = 30_000;

export const inpatientKeys = {
	all: ["inpatients"] as const,
	board: (filters?: Record<string, unknown>) =>
		[...inpatientKeys.all, "board", filters ?? {}] as const,
	stats: () => [...inpatientKeys.all, "stats"] as const,
	due: () => [...inpatientKeys.all, "due"] as const,
	stay: (id: string) => [...inpatientKeys.all, "stay", id] as const,
	activity: (id: string) => [...inpatientKeys.all, "activity", id] as const,
	consents: (id: string) => [...inpatientKeys.all, "consents", id] as const,
	orders: (id: string) => [...inpatientKeys.all, "orders", id] as const,
	requests: (id: string) => [...inpatientKeys.all, "requests", id] as const,
	administrations: (id: string, day?: string) =>
		[...inpatientKeys.all, "mar", id, day ?? "today"] as const,
	vitals: (id: string) => [...inpatientKeys.all, "vitals", id] as const,
	invoice: (id: string) => [...inpatientKeys.all, "invoice", id] as const,
	cages: (filters?: Record<string, unknown>) =>
		[...inpatientKeys.all, "cages", filters ?? {}] as const,
	occupancy: (branchId?: string) =>
		[...inpatientKeys.all, "occupancy", branchId ?? "all"] as const,
};

type BoardFilters = { view?: string; q?: string; kind?: string; acuity?: string };

export const useInpatientBoard = (filters: BoardFilters) => {
	const { data, isLoading, isError, failureCount } = useQuery({
		queryKey: inpatientKeys.board(filters),
		queryFn: async () => {
			const { data, error } = await api.inpatients.get({ query: filters });
			if (error) throw new Error("تعذّر تحميل لوحة التنويم");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		// لا استطلاع والتبويب في الخلفية — العنبر لا يُقرأ من تبويب مخفيّ
		refetchIntervalInBackground: false,
		staleTime: 1000 * 10,
	});
	return {
		stays: data ?? [],
		isLoading,
		liveState: isError || failureCount > 0 ? ("disconnected" as const) : ("live" as const),
	};
};

export const useInpatientStats = () => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.stats(),
		queryFn: async () => {
			const { data, error } = await api.inpatients.stats.get();
			if (error) throw new Error("تعذّر تحميل الإحصائيات");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});

	const s = data ?? {
		census: 0,
		icu: 0,
		isolation: 0,
		criticalAcuity: 0,
		overdueCount: 0,
		dischargedToday: 0,
	};

	const statItems: StatItem[] = [
		{ title: "في العنبر الآن", value: s.census, tooltip: "كل الإقامات القائمة" },
		{
			title: "عناية مركّزة",
			value: s.icu,
			tooltip: "إقامات نوعها عناية مركّزة",
		},
		{
			title: "حالات حرجة",
			value: s.criticalAcuity,
			tooltip: "درجة الحرجية «حرج جدًا» — تُراقَب كل ساعة افتراضيًا",
		},
		{
			title: "جرعات فائتة",
			value: s.overdueCount,
			tooltip: "جرعات مضى موعدها ومهلتها ولم تُنفَّذ بعد",
		},
		{ title: "خرجوا اليوم", value: s.dischargedToday, tooltip: "إقامات أُنهيت اليوم" },
	];

	return { stats: s, statItems, isLoading };
};

export const useInpatientDue = () => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.due(),
		queryFn: async () => {
			const { data, error } = await api.inpatients.due.get();
			if (error) throw new Error("تعذّر تحميل قائمة المستحقّ");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});
	return { due: data ?? [], isLoading };
};

export const useInpatientStay = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.stay(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل الإقامة");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});
	return { stay: data ?? null, isLoading };
};

export const useInpatientActivity = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.activity(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).activity.get();
			if (error) throw new Error("تعذّر تحميل سجل النشاط");
			return data;
		},
	});
	return { activity: data ?? [], isLoading };
};

/** إقرارات الإقامة — أساس بوابة G3 وما يعرضه لسان «نظرة عامة» */
export const useInpatientConsents = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.consents(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).consents.get();
			if (error) throw new Error("تعذّر تحميل الإقرارات");
			return data;
		},
	});
	return { consents: data ?? [], isLoading };
};

/**
 * إنشاء إقرار التنويم مربوطًا بالإقامة.
 *
 * الربط هو بيت القصيد: البوابة G3 تعدّ الإقرارات التي تحمل `inpatientStayId`،
 * فإقرارٌ يُنشأ على الطفل بلا ربط لا يفتح البوابة مهما وُقّع.
 */
export const useCreateInpatientConsent = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: { patientId: string; templateKey: string }) => {
			const { data, error } = await api["patient-consents"].post({
				patientId: vars.patientId,
				templateKey: vars.templateKey,
				inpatientStayId: stayId,
			} as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الإقرار"));
			return data as { id: string };
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("أُنشئ الإقرار — وقّعه لتُفتح بوابة بدء الرعاية");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

/** [IP2] طلبات المختبر والأشعّة المربوطة بالإقامة — كلّها، لا المكتملة وحدها */
export const useInpatientRequests = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.requests(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).requests.get();
			if (error) throw new Error("تعذّر تحميل الطلبات");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});
	return { requests: data ?? [], isLoading };
};

export const useInpatientOrders = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.orders(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).orders.get();
			if (error) throw new Error("تعذّر تحميل الأوامر");
			return data;
		},
	});
	return { orders: data ?? [], isLoading };
};

export const useInpatientAdministrations = (id: string | null, day?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.administrations(id ?? "", day),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api
				.inpatients({ id: id as string })
				.administrations.get({ query: day ? { day } : {} });
			if (error) throw new Error("تعذّر تحميل ورقة العلاج");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});
	return { administrations: data ?? [], isLoading };
};

export const useInpatientVitals = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.vitals(id ?? ""),
		enabled: Boolean(id),
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).vitals.get();
			if (error) throw new Error("تعذّر تحميل ورقة المتابعة");
			return data;
		},
	});
	return { vitals: data ?? [], isLoading };
};

export const useInpatientInvoice = (id: string | null, enabled = true) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.invoice(id ?? ""),
		enabled: Boolean(id) && enabled,
		queryFn: async () => {
			const { data, error } = await api.inpatients({ id: id as string }).invoice.get();
			if (error) throw new Error("تعذّر تحميل الفاتورة");
			return data;
		},
	});
	return { invoice: data ?? null, isLoading };
};

export const useCages = (filters: { branchId?: string; onlyFree?: boolean } = {}) => {
	const { data, isLoading } = useQuery({
		queryKey: inpatientKeys.cages(filters),
		queryFn: async () => {
			const { data, error } = await api.inpatients.cages.get({
				query: {
					...(filters.branchId ? { branchId: filters.branchId } : {}),
					...(filters.onlyFree ? { onlyFree: "true" } : {}),
				},
			});
			if (error) throw new Error("تعذّر تحميل الأقفاص");
			return data;
		},
		refetchInterval: INPATIENTS_POLL_MS,
		refetchIntervalInBackground: false,
	});
	return { cages: data ?? [], isLoading };
};

// ── الطفرات ────────────────────────────────────────────────────────────────

/** إبطال شامل بعد كل كتابة — شجرة الوحدة صغيرة والدقّة أهمّ من التوفير */
const useInvalidate = () => {
	const qc = useQueryClient();
	return (stayId?: string) => {
		qc.invalidateQueries({ queryKey: inpatientKeys.all });
		if (stayId) qc.invalidateQueries({ queryKey: inpatientKeys.stay(stayId) });
	};
};

/** رسالة الخطأ كما يعيدها الخادم — البوابة المرفوضة تُقرأ ولا تُبتلع */
const errorMessage = (error: unknown, fallback: string): string => {
	const value = (error as { value?: { message?: string } } | null)?.value;
	return value?.message ?? fallback;
};

/** [IP2] كتابة طلب التنويم — بلا قفص؛ الإسكان خطوة تالية */
export const useRequestInpatient = () => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.inpatients.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل طلب التنويم"));
			return data;
		},
		onSuccess: () => {
			invalidate();
			toast.success("سُجّل طلب التنويم — بانتظار الإسكان");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

/** [IP2] الإدخال — هنا يُختار القفص، وبه تدخل الإقامة فعلًا */
export const useAdmitInpatient = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: { cageId: string; expectedDischargeAt?: string | null }) => {
			const { data, error } = await api.inpatients({ id: stayId }).admit.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إدخال الطفل"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("دخل الطفل التنويم وأُسكن في قفصه");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useUpdateInpatient = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.inpatients({ id: stayId }).patch(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ التعديل"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("حُفظ التعديل");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useTransitionInpatient = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: {
			to: InpatientStayStatus;
			overrideReason?: string | null;
			cancelReason?: string | null;
		}) => {
			const { data, error } = await api.inpatients({ id: stayId }).status.post(vars as never);
			if (error) throw new Error(errorMessage(error, "تعذّر نقل الإقامة"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("نُقلت الإقامة");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useDischargeInpatient = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: Record<string, unknown>) => {
			const { data, error } = await api
				.inpatients({ id: stayId })
				.discharge.post(vars as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إنهاء الإقامة"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("أُنهيت الإقامة");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useAssignCage = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: { cageId: string; reason?: string | null }) => {
			const { data, error } = await api.inpatients({ id: stayId }).cage.post(vars as never);
			if (error) throw new Error(errorMessage(error, "تعذّر الإسكان"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("تمّ الإسكان");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useCreateOrder = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.inpatients({ id: stayId }).orders.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الأمر"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("أُضيف الأمر وجُدولت جرعاته");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useDiscontinueOrder = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: { orderId: string; reasonAr: string }) => {
			const { data, error } = await api
				.inpatients({ id: stayId })
				.orders({ orderId: vars.orderId })
				.discontinue.post({ reasonAr: vars.reasonAr });
			if (error) throw new Error(errorMessage(error, "تعذّر إيقاف الأمر"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("أُوقف الأمر");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useGiveAdministration = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: { administrationId: string } & Record<string, unknown>) => {
			const { administrationId, ...body } = vars;
			const { data, error } = await api
				.inpatients({ id: stayId })
				.administrations({ administrationId })
				.give.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل الجرعة"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("سُجّلت الجرعة");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useSkipAdministration = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: {
			administrationId: string;
			skipReasonAr: string;
			hold?: boolean;
		}) => {
			const { administrationId, ...body } = vars;
			const { data, error } = await api
				.inpatients({ id: stayId })
				.administrations({ administrationId })
				.skip.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل التخطّي"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("سُجّل القرار");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useRecordVitals = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.inpatients({ id: stayId }).vitals.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ القياس"));
			return data;
		},
		onSuccess: (result) => {
			invalidate(stayId);
			const alerts = (result as { alerts?: { severity: string; messageAr: string }[] })
				?.alerts;
			const critical = alerts?.filter((a) => a.severity === "CRITICAL") ?? [];
			// الإنذار الحرج يُعرض فورًا لمن سجّل القياس — لا يُترك للوارد وحده
			if (critical.length > 0) {
				for (const alert of critical) toast.error(alert.messageAr, { duration: 10_000 });
			} else {
				toast.success("سُجّل القياس");
			}
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const useAddInpatientNote = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: {
			body: string;
			mentionUserIds?: string[];
			handover?: boolean;
		}) => {
			const { data, error } = await api.inpatients({ id: stayId }).notes.post(vars as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الملاحظة"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("أُضيفت الملاحظة");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

export const usePayInpatientInvoice = (stayId: string) => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (vars: { amountPaid: number; paymentMethod: PaymentMethod }) => {
			const { data, error } = await api
				.inpatients({ id: stayId })
				.invoice.pay.post(vars as never);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل الدفعة"));
			return data;
		},
		onSuccess: () => {
			invalidate(stayId);
			toast.success("سُجّلت الدفعة");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};

/**
 * مسودّة الذكاء الاصطناعي — تُعاد للمحرّر ولا تُحفظ.
 *
 * الفشل يُعرض تحذيرًا لا خطأً أحمر: غياب مزوّد النموذج لا يمنع المدرّب من كتابة
 * تقريره كما كان يكتبه دائمًا.
 */
export const useInpatientDraft = (stayId: string) =>
	useMutation({
		mutationFn: async (kind: "discharge-summary" | "handover") => {
			const endpoint =
				kind === "discharge-summary"
					? api.inpatients({ id: stayId }).draft["discharge-summary"]
					: api.inpatients({ id: stayId }).draft.handover;
			const { data, error } = await endpoint.post();
			if (error) throw new Error(errorMessage(error, "تعذّر توليد المسودّة"));
			return (data as { text: string }).text;
		},
		onError: (e: Error) => toast.warning(e.message),
	});

export const useCreateCage = () => {
	const invalidate = useInvalidate();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.inpatients.cages.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إضافة القفص"));
			return data;
		},
		onSuccess: () => {
			invalidate();
			toast.success("أُضيف القفص");
		},
		onError: (e: Error) => toast.error(e.message),
	});
};
