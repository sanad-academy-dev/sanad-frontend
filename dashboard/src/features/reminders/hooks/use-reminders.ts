import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { OutboxStatus, ReminderTrigger } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	RecallContactFormInput,
	ReminderRuleFormInput,
} from "@/server/reminders/reminders.type";

/**
 * [RC0] استعلامات وطفرات وحدة التذكيرات والاستدعاء.
 *
 * لا استطلاع دوريّ هنا خلافًا للوحتَي الطوارئ والتنويم: طاولة الاستدعاء تتغيّر
 * بفعل المستخدم نفسه (سجّل مكالمة ⇒ أُبطلت القائمة)، والاستحقاقات تتغيّر بدقّة
 * اليوم لا الدقيقة. استطلاعٌ كل ١٥ ثانية على استعلامٍ يمسح خمسة محرّكات استحقاق
 * كلفةٌ بلا مقابل.
 */

export const reminderKeys = {
	all: ["reminders"] as const,
	meta: () => [...reminderKeys.all, "meta"] as const,
	rules: () => [...reminderKeys.all, "rules"] as const,
	recall: (filters?: Record<string, unknown>) =>
		[...reminderKeys.all, "recall", filters ?? {}] as const,
	outbox: (filters?: Record<string, unknown>) =>
		[...reminderKeys.all, "outbox", filters ?? {}] as const,
	outboxCounts: () => [...reminderKeys.all, "outbox", "counts"] as const,
	contacts: (ownerId: string) => [...reminderKeys.all, "contacts", ownerId] as const,
	jobs: () => [...reminderKeys.all, "jobs"] as const,
};

// ─── المرجع ─────────────────────────────────────────────────────────────────

export const useReminderMeta = () => {
	const { data, isLoading } = useQuery({
		queryKey: reminderKeys.meta(),
		queryFn: async () => {
			const { data, error } = await api.reminders.meta.get();
			if (error) throw new Error("تعذّر تحميل مرجع التذكيرات");
			return data;
		},
		// ثوابت في الشيفرة — لا تتغيّر بين نقرتين
		staleTime: 30 * 60 * 1000,
	});
	return {
		triggers: data?.triggers ?? [],
		channels: data?.channels ?? [],
		templateTags: data?.templateTags ?? [],
		isLoading,
	};
};

// ─── القواعد ────────────────────────────────────────────────────────────────

export const useReminderRules = () => {
	const { data, isLoading } = useQuery({
		queryKey: reminderKeys.rules(),
		queryFn: async () => {
			const { data, error } = await api.reminders.rules.get();
			if (error) throw new Error("تعذّر تحميل قواعد التذكير");
			return data;
		},
	});
	return { rules: data ?? [], isLoading };
};

export const useRuleMutations = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: reminderKeys.rules() });
	};

	const createMutation = useMutation({
		mutationFn: async (input: ReminderRuleFormInput) => {
			const { data, error } = await api.reminders.rules.post(input);
			if (error) throw error;
			return data;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, ...input }: Partial<ReminderRuleFormInput> & { id: string }) => {
			const { data, error } = await api.reminders.rules({ id }).put(input);
			if (error) throw error;
			return data;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.reminders.rules({ id }).delete();
			if (error) throw error;
			return true;
		},
		onSuccess: invalidate,
	});

	return {
		createRule: (input: ReminderRuleFormInput) =>
			toast.promise(createMutation.mutateAsync(input), {
				loading: "جارٍ حفظ القاعدة...",
				success: "حُفظت القاعدة",
				error: (e: MutationError) => messageOf(e, "تعذّر حفظ القاعدة"),
			}),
		updateRule: (input: Partial<ReminderRuleFormInput> & { id: string }) =>
			toast.promise(updateMutation.mutateAsync(input), {
				loading: "جارٍ حفظ التعديل...",
				success: "حُفظ التعديل",
				error: (e: MutationError) => messageOf(e, "تعذّر حفظ التعديل"),
			}),
		/**
		 * التفعيل والإطفاء بلا صخب: `toast.promise` على مفتاح تبديل يملأ الشاشة
		 * بثلاث رسائل لكل نقرة. الخطأ وحده يستحقّ رسالة هنا.
		 */
		toggleRule: (id: string, active: boolean) =>
			updateMutation.mutateAsync({ id, active }).catch((e: MutationError) => {
				toast.error(messageOf(e, "تعذّر تغيير حالة القاعدة"));
			}),
		deleteRule: (id: string) =>
			toast.promise(deleteMutation.mutateAsync(id), {
				loading: "جارٍ الحذف...",
				success: "حُذفت القاعدة",
				error: (e: MutationError) => messageOf(e, "تعذّر حذف القاعدة"),
			}),
		isPending:
			createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
	};
};

