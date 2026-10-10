import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ClinicalNoteResponse,
	ExamTemplateResponse,
	NoteAnswers,
	NoteDiagnosisFormInput,
} from "@/server/clinical-notes/clinical-notes.type";

/**
 * [S4] ملاحظات الزيارة — قراءةً وكتابةً.
 *
 * المسوّدة تُحفظ تلقائيًّا (`update`)، والتوثيق فعلٌ صريح منفصل لا حفظٌ آخر: بعده
 * لا مسار PATCH يمسّ النصّ، والتصحيح يُلحَق. الفصل هنا يعكس فصل الصلاحيات نفسه.
 */

export const appointmentNotesKey = (appointmentId: string) =>
	["clinical-notes", "appointment", appointmentId] as const;

export const useAppointmentNotes = (appointmentId: string, enabled = true) => {
	const { data, isLoading } = useQuery<ClinicalNoteResponse[]>({
		queryKey: appointmentNotesKey(appointmentId),
		enabled: enabled && !!appointmentId,
		queryFn: async () => {
			const res = await api.appointments({ id: appointmentId })["clinical-notes"].get();
			if (res.error) throw new Error("فشل جلب ملاحظات الزيارة");
			return res.data as ClinicalNoteResponse[];
		},
	});

	return { notes: data ?? [], isLoading };
};

/** القالب المُقترح لهذه الشكوى ونوع الطفل — يسقط إلى GENERAL_V1 */
export const useResolvedTemplate = (
	complaint: string | null,
	animalTypeId: string | null,
	consultationTypeId: string | null,
	enabled = true,
) => {
	const { data, isLoading } = useQuery<ExamTemplateResponse | null>({
		queryKey: ["exam-templates", "resolve", complaint, animalTypeId, consultationTypeId],
		enabled,
		queryFn: async () => {
			const res = await api["exam-templates"].resolve.get({
				query: {
					...(complaint ? { complaint } : {}),
					...(animalTypeId ? { animalTypeId } : {}),
					...(consultationTypeId ? { consultationTypeId } : {}),
				},
			});
			if (res.error) throw new Error("فشل ترشيح القالب");
			return res.data as ExamTemplateResponse | null;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { template: data ?? null, isLoading };
};

export const useClinicalNoteMutations = (appointmentId: string) => {
	const queryClient = useQueryClient();
	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: appointmentNotesKey(appointmentId) });

	const unwrap = <T>(res: { data: unknown; error: unknown }, fallback: string): T => {
		if (res.error) {
			const details = (res.error as { value?: { message?: string } }).value?.message;
			throw new Error(details || fallback);
		}
		return res.data as T;
	};

	const create = useMutation({
		mutationFn: async (input: { patientId: string; templateId: string | null }) =>
			unwrap<ClinicalNoteResponse>(
				await api["clinical-notes"].post({
					patientId: input.patientId,
					appointmentId,
					templateId: input.templateId,
				}),
				"فشل إنشاء الملاحظة",
			),
		onSuccess: invalidate,
	});

	/**
	 * الحفظ التلقائي — بلا `toast`. المسوّدة تُحفظ أثناء الكتابة، ورقاقةُ تنبيه عند
	 * كل ضغطة مفتاح ضجيجٌ لا خبر. الأخطاء وحدها تُعلن.
	 */
	const update = useMutation({
		mutationFn: async (input: {
			noteId: string;
			answers?: NoteAnswers;
			diagnoses?: NoteDiagnosisFormInput[];
			vitalsRecordId?: string | null;
		}) => {
			const { noteId, ...body } = input;
			return unwrap<ClinicalNoteResponse>(
				await api["clinical-notes"]({ id: noteId }).patch(body),
				"فشل حفظ المسوّدة",
			);
		},
		onError: (error: Error) => toast.error(error.message),
		onSuccess: invalidate,
	});

	const finalize = useMutation({
		mutationFn: async (noteId: string) =>
			unwrap<ClinicalNoteResponse>(
				await api["clinical-notes"]({ id: noteId }).finalize.post(),
				"فشل توثيق الملاحظة",
			),
		onSuccess: invalidate,
	});

	const addendum = useMutation({
		mutationFn: async (input: { noteId: string; text: string }) =>
			unwrap<ClinicalNoteResponse>(
				await api["clinical-notes"]({ id: input.noteId }).addenda.post({ text: input.text }),
				"فشل إضافة التصحيح",
			),
		onSuccess: invalidate,
	});

	const finalizeNote = (noteId: string) =>
		toast.promise(finalize.mutateAsync(noteId), {
			loading: "جارٍ التوثيق...",
			success: "وُثِّقت الملاحظة — لم تعد قابلة للتعديل",
			error: (error: Error) => error.message,
		});

	const addAddendum = (noteId: string, text: string) =>
		toast.promise(addendum.mutateAsync({ noteId, text }), {
			loading: "جارٍ إضافة التصحيح...",
			success: "أُضيف التصحيح",
			error: (error: Error) => error.message,
		});

	return {
		createNote: create.mutateAsync,
		saveDraft: update.mutateAsync,
		finalizeNote,
		addAddendum,
		isCreating: create.isPending,
		isSaving: update.isPending,
		isFinalizing: finalize.isPending,
		isAmending: addendum.isPending,
	};
};
