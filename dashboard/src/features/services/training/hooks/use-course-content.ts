import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { showSuccessToast } from "@/components/common/success-toast";
import { showUndoToast } from "@/components/common/undo-toast";
import { lessonToPayload } from "@/features/services/training/utils/lesson";
import { api } from "@/lib/api";
import type {
	ContentStatus,
	CourseContentType,
	CreateLessonPayload,
	LessonResponse,
	LessonType,
	RestoredLessonInput,
	UnitResponse,
	UpdateLessonPayload,
} from "@/server/training/training.type";

// التصميم يسمّي المحتوى المحفوظ حسب نوعه في رسائل التوست («الدرس» / «الاختبار»)
const SAVED_LABELS: Partial<Record<LessonType, string>> = {
	QUIZ: "الاختبار",
	SURVEY: "الاستبيان",
};
const savedLabel = (type: LessonType) => SAVED_LABELS[type] ?? "الدرس";

// كل عمليات الوحدات/الدروس تُبطل كاش الدورة الواحدة لإعادة جلب الشجرة
export const useCourseContent = (courseId: string | null) => {
	const qc = useQueryClient();
	const invalidate = () => {
		if (courseId) qc.invalidateQueries({ queryKey: ["training", "course", courseId] });
		qc.invalidateQueries({ queryKey: ["training", "courses", "stats"] });
	};

	const addUnit = useMutation({
		mutationFn: async ({
			title,
			lessons,
			levelId,
			contentType,
		}: {
			title: string;
			lessons?: RestoredLessonInput[];
			levelId?: string | null;
			contentType?: CourseContentType;
		}) => {
			if (!courseId) throw new Error("لم يتم إنشاء الدورة بعد");
			const { data, error } = await api.training.units.post({
				courseId,
				title,
				lessons,
				levelId,
				contentType,
			});
			if (error) throw new Error("تعذّر إضافة الوحدة");
			return data as UnitResponse;
		},
		onSuccess: invalidate,
	});

	// تعديل بيانات بطاقة المحتوى (النوع/الحالة/المستوى) دون المساس بالدروس
	const updateUnitMeta = useMutation({
		mutationFn: async ({
			id,
			...data
		}: {
			id: string;
			levelId?: string | null;
			contentType?: CourseContentType;
			status?: ContentStatus;
		}) => {
			const { data: res, error } = await api.training.units({ id }).patch(data);
			if (error) throw new Error("تعذّر تحديث البطاقة");
			return res;
		},
		onSuccess: invalidate,
	});

	const renameUnit = useMutation({
		mutationFn: async ({ id, title }: { id: string; title: string }) => {
			const { data, error } = await api.training.units({ id }).patch({ title });
			if (error) throw new Error("تعذّر تعديل اسم الوحدة");
			return data;
		},
		onSuccess: invalidate,
	});

	const duplicateUnit = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.training.units({ id }).duplicate.post();
			if (error) throw new Error("تعذّر نسخ الوحدة");
			return data as UnitResponse;
		},
		onSuccess: invalidate,
	});

	const removeUnit = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.units({ id }).delete();
			// 404 يعني أنها محذوفة أصلًا — النتيجة المطلوبة متحقّقة فلا نعتبره فشلًا
			if (error && error.status !== 404) throw new Error("تعذّر حذف الوحدة");
		},
		onSuccess: invalidate,
	});

	const addLesson = useMutation({
		mutationFn: async (input: CreateLessonPayload) => {
			const { data, error } = await api.training.lessons.post(input);
			if (error) throw new Error("تعذّر حفظ الدرس");
			return data as LessonResponse;
		},
		onSuccess: invalidate,
	});

	const updateLesson = useMutation({
		mutationFn: async ({ id, ...input }: UpdateLessonPayload & { id: string }) => {
			const { data, error } = await api.training.lessons({ id }).patch(input);
			if (error) throw new Error("تعذّر حفظ التعديلات");
			return data as LessonResponse;
		},
		onSuccess: invalidate,
	});

	const removeLesson = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.training.lessons({ id }).delete();
			// 404 يعني أنه محذوف أصلًا — النتيجة المطلوبة متحقّقة
			if (error && error.status !== 404) throw new Error("تعذّر حذف الدرس");
		},
		onSuccess: invalidate,
	});

	return {
		addUnit: (title: string) =>
			toast.promise(addUnit.mutateAsync({ title }), {
				loading: "جارٍ إضافة الوحدة...",
				success: "تمت إضافة الوحدة",
				error: (e: Error) => e.message,
			}),
		// إضافة بطاقة محتوى إلى مستوى محدّد بنوع محدّد (المعالج، الخطوة 2)
		// lessons اختيارية — تُنشأ فصولًا مبدئية مع البطاقة (صفحة/اختبار) في نفس المعاملة
		addContent: (input: {
			title: string;
			levelId?: string | null;
			contentType?: CourseContentType;
			lessons?: RestoredLessonInput[];
		}) => addUnit.mutateAsync(input),
		updateUnitMeta: (input: {
			id: string;
			levelId?: string | null;
			contentType?: CourseContentType;
			status?: ContentStatus;
		}) => updateUnitMeta.mutateAsync(input),
		renameUnit: (id: string, title: string) => renameUnit.mutateAsync({ id, title }),
		// النسخ يتم كاملًا على الخادم في معاملة واحدة، فلا تظهر وحدة ناقصة الدروس عند الفشل
		duplicateUnit: async (unit: UnitResponse) => {
			try {
				const created = await duplicateUnit.mutateAsync(unit.id);
				showSuccessToast(`تم نسخ وحدة (${unit.title}) بنجاح، سيظهر الآن ضمن محتوي الدورة`, {
					iconAtStart: true,
					cardClassName: "h-[44px] rounded-[4px]",
					iconClassName: "size-4",
					textClassName: "text-[10px] font-medium leading-6 text-black truncate",
				});
				return created;
			} catch (e) {
				toast.error((e as Error).message);
				throw e;
			}
		},
		// الحذف فوري، و«تراجع» يعيد إنشاء الوحدة بدروسها من اللقطة المحفوظة في الذاكرة.
		// المعرّفات الجديدة تختلف عن القديمة — لا شيء يشير إليها حاليًا.
		removeUnit: async (unit: UnitResponse) => {
			try {
				await removeUnit.mutateAsync(unit.id);
				showUndoToast(`تم حذف الوحدة التدريبية "${unit.title}" بنجاح...`, () => {
					toast.promise(
						addUnit.mutateAsync({
							title: unit.title,
							lessons: unit.lessons.map(({ id, unitId, order, createdAt, ...rest }) => rest),
						}),
						{
							loading: "جارٍ استعادة الوحدة...",
							success: "تمت استعادة الوحدة",
							error: (e: Error) => e.message,
						},
					);
				});
			} catch (e) {
				toast.error((e as Error).message);
			}
		},
		// نجاح الحفظ له توست مخصص في التصميم (Figma nodes 4573-483409 للدرس و4573-508991 للاختبار)
		// بدل توست sonner الافتراضي، لذا نُدير دورة التحميل/الخطأ بمعرّف واحد ونستبدله ببطاقة النجاح.
		addLesson: async (input: CreateLessonPayload) => {
			const label = savedLabel(input.type);
			const id = toast.loading(`جارٍ حفظ ${label}...`);
			try {
				const lesson = await addLesson.mutateAsync(input);
				toast.dismiss(id);
				showSuccessToast(`تم إضافة ${label} بنجاح، سيظهر الآن ضمن محتوي الدورة`, {
					iconAtStart: true,
					cardClassName: "h-[44px] rounded-[4px]",
					iconClassName: "size-4",
					textClassName: "text-[10px] font-medium leading-6 text-black truncate",
				});
				return lesson;
			} catch (e) {
				toast.error((e as Error).message, { id });
				throw e;
			}
		},
		// توست حفظ التعديلات أخضر ويحمل اسم الدرس (Figma node 4573-523998)
		updateLesson: async (id: string, input: UpdateLessonPayload) => {
			const label = savedLabel(input.type ?? "TEXT");
			const toastId = toast.loading(`جارٍ حفظ تغييرات ${label}...`);
			try {
				const lesson = await updateLesson.mutateAsync({ id, ...input });
				toast.dismiss(toastId);
				showSuccessToast(`تم حفظ التغيرات ${label} (${input.title ?? ""}) بنجاح...`, {
					iconAtStart: true,
					cardClassName: "h-[44px]",
					iconClassName: "size-4",
					textClassName:
						"truncate text-[10px] font-medium leading-5 tracking-[-0.076px] text-[#008A2E]",
				});
				return lesson;
			} catch (e) {
				toast.error((e as Error).message, { id: toastId });
				throw e;
			}
		},
		// نفس نمط حذف الوحدة: حذف فوري و«تراجع» يعيد إنشاء الدرس من اللقطة في الذاكرة
		removeLesson: async (lesson: LessonResponse) => {
			const label = savedLabel(lesson.type);
			try {
				await removeLesson.mutateAsync(lesson.id);
				showUndoToast(`تم حذف ${label} "${lesson.title}" بنجاح...`, () => {
					toast.promise(addLesson.mutateAsync(lessonToPayload(lesson, lesson.unitId)), {
						loading: `جارٍ استعادة ${label}...`,
						success: `تمت استعادة ${label}`,
						error: (e: Error) => e.message,
					});
				});
			} catch (e) {
				toast.error((e as Error).message);
			}
		},
		isSavingLesson: addLesson.isPending || updateLesson.isPending,
	};
};
