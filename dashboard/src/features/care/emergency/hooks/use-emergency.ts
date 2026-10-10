import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type {
	ArrivalStatus,
	EmergencyStability,
	TriageCategory,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";

/**
 * [E2] استعلامات وطفرات وحدة الطوارئ.
 *
 * الاستطلاع كل ١٥ ثانية — أسرع من التنويم (٣٠ث) وأبطأ من البثّ الحيّ: صالة
 * الطوارئ تتغيّر بالدقيقة لا بالساعة، وساعةُ الانتظار على كل بطاقة تدقّ محليًّا
 * بين الجولات فلا يبدو الرقم جامدًا.
 */
export const EMERGENCY_POLL_MS = 15_000;

/** نبض الساعة على البطاقات — أخفّ من الاستطلاع لأنّه حساب محلّي بلا شبكة */
export const EMERGENCY_TICK_MS = 10_000;

export const emergencyKeys = {
	all: ["emergency"] as const,
	board: () => [...emergencyKeys.all, "board"] as const,
	stats: () => [...emergencyKeys.all, "stats"] as const,
	arrivals: (filters?: Record<string, unknown>) =>
		[...emergencyKeys.all, "arrivals", filters ?? {}] as const,
	arrival: (id: string) => [...emergencyKeys.all, "arrival", id] as const,
	discriminators: () => [...emergencyKeys.all, "discriminators"] as const,
	settings: () => [...emergencyKeys.all, "settings"] as const,
	assessments: (appointmentId: string) =>
		[...emergencyKeys.all, "assessments", appointmentId] as const,
	patientAlerts: (patientId: string) =>
		[...emergencyKeys.all, "patient-alerts", patientId] as const,
};

export const useEmergencySettings = () => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.settings(),
		queryFn: async () => {
			const { data, error } = await api.emergency.settings.get({ query: {} });
			if (error) throw new Error("تعذّر تحميل إعدادات الطوارئ");
			return data;
		},
		// الإعدادات لا تتغيّر بين نقرتين — لا داعي لإعادة جلبها مع كل جولة لوحة
		staleTime: 5 * 60 * 1000,
	});
	return { settings: data, isLoading };
};

export const useEmergencyBoard = () => {
	const { data, isLoading, isError, failureCount } = useQuery({
		queryKey: emergencyKeys.board(),
		queryFn: async () => {
			const { data, error } = await api.emergency.board.get();
			if (error) throw new Error("تعذّر تحميل لوحة الطوارئ");
			return data;
		},
		refetchInterval: EMERGENCY_POLL_MS,
	});
	return {
		appointments: data?.appointments ?? [],
		breaches: data?.breaches ?? { breached: [], imminent: [] },
		isLoading,
		// `LiveState` حالتان لا ثلاث — نفس اشتقاق لوحة التنويم حرفيًّا
		liveState: isError || failureCount > 0 ? ("disconnected" as const) : ("live" as const),
	};
};

/**
 * شريط الإحصائيات — حالة اللحظة لا حالة نطاق.
 *
 * الأرقام تُعاد أصفارًا عند الفشل بدل أن يختفي الشريط: صفٌّ فارغ مكان الرقم
 * يُقرأ «لا أحد ينتظر»، وهو أسوأ من رقمٍ قديم بثانية.
 */
export const useEmergencyStats = () => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.stats(),
		queryFn: async () => {
			const { data, error } = await api.emergency.stats.get();
			if (error) throw new Error("تعذّر تحميل الإحصائيات");
			return data;
		},
		refetchInterval: EMERGENCY_POLL_MS,
		refetchIntervalInBackground: false,
	});

	const s = data ?? {
		waiting: 0,
		untriaged: 0,
		critical: 0,
		breached: 0,
		imminent: 0,
		longestWaitMinutes: 0,
		inTreatment: 0,
		reassessOverdue: 0,
		readyForDecision: 0,
	};

	const statItems: StatItem[] = [
		{
			title: "ينتظر الآن",
			value: s.waiting,
			tooltip: "الحالات المفروزة التي لم تبدأ خدمتها بعد",
		},
		{
			title: "بانتظار الفرز",
			value: s.untriaged,
			tooltip: "سجلّات وصول لم يُصنَّف لونها بعد — بما فيها من هم في الطريق",
		},
		{
			title: "حالات حرجة",
			value: s.critical,
			tooltip: "الأحمر والبرتقالي المنتظران الآن",
		},
		{
			title: "تجاوز الهدف",
			value: s.breached,
			tooltip: "من مضى على انتظاره أكثر من هدف لونه",
		},
		{
			title: "جاهز للقرار",
			value: s.readyForDecision,
			tooltip: "قيد العلاج ومستقرّ — ينتظر قرار المآل",
		},
		{
			title: "إعادة تقييم متأخّرة",
			value: s.reassessOverdue,
			tooltip: "قيد العلاج ومضى على آخر تقييم أكثر من إيقاع لونه",
		},
	];

	return { statItems, stats: s, isLoading };
};

