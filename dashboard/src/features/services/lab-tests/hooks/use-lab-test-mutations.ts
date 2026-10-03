import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
	LabSampleStage,
	LabTestStatus,
	PaymentMethod,
	TaskPriority,
} from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { LabResultEntryInput } from "@/server/lab-tests/lab-tests.type";

// ملاحظة: `toast.promise` في sonner لا يُعيد Promise قابلًا للانتظار، لذا نحتفظ
// بوعد الطفرة ونعيده — حتى تعمل السلاسل مثل «احفظ النتائج ثم أرسل للمراجعة».
//
// إجراءات التحليل المفرد تُخاطب `/lab-tests/items/:itemId`، وإجراءات الطلب
// كاملًا تُخاطب `/lab-tests/:id`. كلاهما يُعيد الطلب بعناصره فيُبطَّل معًا.

/** رسالة الخطأ من الخادم (message عربي) مع بديل ثابت */
const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidateLabTests = () => {
	const queryClient = useQueryClient();
	return (id?: string) => {
		void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
		if (id) void queryClient.invalidateQueries({ queryKey: ["lab-test", id] });
	};
};

/** نقل تحليل بين مراحل سير العمل */
/** تغيير أولوية الطلب من البطاقة — الخادم يرفضها بعد بدء سحب العيّنة */
export const useUpdateLabPriority = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({ id, priority }: { id: string; priority: TaskPriority | null }) => {
			const res = await api["lab-tests"]({ id }).priority.patch({ priority });
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

export const useUpdateLabTestStatus = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({ itemId, status }: { itemId: string; status: LabTestStatus }) => {
			const res = await api["lab-tests"].items({ itemId }).status.patch({ status });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحديث حالة التحليل"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
		// رفض الخادم يعيد الجلب حتى ترجع البطاقة المنقولة تفاؤليًا لعمودها الصحيح
		onError: () => invalidate(),
	});

	const updateStatus = (input: { itemId: string; status: LabTestStatus }) => {
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

/** تقدّم مرحلة العيّنة ضمن حالتها (سحب العيّنة أو المختبر) */
export const useUpdateLabSampleStage = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			sampleStage,
		}: {
			itemId: string;
			sampleStage: LabSampleStage;
		}) => {
			const res = await api["lab-tests"].items({ itemId }).stage.patch({ sampleStage });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تحديث مرحلة العيّنة"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
		onError: () => invalidate(),
	});

	const updateStage = (input: { itemId: string; sampleStage: LabSampleStage }) => {
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

/** تعيين فنّي المختبر لتحليل بعينه */
export const useAssignLabTest = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			assignedToId,
		}: {
			itemId: string;
			assignedToId: string | null;
		}) => {
			const res = await api["lab-tests"].items({ itemId }).assign.patch({ assignedToId });
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

/** حفظ نتائج المُحلِّلات (استبدال كامل) */
export const useSaveLabResults = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			results,
		}: {
			itemId: string;
			results: LabResultEntryInput[];
		}) => {
			const res = await api["lab-tests"].items({ itemId }).results.put({ results });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ النتائج"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveResults = (input: { itemId: string; results: LabResultEntryInput[] }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حفظ النتائج...",
			success: "تم حفظ النتائج",
			error: (err: Error) => err.message || "فشل حفظ النتائج",
		});
		return p;
	};

	return { saveResults, isPending: mutation.isPending };
};

