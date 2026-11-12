import type {
	CreateLessonFormInput,
	LessonContentItem,
	LessonFormValues,
} from "@sanad/contracts/runtime/server/training/training.type";

function contentId() {
	return `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildLessonContents(
	values: CreateLessonFormInput | LessonFormValues,
	existing?: LessonContentItem[] | null,
): LessonContentItem[] {
	const first = existing?.[0];
	const primary: LessonContentItem = {
		id: first?.id ?? contentId(),
		type: values.type,
		title: first?.title || values.title.trim() || "المحتوى الأساسي",
		description: values.description?.trim() || null,
		mediaSource: values.mediaSource ?? null,
		mediaKey: values.mediaKey || null,
		mediaUrl: values.mediaUrl?.trim() || null,
		durationSeconds:
			(Number(values.hours) || 0) * 3600 +
			(Number(values.minutes) || 0) * 60 +
			(Number(values.seconds) || 0),
		content:
			values.type === "QUIZ" || values.type === "SURVEY"
				? JSON.stringify({ questions: values.questions ?? [] })
				: values.content?.trim() || null,
	};
	return [primary, ...(values.contents ?? [])];
}
