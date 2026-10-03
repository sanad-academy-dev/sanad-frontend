import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MembershipPlanStatus, MembershipStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { CreateMembershipPlanFormInput } from "@/server/accounting/membership/membership-plan.type";

/**
 * [MI-P1] Hooks for «العضويات» (MI BRD §11) — plans + members, one file (the extended-hub
 * precedent: small lists + a handful of actions; the shared key prefix lets any mutation
 * that can move the ledger refresh every accounting read at once).
 */

const KEY = ["accounting", "memberships"] as const;
const key = (...parts: string[]) => [...KEY, ...parts] as const;

const messageOf = (error: unknown, fallback: string): string => {
	const value = (error as { value?: { message?: string } })?.value;
	return value?.message ?? fallback;
};

const useAccountingInvalidator = () => {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: ["accounting"] });
};

/* ── plans (FR-M4.1) ──────────────────────────────────────────────────────────────────── */

export const useMembershipPlans = (status?: MembershipPlanStatus) => {
	const { data, isLoading } = useQuery({
		queryKey: key("plans", status ?? "all"),
		queryFn: async () => {
			const { data, error } = await api.accounting["membership-plans"].get({
				query: status ? { status } : {},
			});
			if (error) throw new Error("تعذّر تحميل خطط العضويات");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { plans: data ?? [], isLoading };
};

export const useSaveMembershipPlan = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id?: string; plan: CreateMembershipPlanFormInput }) => {
			const { data, error } = input.id
				? await api.accounting["membership-plans"]({ id: input.id }).put(input.plan)
				: await api.accounting["membership-plans"].post(input.plan);
			if (error) throw new Error(messageOf(error, "تعذّر حفظ الخطة"));
			return data;
		},
		onSettled: invalidate,
	});
	const savePlan = (input: { id?: string; plan: CreateMembershipPlanFormInput }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ الخطة…",
			success: input.id ? "حُفظت الخطة — التعديل يسري على التجديد القادم فقط" : "أُنشئت الخطة",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { savePlan, isPending };
};

export const useSetMembershipPlanStatus = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; status: MembershipPlanStatus }) => {
			const { data, error } = await api.accounting["membership-plans"]({
				id: input.id,
			}).status.post({ status: input.status });
			if (error) throw new Error(messageOf(error, "تعذّر تغيير حالة الخطة"));
			return data;
		},
		onSettled: invalidate,
	});
	const setPlanStatus = (input: { id: string; status: MembershipPlanStatus }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ التحديث…",
			success:
				input.status === "INACTIVE"
					? "عُطّلت الخطة — لا بيع جديدًا عليها والعضويات القائمة لا تتأثر"
					: "فُعّلت الخطة",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { setPlanStatus, isPending };
};

/* ── memberships (FR-M5) ──────────────────────────────────────────────────────────────── */

export const useMemberships = (filters: { status?: MembershipStatus; planId?: string }) => {
	const { data, isLoading } = useQuery({
		queryKey: key("list", filters.status ?? "all", filters.planId ?? "all"),
		queryFn: async () => {
			const { data, error } = await api.accounting.memberships.get({
				query: {
					...(filters.status ? { status: filters.status } : {}),
					...(filters.planId ? { planId: filters.planId } : {}),
				},
			});
			if (error) throw new Error("تعذّر تحميل العضويات");
			return data;
		},
		staleTime: 1000 * 15,
	});
	return { memberships: data ?? [], isLoading };
};

export const useMembership = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: key("detail", id ?? ""),
		queryFn: async () => {
			const { data, error } = await api.accounting.memberships({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل العضوية");
			return data;
		},
		enabled: Boolean(id),
		staleTime: 1000 * 10,
	});
	return { membership: data ?? null, isLoading };
};

/** the owner-profile badge read (§2.7) */
export const useOwnerMembership = (ownerId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: key("by-owner", ownerId ?? ""),
		queryFn: async () => {
			const { data, error } = await api.accounting.memberships["by-owner"]({
				ownerId: ownerId as string,
			}).get();
			if (error) throw new Error("تعذّر تحميل عضوية وليّ الأمر");
			return data;
		},
		enabled: Boolean(ownerId),
		staleTime: 1000 * 30,
	});
	return { membership: data?.membership ?? null, isLoading };
};

export const useEnrollMembership = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { ownerId: string; planId: string }) => {
			const { data, error } = await api.accounting.memberships.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر التسجيل"));
			return data;
		},
		onSettled: invalidate,
	});
	const enroll = (input: { ownerId: string; planId: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ التسجيل وتوليد الفاتورة…",
			success: (result) =>
				result?.billingError
					? `سُجّلت العضوية، لكن توليد الفاتورة تعثّر: ${result.billingError} — التشغيل اليومي سيصلحه`
					: "سُجّلت العضوية وصدرت فاتورة الفترة الأولى — حصّلها من شاشة سندات القبض",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { enroll, isPending };
};

export const useCancelMembership = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; reason: string }) => {
			const { data, error } = await api.accounting
				.memberships({ id: input.id })
				.cancel.post({ reason: input.reason });
			if (error) throw new Error(messageOf(error, "تعذّر الإلغاء"));
			return data;
		},
		onSettled: invalidate,
	});
	const cancel = (input: { id: string; reason: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ الإلغاء…",
			// §17-O2 — the no-refund rule, said where the operator acts
			success: "أُلغيت العضوية — لا استرداد تلقائيًا؛ الاسترداد إجراء يدوي من شاشة الفاتورة",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { cancel, isPending };
};

export const useSchedulePlanChange = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { id: string; planId: string }) => {
			const { data, error } = await api.accounting
				.memberships({ id: input.id })
				["schedule-plan-change"].post({ planId: input.planId });
			if (error) throw new Error(messageOf(error, "تعذّر جدولة تغيير الخطة"));
			return data;
		},
		onSettled: invalidate,
	});
	const scheduleChange = (input: { id: string; planId: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ الجدولة…",
			success: "جُدول تغيير الخطة — يسري عند التجديد القادم (BR-M5.4.2)",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { scheduleChange, isPending };
};

export const useRunMembershipDaily = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { asOf?: string }) => {
			const { data, error } = await api.accounting.memberships.run.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر تشغيل معالجة العضويات"));
			return data;
		},
		onSettled: invalidate,
	});
	const runDaily = (input: { asOf?: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ توليد فواتير التجديد واشتقاق الحالات…",
			success: (result) =>
				`اكتملت المعالجة: ${result?.billed ?? 0} فاتورة مولَّدة، ${result?.rolled ?? 0} فترة مدوَّرة، ${result?.statusChanges?.length ?? 0} تغيير حالة`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { runDaily, isPending };
};
