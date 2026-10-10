import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AppointmentQuestionnaireResponse,
	QuestionnaireAnswers,
} from "@/server/video-calls/video-calls.type";

// room هو اسم القاعة الكامل (مع بادئة الأكاديمية) — نفس مفتاح رابط الدعوة.
// poll: المدرّب يراقب وصول إجابات صاحب الطفل أثناء الجلسة
export const useQuestionnaire = (room: string | null, options?: { poll?: boolean }) => {
	const { data, isLoading } = useQuery<AppointmentQuestionnaireResponse | null>({
		queryKey: ["video-call-questionnaire", room],
		queryFn: async () => {
			const res = await api["video-calls"].questionnaire.get({ query: { room: room ?? "" } });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب الاستبيان");
			}
			return res.data;
		},
		enabled: !!room,
		refetchInterval: options?.poll ? 15_000 : undefined,
	});

	return { questionnaire: data ?? null, isLoading };
};

export const useSaveQuestionnaire = (room: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (answers: QuestionnaireAnswers) => {
			const res = await api["video-calls"].questionnaire.post({ room, answers });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حفظ الاستبيان");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["video-call-questionnaire", room] });
		},
	});

	const saveQuestionnaire = (answers: QuestionnaireAnswers) =>
		toast.promise(mutation.mutateAsync(answers), {
			loading: "جارٍ إرسال الإجابات...",
			success: "تم إرسال الاستبيان",
			error: (err: Error) => err.message || "فشل إرسال الاستبيان",
		});

	return { saveQuestionnaire, isPending: mutation.isPending };
};