export const useArrivals = (filters: { view?: string; q?: string }) => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.arrivals(filters),
		queryFn: async () => {
			const { data, error } = await api.emergency.arrivals.get({ query: filters });
			if (error) throw new Error("تعذّر تحميل سجلّات الوصول");
			return data;
		},
		refetchInterval: EMERGENCY_POLL_MS,
	});
	return { arrivals: data ?? [], isLoading };
};

export const useDiscriminators = () => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.discriminators(),
		queryFn: async () => {
			const { data, error } = await api.emergency.discriminators.get();
			if (error) throw new Error("تعذّر تحميل مُميِّزات الفرز");
			return data;
		},
		// مرجع سريري ثابت في الشيفرة — يُجلب مرّة ويُخزَّن
		staleTime: Number.POSITIVE_INFINITY,
	});
	return { systems: data?.systems ?? [], categories: data?.categories ?? [], isLoading };
};

export const useTriageAssessments = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.assessments(appointmentId ?? ""),
		queryFn: async () => {
			const { data, error } = await api.emergency
				.appointments({ id: appointmentId ?? "" })
				.triage.get();
			if (error) throw new Error("تعذّر تحميل سلسلة الفرز");
			return data;
		},
		enabled: Boolean(appointmentId),
	});
	return { assessments: data ?? [], isLoading };
};

export const usePatientAlerts = (patientId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: emergencyKeys.patientAlerts(patientId ?? ""),
		queryFn: async () => {
			const { data, error } = await api.emergency
				.patients({ id: patientId ?? "" })
				.alerts.get();
			if (error) throw new Error("تعذّر تحميل تنبيهات الطفل");
			return data;
		},
		enabled: Boolean(patientId),
	});
	return { alerts: data ?? [], isLoading };
};

// ── الطفرات ────────────────────────────────────────────────────────────────

export const useCreateArrival = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			patientId?: string | null;
			ownerId?: string | null;
			provisionalLabel?: string | null;
			presentingComplaint: string;
			source?: string;
			expectedAt?: string | null;
		}) => {
			const { data, error } = await api.emergency.arrivals.post(input as never);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: emergencyKeys.all });
		},
	});

	const create = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تسجيل الوصول…",
			success: "سُجِّل الوصول",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر تسجيل الوصول",
		});

	return { create, isPending: mutation.isPending };
};

export const useAssessTriage = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			arrivalId?: string;
			appointmentId?: string;
			discriminators: string[];
			category?: TriageCategory | null;
			overrideReason?: string | null;
			notes?: string | null;
			patientId?: string | null;
			/** [E5] استقرار الحالة — يُشتقّ من اللون إن غاب */
			stability?: EmergencyStability | null;
			vitalsRecordId?: string | null;
			vitals?: Record<string, unknown> | null;
		}) => {
			const { data, error } = await api.emergency.triage.post(input as never);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: emergencyKeys.all });
			// الفرز يفتح زيارة ويغيّر ترتيب الطابور — لوحة الجلسات تتأثّر أيضًا
			qc.invalidateQueries({ queryKey: ["appointments"] });
		},
	});

	const assess = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ الفرز…",
			success: "تمّ الفرز",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر حفظ الفرز",
		});

	return { assess, isPending: mutation.isPending };
};