/**
 * معاينة قاعدة — تمرّ بنفس مسار الإدراج مع `dryRun`، فتعرض النصّ الذي سيصل فعلًا.
 *
 * طفرةٌ لا استعلام رغم أنّها قراءة: المعاينة فعلٌ يبدأه المستخدم بزرّ، وتشغيلُها
 * تلقائيًّا مع كل فتحٍ للورقة يمسح محرّكات الاستحقاق بلا أن يطلب أحد.
 */
export const useRulePreview = () => {
	const mutation = useMutation({
		mutationFn: async ({ id, limit }: { id: string; limit?: number }) => {
			const { data, error } = await api.reminders.rules({ id }).preview.post({ limit });
			if (error) throw error;
			return data;
		},
	});
	return {
		preview: mutation.mutateAsync,
		result: mutation.data,
		isPending: mutation.isPending,
		reset: mutation.reset,
	};
};

export const useRunRule = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.reminders.rules({ id }).run.post({ dryRun: false });
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
		},
	});
	return {
		runRule: (id: string) =>
			toast.promise(mutation.mutateAsync(id), {
				loading: "جارٍ تجهيز الرسائل...",
				success: (result) =>
					result
						? `أُدرجت ${result.queued} رسالة · ${result.duplicates} مكرّرة · ${result.skipped} متعذّرة`
						: "تمّ التشغيل",
				error: (e: MutationError) => messageOf(e, "تعذّر تشغيل القاعدة"),
			}),
		isPending: mutation.isPending,
	};
};

// ─── طاولة الاستدعاء ────────────────────────────────────────────────────────

export type RecallQuery = {
	triggers?: string;
	horizonDays?: string;
	includeHandled?: boolean;
	includeSnoozed?: boolean;
	q?: string;
};

export const useRecallBoard = (filters: RecallQuery) => {
	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: reminderKeys.recall(filters),
		queryFn: async () => {
			const { data, error } = await api.reminders.recall.get({
				query: {
					...(filters.triggers ? { triggers: filters.triggers } : {}),
					...(filters.horizonDays ? { horizonDays: filters.horizonDays } : {}),
					includeHandled: String(Boolean(filters.includeHandled)),
					includeSnoozed: String(Boolean(filters.includeSnoozed)),
					...(filters.q ? { q: filters.q } : {}),
				},
			});
			if (error) throw new Error("تعذّر تحميل طاولة الاستدعاء");
			return data;
		},
		// مسحٌ عبر خمسة محرّكات استحقاق — يبقى صالحًا دقيقتين بدل إعادته مع كل تركيز نافذة
		staleTime: 2 * 60 * 1000,
	});

	const stats = data?.stats;
	const statItems: StatItem[] = [
		{
			title: "ملّاك بانتظار الاتصال",
			value: stats?.owners ?? 0,
			tooltip: "عدد أولياء الأمور الذين لديهم استحقاق واحد على الأقل لم يُعالَج بعد.",
		},
		{
			title: "استحقاقات",
			value: stats?.items ?? 0,
			tooltip: "مجموع البنود المستحقّة عبر كل الأسباب — قد يكون للوليّ أمر الواحد أكثر من بند.",
		},
		{
			title: "متأخّرة",
			value: stats?.overdue ?? 0,
			tooltip: "بنود مضى تاريخ استحقاقها.",
		},
		{
			title: "كُلّموا اليوم",
			value: stats?.contactedToday ?? 0,
			tooltip: "عدد التواصلات المسجَّلة منذ منتصف ليلة اليوم.",
		},
		{
			title: "بانتظار إرسال يدويّ",
			value: stats?.awaitingManual ?? 0,
			tooltip:
				"رسائل واتساب جاهزة برابطها تنتظر ضغطة موظّف — لا مرسِل آليّ لواتساب في هذه النسخة.",
		},
	];

	return {
		rows: data?.rows ?? [],
		stats,
		statItems,
		isLoading,
		isFetching,
		refetch,
	};
};

export const useLogContact = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: RecallContactFormInput) => {
			const { data, error } = await api.reminders.recall.contacts.post(input);
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			// الطاولة والصندوق الصادر معًا: نتيجة «حُجز» تُلغي رسائل معلّقة
			void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
		},
	});
	return {
		logContact: (input: RecallContactFormInput) =>
			toast.promise(mutation.mutateAsync(input), {
				loading: "جارٍ تسجيل التواصل...",
				success: (result) =>
					result && result.cancelledMessages > 0
						? `سُجّل التواصل — أُلغيت ${result.cancelledMessages} رسالة لم تعد لازمة`
						: "سُجّل التواصل",
				error: (e: MutationError) => messageOf(e, "تعذّر تسجيل التواصل"),
			}),
		isPending: mutation.isPending,
	};
};

// ─── الصندوق الصادر ─────────────────────────────────────────────────────────

/**
 * حالات الصندوق الصادر كما يقبلها الخادم. تُشتقّ من التعداد المولَّد لا تُكتب بيد،
 * فقيمةٌ جديدة فيه تكسر البناء هنا بدل أن تُرسَل نصًّا يرفضه المخطّط في وقت التشغيل.
 */
