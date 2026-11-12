import {
	type CourseLocationMode,
	type CourseType,
	type CreateLessonFormInput,
	type LessonResponse,
	type LessonType,
	parseQuizContent,
} from "@sanad/contracts/runtime/server/training/training.type";

export type StoredLessonDraft = {
	values: CreateLessonFormInput;
	unitId?: string;
	mode: "add" | "edit";
	lessonId?: string;
	updatedAt: number;
};

export type OpenEditorSession =
	| { mode: "add"; unitId: string; unitTitle: string; initialType?: LessonType }
	| { mode: "edit"; lessonId: string; unitId: string; unitTitle: string };

export type CourseDialogSession = {
	editCourseId: string | null;
	activeCourseId: string | null;
	step: 1 | 2 | 3 | 4;
	furthest: number;
	name?: string;
	code?: string;
	description?: string;
	notes?: string;
	category?: string;
	academicStage?: string;
	duration?: string;
	price?: number;
	institution?: string;
	locationMode?: CourseLocationMode;
	courseType?: CourseType;
	selectedIcon?: string;
	selectedColor?: string;
	updatedAt: number;
};

const DRAFT_PREFIX = "sanad_lesson_draft:";
const OPEN_EDITOR_PREFIX = "sanad_course_open_editor:";
const DIALOG_SESSION_KEY = "sanad_training_course_dialog_session";

function hasStorage(): boolean {
	return typeof window !== "undefined";
}

export function getLessonDraftKey(opts: {
	lessonId?: string;
	courseId?: string | null;
	unitId?: string | null;
}): string {
	if (opts.lessonId) return `${DRAFT_PREFIX}edit:${opts.lessonId}`;
	return `${DRAFT_PREFIX}add:${opts.courseId || "pending"}:${opts.unitId || "default"}`;
}

export function readLessonDraft(key: string): StoredLessonDraft | null {
	if (!hasStorage()) return null;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<StoredLessonDraft>;
		if (!parsed || typeof parsed !== "object" || !parsed.values) return null;
		return parsed as StoredLessonDraft;
	} catch {
		return null;
	}
}

export function writeLessonDraft(key: string, draft: StoredLessonDraft): void {
	if (!hasStorage()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(draft));
	} catch {
		// تجاهل أخطاء امتلاء التخزين المحلي حتى لا يتعطّل المحرر
	}
}

export function clearLessonDraft(key: string): void {
	if (!hasStorage()) return;
	try {
		window.localStorage.removeItem(key);
	} catch {
		// تجاهل
	}
}

/** Collect unsaved "add" drafts inside a course so unit cards can offer a 1-click resume badge. */
export function listAddLessonDraftsForCourse(
	courseId?: string | null,
): Record<string, StoredLessonDraft> {
	if (!hasStorage()) return {};
	const prefix = `${DRAFT_PREFIX}add:${courseId || "pending"}:`;
	const result: Record<string, StoredLessonDraft> = {};
	try {
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (!key?.startsWith(prefix)) continue;
			const unitId = key.slice(prefix.length);
			const draft = readLessonDraft(key);
			if (draft) result[unitId] = draft;
		}
	} catch {
		return {};
	}
	return result;
}

export function hasEditLessonDraft(lessonId: string): boolean {
	return readLessonDraft(getLessonDraftKey({ lessonId })) !== null;
}

/** Check whether form values represent meaningful user-entered data worth preserving as a draft. */
export function hasMeaningfulLessonInput(
	values: Partial<CreateLessonFormInput>,
	baseline?: LessonResponse,
): boolean {
	if (baseline) {
		const durSeconds =
			(Number(values.hours) || 0) * 3600 +
			(Number(values.minutes) || 0) * 60 +
			(Number(values.seconds) || 0);
		const origDuration = baseline.durationSeconds ?? 0;
		return (
			(values.title ?? "") !== baseline.title ||
			(values.type ?? baseline.type) !== baseline.type ||
			(values.description ?? "") !== (baseline.description ?? "") ||
			(values.content ?? "") !== (baseline.type === "QUIZ" ? "" : (baseline.content ?? "")) ||
			(values.mediaKey ?? undefined) !== (baseline.mediaKey ?? undefined) ||
			(values.mediaUrl ?? undefined) !== (baseline.mediaUrl ?? undefined) ||
			(baseline.type === "QUIZ" &&
				JSON.stringify(values.questions ?? []) !==
					JSON.stringify(parseQuizContent(baseline.content))) ||
			JSON.stringify(values.contents ?? []) !== JSON.stringify(baseline.contents?.slice(1) ?? []) ||
			durSeconds !== origDuration
		);
	}
	return Boolean(
		values.title?.trim() ||
			values.content?.trim() ||
			values.description?.trim() ||
			values.mediaKey ||
			values.mediaUrl ||
			(values.contents && values.contents.length > 0) ||
			(values.questions && values.questions.length > 0),
	);
}

export function readOpenEditorSession(courseId?: string | null): OpenEditorSession | null {
	if (!hasStorage()) return null;
	try {
		const raw = window.localStorage.getItem(`${OPEN_EDITOR_PREFIX}${courseId || "pending"}`);
		if (!raw) return null;
		return JSON.parse(raw) as OpenEditorSession;
	} catch {
		return null;
	}
}

export function writeOpenEditorSession(
	courseId: string | null | undefined,
	session: OpenEditorSession | null,
): void {
	if (!hasStorage()) return;
	const key = `${OPEN_EDITOR_PREFIX}${courseId || "pending"}`;
	try {
		if (!session) window.localStorage.removeItem(key);
		else window.localStorage.setItem(key, JSON.stringify(session));
	} catch {
		// تجاهل
	}
}

export function readCourseDialogSession(): CourseDialogSession | null {
	if (!hasStorage()) return null;
	try {
		const raw = window.sessionStorage.getItem(DIALOG_SESSION_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as CourseDialogSession;
	} catch {
		return null;
	}
}

export function writeCourseDialogSession(session: CourseDialogSession | null): void {
	if (!hasStorage()) return;
	try {
		if (!session) window.sessionStorage.removeItem(DIALOG_SESSION_KEY);
		else window.sessionStorage.setItem(DIALOG_SESSION_KEY, JSON.stringify(session));
	} catch {
		// تجاهل
	}
}