/**
 * [E5] القرار — يُقفل الحلقة ويسلّم. يُبطل لوحة الجلسات والتنويم والعمليات أيضًا:
 * الإدخال يكتب طلبًا يظهر على لوحة العنبر، والجراحة حالةً على لوحة العمليات.
 */
export const useDispose = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			appointmentId: string;
			kind: string;
			notes?: string | null;
			transferDestination?: string | null;
			admit?: Record<string, unknown> | null;
			surgery?: Record<string, unknown> | null;
		}) => {
			const { appointmentId, ...body } = input;
			const { data, error } = await api.emergency
				.appointments({ id: appointmentId })
				.dispose.post(body as never);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: emergencyKeys.all });
			qc.invalidateQueries({ queryKey: ["appointments"] });
			qc.invalidateQueries({ queryKey: ["inpatients"] });
			qc.invalidateQueries({ queryKey: ["operations"] });
		},
	});

	const dispose = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تسجيل القرار…",
			success: "سُجِّل القرار ورُفعت الحالة من اللوحة",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر تسجيل القرار",
		});

	return { dispose, isPending: mutation.isPending };
};

/**
 * [E5.4] تسجيل طفل لوصولٍ مجهول ثم متابعة الفرز بلا مغادرة الشاشة.
 */
export const useRegisterArrivalPatient = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			arrivalId: string;
			name: string;
			gender: string;
			animalTypeId: string;
			birthDate: string;
			ownerId?: string | null;
			weight?: number | null;
			notes?: string | null;
		}) => {
			const { arrivalId, ...body } = input;
			const { data, error } = await api.emergency
				.arrivals({ id: arrivalId })
				["register-patient"].post(body as never);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: emergencyKeys.all });
			// الملفّ الجديد يظهر في قوائم الأطفال وأولياء الأمور فورًا
			qc.invalidateQueries({ queryKey: ["patients"] });
			qc.invalidateQueries({ queryKey: ["owners"] });
		},
	});

	const registerPatient = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تسجيل الطفل…",
			success: "سُجِّل الطفل — تابع الفرز",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر تسجيل الطفل",
		});

	return { registerPatient, isPending: mutation.isPending };
};

/**
 * [E5.5] بدء العلاج من اللوحة — ينقل المفروز إلى «قيد العلاج» بلا مغادرة الشاشة.
 */
export const useStartTreatment = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (appointmentId: string) => {
			const { data, error } = await api.emergency
				.appointments({ id: appointmentId })
				["start-treatment"].post();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: emergencyKeys.all });
			qc.invalidateQueries({ queryKey: ["appointments"] });
		},
	});

	const startTreatment = (appointmentId: string) =>
		toast.promise(mutation.mutateAsync(appointmentId), {
			loading: "جارٍ بدء العلاج…",
			success: "بدأ العلاج",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر بدء العلاج",
		});

	return { startTreatment, isPending: mutation.isPending };
};

export const useTransitionArrival = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			id: string;
			status: ArrivalStatus;
			reason?: string | null;
		}) => {
			const { data, error } = await api.emergency
				.arrivals({ id: input.id })
				.status.patch({ status: input.status, reason: input.reason ?? null } as never);
			if (error) throw error;
			return data;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: emergencyKeys.all }),
	});

	const transition = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ التحديث…",
			success: "تمّ التحديث",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر التحديث",
		});

	return { transition, isPending: mutation.isPending };
};

export const useCreatePatientAlert = () => {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: {
			patientId: string;
			kind: string;
			label: string;
			severity?: string;
			notes?: string | null;
		}) => {
			const { data, error } = await api.emergency.patients.alerts.post(input as never);
			if (error) throw error;
			return data;
		},
		onSuccess: (_d, vars) => {
			qc.invalidateQueries({ queryKey: emergencyKeys.patientAlerts(vars.patientId) });
			qc.invalidateQueries({ queryKey: emergencyKeys.board() });
		},
	});

	const create = (input: Parameters<typeof mutation.mutateAsync>[0]) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ…",
			success: "أُضيف التنبيه",
			error: (e: { value?: { message?: string }; message?: string }) =>
				e.value?.message || e.message || "تعذّر إضافة التنبيه",
		});

	return { create, isPending: mutation.isPending };
};
