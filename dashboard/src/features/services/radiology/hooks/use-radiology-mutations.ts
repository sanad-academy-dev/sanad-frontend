import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
	PaymentMethod,
	RadiologyStage,
	RadiologyStatus,
	TaskPriority,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { RadiologyReportFormValues } from "@/server/radiology/radiology.type";

// ملاحظة: `toast.promise` في sonner لا يُعيد Promise قابلًا للانتظار، لذا نحتفظ
// بوعد الطفرة ونعيده — حتى تعمل السلاسل مثل «احفظ التقرير ثم أرسل للمراجعة».
//
// إجراءات الفحص المفرد تُخاطب `/radiology/items/:itemId`، وإجراءات الطلب
// كاملًا تُخاطب `/radiology/:id`. كلاهما يُعيد الطلب بعناصره فيُبطَّل معًا.

/** رسالة الخطأ من الخادم (message عربي) مع بديل ثابت */
const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidateRadiology = () => {
	const queryClient = useQueryClient();
	return (id?: string) => {
		void queryClient.invalidateQueries({ queryKey: ["radiology"] });
		if (id) void queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
	};
};

/** تغيير أولوية الطلب من البطاقة — الخادم يرفضها بعد بدء تحضير الطفل */
export const useUpdateRadiologyPriority = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ id, priority }: { id: string; priority: TaskPriority | null }) => {
			const res = await api.radiology({ id }).priority.patch({ priority });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تغيير الأولوية"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const updatePriority = (input: { id: string; priority: TaskPriority | null }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تغيير الأولوية...",
			success: "تم تغيير الأولوية",
			error: (err: Error) => err.message || "فشل تغيير الأولوية",
		});
		return p;
	};

	return { updatePriority, isPending: mutation.isPending };
};

/** نقل فحص بين حالات سير العمل (محكوم بآلة الحالات على الخادم) */
export const useUpdateRadiologyStatus = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ itemId, status }: { itemId: string; status: RadiologyStatus }) => {
			const res = await api.radiology.items({ itemId }).status.patch({ status });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحديث حالة الفحص"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
		// رفض الخادم يعيد الجلب حتى ترجع البطاقة المنقولة تفاؤليًا لعمودها الصحيح
		onError: () => invalidate(),
	});

	const updateStatus = (input: { itemId: string; status: RadiologyStatus }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث الحالة",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});
		return p;
	};

	return { updateStatus, isPending: mutation.isPending };
};

/** تقدّم المرحلة الفرعية ضمن حالتها (التحضير أو التصوير) */
export const useUpdateRadiologyStage = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ itemId, stage }: { itemId: string; stage: RadiologyStage }) => {
			const res = await api.radiology.items({ itemId }).stage.patch({ stage });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحديث المرحلة"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
		onError: () => invalidate(),
	});

	const updateStage = (input: { itemId: string; stage: RadiologyStage }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تحديث المرحلة...",
			success: "تم تحديث المرحلة",
			error: (err: Error) => err.message || "فشل تحديث المرحلة",
		});
		return p;
	};

	return { updateStage, isPending: mutation.isPending };
};

/** تعيين فنّي الأشعة لفحص بعينه */
/** إعادة جدولة فحص — متاحة قبل بدء العمل عليه فقط (الخادم يحرس ذلك) */
export const useRescheduleRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			scheduledAt,
			reason,
		}: {
			itemId: string;
			scheduledAt: Date;
			reason?: string | null;
		}) => {
			const res = await api.radiology.items({ itemId }).schedule.patch({
				scheduledAt: scheduledAt.toISOString(),
				reason: reason ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تغيير الموعد"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const reschedule = (input: {
		itemId: string;
		scheduledAt: Date;
		reason?: string | null;
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تغيير الموعد...",
			success: "تم تغيير موعد الفحص",
			error: (err: Error) => err.message || "فشل تغيير الموعد",
		});
		return p;
	};

	return { reschedule, isPending: mutation.isPending };
};

export const useAssignRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			assignedToId,
		}: {
			itemId: string;
			assignedToId: string | null;
		}) => {
			const res = await api.radiology.items({ itemId }).assign.patch({ assignedToId });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعيين الفنّي"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const assign = (input: { itemId: string; assignedToId: string | null }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ التعيين...",
			success: "تم تعيين الفنّي",
			error: (err: Error) => err.message || "فشل التعيين",
		});
		return p;
	};

	return { assign, isPending: mutation.isPending };
};

/** حفظ مسودّة التقرير (الأقسام الخمسة + علم النتيجة الحرجة) دون تغيير الحالة */
export const useSaveRadiologyReport = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			...report
		}: RadiologyReportFormValues & { itemId: string }) => {
			const res = await api.radiology.items({ itemId }).report.patch({
				technique: report.technique ?? null,
				comparison: report.comparison ?? null,
				findings: report.findings ?? null,
				impression: report.impression ?? null,
				recommendations: report.recommendations ?? null,
				criticalFinding: report.criticalFinding,
				criticalNotifiedTo: report.criticalNotifiedTo ?? null,
				criticalNotifiedToId: report.criticalNotifiedToId ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التقرير"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveReport = (input: RadiologyReportFormValues & { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حفظ التقرير...",
			success: "تم حفظ التقرير",
			error: (err: Error) => err.message || "فشل حفظ التقرير",
		});
		return p;
	};

	return { saveReport, isPending: mutation.isPending };
};

