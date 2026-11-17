import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { backendUrl } from "@/lib/backend-fetch";
import { getFileUrl } from "@/lib/file-url";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageDocument {
	id: string;
	title: string;
	content: BlockNoteDocument | null; // JSON بلوكات BlockNote
	status: "PUBLISHED" | "DRAFT";
	readingTimeMinutes: number;
	updatedAt: string;
}

// نوع مبسّط لمستند BlockNote (المصفوفة الكاملة من blocks)
// biome-ignore lint/suspicious/noExplicitAny: BlockNote types are complex
export type BlockNoteDocument = any[];

export type SaveState = "idle" | "saving" | "saved" | "error";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const pageKey = (id: string) => ["training", "page", id] as const;

// ─── Fetch Page ───────────────────────────────────────────────────────────────

async function fetchPage(id: string): Promise<PageDocument> {
	const res = await fetch(backendUrl(`/api/training/pages/${id}`), { credentials: "include" });
	if (!res.ok) throw new Error("تعذّر تحميل الصفحة");
	return res.json();
}

// ─── Save Page ───────────────────────────────────────────────────────────────

async function savePage(
	id: string,
	payload: { title?: string; content?: BlockNoteDocument },
): Promise<PageDocument> {
	const res = await fetch(backendUrl(`/api/training/pages/${id}`), {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) throw new Error("تعذّر حفظ الصفحة");
	return res.json();
}

// ─── Upload File ──────────────────────────────────────────────────────────────

/**
 * رفع ملف (صورة/فيديو) عبر POST /api/uploads/direct
 * يُستخدم من BlockNote كـ uploadFile callback
 */
export async function uploadFileForEditor(file: File): Promise<string> {
	const form = new FormData();
	form.append("file", file);

	const res = await fetch(backendUrl("/api/uploads/direct"), {
		method: "POST",
		credentials: "include",
		body: form,
	});

	if (!res.ok) throw new Error("تعذّر رفع الملف");
	const json = (await res.json()) as { url?: string; key?: string };
	// نُعيد URL قابلاً للعرض — إما url مباشرة أو عبر نقطة تقديم الملفات `/api/uploads/serve`
	return json.url ?? (json.key ? getFileUrl(json.key) : "");
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook يوفّر:
 * - تحميل بيانات الصفحة عبر React Query
 * - حالة حفظ تلقائي مع debounce 1500ms
 * - دوال تحديث العنوان والمحتوى
 */
export function usePageEditor(pageId: string | null) {
	const queryClient = useQueryClient();
	const [saveState, setSaveState] = useState<SaveState>("idle");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// نمنع الحفظ أول ما الصفحة تتحمل
	const isInitialLoad = useRef(true);

	// ─── Query ─────────────────────────────────────────────────────────────
	const { data: page, isLoading } = useQuery<PageDocument>({
		queryKey: pageKey(pageId ?? ""),
		enabled: !!pageId,
		queryFn: () => {
			if (!pageId) throw new Error("معرّف الصفحة غير متوفر");
			return fetchPage(pageId);
		},
		staleTime: 60_000,
	});

	// ─── Mutation ──────────────────────────────────────────────────────────
	const mutation = useMutation({
		mutationFn: ({ title, content }: { title?: string; content?: BlockNoteDocument }) => {
			if (!pageId) throw new Error("معرّف الصفحة غير متوفر");
			return savePage(pageId, { title, content });
		},

		onMutate: () => setSaveState("saving"),

		onSuccess: (updated) => {
			setSaveState("saved");
			if (pageId) {
				queryClient.setQueryData(pageKey(pageId), updated);
			}
			// إعادة الحالة إلى idle بعد 2.5 ثانية
			setTimeout(() => setSaveState("idle"), 2500);
		},

		onError: () => {
			setSaveState("error");
			setTimeout(() => setSaveState("idle"), 4000);
		},
	});

	// ─── Debounced Save ────────────────────────────────────────────────────
	const scheduleSave = useCallback(
		(payload: { title?: string; content?: BlockNoteDocument }) => {
			if (isInitialLoad.current) return; // تجاهل أول تغيير (تهيئة المحرر)

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				mutation.mutate(payload);
			}, 1500);
		},
		[mutation],
	);

	// ─── Mark initial load done after first render with page data ──────────
	useEffect(() => {
		if (page && isInitialLoad.current) {
			// نضع تأخير قصير حتى يُهيئ BlockNote المحتوى
			const t = setTimeout(() => {
				isInitialLoad.current = false;
			}, 800);
			return () => clearTimeout(t);
		}
	}, [page]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const onTitleChange = useCallback(
		(title: string) => scheduleSave({ title }),
		[scheduleSave],
	);

	const onContentChange = useCallback(
		(content: BlockNoteDocument) => scheduleSave({ content }),
		[scheduleSave],
	);

	return {
		page,
		isLoading,
		saveState,
		onTitleChange,
		onContentChange,
	};
}
