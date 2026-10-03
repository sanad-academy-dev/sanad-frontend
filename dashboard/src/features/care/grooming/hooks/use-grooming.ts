import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type {
	GroomingPhotoKind,
	GroomingStatus,
	PaymentMethod,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	GroomingActivityResponse,
	GroomingDueRow,
	GroomingPeriod,
	GroomingSessionCard,
	GroomingSessionDetail,
	GroomingView,
} from "@/server/grooming/grooming.type";
import type { GroomingTemplateResponse } from "@/server/grooming-definitions/grooming-definitions.type";

/** مفاتيح الاستعلام في مكان واحد — الإبطال بعد الطفرات يلمس الشجرة كلها */
export const groomingKeys = {
	all: ["grooming"] as const,
	board: (filters?: Record<string, unknown>) =>
		[...groomingKeys.all, "board", filters ?? {}] as const,
	stats: () => [...groomingKeys.all, "stats"] as const,
	session: (id: string) => [...groomingKeys.all, "session", id] as const,
	activity: (id: string) => [...groomingKeys.all, "activity", id] as const,
	due: () => [...groomingKeys.all, "due"] as const,
	templates: () => [...groomingKeys.all, "templates"] as const,
	profile: (patientId: string) => [...groomingKeys.all, "profile", patientId] as const,
};

export const useGroomingBoard = (filters: {
	period: GroomingPeriod;
	view: GroomingView;
	q: string;
}) => {
	const { data, isLoading } = useQuery({
		queryKey: groomingKeys.board(filters),
		queryFn: async () => {
			const { data, error } = await api.grooming.get({ query: filters });
			if (error) throw new Error("تعذّر تحميل جلسات التجميل");
			return data as unknown as GroomingSessionCard[];
		},
		staleTime: 1000 * 30,
	});
	return { cards: data ?? [], isLoading };
};

export const useGroomingStats = () => {
	const { data, isLoading } = useQuery({
		queryKey: groomingKeys.stats(),
		queryFn: async () => {
			const { data, error } = await api.grooming.stats.get();
			if (error) throw new Error("تعذّر تحميل الإحصائيات");
			return data;
		},
		staleTime: 1000 * 60,
	});

	const s = data ?? { today: 0, inCustody: 0, ready: 0, overdue: 0, openIncidents: 0 };
	const statItems: StatItem[] = [
		{ title: "جلسات اليوم", value: s.today, tooltip: "الجلسات المجدولة اليوم" },
		{
			title: "في العهدة",
			value: s.inCustody,
			tooltip: "أطفال داخل الأكاديمية الآن — من الاستلام حتى التشطيب",
		},
		{ title: "جاهز للاستلام", value: s.ready, tooltip: "انتهى العمل وينتظر وليّ الأمر" },
		{
			title: "تأخّر عن الموعد",
			value: s.overdue,
			tooltip: "تجاوز الوقت الموعود للاستلام ولم يُنجَز بعد",
		},
		{
			title: "حوادث مفتوحة",
			value: s.openIncidents,
			tooltip: "حوادث متوسطة فأعلى تنتظر تقييم المدرّب وإبلاغ وليّ الأمر",
		},
	];

	return { statItems, stats: s, isLoading };
};

export const useGroomingSession = (id: string | null) => {
	const { data, isLoading } = useQuery({
		queryKey: groomingKeys.session(id ?? ""),
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await api.grooming({ id: id as string }).get();
			if (error) throw new Error("تعذّر تحميل الجلسة");
			return data as unknown as GroomingSessionDetail;
		},
	});
	return { session: data ?? null, isLoading };
};

export const useGroomingActivity = (id: string | null) => {
	const { data } = useQuery({
		queryKey: groomingKeys.activity(id ?? ""),
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await api.grooming({ id: id as string }).activity.get();
			if (error) throw new Error("تعذّر تحميل سجل النشاط");
			return data as unknown as GroomingActivityResponse[];
		},
	});
	return { activity: data ?? [] };
};

