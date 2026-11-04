"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { backendFetch } from "@/lib/backend-fetch";
import type { AcademicStageItem } from "../types/stages.types";

async function requestStages(path: string, init?: RequestInit) {
	const response = await backendFetch(`/api/classrooms/academic-stages${path}`, init);
	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "تعذر حفظ المرحلة الدراسية");
	}
	return response.status === 204 ? null : response.json();
}

export function useAcademicStages() {
	const queryClient = useQueryClient();
	const { data, isLoading, refetch } = useQuery<AcademicStageItem[]>({
		queryKey: ["academic-stages"],
		queryFn: () => requestStages(""),
		staleTime: 1000 * 60 * 5,
	});

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["academic-stages"] });
		queryClient.invalidateQueries({ queryKey: ["classrooms", "classifications"] });
		queryClient.invalidateQueries({ queryKey: ["classrooms"] });
	};
	const addMutation = useMutation({
		mutationFn: ({ name, description }: { name: string; description?: string }) =>
			requestStages("", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description }),
			}),
		onSuccess: invalidate,
		onError: (error) => toast.error(error.message),
	});
	const updateMutation = useMutation({
		mutationFn: ({
			name,
			isActive,
			targetStage,
		}: {
			name: string;
			isActive: boolean;
			targetStage?: string;
		}) =>
			requestStages(`/${encodeURIComponent(name)}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isActive, targetStage }),
			}),
		onMutate: async ({ name, isActive }) => {
			await queryClient.cancelQueries({ queryKey: ["academic-stages"] });
			const previous = queryClient.getQueryData<AcademicStageItem[]>(["academic-stages"]);
			if (previous) {
				queryClient.setQueryData<AcademicStageItem[]>(
					["academic-stages"],
					previous.map((s) => (s.name === name ? { ...s, isActive } : s)),
				);
			}
			return { previous };
		},
		onError: (error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(["academic-stages"], context.previous);
			}
			toast.error(error.message || "فشل تحديث حالة المرحلة الدراسية");
		},
		onSuccess: (_data, variables) => {
			if (variables.targetStage) {
				toast.success(
					`تم نقل الفصول إلى مرحلة (${variables.targetStage}) وتعطيل مرحلة (${variables.name}) بنجاح`,
				);
			} else {
				toast.success(
					variables.isActive
						? `تم تفعيل مرحلة (${variables.name}) بنجاح`
						: `تم تعطيل مرحلة (${variables.name}) بنجاح`,
				);
			}
			invalidate();
		},
	});
	const deleteMutation = useMutation({
		mutationFn: (name: string) =>
			requestStages(`/${encodeURIComponent(name)}`, { method: "DELETE" }),
		onSuccess: invalidate,
		onError: (error) => toast.error(error.message),
	});

	return {
		stages: data ?? [],
		isLoading,
		isAdding: addMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isUpdating: updateMutation.isPending,
		addStage: (name: string, description?: string) =>
			addMutation.mutateAsync({ name: name.trim(), description: description?.trim() }),
		deleteStage: (name: string) => deleteMutation.mutateAsync(name),
		toggleStage: (name: string, isActive: boolean, targetStage?: string) =>
			updateMutation.mutateAsync({ name, isActive, targetStage }),
		refetch,
	};
}
