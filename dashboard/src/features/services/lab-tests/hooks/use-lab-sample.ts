import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CollectionDetailsFormValues,
	PreAnalyticalFormValues,
} from "@/server/lab-tests/lab-sample.type";

// خطّافات جمع العيّنة — تُعيد وعد الطفرة نفسه (لا نتيجة toast.promise) ليعمل الانتظار

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidate = () => {
	const queryClient = useQueryClient();
	return (id: string) => {
		void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
		void queryClient.invalidateQueries({ queryKey: ["lab-test", id] });
	};
};

/** ① التقييم ما قبل التحليلي */
export const useSavePreAnalytical = () => {
	const invalidate = useInvalidate();

	const mutation = useMutation({
		mutationFn: async ({ id, ...values }: PreAnalyticalFormValues & { id: string }) => {
			const res = await api["lab-tests"]({ id })["pre-analytical"].patch({
				fastingStatus: values.fastingStatus ?? null,
				fastingHours: values.fastingHours ?? null,
				medications: values.medications ?? [],
				ivFluids24h: values.ivFluids24h ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ التقييم"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const savePreAnalytical = (input: PreAnalyticalFormValues & { id: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حفظ التقييم...",
			success: "تم حفظ التقييم ما قبل التحليلي",
			error: (err: Error) => err.message || "فشل حفظ التقييم",
		});
		return p;
	};

	return { savePreAnalytical, isPending: mutation.isPending };
};

/** ② تفاصيل جمع العيّنة — لكل تحليل (الأنبوب وموقع السحب يختلفان) */
export const useSaveCollectionDetails = () => {
	const invalidate = useInvalidate();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			...values
		}: CollectionDetailsFormValues & { itemId: string }) => {
			const res = await api["lab-tests"].items({ itemId }).collection.patch({
				tubeType: values.tubeType ?? null,
				collectedById: values.collectedById ?? null,
				drawSite: values.drawSite ?? null,
				volumeMl: values.volumeMl ?? null,
				attempts: values.attempts ?? null,
				collectedAt: values.collectedAt ?? null,
				quality: values.quality ?? null,
				collectionNotes: values.collectionNotes ?? null,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ تفاصيل الجمع"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const saveCollection = (input: CollectionDetailsFormValues & { itemId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حفظ تفاصيل الجمع...",
			success: "تم جمع العيّنة بنجاح",
			error: (err: Error) => err.message || "فشل حفظ تفاصيل الجمع",
		});
		return p;
	};

	return { saveCollection, isPending: mutation.isPending };
};

/** ③ تسليم العيّنة لقسم المعالجة وطباعة الملصق */
export const useHandoverSample = () => {
	const invalidate = useInvalidate();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			labelsPrinted,
		}: {
			itemId: string;
			labelsPrinted: number;
		}) => {
			const res = await api["lab-tests"].items({ itemId }).handover.post({ labelsPrinted });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تأكيد النقل"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const handover = (input: { itemId: string; labelsPrinted: number }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تأكيد النقل...",
			success: "تم نقل العيّنة إلى قسم المعالجة",
			error: (err: Error) => err.message || "فشل تأكيد النقل",
		});
		return p;
	};

	return { handover, isPending: mutation.isPending };
};
