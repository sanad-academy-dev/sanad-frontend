import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { CatalogSpecies } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	AntigenResponse,
	PatientVaccinationStatus,
	UnschedulablePatientRow,
	VaccinationDueRow,
	VaccinationProtocolResponse,
	VaccinationRecordResponse,
	VaccineResponse,
} from "@/server/vaccinations/vaccinations.type";

/** مفاتيح الاستعلام في مكان واحد — الإبطال بعد الطفرات يلمس الشجرة كلها. */
export const vaccinationKeys = {
	all: ["vaccinations"] as const,
	stats: () => [...vaccinationKeys.all, "stats"] as const,
	due: (filters?: Record<string, unknown>) =>
		[...vaccinationKeys.all, "due", filters ?? {}] as const,
	vaccines: (filters?: Record<string, unknown>) =>
		[...vaccinationKeys.all, "vaccines", filters ?? {}] as const,
	batches: (vaccineId: string, branchId?: string | null) =>
		[...vaccinationKeys.all, "batches", vaccineId, branchId ?? null] as const,
	protocols: () => [...vaccinationKeys.all, "protocols"] as const,
	antigens: () => [...vaccinationKeys.all, "antigens"] as const,
	records: (filters?: Record<string, unknown>) =>
		[...vaccinationKeys.all, "records", filters ?? {}] as const,
	patient: (patientId: string) => [...vaccinationKeys.all, "patient", patientId] as const,
	unschedulable: () => [...vaccinationKeys.all, "unschedulable"] as const,
};

type VaccinationStats = {
	overdue: number;
	dueSoon: number;
	givenThisMonth: number;
	activeVaccines: number;
	adverseReactionsThisMonth: number;
};

const EMPTY_STATS: VaccinationStats = {
	overdue: 0,
	dueSoon: 0,
	givenThisMonth: 0,
	activeVaccines: 0,
	adverseReactionsThisMonth: 0,
};

export const useVaccinationStats = () => {
	const { data, isLoading } = useQuery<VaccinationStats>({
		queryKey: vaccinationKeys.stats(),
		queryFn: async () => {
			const res = await api.vaccinations.stats.get();
			if (res.error) throw new Error("فشل جلب إحصاءات التطعيمات");
			return res.data as VaccinationStats;
		},
	});

	const stats = data ?? EMPTY_STATS;

	const statItems: StatItem[] = [
		{
			title: "متأخّرة",
			value: stats.overdue,
			tooltip: "أطفال تجاوزت موعد جرعة مستحقة، أو لم تبدأ التطعيم وقد حان وقته",
		},
		{
			title: "تستحق قريبًا",
			value: stats.dueSoon,
			tooltip: "أطفال تستحق جرعة اليوم أو خلال مدى الاستباق المحدَّد في الإعدادات",
		},
		{
			title: "جرعات هذا الشهر",
			value: stats.givenThisMonth,
			tooltip: "عدد الجرعات المسجَّلة منذ بداية الشهر (عدا الملغاة)",
		},
		{
			title: "لقاحات مفعّلة",
			value: stats.activeVaccines,
			tooltip: "عدد اللقاحات في كتالوج الأكاديمية",
		},
		{
			title: "تفاعلات مسجَّلة",
			value: stats.adverseReactionsThisMonth,
			tooltip: "جرعات هذا الشهر سُجِّل بعدها تفاعل عكسي بأي درجة",
		},
	];

	return { stats, statItems, isLoading };
};

export const useVaccinationDue = (
	filters: { species?: CatalogSpecies; branchId?: string; horizonDays?: number } = {},
) => {
	const { data, isLoading, isError, refetch } = useQuery<VaccinationDueRow[]>({
		queryKey: vaccinationKeys.due(filters),
		queryFn: async () => {
			const res = await api.vaccinations.due.get({ query: filters });
			if (res.error) throw new Error("فشل جلب الجرعات المستحقة");
			return res.data as VaccinationDueRow[];
		},
	});

	// `isError` يُمرَّر عمدًا: طابور المتأخّرين عن التطعيم لا يجوز أن يعرض «لا شيء
	// مستحق» عند فشل الطلب — القائمة الفارغة تُقرأ طمأنينةً، وفشل الشبكة ليس طمأنينة.
	return { rows: data ?? [], isLoading, isError, refetch };
};

