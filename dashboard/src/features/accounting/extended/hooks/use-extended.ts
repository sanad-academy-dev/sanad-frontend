import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

/**
 * [P12.14] Hooks for «العمليات الممتدّة» — the Phase-12 Extended features that shipped
 * server-side only and were, until this task, unreachable through the product.
 *
 * ONE FILE FOR SEVEN FEATURES, deliberately. Each is a small list + one action; splitting
 * them into seven hook files would multiply the query-key boilerplate without separating
 * anything that actually varies. The shared `EXTENDED_KEY` prefix means any action that
 * posts to the ledger can invalidate everything accounting-shaped in one call — which is the
 * correct blast radius, because a deferred run or a subscription bill changes balances the
 * other tabs are showing.
 */

const EXTENDED_KEY = ["accounting", "extended"] as const;
const key = (...parts: string[]) => [...EXTENDED_KEY, ...parts] as const;

/** Elysia's error envelope → the Arabic message the server actually sent */
const messageOf = (error: unknown, fallback: string): string => {
	const value = (error as { value?: { message?: string } })?.value;
	return value?.message ?? fallback;
};

/** every mutation here can move the ledger — refresh ALL accounting reads, not just this tab */
const useAccountingInvalidator = () => {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: ["accounting"] });
};

/* ── [P12.5] dunning ──────────────────────────────────────────────────────────────────── */

export const useDunnings = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("dunnings"),
		queryFn: async () => {
			const { data, error } = await api.accounting.dunning.get();
			if (error) throw new Error("تعذّر تحميل المطالبات");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { dunnings: data ?? [], isLoading };
};

export const useDunningTypes = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("dunning-types"),
		queryFn: async () => {
			const { data, error } = await api.accounting.dunning.types.get();
			if (error) throw new Error("تعذّر تحميل أنواع المطالبات");
			return data;
		},
		staleTime: 1000 * 60,
	});
	return { types: data ?? [], isLoading };
};

/**
 * [P12.15] What a dunning letter WOULD cover, for one party, as of one date.
 *
 * Read before creating, never after: the operator picks which overdue invoices go into the
 * letter, and a create screen that could not show them would be asking for a signature on a
 * blank page. `enabled` on the party keeps it from firing before there is anything to ask
 * about.
 */
export const useOverdueInvoices = (partyType: string | null, partyId: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: key("overdue", partyType ?? "", partyId ?? ""),
		queryFn: async () => {
			const { data, error } = await api.accounting.dunning.overdue.get({
				query: { partyType: partyType as string, partyId: partyId as string },
			});
			if (error) throw new Error("تعذّر تحميل الفواتير المتأخّرة");
			return data;
		},
		enabled: Boolean(partyType && partyId),
		staleTime: 1000 * 15,
	});
	return { overdue: data ?? [], isLoading };
};

export const useCreateDunning = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			partyType: string;
			partyId: string;
			postingDate: string;
			typeId?: string | null;
			salesInvoiceIds?: string[];
			rateOfInterest?: string | null;
			dunningFee?: string | null;
		}) => {
			const { data, error } = await api.accounting.dunning.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر إنشاء المطالبة"));
			return data;
		},
		onSettled: invalidate,
	});
	const createDunning = (input: {
		partyType: string;
		partyId: string;
		postingDate: string;
		typeId?: string | null;
		salesInvoiceIds?: string[];
		rateOfInterest?: string | null;
		dunningFee?: string | null;
	}) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إنشاء المطالبة…",
			// المسودّة لا تُرحّل شيئًا؛ قول ذلك يمنع ظنّ أن الفائدة قُيّدت بمجرّد الإنشاء
			success: "أُنشئت المطالبة كمسودّة — الاعتماد هو ما يُرحّل الفائدة والرسم",
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { createDunning, isPending };
};

export const useCreateDunningType = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			title: string;
			rateOfInterest: string;
			dunningFee: string;
			letterBody?: string | null;
			incomeAccountId?: string | null;
			disabled?: boolean;
		}) => {
			const { data, error } = await api.accounting.dunning.types.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر إنشاء نوع المطالبة"));
			return data;
		},
		onSettled: invalidate,
	});
	const createDunningType = (input: {
		title: string;
		rateOfInterest: string;
		dunningFee: string;
		letterBody?: string | null;
		incomeAccountId?: string | null;
		disabled?: boolean;
	}) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ حفظ النوع…",
			success: "حُفظ نوع المطالبة",
			error: (error: Error) => error.message,
		});
	return { createDunningType, isPending };
};

export const useSubmitDunning = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting.dunning({ id }).submit.post();
			if (error) throw new Error(messageOf(error, "تعذّر اعتماد المطالبة"));
			return data;
		},
		onSettled: invalidate,
	});
	const submitDunning = (id: string) =>
		toast.promise(mutateAsync(id), {
			loading: "جارٍ اعتماد المطالبة…",
			success: "اعتُمدت المطالبة ورُحّلت الفائدة والرسوم",
			error: (error: Error) => error.message,
		});
	return { submitDunning, isPending };
};

