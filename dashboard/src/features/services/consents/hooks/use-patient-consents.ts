import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ConsentLocale, SignatureMethod } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	ConsentFieldValues,
	ConsentTemplateListResponse,
	PatientConsentDetailResponse,
	PatientConsentListResponse,
} from "@/server/patient-consents/patient-consents.type";

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const consentsKey = (patientId: string) => ["patient-consents", patientId] as const;

/** قوالب الموافقات المتاحة — تُزرع من الخادم عند أول قراءة */
export const useConsentTemplates = (speciesKey?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["consent-templates", speciesKey ?? "all"],
		queryFn: async () => {
			const res = await api["patient-consents"].templates.get({
				query: speciesKey ? { speciesKey } : {},
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحميل القوالب"));
			return res.data as ConsentTemplateListResponse[];
		},
		staleTime: 1000 * 60 * 10,
	});

	return { templates: data ?? [], isLoading };
};

/** أسعار البنود المسعّرة من قائمة أسعار الأكاديمية */
export const useConsentPrices = () => {
	const { data } = useQuery({
		queryKey: ["consent-prices"],
		queryFn: async () => {
			const res = await api["patient-consents"].prices.get();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحميل الأسعار"));
			return res.data as Record<string, string>;
		},
		staleTime: 1000 * 60 * 10,
	});

	return { prices: data ?? {} };
};

export const usePatientConsents = (patientId: string | undefined) => {
	const { data, isLoading } = useQuery({
		queryKey: consentsKey(patientId ?? ""),
		enabled: !!patientId,
		queryFn: async () => {
			if (!patientId) return [];
			const res = await api["patient-consents"].get({ query: { patientId } });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحميل الموافقات"));
			return res.data as PatientConsentListResponse[];
		},
	});

	return { consents: data ?? [], isLoading };
};

export const useConsent = (consentId: string | undefined) => {
	const { data, isLoading } = useQuery({
		queryKey: ["patient-consent", consentId],
		enabled: !!consentId,
		queryFn: async () => {
			if (!consentId) return null;
			const res = await api["patient-consents"]({ id: consentId }).get();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحميل الموافقة"));
			return res.data as PatientConsentDetailResponse;
		},
	});

	return { consent: data, isLoading };
};