/** حفظ مسودّة تقرير المراجعة دون تغيير الحالة */
export const useSaveLabReport = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			report,
			mentionedStaffIds,
		}: {
			itemId: string;
			report: string | null;
			mentionedStaffIds?: string[];
		}) => {
			const res = await api["lab-tests"].items({ itemId }).report.patch({
				report,
				mentionedStaffIds: mentionedStaffIds ?? [],
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التقرير"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveReport = (input: {
		itemId: string;
		report: string | null;
		mentionedStaffIds?: string[];
	}) => {
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
 * صياغة مسودّة التقرير بالذكاء الاصطناعي من النتائج المحفوظة على الخادم.
 * لا تحفظ شيئًا: تُعيد النص ليضعه المحرّر في المسودّة ويراجعه المدرّب.
 */
export const useGenerateLabReport = () => {
	const mutation = useMutation({
		mutationFn: async ({ itemId }: { itemId: string }) => {
			const res = await api["lab-tests"].items({ itemId }).report.generate.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توليد التقرير"));
			return res.data as { report: string };
		},
	});

	const generateReport = (input: { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ صياغة التقرير...",
			success: "تمت صياغة مسودّة التقرير — راجعها قبل الحفظ",
			error: (err: Error) => err.message || "فشل توليد التقرير",
		});
		return p;
	};

	return { generateReport, isPending: mutation.isPending };
};

/** قبول المراجعة → مكتملة (التقرير مطلوب) */
export const useApproveLabTest = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			report,
			mentionedStaffIds,
		}: {
			itemId: string;
			report: string;
			mentionedStaffIds?: string[];
		}) => {
			const res = await api["lab-tests"].items({ itemId }).approve.post({
				report,
				mentionedStaffIds: mentionedStaffIds ?? [],
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر اعتماد التحليل"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const approve = (input: {
		itemId: string;
		report: string;
		mentionedStaffIds?: string[];
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الاعتماد...",
			success: "تم اعتماد التحليل",
			error: (err: Error) => err.message || "فشل اعتماد التحليل",
		});
		return p;
	};

	return { approve, isPending: mutation.isPending };
};

/** رفض المراجعة → العودة للمختبر من أول مرحلة */
export const useRejectLabTest = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({ itemId, reason }: { itemId: string; reason: string }) => {
			const res = await api["lab-tests"].items({ itemId }).reject.post({ reason });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر رفض التحليل"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const reject = (input: { itemId: string; reason: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ إرسال الرفض...",
			success: "أُعيد التحليل إلى المختبر",
			error: (err: Error) => err.message || "فشل رفض التحليل",
		});
		return p;
	};

	return { reject, isPending: mutation.isPending };
};

// ── إجراءات الطلب كاملًا ───────────────────────────────────────────────────

/** تأكيد طلب من الطابور → مجدول لكل تحاليله */
export const useConfirmLabTest = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...input
		}: {
			id: string;
			assignedToId?: string | null;
			priority?: TaskPriority | null;
			notes?: string | null;
		}) => {
			const res = await api["lab-tests"]({ id }).confirm.post({
				assignedToId: input.assignedToId ?? null,
				priority: input.priority ?? null,
				notes: input.notes ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تأكيد الطلب"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const confirmLabTest = (input: {
		id: string;
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

	return { confirmLabTest, isPending: mutation.isPending };
};

/** اعتماد مراجعة ضبط الجودة (Westgard) للطلب — يختم الطلب بمن راجع ومتى */
export const useReviewLabQc = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({ id, rules }: { id: string; rules: string[] }) => {
			const res = await api["lab-tests"]({ id })["qc-review"].post({ rules });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر اعتماد المراجعة"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const reviewQc = (input: { id: string; rules: string[] }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ اعتماد المراجعة...",
			success: "تم اعتماد مراجعة ضبط الجودة",
			error: (err: Error) => err.message || "فشل اعتماد المراجعة",
		});
		return p;
	};

	return { reviewQc, isPending: mutation.isPending };
};

/** رفض طلب من الطابور → إلغاء وحذف مع إشعار المدرّب الطالب */
export const useDeclineLabTest = () => {
	const invalidate = useInvalidateLabTests();

	const mutation = useMutation({
		mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
			const res = await api["lab-tests"]({ id }).decline.post({ reason });
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

/** سداد فاتورة الطلب — البوابة التي لا يمضي أي تحليل قبلها */
export const usePayLabInvoice = () => {
	const invalidate = useInvalidateLabTests();
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
			const res = await api["lab-tests"]({ id }).invoice.pay.post({
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
		/** سداد تحليل بعينه — غيابه دفعة على الفاتورة كلها */
		itemId?: string;
		insurance?: { apply: boolean; excludedLineRefs: string[] };
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تسجيل السداد...",
			success: input.itemId ? "تم سداد التحليل" : "تم سداد فاتورة الطلب",
			error: (err: Error) => err.message || "فشل سداد الفاتورة",
		});
		return p;
	};

	return { payInvoice, isPending: mutation.isPending };
};