/* ── [P12.5] subscriptions ────────────────────────────────────────────────────────────── */

export const useSubscriptions = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("subscriptions"),
		queryFn: async () => {
			const { data, error } = await api.accounting.subscriptions.get();
			if (error) throw new Error("تعذّر تحميل الاشتراكات");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { subscriptions: data ?? [], isLoading };
};

export type SubscriptionPlanInput = {
	itemName: string;
	qty: string;
	rate: string;
	incomeAccountId: string;
	costCenterId: string;
};

export type CreateSubscriptionInput = {
	partyId: string;
	partyType?: string;
	interval: "DAY" | "WEEK" | "MONTH" | "YEAR";
	intervalCount: number;
	startDate: string;
	endDate?: string | null;
	generateInvoiceAtPeriodStart?: boolean;
	daysUntilDue?: number;
	submitGeneratedInvoice?: boolean;
	plans: SubscriptionPlanInput[];
};

export const useCreateSubscription = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CreateSubscriptionInput) => {
			const { data, error } = await api.accounting.subscriptions.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر إنشاء الاشتراك"));
			return data;
		},
		onSettled: invalidate,
	});
	const createSubscription = (input: CreateSubscriptionInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ إنشاء الاشتراك…",
			success: "أُنشئ الاشتراك — «توليد الفواتير المستحقّة» هو ما يُصدر أول فاتورة",
			error: (error: Error) => error.message,
		});
	return { createSubscription, isPending };
};

export const useRunSubscriptionBilling = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { asOf?: string; subscriptionId?: string }) => {
			const { data, error } = await api.accounting.subscriptions.run.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر تشغيل فوترة الاشتراكات"));
			return data;
		},
		onSettled: invalidate,
	});
	const runBilling = (input: { asOf?: string; subscriptionId?: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ توليد فواتير الاشتراكات…",
			success: (result) =>
				result.generated.length === 0
					? "لا فترات مستحقّة — لم تُولَّد فواتير"
					: `وُلِّدت ${result.generated.length} فاتورة`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { runBilling, isPending };
};

/* ── [P12.2] deferred revenue/expense ─────────────────────────────────────────────────── */

export const useDeferredSchedule = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("deferred-schedule"),
		queryFn: async () => {
			const { data, error } = await api.accounting.deferred.schedule.get({ query: {} });
			if (error) throw new Error("تعذّر تحميل جدول الاستحقاق المؤجل");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { schedule: data, isLoading };
};

export const useRunDeferred = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { periodStartDate: string; periodEndDate: string }) => {
			const { data, error } = await api.accounting.deferred.run.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر تشغيل الاعتراف المؤجل"));
			return data;
		},
		onSettled: invalidate,
	});
	const runDeferred = (input: { periodStartDate: string; periodEndDate: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ الاعتراف بالمؤجل…",
			success: (result) =>
				`اعتُرف بـ ${result.recognized.length} سطر بإجمالي ${result.totalAmount}`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { runDeferred, isPending };
};

/* ── [P12.7] statements of accounts ───────────────────────────────────────────────────── */

export const usePsoaConfigs = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("psoa"),
		queryFn: async () => {
			const { data, error } = await api.accounting["statements-of-accounts"].get();
			if (error) throw new Error("تعذّر تحميل تهيئات كشوف الحساب");
			return data;
		},
		staleTime: 1000 * 60,
	});
	return { configs: data ?? [], isLoading };
};

export type PsoaCustomerInput = { partyType: string; partyId: string; email?: string | null };

export type PsoaConfigInput = {
	title: string;
	reportType: "PARTY_LEDGER" | "RECEIVABLE_AGEING";
	frequency: "MANUAL" | "WEEKLY" | "MONTHLY" | "QUARTERLY";
	fromDate?: string | null;
	toDate?: string | null;
	subject?: string | null;
	bodyText?: string | null;
	ccEmails?: string[];
	enabled?: boolean;
	customers: PsoaCustomerInput[];
};

export const useCreatePsoaConfig = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: PsoaConfigInput) => {
			const { data, error } = await api.accounting["statements-of-accounts"].post(input);
			if (error) throw new Error(messageOf(error, "تعذّر حفظ تهيئة كشف الحساب"));
			return data;
		},
		onSettled: invalidate,
	});
	const createConfig = (input: PsoaConfigInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الحفظ…",
			success: "حُفظت التهيئة — عاينها قبل أي إرسال",
			error: (error: Error) => error.message,
		});
	return { createConfig, isPending };
};

/**
 * [P12.15] Preview one config's statements. Fetched only while the preview dialog is open:
 * building a statement walks the ledger for every customer in the config, and doing that on
 * every list render would make the tab expensive for no reason.
 */
export const usePsoaPreview = (psoaId: string | null) => {
	const { data, isLoading, error } = useQuery({
		queryKey: key("psoa-preview", psoaId ?? ""),
		queryFn: async () => {
			const { data, error } = await api.accounting["statements-of-accounts"]({
				id: psoaId as string,
			}).preview.get({ query: {} });
			if (error) throw new Error(messageOf(error, "تعذّرت المعاينة"));
			return data;
		},
		enabled: Boolean(psoaId),
		retry: false,
		staleTime: 1000 * 15,
	});
	return { statements: data ?? [], isLoading, error: error as Error | null };
};