/**
 * الأطفال التي يمنع نقصُ تاريخ ميلادها جدولتها. تُقرأ منفصلة عن الطابور لأنها
 * ليست عملًا سريريًا بل بيانات ناقصة — لكن إخفاء عددها يجعل الطابور يبدو كاملًا وهو ليس كذلك.
 */
export const useUnschedulablePatients = () => {
	const { data, isLoading } = useQuery<UnschedulablePatientRow[]>({
		queryKey: vaccinationKeys.unschedulable(),
		queryFn: async () => {
			const res = await api.vaccinations.unschedulable.get();
			if (res.error) throw new Error("فشل جلب الأطفال غير القابلة للجدولة");
			return res.data as UnschedulablePatientRow[];
		},
	});
	return { patients: data ?? [], isLoading };
};

/** يحفظ تاريخ ميلاد طفل ثم يُبطل شجرة التطعيمات — الجدولة كلها مشتقّة منه. */
export const useSetPatientBirthDate = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ patientId, birthDate }: { patientId: string; birthDate: string }) => {
			const res = await api.patients({ id: patientId }).patch({ birthDate } as never);
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل حفظ تاريخ الميلاد",
				);
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
			void queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	const setBirthDate = (payload: { patientId: string; birthDate: string }) =>
		toast.promise(mutation.mutateAsync(payload), {
			loading: "جارٍ الحفظ...",
			success: "حُفظ تاريخ الميلاد وأُعيد حساب الجدولة",
			error: (error: MutationError) => errorText(error, "فشل حفظ تاريخ الميلاد"),
		});

	return { setBirthDate, isPending: mutation.isPending };
};

export const useVaccines = (filters: { q?: string; species?: CatalogSpecies } = {}) => {
	const { data, isLoading } = useQuery<VaccineResponse[]>({
		queryKey: vaccinationKeys.vaccines(filters),
		queryFn: async () => {
			const res = await api.vaccinations.vaccines.get({ query: filters });
			if (res.error) throw new Error("فشل جلب كتالوج اللقاحات");
			return res.data as VaccineResponse[];
		},
	});

	return { vaccines: data ?? [], isLoading };
};

export type VaccineBatchOption = {
	id: string;
	batchNo: string;
	expiryDate: string | null;
	qty: number;
	isExpired: boolean;
	warehouse: { id: string; name: string; branchId: string | null };
};

/**
 * دُفعات اللقاح المتاحة. مفعّل فقط عند اختيار لقاح — الاستعلام بلا لقاح بلا معنى.
 * الترتيب FEFO يصل من الخادم؛ الواجهة لا تعيد ترتيبه ولا تختار نيابةً عن المستخدم.
 */
export const useVaccineBatches = (vaccineId?: string, branchId?: string | null) => {
	const { data, isLoading } = useQuery<VaccineBatchOption[]>({
		queryKey: vaccinationKeys.batches(vaccineId ?? "", branchId),
		enabled: Boolean(vaccineId),
		queryFn: async () => {
			const res = await api.vaccinations
				.vaccines({ id: vaccineId as string })
				.batches.get({ query: branchId ? { branchId } : {} });
			if (res.error) throw new Error("فشل جلب دفعات اللقاح");
			return res.data as VaccineBatchOption[];
		},
	});

	return { batches: data ?? [], isLoading };
};

export const useVaccinationProtocols = () => {
	const { data, isLoading } = useQuery<VaccinationProtocolResponse[]>({
		queryKey: vaccinationKeys.protocols(),
		queryFn: async () => {
			const res = await api.vaccinations.protocols.get({ query: {} });
			if (res.error) throw new Error("فشل جلب البروتوكولات");
			return res.data as VaccinationProtocolResponse[];
		},
	});

	return { protocols: data ?? [], isLoading };
};

export const useAntigens = () => {
	const { data, isLoading } = useQuery<AntigenResponse[]>({
		queryKey: vaccinationKeys.antigens(),
		queryFn: async () => {
			const res = await api.vaccinations.antigens.get();
			if (res.error) throw new Error("فشل جلب المُستضِدّات");
			return res.data as AntigenResponse[];
		},
		staleTime: 1000 * 60 * 30, // جدول مرجعي عالمي لا يتغيّر أثناء الجلسة
	});

	return { antigens: data ?? [], isLoading };
};

