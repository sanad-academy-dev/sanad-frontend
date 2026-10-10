import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { InsuranceProductFormInput } from "@/server/accounting/insurance/insurance-product.type";
import type { InsurerFormInput } from "@/server/accounting/insurance/insurer.type";
import type { PatientPolicyFormInput } from "@/server/accounting/insurance/patient-policy.type";

/**
 * [MI-P3] Hooks for «التأمين» (MI BRD §11) — insurers + products + policies, one file
 * (the memberships-hub precedent). The shared "accounting" key prefix keeps every list
 * fresh after any mutation.
 */

const KEY = ["accounting", "insurance"] as const;
const key = (...parts: string[]) => [...KEY, ...parts] as const;

const messageOf = (error: unknown, fallback: string): string => {
	const value = (error as { value?: { message?: string } })?.value;
	return value?.message ?? fallback;
};

const useAccountingInvalidator = () => {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: ["accounting"] });
};

/** الجسم كما يرسله النموذج — التواريخ نصوص YYYY-MM-DD على السلك */
export type PatientPolicyBody = Omit<PatientPolicyFormInput, "policyStart" | "policyEnd"> & {
	policyStart: string;
	policyEnd: string;
};

/* ── insurers (MI §8.1) ───────────────────────────────────────────────────────────────── */

export const useInsurers = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("insurers"),
		queryFn: async () => {
			const { data, error } = await api.accounting.insurers.get();
			if (error) throw new Error("تعذّر تحميل شركات التأمين");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { insurers: data ?? [], isLoading };
};

export const useSaveInsurer = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id?: string; insurer: InsurerFormInput }) => {
			const { data, error } = input.id
				? await api.accounting.insurers({ id: input.id }).put(input.insurer)
				: await api.accounting.insurers.post(input.insurer);
			if (error) throw new Error(messageOf(error, "تعذّر حفظ شركة التأمين"));
			return data;
		},
		onSettled: invalidate,
	});
	const saveInsurer = (input: { id?: string; insurer: InsurerFormInput }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ شركة التأمين…",
			success: input.id
				? "حُفظت شركة التأمين"
				: "أُنشئت شركة التأمين — تظهر تلقائيًا في «حسابات الأطراف»",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { saveInsurer, isPending };
};

export const useSetInsurerActive = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; active: boolean }) => {
			const { data, error } = await api.accounting
				.insurers({ id: input.id })
				.status.post({ active: input.active });
			if (error) throw new Error(messageOf(error, "تعذّر تغيير حالة شركة التأمين"));
			return data;
		},
		onSettled: invalidate,
	});
	const setInsurerActive = (input: { id: string; active: boolean }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ التحديث…",
			success: input.active
				? "فُعّلت شركة التأمين"
				: "عُطّلت شركة التأمين — لا منتجات جديدة عليها والبوالص القائمة لا تتأثر",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { setInsurerActive, isPending };
};

/* ── products (MI §8.2) ───────────────────────────────────────────────────────────────── */

export const useInsuranceProducts = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("products"),
		queryFn: async () => {
			const { data, error } = await api.accounting["insurance-products"].get({ query: {} });
			if (error) throw new Error("تعذّر تحميل منتجات التأمين");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { products: data ?? [], isLoading };
};

export const useSaveInsuranceProduct = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id?: string; product: InsuranceProductFormInput }) => {
			const { data, error } = input.id
				? await api.accounting["insurance-products"]({ id: input.id }).put(input.product)
				: await api.accounting["insurance-products"].post(input.product);
			if (error) throw new Error(messageOf(error, "تعذّر حفظ منتج التأمين"));
			return data;
		},
		onSettled: invalidate,
	});
	const saveProduct = (input: { id?: string; product: InsuranceProductFormInput }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ المنتج…",
			success: input.id
				? "حُفظ المنتج — المطالبات تلتقط شروطه لحظة إنشائها لا رجعيًا"
				: "أُنشئ منتج التأمين",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { saveProduct, isPending };
};