type OutboxFilter = { status?: OutboxStatus; trigger?: ReminderTrigger };

export const useOutbox = (filters: OutboxFilter) => {
	const { data, isLoading } = useQuery({
		queryKey: reminderKeys.outbox(filters),
		queryFn: async () => {
			const { data, error } = await api.reminders.outbox.get({
				query: {
					...(filters.status ? { status: filters.status } : {}),
					...(filters.trigger ? { trigger: filters.trigger } : {}),
					limit: "200",
				},
			});
			if (error) throw new Error("تعذّر تحميل الصندوق الصادر");
			return data;
		},
	});
	return { messages: data ?? [], isLoading };
};

export const useOutboxCounts = () => {
	const { data } = useQuery({
		queryKey: reminderKeys.outboxCounts(),
		queryFn: async () => {
			const { data, error } = await api.reminders.outbox.counts.get();
			if (error) throw new Error("تعذّر تحميل عدّادات الصندوق الصادر");
			return data;
		},
	});
	return { counts: data ?? {} };
};

export const useOutboxActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
	};

	const markSent = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.reminders.outbox({ id })["mark-sent"].post();
			if (error) throw error;
			return true;
		},
		onSuccess: invalidate,
	});

	const cancel = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.reminders.outbox({ id }).cancel.post();
			if (error) throw error;
			return true;
		},
		onSuccess: invalidate,
	});

	const dispatch = useMutation({
		mutationFn: async () => {
			const { data, error } = await api.reminders.outbox.dispatch.post();
			if (error) throw error;
			return data;
		},
		onSuccess: invalidate,
	});

	return {
		markSent: (id: string) =>
			toast.promise(markSent.mutateAsync(id), {
				loading: "جارٍ التعليم...",
				success: "عُلّمت الرسالة مُرسَلة",
				error: (e: MutationError) => messageOf(e, "تعذّر تعليم الرسالة"),
			}),
		cancelMessage: (id: string) =>
			toast.promise(cancel.mutateAsync(id), {
				loading: "جارٍ الإلغاء...",
				success: "أُلغيت الرسالة",
				error: (e: MutationError) => messageOf(e, "تعذّر إلغاء الرسالة"),
			}),
		dispatchNow: () =>
			toast.promise(dispatch.mutateAsync(), {
				loading: "جارٍ التسليم...",
				success: (result) =>
					result
						? `سُلّمت ${result.sent} · بانتظار إرسال يدويّ ${result.awaitingManual} · متعذّرة ${result.skipped}`
						: "تمّ التسليم",
				error: (e: MutationError) => messageOf(e, "تعذّر التسليم"),
			}),
		isPending: markSent.isPending || cancel.isPending || dispatch.isPending,
	};
};

// ─── المُجدوِل ──────────────────────────────────────────────────────────────

export const useSchedulerJobs = () => {
	const { data, isLoading } = useQuery({
		queryKey: reminderKeys.jobs(),
		queryFn: async () => {
			const { data, error } = await api.scheduler.jobs.get({ query: { limit: "50" } });
			if (error) throw new Error("تعذّر تحميل وظائف المُجدوِل");
			return data;
		},
	});
	return { jobs: data ?? [], isLoading };
};

export const useRunScheduler = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async () => {
			const { data, error } = await api.scheduler["run-now"].post();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: reminderKeys.all });
		},
	});
	return {
		runNow: () =>
			toast.promise(mutation.mutateAsync(), {
				loading: "جارٍ تشغيل المُجدوِل...",
				// الشكل `{ enqueued, run }` لأنّ الزرّ يُدرج ثمّ يُنفّذ — والرسالة تقول
				// الأمرين: «نُفّذت ٠ وظيفة» وحدها تُقرأ فشلًا وهي نجاح
				success: (result) =>
					result
						? `أُدرجت ${result.enqueued} وظيفة · نُفّذت ${result.run.completed} · ${result.run.failed} فاشلة`
						: "تمّ التشغيل",
				error: (e: MutationError) => messageOf(e, "تعذّر تشغيل المُجدوِل"),
			}),
		isPending: mutation.isPending,
	};
};

// ─── معالجة الأخطاء ─────────────────────────────────────────────────────────

/**
 * شكل خطأ Treaty: الرسالة العربية تصل في `value.message` من المعالج العامّ في
 * `src/server/app.ts`. قراءتُها **بالترتيب** لازمة — الاكتفاء بـ`error.message`
 * يعرض «Failed to fetch» بدل «علامات غير معروفة في القالب: ownrName».
 */
type MutationError = {
	value?: { message?: string } | string | null;
	message?: string;
	status?: number;
};

function messageOf(error: MutationError, fallback: string): string {
	const value = error?.value;
	if (value && typeof value === "object" && typeof value.message === "string") {
		return value.message;
	}
	if (typeof value === "string" && value.trim()) return value;
	if (typeof error?.message === "string" && /[؀-ۿ]/.test(error.message)) {
		return error.message;
	}
	return fallback;
}
