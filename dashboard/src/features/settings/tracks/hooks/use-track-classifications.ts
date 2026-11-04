"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendFetch } from "@/lib/backend-fetch";
import type { TrackClassificationItem } from "../types/tracks.types";

export const DEFAULT_TRACK_CATEGORIES = [
	"البرمجة والمنطق",
	"طبي وتأهيلي",
	"نفسي وسلوكي",
	"تدريب تربوي",
	"عام وتوعوي",
	"إداري وقيادي",
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
	"البرمجة والمنطق": "مسارات تعليم البرمجة، الخوارزميات، وتطوير الأنظمة الرقمية والذكاء الاصطناعي.",
	"طبي وتأهيلي": "برامج التأهيل الحركي والنطقي والخدمات العلاجية المتخصصة.",
	"نفسي وسلوكي": "جلسات الدعم النفسي وتعديل السلوك وتنمية المهارات الإدراكية.",
	"تدريب تربوي": "برامج تطوير المهارات التربوية والتعليم الخاص وتأهيل الكوادر.",
	"عام وتوعوي": "ورش عمل ومحاضرات توعوية وإرشادية لأولياء الأمور والمجتمع.",
	"إداري وقيادي": "تطوير مهارات القيادة، التخطيط المؤسسي، وإدارة الموارد.",
};

export function useTrackClassifications() {
	const queryClient = useQueryClient();

	const {
		data: trackClassifications = [],
		isLoading,
		refetch,
	} = useQuery<TrackClassificationItem[]>({
		queryKey: ["tracks", "classifications"],
		queryFn: async () => {
			const res = await backendFetch("/api/tracks/classifications");
			if (!res.ok) throw new Error("فشل جلب تصنيفات المسارات");
			const data = await res.json();
			if (Array.isArray(data)) {
				return data.map((item, index) => {
					if (typeof item === "string") {
						return {
							id: `track-cat-${index}-${item}`,
							name: item,
							description:
								CATEGORY_DESCRIPTIONS[item] ||
								`إدارة ومتابعة البرامج والمسارات التدريبية التابعة لتصنيف (${item}).`,
							tracksCount: 0,
							usageCount: 0,
							isActive: true,
							isDefault: DEFAULT_TRACK_CATEGORIES.includes(item),
						};
					}
					return {
						id: item.id || `track-cat-${index}-${item.name}`,
						name: item.name,
						description:
							item.description ||
							CATEGORY_DESCRIPTIONS[item.name] ||
							`إدارة ومتابعة البرامج والمسارات التدريبية التابعة لتصنيف (${item.name}).`,
						tracksCount: item.tracksCount ?? 0,
						usageCount: item.usageCount ?? 0,
						isActive: item.isActive !== false,
						isDefault: item.isDefault ?? DEFAULT_TRACK_CATEGORIES.includes(item.name),
					};
				});
			}
			return [];
		},
		staleTime: 1000 * 60 * 5,
	});

	const addMutation = useMutation({
		mutationFn: async ({ name, description }: { name: string; description?: string }) => {
			const res = await backendFetch("/api/tracks/classifications", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل إضافة تصنيف المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks", "classifications"] });
			toast.success("تم إضافة تصنيف المسار بنجاح");
		},
		onError: (err: any) => {
			toast.error(err?.message || "فشل إضافة تصنيف المسار");
		},
	});

	const updateMutation = useMutation({
		mutationFn: async ({
			name,
			isActive,
			description,
			targetCategory,
		}: {
			name: string;
			isActive?: boolean;
			description?: string;
			targetCategory?: string;
		}) => {
			const res = await backendFetch(`/api/tracks/classifications/${encodeURIComponent(name)}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive, description, targetCategory }),
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل تحديث تصنيف المسار");
			}
			return res.json();
		},
		onMutate: async ({ name, isActive }) => {
			await queryClient.cancelQueries({ queryKey: ["tracks", "classifications"] });
			const previous = queryClient.getQueryData<TrackClassificationItem[]>([
				"tracks",
				"classifications",
			]);
			if (previous && isActive !== undefined) {
				queryClient.setQueryData<TrackClassificationItem[]>(
					["tracks", "classifications"],
					previous.map((item) => (item.name === name ? { ...item, isActive } : item)),
				);
			}
			return { previous };
		},
		onError: (err: any, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(["tracks", "classifications"], context.previous);
			}
			toast.error(err?.message || "فشل تحديث تصنيف المسار");
		},
		onSuccess: (_data, variables) => {
			if (variables.targetCategory) {
				toast.success(
					`تم نقل المسارات إلى تصنيف (${variables.targetCategory}) وتعطيل تصنيف (${variables.name}) بنجاح`,
				);
			} else if (variables.isActive !== undefined) {
				toast.success(
					variables.isActive
						? `تم تفعيل تصنيف (${variables.name}) بنجاح`
						: `تم تعطيل تصنيف (${variables.name}) بنجاح`,
				);
			}
			queryClient.invalidateQueries({ queryKey: ["tracks", "classifications"] });
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (name: string) => {
			const res = await backendFetch(`/api/tracks/classifications/${encodeURIComponent(name)}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حذف تصنيف المسار");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tracks", "classifications"] });
			queryClient.invalidateQueries({ queryKey: ["tracks"] });
			toast.success("تم حذف تصنيف المسار بنجاح");
		},
		onError: (err: any) => {
			toast.error(err?.message || "فشل حذف تصنيف المسار");
		},
	});

	const toggleClassification = (name: string, active: boolean, targetCategory?: string) => {
		return updateMutation.mutateAsync({ name, isActive: active, targetCategory });
	};

	const addClassification = async (name: string, description?: string) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		await addMutation.mutateAsync({ name: trimmed, description: description?.trim() });
	};

	const deleteClassification = async (name: string) => {
		await deleteMutation.mutateAsync(name);
	};

	return {
		trackClassifications,
		isLoading,
		isAdding: addMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isUpdating: updateMutation.isPending,
		addClassification,
		deleteClassification,
		toggleClassification,
		refetch,
	};
}