export const usePatientConsentMutations = (patientId: string) => {
	const queryClient = useQueryClient();

	const invalidate = (consentId?: string) => {
		void queryClient.invalidateQueries({ queryKey: consentsKey(patientId) });
		if (consentId)
			void queryClient.invalidateQueries({ queryKey: ["patient-consent", consentId] });
		// الإقرار قد يكون بوّابة إقامة تنويم (G3): ورقتها تقرأ حالته من استعلامها هي،
		// فبدون هذا كان التوقيع لا يظهر فيها حتى تُغلق وتُفتح
		void queryClient.invalidateQueries({ queryKey: ["inpatients"] });
	};

	const createMutation = useMutation({
		mutationFn: async (input: {
			templateKey: string;
			locale?: ConsentLocale;
			operationCaseId?: string | null;
			appointmentId?: string | null;
		}) => {
			const res = await api["patient-consents"].post({ patientId, ...input });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إنشاء الموافقة"));
			return res.data as PatientConsentDetailResponse;
		},
		onSuccess: (consent) => invalidate(consent.id),
	});

	const updateMutation = useMutation({
		mutationFn: async (input: {
			consentId: string;
			fieldValues: ConsentFieldValues;
			locale?: ConsentLocale;
		}) => {
			const { consentId, ...body } = input;
			const res = await api["patient-consents"]({ id: consentId }).patch(body);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ الموافقة"));
			return res.data as PatientConsentDetailResponse;
		},
		onSuccess: (consent) => invalidate(consent.id),
	});

	const signMutation = useMutation({
		mutationFn: async (input: {
			consentId: string;
			signerName: string;
			signerRelationship?: string | null;
			signatureMethod: SignatureMethod;
			signatureUrl?: string | null;
			witnessStaffId?: string | null;
		}) => {
			const { consentId, ...body } = input;
			const res = await api["patient-consents"]({ id: consentId }).sign.post(body);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توقيع الموافقة"));
			return res.data as PatientConsentDetailResponse;
		},
		onSuccess: (consent) => invalidate(consent.id),
	});

	const revokeMutation = useMutation({
		mutationFn: async (input: { consentId: string; reason: string }) => {
			const res = await api["patient-consents"]({ id: input.consentId }).revoke.post({
				reason: input.reason,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إبطال الموافقة"));
			return res.data as PatientConsentDetailResponse;
		},
		onSuccess: (consent) => invalidate(consent.id),
	});

	const deleteMutation = useMutation({
		mutationFn: async (consentId: string) => {
			const res = await api["patient-consents"]({ id: consentId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف الموافقة"));
			return res.data;
		},
		onSuccess: () => invalidate(),
	});

	const createConsent = (input: Parameters<typeof createMutation.mutateAsync>[0]) => {
		const p = createMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تجهيز النموذج...",
			success: "جُهّز النموذج معبّأً — راجع الحقول قبل التوقيع",
			error: (e: Error) => e.message || "فشل إنشاء الموافقة",
		});
		return p;
	};

	const saveConsent = (input: Parameters<typeof updateMutation.mutateAsync>[0]) => {
		const p = updateMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "حُفظت المسودّة",
			error: (e: Error) => e.message || "فشل حفظ الموافقة",
		});
		return p;
	};

	const signConsent = (input: Parameters<typeof signMutation.mutateAsync>[0]) => {
		const p = signMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ التوقيع...",
			success: "وُقّعت الموافقة وحُفظت نسختها النهائية",
			error: (e: Error) => e.message || "فشل توقيع الموافقة",
		});
		return p;
	};

	const revokeConsent = (input: Parameters<typeof revokeMutation.mutateAsync>[0]) => {
		const p = revokeMutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإبطال...",
			success: "أُبطلت الموافقة وبقيت في السجل مع سببها",
			error: (e: Error) => e.message || "فشل إبطال الموافقة",
		});
		return p;
	};

	const deleteConsent = (consentId: string) => {
		const p = deleteMutation.mutateAsync(consentId);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success: "حُذفت المسودّة",
			error: (e: Error) => e.message || "فشل حذف المسودّة",
		});
		return p;
	};

	return {
		createConsent,
		saveConsent,
		signConsent,
		revokeConsent,
		deleteConsent,
		isPending:
			createMutation.isPending ||
			updateMutation.isPending ||
			signMutation.isPending ||
			revokeMutation.isPending ||
			deleteMutation.isPending,
	};
};

// ── الذكاء الاصطناعي — مسودّات تهبط في الحقول ولا تُحفظ آليًا ──────────────

/** صياغة نصّ حقل حرّ من وقائع الحالة المسجّلة */
export const useDraftConsentField = () => {
	const mutation = useMutation({
		mutationFn: async (input: { consentId: string; fieldKey: string }) => {
			const res = await api["patient-consents"]({ id: input.consentId })["draft-field"].post({
				fieldKey: input.fieldKey,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توليد المسودّة"));
			return res.data as { text: string };
		},
	});

	const draftField = (input: { consentId: string; fieldKey: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الصياغة...",
			success: "صيغت مسودّة — راجعها وعدّلها قبل التوقيع",
			error: (e: Error) => e.message || "فشل توليد المسودّة",
		});
		return p;
	};

	return { draftField, isPending: mutation.isPending };
};

/** قراءة نموذج ورقي موقَّع واستخراج قيمه للمراجعة */
export const useExtractConsentScan = () => {
	const mutation = useMutation({
		mutationFn: async (input: { consentId: string; imageDataUrl: string }) => {
			const res = await api["patient-consents"]({ id: input.consentId })["extract-scan"].post({
				imageDataUrl: input.imageDataUrl,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر قراءة النموذج"));
			return res.data as { fieldValues: ConsentFieldValues; unreadableKeys: string[] };
		},
	});

	const extractScan = (input: { consentId: string; imageDataUrl: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ قراءة النموذج...",
			success: (r) =>
				r.unreadableKeys.length
					? `قُرئ النموذج — ${r.unreadableKeys.length} حقلًا لم يُقرأ بثقة، أكملها يدويًا`
					: "قُرئ النموذج — راجع القيم قبل الحفظ",
			error: (e: Error) => e.message || "فشل قراءة النموذج",
		});
		return p;
	};

	return { extractScan, isPending: mutation.isPending };
};