export const useVaccinationRecords = (
	filters: {
		patientId?: string;
		vaccineId?: string;
		includeVoided?: boolean;
		skip?: number;
		take?: number;
	} = {},
) => {
	const { data, isLoading } = useQuery<{
		items: VaccinationRecordResponse[];
		total: number;
	}>({
		queryKey: vaccinationKeys.records(filters),
		queryFn: async () => {
			const res = await api.vaccinations.records.get({ query: filters });
			if (res.error) throw new Error("فشل جلب سجلّ التطعيمات");
			return res.data as { items: VaccinationRecordResponse[]; total: number };
		},
	});

	return { records: data?.items ?? [], total: data?.total ?? 0, isLoading };
};

export const usePatientVaccinationStatus = (patientId?: string) => {
	const { data, isLoading } = useQuery<PatientVaccinationStatus>({
		queryKey: vaccinationKeys.patient(patientId ?? ""),
		enabled: Boolean(patientId),
		queryFn: async () => {
			const res = await api.vaccinations
				.patients({ patientId: patientId as string })
				.status.get();
			if (res.error) throw new Error("فشل جلب حالة التطعيم");
			return res.data as PatientVaccinationStatus;
		},
	});

	return { status: data ?? null, isLoading };
};

// ─── الطفرات ────────────────────────────────────────────────────────────────

type MutationError = { message?: string; details?: unknown };

const errorText = (error: MutationError, fallback: string) =>
	(typeof error.details === "string" && error.details) || error.message || fallback;

export const useAdministerVaccination = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (payload: Record<string, unknown>) => {
			const res = await api.vaccinations.records.post(payload as never);
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل تسجيل الجرعة",
				);
			}
			return res.data;
		},
		onSuccess: () => {
			// الجرعة تغيّر الطابور والإحصاءات والسجل وحالة الطفل — أبطِل الشجرة كلها.
			// وتغيّر المخزون أيضًا: الدفعة نقصت فعلًا فلا يصحّ أن تبقى الشاشة تعرض القديم.
			void queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			void queryClient.invalidateQueries({ queryKey: ["stock"] });
		},
	});

	const administer = (
		payload: Record<string, unknown>,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(
			mutation.mutateAsync(payload).then((data) => {
				options?.onSuccess?.();
				return data;
			}),
			{
				loading: "جارٍ تسجيل الجرعة...",
				success: "سُجِّلت الجرعة وخُصمت من الدفعة",
				error: (error: MutationError) => errorText(error, "فشل تسجيل الجرعة"),
			},
		);

	return { administer, isPending: mutation.isPending };
};

export const useVoidVaccinationRecord = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...body
		}: {
			id: string;
			voidReason: string;
			restoreStock?: boolean;
		}) => {
			const res = await api.vaccinations.records({ id }).void.post(body as never);
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل إبطال السجل",
				);
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			void queryClient.invalidateQueries({ queryKey: ["stock"] });
		},
	});

	const voidRecord = (
		payload: { id: string; voidReason: string; restoreStock?: boolean },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(
			mutation.mutateAsync(payload).then((data) => {
				options?.onSuccess?.();
				return data;
			}),
			{
				loading: "جارٍ إبطال السجل...",
				success: "أُبطل السجل وأُعيدت الكمية إلى الدفعة",
				error: (error: MutationError) => errorText(error, "فشل إبطال السجل"),
			},
		);

	return { voidRecord, isPending: mutation.isPending };
};

export const useSaveVaccine = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, ...body }: { id?: string } & Record<string, unknown>) => {
			const res = id
				? await api.vaccinations.vaccines({ id }).patch(body as never)
				: await api.vaccinations.vaccines.post(body as never);
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل حفظ اللقاح",
				);
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
		},
	});

	const saveVaccine = (
		payload: { id?: string } & Record<string, unknown>,
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(
			mutation.mutateAsync(payload).then((data) => {
				options?.onSuccess?.();
				return data;
			}),
			{
				loading: "جارٍ حفظ اللقاح...",
				success: payload.id ? "حُدِّث اللقاح" : "أُضيف اللقاح إلى الكتالوج",
				error: (error: MutationError) => errorText(error, "فشل حفظ اللقاح"),
			},
		);

	return { saveVaccine, isPending: mutation.isPending };
};

export const useCloneProtocol = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.vaccinations.protocols({ id }).clone.post();
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل نسخ البروتوكول",
				);
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: vaccinationKeys.all });
		},
	});

	const cloneProtocol = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ نسخ البروتوكول...",
			success: "نُسخ البروتوكول إلى أكاديميتك وصار قابلًا للتعديل",
			error: (error: MutationError) => errorText(error, "فشل نسخ البروتوكول"),
		});

	return { cloneProtocol, isPending: mutation.isPending };
};