export const useSendStatements = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (psoaId: string) => {
			const { data, error } = await api.accounting["statements-of-accounts"]({
				id: psoaId,
			}).send.post({});
			if (error) throw new Error(messageOf(error, "تعذّر إرسال الكشوف"));
			return data;
		},
		onSettled: invalidate,
	});
	const sendStatements = (psoaId: string) => {
		const promise = mutateAsync(psoaId);
		toast.promise(promise, {
			loading: "جارٍ الإرسال…",
			// المتخطَّى يُقال صراحةً: «أُرسل ٣» وحدها تُقرأ كأن الكلّ وصل
			success: (result) =>
				result.skipped.length === 0
					? `أُرسل ${result.sent.length} كشفًا`
					: `أُرسل ${result.sent.length} وتُخطّي ${result.skipped.length} (بلا بريد أو فشل الإرسال)`,
			error: (error: Error) => error.message,
		});
		return promise;
	};
	return { sendStatements, isPending };
};

/* ── [P12.9] repost ───────────────────────────────────────────────────────────────────── */

export const useReposts = () => {
	const { data, isLoading } = useQuery({
		queryKey: key("reposts"),
		queryFn: async () => {
			const { data, error } = await api.accounting.repost.get();
			if (error) throw new Error("تعذّر تحميل طلبات إعادة الترحيل");
			return data;
		},
		staleTime: 1000 * 30,
	});
	return { reposts: data ?? [], isLoading };
};

export const useRepostCandidates = (voucherType: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: key("repost-candidates", voucherType ?? ""),
		queryFn: async () => {
			const { data, error } = await api.accounting.repost.candidates.get({
				query: { voucherType: voucherType as string },
			});
			if (error) throw new Error(messageOf(error, "تعذّر تحميل المستندات المرشّحة"));
			return data;
		},
		enabled: Boolean(voucherType),
		staleTime: 1000 * 15,
	});
	return { candidates: data ?? [], isLoading };
};

export const useCreateRepost = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: {
			reason: string;
			vouchers: { voucherType: string; voucherId: string; voucherNo?: string | null }[];
		}) => {
			const { data, error } = await api.accounting.repost.post(input);
			if (error) throw new Error(messageOf(error, "تعذّر إنشاء طلب إعادة الترحيل"));
			return data;
		},
		onSettled: invalidate,
	});
	const createRepost = (input: {
		reason: string;
		vouchers: { voucherType: string; voucherId: string; voucherNo?: string | null }[];
	}) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ إنشاء الطلب…",
			// الإنشاء لا يُحرّك الدفتر — «تشغيل» هو ما يعكس ويعيد البناء
			success: "أُنشئ الطلب — لم يُمَسّ الدفتر بعد، «تشغيل» هو ما يعكس ويعيد الترحيل",
			error: (error: Error) => error.message,
		});
	return { createRepost, isPending };
};

export const useRunRepost = () => {
	const invalidate = useAccountingInvalidator();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting.repost({ id }).run.post();
			if (error) throw new Error(messageOf(error, "تعذّر تشغيل إعادة الترحيل"));
			return data;
		},
		onSettled: invalidate,
	});
	const runRepost = (id: string) =>
		toast.promise(mutateAsync(id), {
			loading: "جارٍ إعادة الترحيل…",
			success: (result) => {
				const failed = result.results.filter((row) => !row.ok).length;
				return failed === 0
					? `أُعيد ترحيل ${result.results.length} مستند`
					: `اكتمل مع ${failed} إخفاق — راجع التفاصيل`;
			},
			error: (error: Error) => error.message,
		});
	return { runRepost, isPending };
};

/* ── [P12.4] POS shifts ───────────────────────────────────────────────────────────────── */

export const usePosRegister = (fromDate: string, toDate: string) => {
	const { data, isLoading } = useQuery({
		queryKey: key("pos-register", fromDate, toDate),
		queryFn: async () => {
			const { data, error } = await api.accounting["pos-shifts"].register.get({
				query: { fromDate, toDate },
			});
			if (error) throw new Error("تعذّر تحميل سجلّ الورديات");
			return data;
		},
		enabled: Boolean(fromDate && toDate),
		staleTime: 1000 * 30,
	});
	return { register: data ?? [], isLoading };
};

/* ── [P12.3] withholding ──────────────────────────────────────────────────────────────── */

export const useWithholdingSummary = (fromDate: string, toDate: string) => {
	const { data, isLoading } = useQuery({
		queryKey: key("withholding-summary", fromDate, toDate),
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["withholding-summary"].get({
				query: { fromDate, toDate },
			});
			if (error) throw new Error("تعذّر تحميل ملخّص الاستقطاع");
			return data;
		},
		enabled: Boolean(fromDate && toDate),
		staleTime: 1000 * 30,
	});
	return { rows: data ?? [], isLoading };
};
