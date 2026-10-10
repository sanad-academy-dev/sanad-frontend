import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AiShiftOptions, AiShiftPlan } from "@/server/shifts/shifts.type";

// رسالة خطأ من استجابة treaty (error.value قد يحمل { message })
const errMsg = (value: unknown, fallback: string) =>
	(typeof value === "object" && value && "message" in value
		? String((value as { message: unknown }).message)
		: null) || fallback;

// اقتراح جدول مناوبات بالذكاء الاصطناعي — معاينة فقط؛ الحفظ يتم بعد موافقة المستخدم
export const useAiShifts = () => {
	const suggest = useMutation({
		mutationFn: async (input: { days: string[]; options: AiShiftOptions }) => {
			const { data, error } = await api.shifts.ai.suggest.post(input);
			if (error) throw new Error(errMsg(error.value, "تعذّر توليد الجدول"));
			return data as AiShiftPlan;
		},
	});

	return { suggest: suggest.mutateAsync, isSuggesting: suggest.isPending };
};
