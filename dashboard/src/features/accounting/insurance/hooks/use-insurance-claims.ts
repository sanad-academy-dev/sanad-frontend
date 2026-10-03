import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { InsuranceClaimStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

/** [MI-P4] Hooks for «المطالبات التأمينية» (MI §9) — list/detail + submit/cancel. */

const KEY = ["accounting", "insurance-claims"] as const;
const key = (...parts: string[]) => [...KEY, ...parts] as const;

const messageOf = (error: unknown, fallback: string): string => {
	const value = (error as { value?: { message?: string } })?.value;
	return value?.message ?? fallback;
};

const useAccountingInvalidator = () => {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: ["accounting"] });
};

export const useInsuranceClaims = (filter?: {
	status?: InsuranceClaimStatus;
	insurerId?: string;
}) => {
	const { data, isLoading } = useQuery({
		queryKey: key("list", filter?.status ?? "all", filter?.insurerId ?? "all"),
		queryFn: async () => {
			const { data, error } = await api.accounting["insurance-claims"].get({
				query: {
					...(filter?.status ? { status: filter.status } : {}),
					...(filter?.insurerId ? { insurerId: filter.insurerId } : {}),
				},
			});
			if (error) throw new Error("تعذّر تحميل المطالبات");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { claims: data ?? [], isLoading };
};

export const useInsuranceClaim = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: key("detail", id ?? "none"),
		enabled: !!id,
		queryFn: async () => {
			if (!id) return null;
			const { data, error } = await api.accounting["insurance-claims"]({ id }).get();
			if (error) throw new Error("تعذّر تحميل المطالبة");
			return data;
		},
	});
	return { claim: data ?? null, isLoading };
};

export const useSubmitInsuranceClaim = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["insurance-claims"]({ id }).submit.post();
			if (error) throw new Error(messageOf(error, "تعذّر إرسال المطالبة"));
			return data;
		},
		onSettled: invalidate,
	});
	const submitClaim = (id: string) => {
		const promise = mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ إرسال المطالبة…",
			success: (claim) =>
				`أُرسلت المطالبة ${claim?.documentNo ?? ""} — صارت ذمّة على شركة التأمين وترحّل مع الدورة`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { submitClaim, isPending };
};

export const useCancelInsuranceClaim = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["insurance-claims"]({ id }).cancel.post();
			if (error) throw new Error(messageOf(error, "تعذّر إلغاء المطالبة"));
			return data;
		},
		onSettled: invalidate,
	});
	const cancelClaim = (id: string) => {
		const promise = mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ الإلغاء…",
			success: "أُلغيت المطالبة — عادت الفاتورة على وليّ الأمر كاملة ويُحصَّل الباقي عاديًا",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { cancelClaim, isPending };
};

/** [MI-P5] FR-I9.3 — إدخال جواب شركة التأمين (اعتماد كلي/جزئي/رفض) */
export const useAdjudicateClaim = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			id: string;
			approvedAmount: string;
			insurerReference?: string;
			rejectionReason?: string;
		}) => {
			const { data, error } = await api.accounting["insurance-claims"]({
				id: input.id,
			}).adjudicate.post({
				approvedAmount: input.approvedAmount,
				insurerReference: input.insurerReference?.trim() || null,
				rejectionReason: input.rejectionReason?.trim() || null,
			});
			if (error) throw new Error(messageOf(error, "تعذّر تسجيل نتيجة التحكيم"));
			return data;
		},
		onSettled: invalidate,
	});
	const adjudicate = (input: {
		id: string;
		approvedAmount: string;
		insurerReference?: string;
		rejectionReason?: string;
	}) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ تسجيل النتيجة…",
			success: (claim) =>
				claim?.status === "APPROVED"
					? "اعتُمدت المطالبة بالكامل — بانتظار تحصيل المبلغ بسند قبض"
					: claim?.status === "REJECTED"
						? "سُجّل الرفض — اختر مصير المبلغ: إعادة تحميل على وليّ الأمر أو شطب"
						: "اعتُمدت جزئيًا — اختر مصير المبلغ المرفوض",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { adjudicate, isPending };
};

/** [MI-P5] BR-I9.4 — مصير المبلغ المرفوض: على وليّ الأمر أو شطبًا (§10.3a/b) */
export const useResolveClaimRejection = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; resolution: "REBILL_OWNER" | "WRITE_OFF" }) => {
			const { data, error } = await api.accounting["insurance-claims"]({ id: input.id })[
				"resolve-rejection"
			].post({ resolution: input.resolution });
			if (error) throw new Error(messageOf(error, "تعذّر حسم المبلغ المرفوض"));
			return data;
		},
		onSettled: invalidate,
	});
	const resolveRejection = (input: {
		id: string;
		resolution: "REBILL_OWNER" | "WRITE_OFF";
	}) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ الحسم…",
			success:
				input.resolution === "REBILL_OWNER"
					? "أُعيد تحميل المبلغ على وليّ الأمر — صار رصيدًا مفتوحًا على ذمته يُحصَّل بسند قبض"
					: "شُطب المبلغ على حساب الشطب",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { resolveRejection, isPending };
};
