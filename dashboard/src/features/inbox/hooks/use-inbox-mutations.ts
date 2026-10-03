import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

// يبطل استعلامات الوارد ذات الصلة بعد أي تغيير
function useInvalidate() {
	const qc = useQueryClient();
	return (id?: string | null) => {
		void qc.invalidateQueries({ queryKey: ["inbox"] });
		if (id) {
			void qc.invalidateQueries({ queryKey: ["inbox-item", id] });
			void qc.invalidateQueries({ queryKey: ["inbox-activity", id] });
		}
	};
}

// إضافة تعليق على عنصر
export function useAddInboxComment(itemId: string | null) {
	const invalidate = useInvalidate();
	const mutation = useMutation({
		mutationFn: async (comment: string) => {
			if (!itemId) throw new Error("no id");
			const res = await api.inbox({ id: itemId }).comments.post({ comment });
			if (res.error) throw new Error("تعذّر إضافة التعليق");
			return res.data;
		},
		onSuccess: () => invalidate(itemId),
	});
	return (comment: string) =>
		toast.promise(mutation.mutateAsync(comment), {
			loading: "جارٍ الإضافة...",
			success: "تمت إضافة التعليق",
			error: (e: Error) => e.message || "تعذّر إضافة التعليق",
		});
}

// تعليم عنصر كمقروء — إبطال أدنى (عدّاد غير المقروء فقط) لتفادي حلقة إعادة الجلب
export function useMarkInboxRead() {
	const qc = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.inbox({ id }).read.post();
			if (res.error) throw new Error("تعذّر التعليم كمقروء");
			return res.data;
		},
		// لا نُبطل القائمة/التفاصيل هنا — ذلك يسبب إعادة جلب تُعيد تشغيل التأثير.
		// نبطل فقط عدّاد غير المقروء لتحديث شارة الشريط الجانبي.
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["inbox", "unread-count"] });
		},
	});
	return (id: string) => mutation.mutate(id);
}

// تعليم الكل كمقروء
export function useMarkAllInboxRead() {
	const invalidate = useInvalidate();
	const mutation = useMutation({
		mutationFn: async () => {
			const res = await api.inbox["read-all"].post();
			if (res.error) throw new Error("تعذّر التعليم");
			return res.data;
		},
		onSuccess: () => invalidate(),
	});
	return () =>
		toast.promise(mutation.mutateAsync(), {
			loading: "جارٍ التعليم...",
			success: "تم تعليم الكل كمقروء",
			error: (e: Error) => e.message || "تعذّر التعليم",
		});
}

// قبول/رفض موافقة
export function useApprovalAction(itemId: string | null) {
	const invalidate = useInvalidate();
	const approve = useMutation({
		mutationFn: async (comment?: string) => {
			if (!itemId) throw new Error("no id");
			const res = await api.inbox({ id: itemId }).approve.post({ comment });
			if (res.error) throw new Error("تعذّر قبول الطلب");
			return res.data;
		},
		onSuccess: () => invalidate(itemId),
	});
	const reject = useMutation({
		mutationFn: async (reason?: string) => {
			if (!itemId) throw new Error("no id");
			const res = await api.inbox({ id: itemId }).reject.post({ reason });
			if (res.error) throw new Error("تعذّر رفض الطلب");
			return res.data;
		},
		onSuccess: () => invalidate(itemId),
	});
	return {
		approve: (comment?: string) =>
			toast.promise(approve.mutateAsync(comment), {
				loading: "جارٍ القبول...",
				success: "تم قبول الطلب",
				error: (e: Error) => e.message || "تعذّر قبول الطلب",
			}),
		reject: (reason?: string) =>
			toast.promise(reject.mutateAsync(reason), {
				loading: "جارٍ الرفض...",
				success: "تم رفض الطلب",
				error: (e: Error) => e.message || "تعذّر رفض الطلب",
			}),
		isPending: approve.isPending || reject.isPending,
	};
}

// حذف جماعي (all/read/completed)
export function useDeleteInbox() {
	const invalidate = useInvalidate();
	const mutation = useMutation({
		mutationFn: async (scope: "all" | "read" | "completed") => {
			const res = await api.inbox.delete({}, { query: { scope } });
			if (res.error) throw new Error("تعذّر الحذف");
			return res.data;
		},
		onSuccess: () => invalidate(),
	});
	return (scope: "all" | "read" | "completed") =>
		toast.promise(mutation.mutateAsync(scope), {
			loading: "جارٍ الحذف...",
			success: (d) => `تم حذف ${d?.count ?? 0} عنصرًا`,
			error: (e: Error) => e.message || "تعذّر الحذف",
		});
}
