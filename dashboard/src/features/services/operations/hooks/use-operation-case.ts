import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
	ChecklistItemResponse,
	ChecklistScope,
	SignatureMethod,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	AssessmentFormValues,
	OperationCaseDetailResponse,
	OperationConsentType,
} from "@/server/operations/operations.type";

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

export const operationCaseQueryKey = (caseId: string) =>
	["operations", "case", caseId] as const;

/** تفاصيل حالة العملية — النظرة العامة والتحضير وقوائم التحقق والنشاط */
export const useOperationCase = (caseId: string | null) => {
	const { data, isLoading } = useQuery<OperationCaseDetailResponse>({
		queryKey: operationCaseQueryKey(caseId ?? ""),
		queryFn: async () => {
			const res = await api.operations({ id: caseId as string }).get();
			if (res.error) throw new Error("فشل جلب تفاصيل العملية");
			return res.data as OperationCaseDetailResponse;
		},
		enabled: caseId !== null,
	});

	return { operationCase: data ?? null, isLoading };
};

/** كل طفرات لوحة الحالة — تعيد جلب الحالة المفتوحة وحدها فورًا */
export const useOperationCaseMutations = (caseId: string) => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		// إبطال الجذر كان يعيد جلب اللوحة والإحصاءات كلها عند كل نقرة (بطء شديد)
		// — تُعلَّم قديمة فقط وتتحدث عند العودة إليها، والحالة المفتوحة تُعاد فورًا
		void queryClient.invalidateQueries({ queryKey: ["operations"], refetchType: "none" });
		void queryClient.invalidateQueries({ queryKey: operationCaseQueryKey(caseId) });
	};

	const run = <T>(p: Promise<T>, loading: string, success: string, fallback: string) => {
		toast.promise(p, {
			loading,
			success,
			error: (err: Error) => err.message || fallback,
		});
		return p;
	};

	const createConsentMutation = useMutation({
		mutationFn: async (args: {
			type: OperationConsentType;
			estimateLow?: number | null;
			estimateHigh?: number | null;
		}) => {
			const res = await api.operations({ id: caseId }).consents.post({
				type: args.type,
				estimateLow: args.estimateLow ?? null,
				estimateHigh: args.estimateHigh ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إنشاء الموافقة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const signConsentMutation = useMutation({
		mutationFn: async (args: {
			consentId: string;
			signerName: string;
			signerRelationship?: string | null;
			signatureMethod: SignatureMethod;
			signatureUrl?: string | null;
			witnessStaffId?: string | null;
		}) => {
			const res = await api
				.operations({ id: caseId })
				.consents({ consentId: args.consentId })
				.sign.post({
					signerName: args.signerName,
					signerRelationship: args.signerRelationship ?? null,
					signatureMethod: args.signatureMethod,
					signatureUrl: args.signatureUrl ?? null,
					witnessStaffId: args.witnessStaffId ?? null,
				});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توقيع الموافقة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const deleteConsentMutation = useMutation({
		mutationFn: async (consentId: string) => {
			const res = await api.operations({ id: caseId }).consents({ consentId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف الموافقة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const revokeConsentMutation = useMutation({
		mutationFn: async (args: { consentId: string; reason: string }) => {
			const res = await api
				.operations({ id: caseId })
				.consents({ consentId: args.consentId })
				.revoke.post({ reason: args.reason });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إبطال الموافقة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const saveAssessmentMutation = useMutation({
		mutationFn: async (values: AssessmentFormValues) => {
			const res = await api.operations({ id: caseId }).assessment.put({
				asaClass: values.asaClass ?? null,
				asaEmergency: values.asaEmergency,
				lastFoodAt: values.lastFoodAt ? new Date(values.lastFoodAt).toISOString() : null,
				lastWaterAt: values.lastWaterAt ? new Date(values.lastWaterAt).toISOString() : null,
				fastingVerified: values.fastingVerified,
				physicalFindings: values.physicalFindings ?? null,
				airwayAssessment: values.airwayAssessment ?? null,
				medications: values.medications ?? null,
				allergies: values.allergies ?? null,
				bloodworkReviewed: values.bloodworkReviewed,
				imagingReviewed: values.imagingReviewed,
				riskNotes: values.riskNotes ?? null,
				premedPlan: values.premedPlan ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التقييم"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const startChecklistMutation = useMutation({
		mutationFn: async (scope: ChecklistScope) => {
			const res = await api.operations({ id: caseId }).checklists.start.post({ scope });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر بدء قائمة التحقق"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const respondItemMutation = useMutation({
		mutationFn: async (args: { itemId: string; response: ChecklistItemResponse }) => {
			const res = await api
				.operations({ id: caseId })
				.checklists.items({ itemId: args.itemId })
				.respond.post({ response: args.response });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل الاستجابة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const completeChecklistMutation = useMutation({
		mutationFn: async (scope: ChecklistScope) => {
			const res = await api.operations({ id: caseId }).checklists.complete.post({ scope });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إكمال قائمة التحقق"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const upsertAnesthesiaMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["anesthesia"]["put"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).anesthesia.put(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ سجل التخدير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addAnesthesiaEventMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["anesthesia"]["events"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).anesthesia.events.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل الحدث"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const upsertNoteMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["note"]["put"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).note.put(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التقرير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const signNoteMutation = useMutation({
		mutationFn: async () => {
			const res = await api.operations({ id: caseId }).note.sign.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توقيع التقرير"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const upsertCountMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["counts"]["put"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).counts.put(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ العدّ"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addImplantMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["implants"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).implants.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة الغرسة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addComplicationMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["complications"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).complications.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل المضاعفة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addCommentMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["comments"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).comments.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة التعليق"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addConsumableMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["consumables"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).consumables.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة المستهلك"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const countConsumableMutation = useMutation({
		mutationFn: async (args: {
			consumableId: string;
			countedQuantity: number | null;
			countNote?: string | null;
		}) => {
			const res = await api
				.operations({ id: caseId })
				.consumables({ consumableId: args.consumableId })
				.count.patch({
					countedQuantity: args.countedQuantity,
					countNote: args.countNote ?? null,
				});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل العدّ"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const removeConsumableMutation = useMutation({
		mutationFn: async (consumableId: string) => {
			const res = await api.operations({ id: caseId }).consumables({ consumableId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف المستهلك"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const refreshInvoiceMutation = useMutation({
		mutationFn: async () => {
			const res = await api.operations({ id: caseId }).invoice.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحديث الفاتورة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const payInvoiceMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["invoice"]["pay"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).invoice.pay.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل السداد"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addRecoveryMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["recovery"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).recovery.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تسجيل التقييم"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addPostOpOrderMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["post-op-orders"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId })["post-op-orders"].post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إصدار الأمر"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	const addSpecimenMutation = useMutation({
		mutationFn: async (
			data: Parameters<ReturnType<typeof api.operations>["specimens"]["post"]>[0],
		) => {
			const res = await api.operations({ id: caseId }).specimens.post(data);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة العينة"));
			return res.data;
		},
		onSuccess: invalidate,
	});

	return {
		createConsent: (args: Parameters<typeof createConsentMutation.mutateAsync>[0]) =>
			run(
				createConsentMutation.mutateAsync(args),
				"جارٍ الإنشاء...",
				"أُنشئت الموافقة",
				"فشل إنشاء الموافقة",
			),
		signConsent: (args: Parameters<typeof signConsentMutation.mutateAsync>[0]) =>
			run(
				signConsentMutation.mutateAsync(args),
				"جارٍ التوقيع...",
				"وُقّعت الموافقة",
				"فشل توقيع الموافقة",
			),
		deleteConsent: (consentId: string) =>
			run(
				deleteConsentMutation.mutateAsync(consentId),
				"جارٍ الحذف...",
				"حُذفت الموافقة",
				"فشل حذف الموافقة",
			),
		revokeConsent: (args: Parameters<typeof revokeConsentMutation.mutateAsync>[0]) =>
			run(
				revokeConsentMutation.mutateAsync(args),
				"جارٍ الإبطال...",
				"أُبطلت الموافقة",
				"فشل إبطال الموافقة",
			),
		saveAssessment: (values: AssessmentFormValues) =>
			run(
				saveAssessmentMutation.mutateAsync(values),
				"جارٍ الحفظ...",
				"حُفظ تقييم ما قبل التخدير",
				"فشل حفظ التقييم",
			),
		startChecklist: (scope: ChecklistScope) =>
			run(
				startChecklistMutation.mutateAsync(scope),
				"جارٍ البدء...",
				"بدأت قائمة التحقق",
				"فشل بدء قائمة التحقق",
			),
		respondItem: respondItemMutation.mutateAsync,
		completeChecklist: (scope: ChecklistScope) =>
			run(
				completeChecklistMutation.mutateAsync(scope),
				"جارٍ الإكمال...",
				"اكتملت قائمة التحقق",
				"فشل إكمال قائمة التحقق",
			),
		saveAnesthesia: (data: Parameters<typeof upsertAnesthesiaMutation.mutateAsync>[0]) =>
			run(
				upsertAnesthesiaMutation.mutateAsync(data),
				"جارٍ الحفظ...",
				"حُفظ سجل التخدير",
				"فشل حفظ سجل التخدير",
			),
		addAnesthesiaEvent: addAnesthesiaEventMutation.mutateAsync,
		saveNote: (data: Parameters<typeof upsertNoteMutation.mutateAsync>[0]) =>
			run(
				upsertNoteMutation.mutateAsync(data),
				"جارٍ الحفظ...",
				"حُفظ التقرير الجراحي",
				"فشل حفظ التقرير",
			),
		signNote: () =>
			run(
				signNoteMutation.mutateAsync(),
				"جارٍ التوقيع...",
				"وُقّع التقرير الجراحي وأصبح مصونًا",
				"فشل توقيع التقرير",
			),
		saveCount: upsertCountMutation.mutateAsync,
		addImplant: (data: Parameters<typeof addImplantMutation.mutateAsync>[0]) =>
			run(
				addImplantMutation.mutateAsync(data),
				"جارٍ الإضافة...",
				"أُضيفت الغرسة",
				"فشل إضافة الغرسة",
			),
		addSpecimen: (data: Parameters<typeof addSpecimenMutation.mutateAsync>[0]) =>
			run(
				addSpecimenMutation.mutateAsync(data),
				"جارٍ الإضافة...",
				"أُضيفت العينة",
				"فشل إضافة العينة",
			),
		addComplication: (data: Parameters<typeof addComplicationMutation.mutateAsync>[0]) =>
			run(
				addComplicationMutation.mutateAsync(data),
				"جارٍ التسجيل...",
				"سُجّلت المضاعفة",
				"فشل تسجيل المضاعفة",
			),
		addComment: (data: Parameters<typeof addCommentMutation.mutateAsync>[0]) =>
			run(
				addCommentMutation.mutateAsync(data),
				"جارٍ الإضافة...",
				"أُضيف التعليق",
				"فشل إضافة التعليق",
			),
		addConsumable: (data: Parameters<typeof addConsumableMutation.mutateAsync>[0]) =>
			run(
				addConsumableMutation.mutateAsync(data),
				"جارٍ الإضافة...",
				"أُضيف المستهلك",
				"فشل إضافة المستهلك",
			),
		countConsumable: (args: Parameters<typeof countConsumableMutation.mutateAsync>[0]) =>
			run(
				countConsumableMutation.mutateAsync(args),
				"جارٍ التسجيل...",
				"سُجّل العدّ",
				"فشل تسجيل العدّ",
			),
		removeConsumable: (consumableId: string) =>
			run(
				removeConsumableMutation.mutateAsync(consumableId),
				"جارٍ الحذف...",
				"حُذف المستهلك",
				"فشل حذف المستهلك",
			),
		refreshInvoice: () =>
			run(
				refreshInvoiceMutation.mutateAsync(),
				"جارٍ التحديث...",
				"حُدّثت الفاتورة من البنود الحالية",
				"فشل تحديث الفاتورة",
			),
		payInvoice: (data: Parameters<typeof payInvoiceMutation.mutateAsync>[0]) =>
			run(
				payInvoiceMutation.mutateAsync(data),
				"جارٍ التسجيل...",
				"سُجّل السداد",
				"فشل تسجيل السداد",
			),
		addRecovery: (data: Parameters<typeof addRecoveryMutation.mutateAsync>[0]) =>
			run(
				addRecoveryMutation.mutateAsync(data),
				"جارٍ التسجيل...",
				"سُجّل تقييم الإفاقة",
				"فشل تسجيل التقييم",
			),
		addPostOpOrder: (data: Parameters<typeof addPostOpOrderMutation.mutateAsync>[0]) =>
			run(
				addPostOpOrderMutation.mutateAsync(data),
				"جارٍ الإصدار...",
				"صدر أمر ما بعد الجراحة",
				"فشل إصدار الأمر",
			),
		isPending:
			createConsentMutation.isPending ||
			signConsentMutation.isPending ||
			revokeConsentMutation.isPending ||
			saveAssessmentMutation.isPending ||
			startChecklistMutation.isPending ||
			respondItemMutation.isPending ||
			completeChecklistMutation.isPending ||
			upsertAnesthesiaMutation.isPending ||
			addAnesthesiaEventMutation.isPending ||
			upsertNoteMutation.isPending ||
			signNoteMutation.isPending ||
			upsertCountMutation.isPending ||
			addImplantMutation.isPending ||
			addSpecimenMutation.isPending ||
			addRecoveryMutation.isPending ||
			addPostOpOrderMutation.isPending ||
			addComplicationMutation.isPending ||
			addCommentMutation.isPending ||
			addConsumableMutation.isPending ||
			countConsumableMutation.isPending ||
			removeConsumableMutation.isPending ||
			refreshInvoiceMutation.isPending ||
			payInvoiceMutation.isPending,
	};
};
