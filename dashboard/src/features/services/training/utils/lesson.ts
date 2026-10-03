import type { CreateLessonPayload, LessonResponse } from "@/server/training/training.type";

// يحوّل درسًا محفوظًا إلى حمولة إنشاء مطابقة — للاستنساخ داخل نفس الوحدة أو ضمن وحدة منسوخة
export const lessonToPayload = (
	lesson: LessonResponse,
	unitId: string,
): CreateLessonPayload => ({
	unitId,
	title: lesson.title,
	type: lesson.type,
	description: lesson.description,
	mediaSource: lesson.mediaSource,
	mediaKey: lesson.mediaKey,
	mediaUrl: lesson.mediaUrl,
	content: lesson.content,
	durationSeconds: lesson.durationSeconds,
});
