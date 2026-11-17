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
	selectedContentId?: string,
): LessonContentItem[] {
	const existingList = Array.isArray(existing) ? existing : [];
	const selectedIdx =
		selectedContentId && existingList.length > 0
			? existingList.findIndex((item) => item.id === selectedContentId)
			: 0;
	const itemFromValues = (id: string, fallbackTitle?: string): LessonContentItem => ({
		id,
		type: values.type,
		title:
			(values.title || "").trim() ||
			(values.lessonTitle || "").trim() ||
			fallbackTitle ||
			"المحتوى الأساسي",
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
	});

	if (selectedIdx > 0) {
		return existingList.map((item, idx) =>
			idx === selectedIdx ? itemFromValues(item.id, item.title) : item,
		);
	}

	const first = existingList[0];
	const primary = itemFromValues(first?.id ?? contentId(), first?.title);
	const extras =
		values.contents && values.contents.length > 0 ? values.contents : existingList.slice(1);
	return [primary, ...extras];
}