/**
 * سؤال الذكاء الاصطناعي عن منطقة مختارة من الصورة داخل العارض.
 * لا يحفظ شيئًا: يُعيد الإجابة لتُقرأ، والمدرّب ينقل ما يراه مفيدًا لتقريره.
 */
export const useAskRadiologyAi = () => {
	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			imageDataUrl,
			question,
		}: {
			itemId: string;
			imageDataUrl: string;
			question: string;
		}) => {
			const res = await api.radiology.items({ itemId })["ask-ai"].post({
				imageDataUrl,
				question,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر الحصول على إجابة"));
			return res.data as { answer: string };
		},
	});

	return { askAi: mutation.mutateAsync, isPending: mutation.isPending };
};

/** اعتماد المراجعة → مكتملة (التقرير المكتمل شرط على الخادم) */
export const useApproveRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ itemId, note }: { itemId: string; note?: string | null }) => {
			const res = await api.radiology.items({ itemId }).approve.post({ note: note ?? null });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر اعتماد الفحص"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const approve = (input: { itemId: string; note?: string | null }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الاعتماد...",
			success: "تم اعتماد التقرير",
			error: (err: Error) => err.message || "فشل اعتماد الفحص",
		});
		return p;
	};

	return { approve, isPending: mutation.isPending };
};

/** رفض المراجعة → العودة إلى كتابة التقرير */
export const useRejectRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ itemId, reason }: { itemId: string; reason: string }) => {
			const res = await api.radiology.items({ itemId }).reject.post({ reason });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر رفض التقرير"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const reject = (input: { itemId: string; reason: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ إرسال الرفض...",
			success: "أُعيد الفحص إلى كتابة التقرير",
			error: (err: Error) => err.message || "فشل رفض التقرير",
		});
		return p;
	};

	return { reject, isPending: mutation.isPending };
};

// ── إجراءات الطلب كاملًا ───────────────────────────────────────────────────

/** تأكيد طلب من الطلبات → مجدول لكل فحوصاته */
export const useConfirmRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...input
		}: {
			id: string;
			scheduledAt: Date;
			assignedToId?: string | null;
			priority?: TaskPriority | null;
			notes?: string | null;
		}) => {
			const res = await api.radiology({ id }).confirm.post({
				scheduledAt: input.scheduledAt.toISOString(),
				assignedToId: input.assignedToId ?? null,
				priority: input.priority ?? null,
				notes: input.notes ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تأكيد الطلب"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const confirmOrder = (input: {
		id: string;
		scheduledAt: Date;
		assignedToId?: string | null;
		priority?: TaskPriority | null;
		notes?: string | null;
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تأكيد الطلب...",
			success: "تم تأكيد الطلب",
			error: (err: Error) => err.message || "فشل تأكيد الطلب",
		});
		return p;
	};

	return { confirmOrder, isPending: mutation.isPending };
};

/** رفض طلب من الطلبات → إلغاء وحذف مع إشعار المدرّب الطالب */
export const useDeclineRadiology = () => {
	const invalidate = useInvalidateRadiology();

	const mutation = useMutation({
		mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
			const res = await api.radiology({ id }).decline.post({ reason });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر رفض الطلب"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const decline = (input: { id: string; reason: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ رفض الطلب...",
			success: "رُفض الطلب وأُشعر المدرّب الطالب",
			error: (err: Error) => err.message || "فشل رفض الطلب",
		});
		return p;
	};

	return { decline, isPending: mutation.isPending };
};

/** سداد فاتورة الطلب — البوابة التي لا يمضي أي فحص قبلها */
export const usePayRadiologyInvoice = () => {
	const invalidate = useInvalidateRadiology();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			amountPaid,
			paymentMethod,
			itemId,
			insurance,
		}: {
			id: string;
			amountPaid: number;
			paymentMethod: PaymentMethod;
			itemId?: string;
			insurance?: { apply: boolean; excludedLineRefs: string[] };
		}) => {
			const res = await api.radiology({ id }).invoice.pay.post({
				amountPaid,
				paymentMethod,
				itemId,
				insurance,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر سداد الفاتورة"));
			return res.data;
		},
		onSuccess: (_d, v) => {
			invalidate(v.id);
			// الفاتورة تظهر أيضًا في المالية — تُبطَّل قوائمها
			void queryClient.invalidateQueries({ queryKey: ["invoices"] });
			void queryClient.invalidateQueries({ queryKey: ["finance-stats"] });
		},
	});

	const payInvoice = (input: {
		id: string;
		amountPaid: number;
		paymentMethod: PaymentMethod;
		/** سداد فحص بعينه — غيابه دفعة على الفاتورة كلها */
		itemId?: string;
		insurance?: { apply: boolean; excludedLineRefs: string[] };
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تسجيل السداد...",
			success: input.itemId ? "تم سداد الفحص" : "تم سداد فاتورة الطلب",
			error: (err: Error) => err.message || "فشل سداد الفاتورة",
		});
		return p;
	};

	return { payInvoice, isPending: mutation.isPending };
};