export const useGroomingDue = () => {
	const { data, isLoading } = useQuery({
		queryKey: groomingKeys.due(),
		queryFn: async () => {
			const { data, error } = await api.grooming.due.get();
			if (error) throw new Error("تعذّر تحميل قائمة الاستحقاق");
			return data as unknown as GroomingDueRow[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { rows: data ?? [], isLoading };
};

/** كتالوج دورات التجميل — يغذّي مُنشئ الجلسة */
export const useGroomingTemplates = () => {
	const { data, isLoading } = useQuery({
		queryKey: groomingKeys.templates(),
		queryFn: async () => {
			const { data, error } = await api["grooming-definitions"].templates.get();
			if (error) throw new Error("تعذّر تحميل كتالوج التجميل");
			return data as unknown as GroomingTemplateResponse[];
		},
		staleTime: 1000 * 60 * 10,
	});
	return { templates: data ?? [], isLoading };
};

/** كل الطفرات تُبطل الشجرة كاملةً: النقل يمسّ اللوحة والإحصاءات والجلسة معًا */
const useInvalidateGrooming = () => {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: groomingKeys.all });
};

export const useGroomingMutations = () => {
	const invalidate = useInvalidateGrooming();

	const moveSession = useMutation({
		mutationFn: async (vars: {
			id: string;
			to: GroomingStatus;
			overrideReason?: string;
			cancelReason?: string;
		}) => {
			const { data, error } = await api.grooming({ id: vars.id }).status.post({
				to: vars.to,
				overrideReason: vars.overrideReason ?? null,
				cancelReason: vars.cancelReason ?? null,
			});
			// 409 يحمل رسالة البوابة العربية ورمزها — تُعرض كما هي بدل «فشل» صمّاء
			if (error)
				throw new GroomingGateError(errorMessage(error, "تعذّر نقل الجلسة"), gateOf(error));
			return data;
		},
		onSuccess: invalidate,
	});

	const recordIntake = useMutation({
		mutationFn: async (vars: { id: string; body: Record<string, unknown> }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				.intake.post(vars.body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الفحص القبلي"));
			return data;
		},
		onSuccess: invalidate,
	});

	const setDryingMethod = useMutation({
		mutationFn: async (vars: { id: string; method: string }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				["drying-method"].post({ method: vars.method as never });
			if (error) throw new Error(errorMessage(error, "تعذّر ضبط طريقة التجفيف"));
			return data;
		},
		onSuccess: invalidate,
	});

	const addFinding = useMutation({
		mutationFn: async (vars: { id: string; body: Record<string, unknown> }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				.findings.post(vars.body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الملاحظة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const addIncident = useMutation({
		mutationFn: async (vars: { id: string; body: Record<string, unknown> }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				.incidents.post(vars.body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل الحادثة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const addPhoto = useMutation({
		mutationFn: async (vars: {
			id: string;
			kind: GroomingPhotoKind;
			url: string;
			caption?: string | null;
			bodyZone?: string | null;
		}) => {
			const { data, error } = await api.grooming({ id: vars.id }).photos.post({
				kind: vars.kind,
				url: vars.url,
				caption: vars.caption ?? null,
				bodyZone: vars.bodyZone ?? null,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الصورة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const sendReportCard = useMutation({
		mutationFn: async (vars: { id: string; body: Record<string, unknown> }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				["report-card"].post(vars.body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إصدار تقرير الجلسة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const setItemPerformed = useMutation({
		mutationFn: async (vars: { id: string; itemId: string; performed: boolean }) => {
			const { data, error } = await api
				.grooming({ id: vars.id })
				.items({ itemId: vars.itemId })
				.performed.post({ performed: vars.performed });
			if (error) throw new Error(errorMessage(error, "تعذّر تحديث البند"));
			return data;
		},
		onSuccess: invalidate,
	});

	const issueInvoice = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.grooming({ id }).invoice.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إصدار الفاتورة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const payInvoice = useMutation({
		mutationFn: async (vars: {
			id: string;
			amountPaid: number;
			paymentMethod: PaymentMethod;
		}) => {
			const { data, error } = await api.grooming({ id: vars.id }).invoice.pay.post({
				amountPaid: vars.amountPaid,
				paymentMethod: vars.paymentMethod,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل السداد"));
			return data;
		},
		onSuccess: invalidate,
	});

	const createSession = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api.grooming.post(body as never);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الجلسة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const approveQuote = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.grooming({ id }).quote.approve.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إقرار التسعيرة"));
			return data;
		},
		onSuccess: invalidate,
	});

	const approveShaveDown = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.grooming({ id })["shave-down"].approve.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إقرار الحلاقة"));
			return data;
		},
		onSuccess: invalidate,
	});

	/**
	 * `toast.promise` تُعيد مقبضًا لا وعدًا، فلا يصحّ ربط `.catch` بها. نُطلق الوعد
	 * أولًا ونمرّره للتنبيه ثم نُعيده كما هو — فيبقى المتصل قادرًا على الانتظار
	 * والالتقاط، ويبقى التنبيه معروضًا.
	 */
	const withToast = <T>(
		promise: Promise<T>,
		/**
		 * `typeof toast.promise<T>` لا `typeof toast.promise`.
		 *
		 * `toast.promise` نفسها معمّمة، والإشارة إليها بلا تحديد نوعها تُسقط `T` إلى
		 * `unknown` — فيصل ردّ الخادم إلى `success` بلا نوع. المستدعون الذين يمرّرون نصًّا
		 * ثابتًا لا يشعرون بذلك، ومن يمرّر دالّة يحصل على `item: unknown` (كان ذلك خطأ
		 * ترجمة قائمًا في هذا الملفّ). تعبير التنويع هنا يُبقي النوع مشتقًّا من sonner
		 * بدل إعلانه يدويًّا.
		 */
		messages: Parameters<typeof toast.promise<T>>[1],
	) => {
		toast.promise(promise, messages);
		return promise;
	};

	return {
		moveSession: (vars: Parameters<typeof moveSession.mutateAsync>[0]) =>
			withToast(moveSession.mutateAsync(vars), {
				loading: "جارٍ نقل الجلسة...",
				success: "تم نقل الجلسة",
				error: (e: Error) => e.message,
			}),
		recordIntake: (vars: Parameters<typeof recordIntake.mutateAsync>[0]) =>
			withToast(recordIntake.mutateAsync(vars), {
				loading: "جارٍ حفظ الفحص القبلي...",
				success: "حُفظ الفحص القبلي وأُعيد حساب التسعيرة",
				error: (e: Error) => e.message,
			}),
		setDryingMethod: (vars: Parameters<typeof setDryingMethod.mutateAsync>[0]) =>
			withToast(setDryingMethod.mutateAsync(vars), {
				loading: "جارٍ الحفظ...",
				success: "ضُبطت طريقة التجفيف",
				error: (e: Error) => e.message,
			}),
		addFinding: (vars: Parameters<typeof addFinding.mutateAsync>[0]) =>
			withToast(addFinding.mutateAsync(vars), {
				loading: "جارٍ حفظ الملاحظة...",
				success: "سُجّلت الملاحظة في سجل الطفل",
				error: (e: Error) => e.message,
			}),
		addIncident: (vars: Parameters<typeof addIncident.mutateAsync>[0]) =>
			withToast(addIncident.mutateAsync(vars), {
				loading: "جارٍ تسجيل الحادثة...",
				success: "سُجّلت الحادثة وأُبلغ الفريق",
				error: (e: Error) => e.message,
			}),
		createSession: (body: Record<string, unknown>) =>
			withToast(createSession.mutateAsync(body), {
				loading: "جارٍ إنشاء الجلسة...",
				success: "أُنشئت جلسة التجميل",
				error: (e: Error) => e.message,
			}),
		approveQuote: (id: string) =>
			withToast(approveQuote.mutateAsync(id), {
				loading: "جارٍ الحفظ...",
				success: "أُقرّت التسعيرة",
				error: (e: Error) => e.message,
			}),
		approveShaveDown: (id: string) =>
			withToast(approveShaveDown.mutateAsync(id), {
				loading: "جارٍ الحفظ...",
				success: "أُقرّت الحلاقة الاضطرارية",
				error: (e: Error) => e.message,
			}),
		addPhoto: (vars: Parameters<typeof addPhoto.mutateAsync>[0]) =>
			withToast(addPhoto.mutateAsync(vars), {
				loading: "جارٍ رفع الصورة...",
				success: "أُضيفت الصورة إلى الجلسة",
				error: (e: Error) => e.message,
			}),
		sendReportCard: (vars: Parameters<typeof sendReportCard.mutateAsync>[0]) =>
			withToast(sendReportCard.mutateAsync(vars), {
				loading: "جارٍ إصدار التقرير...",
				success: "صدر تقرير الجلسة",
				error: (e: Error) => e.message,
			}),
		setItemPerformed: (vars: Parameters<typeof setItemPerformed.mutateAsync>[0]) =>
			withToast(setItemPerformed.mutateAsync(vars), {
				loading: "جارٍ الحفظ...",
				success: (item) => `${item.performed ? "نُفِّذت" : "أُلغي تنفيذ"} «${item.nameSnapshot}»`,
				error: (e: Error) => e.message,
			}),
		issueInvoice: (id: string) =>
			withToast(issueInvoice.mutateAsync(id), {
				loading: "جارٍ إصدار الفاتورة...",
				success: "صدرت فاتورة الجلسة",
				error: (e: Error) => e.message,
			}),
		payInvoice: (vars: Parameters<typeof payInvoice.mutateAsync>[0]) =>
			withToast(payInvoice.mutateAsync(vars), {
				loading: "جارٍ تسجيل السداد...",
				success: "سُجّل السداد",
				error: (e: Error) => e.message,
			}),
		isPending:
			moveSession.isPending ||
			recordIntake.isPending ||
			createSession.isPending ||
			addFinding.isPending ||
			addIncident.isPending ||
			addPhoto.isPending ||
			setItemPerformed.isPending ||
			sendReportCard.isPending ||
			issueInvoice.isPending ||
			payInvoice.isPending,
		isPayingInvoice: payInvoice.isPending || issueInvoice.isPending,
	};
};

/**
 * خطأ بوابة — يحمل الرسالة العربية ورمز البوابة معًا.
 *
 * الرسالة وحدها تكفي للعرض، لكن الرمز هو ما يسمح للوحة أن تعرض «تجاوز بسبب»
 * للبوابات القابلة للتجاوز وتُخفيه عن الثلاث التي لا تُتجاوز (G5 التجفيف،
 * G6 أمر المدرّب، G10 الحادثة المفتوحة).
 */
export class GroomingGateError extends Error {
	constructor(
		message: string,
		readonly gate: string | null,
	) {
		super(message);
		this.name = "GroomingGateError";
	}
}

/** البوابات التي لا يفتحها سبب مهما كان — نسخة الواجهة من قائمة الخادم */
const NON_OVERRIDABLE = ["G5_DRYING_METHOD", "G6_VET_ORDER", "G10_INCIDENT_CLOSED"];

export const isGateOverridable = (gate: string | null | undefined): boolean =>
	!!gate && !NON_OVERRIDABLE.includes(gate);

/** رسالة الخادم العربية أولًا — البوابات ترسل سببًا مفهومًا، فلا يُبتلع */
function errorMessage(error: unknown, fallback: string): string {
	const value = (error as { value?: { message?: string } } | null)?.value;
	return typeof value?.message === "string" && value.message ? value.message : fallback;
}

function gateOf(error: unknown): string | null {
	const value = (error as { value?: { gate?: string | null } } | null)?.value;
	return typeof value?.gate === "string" ? value.gate : null;
}