export const useSetInsuranceProductActive = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; active: boolean }) => {
			const { data, error } = await api.accounting["insurance-products"]({
				id: input.id,
			}).status.post({ active: input.active });
			if (error) throw new Error(messageOf(error, "تعذّر تغيير حالة المنتج"));
			return data;
		},
		onSettled: invalidate,
	});
	const setProductActive = (input: { id: string; active: boolean }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ التحديث…",
			success: input.active
				? "فُعّل المنتج"
				: "عُطّل المنتج — لا بوالص جديدة عليه والبوالص القائمة لا تتأثر",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { setProductActive, isPending };
};

/* ── patient policies (MI §8.3) ───────────────────────────────────────────────────────── */

export const usePatientPolicies = (patientId?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: key("policies", patientId ?? "all"),
		queryFn: async () => {
			const { data, error } = await api.accounting["patient-policies"].get({
				query: patientId ? { patientId } : {},
			});
			if (error) throw new Error("تعذّر تحميل البوالص");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { policies: data ?? [], isLoading };
};

export const useSavePatientPolicy = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id?: string; policy: PatientPolicyBody }) => {
			const { data, error } = input.id
				? await api.accounting["patient-policies"]({ id: input.id }).put(input.policy)
				: await api.accounting["patient-policies"].post(input.policy);
			if (error) throw new Error(messageOf(error, "تعذّر حفظ البوليصة"));
			return data;
		},
		onSettled: invalidate,
	});
	const savePolicy = (input: { id?: string; policy: PatientPolicyBody }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ البوليصة…",
			success: input.id ? "حُفظت البوليصة" : "أُنشئت البوليصة",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { savePolicy, isPending };
};

/* ── [MI-P4] معاينة قسمة التأمين (BR-I9.1.2) ─────────────────────────────────────────── */

export type InsurancePreview = {
	invoiceId: string;
	total: string;
	insurerShare: string;
	copayShare: string;
	workings: {
		coveredBeforeDeductible: string;
		deductibleFixedApplied: string;
		deductiblePercentApplied: string;
		afterDeductible: string;
		perClaimCapApplied: boolean;
		annualCapApplied: boolean;
		annualCapRemaining: string | null;
	};
	lines: {
		lineRef: string;
		label: string;
		serviceId: string | null;
		grossShare: string;
		coveragePercent: string;
		insurerAmount: string;
		excludedByOperator: boolean;
		excludedByPolicy: boolean;
	}[];
	policy: { policyId: string; policyNumber: string; insurerName: string };
};

/**
 * null بلا رنين حين لا تغطية (409) أو لا فاتورة بعد — الشاشة ببساطة لا تعرض اللوحة؛
 * المطالبة القائمة تُعاد كذلك حالتها لعرض شارة بدل اللوحة.
 */
export const useInvoiceInsurancePreview = (
	invoiceId: string | null | undefined,
	excludedLineRefs: string[],
) => {
	const { data, isLoading } = useQuery({
		queryKey: key("preview", invoiceId ?? "none", ...excludedLineRefs),
		enabled: !!invoiceId,
		queryFn: async () => {
			if (!invoiceId) return null;
			const res = await api
				.invoices({ id: invoiceId })
				["insurance-preview"].post({ excludedLineRefs });
			if (res.error) {
				const value = res.error.value as { claimId?: string; status?: string } | undefined;
				if (res.status === 409 && value?.claimId) {
					return { kind: "already-claimed" as const, claimId: value.claimId };
				}
				return null; // لا تغطية / لا فاتورة — اللوحة لا تظهر
			}
			return { kind: "ok" as const, preview: res.data as InsurancePreview };
		},
		staleTime: 1000 * 15,
		retry: false,
	});
	return { previewState: data ?? null, isPreviewLoading: isLoading };
};
