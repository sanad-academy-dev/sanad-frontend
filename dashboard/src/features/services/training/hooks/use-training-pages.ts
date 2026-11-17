import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendUrl } from "@/lib/backend-fetch";
import type { PageDocument } from "./use-page-editor";

export interface TrainingPage extends PageDocument {
	summary: string;
	category: string;
	viewsCount: number;
	createdAt: string;
}

export interface TrainingPagePayload {
	title?: string;
	summary?: string;
	content?: unknown;
	category?: string;
	readingTimeMinutes?: number;
	status?: "PUBLISHED" | "DRAFT" | "ARCHIVED";
}

export const PAGES_KEY = ["training", "pages"] as const;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(backendUrl(`/api/training/pages${path}`), {
		credentials: "include",
		headers: { "Content-Type": "application/json", ...init?.headers },
		...init,
	});
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new Error(body?.message ?? "تعذّر حفظ الصفحة");
	}
	if (response.status === 204) return undefined as T;
	return response.json() as Promise<T>;
}

export function useTrainingPages() {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: PAGES_KEY,
		queryFn: () => request<TrainingPage[]>(""),
	});

	const createMutation = useMutation({
		mutationFn: (data?: Partial<TrainingPagePayload>) =>
			request<TrainingPage>("", { method: "POST", body: JSON.stringify(data ?? {}) }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PAGES_KEY }),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<TrainingPagePayload> }) =>
			request<TrainingPage>(`/${id}`, { method: "PUT", body: JSON.stringify(data) }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PAGES_KEY }),
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => request<void>(`/${id}`, { method: "DELETE" }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: PAGES_KEY }),
	});

	return {
		pages: query.data ?? [],
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
		createPage: async (data?: Partial<TrainingPagePayload>) => {
			try {
				const res = await createMutation.mutateAsync(data);
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر إنشاء الصفحة");
				throw error;
			}
		},
		updatePage: async (id: string, data: Partial<TrainingPagePayload>) => {
			try {
				const res = await updateMutation.mutateAsync({ id, data });
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر تحديث الصفحة");
				throw error;
			}
		},
		duplicatePage: async (id: string) => {
			const target = (query.data ?? []).find((p) => p.id === id);
			if (!target) throw new Error("الصفحة غير موجودة");
			try {
				const res = await createMutation.mutateAsync({
					title: `${target.title || "صفحة"} (نسخة)`,
					summary: target.summary,
					content: target.content,
					category: target.category,
					readingTimeMinutes: target.readingTimeMinutes,
					status: "DRAFT",
				});
				toast.success("تم استنساخ الصفحة بنجاح كمسودة");
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر استنساخ الصفحة");
				throw error;
			}
		},
		publishPage: async (id: string) => {
			try {
				const res = await updateMutation.mutateAsync({ id, data: { status: "PUBLISHED" } });
				toast.success("تم نشر الصفحة بنجاح");
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر نشر الصفحة");
				throw error;
			}
		},
		unpublishPage: async (id: string) => {
			try {
				const res = await updateMutation.mutateAsync({ id, data: { status: "DRAFT" } });
				toast.success("تم تحويل الصفحة إلى مسودة");
				return res;
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر إلغاء نشر الصفحة");
				throw error;
			}
		},
		deletePage: async (id: string) => {
			try {
				await deleteMutation.mutateAsync(id);
				toast.success("تم حذف الصفحة");
			} catch (error) {
				toast.error(error instanceof Error ? error.message : "تعذّر حذف الصفحة");
				throw error;
			}
		},
	};
}
