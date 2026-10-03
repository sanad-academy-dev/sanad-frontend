import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { LabAnalyzerAvailability } from "@/server/lab-tests/lab-analyzers.service";

// أجهزة التحليل وإشغالها — الخادم يحسب الأماكن المشغولة، فالواجهة تعرض فقط

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

export const useLabAnalyzers = (itemId: string | null) => {
	const { data, isLoading } = useQuery<LabAnalyzerAvailability[]>({
		queryKey: ["lab-analyzers", itemId],
		enabled: !!itemId,
		queryFn: async () => {
			if (!itemId) return [];
			const res = await api["lab-tests"].items({ itemId }).analyzers.get();
			if (res.error) throw new Error("تعذّر جلب أجهزة التحليل");
			return res.data as LabAnalyzerAvailability[];
		},
		// الإشغال يتغيّر بتحرّك تحاليل أخرى — لا نُبقيه طويلًا في الذاكرة
		staleTime: 15_000,
	});

	return { analyzers: data ?? [], isLoading };
};

export const useAssignLabAnalyzer = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			analyzerId,
		}: {
			itemId: string;
			analyzerId: string | null;
		}) => {
			const res = await api["lab-tests"].items({ itemId }).analyzer.patch({ analyzerId });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعيين الجهاز"));
			return res.data;
		},
		onSuccess: (d) => {
			void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
			void queryClient.invalidateQueries({ queryKey: ["lab-analyzers"] });
			if (d?.id) void queryClient.invalidateQueries({ queryKey: ["lab-test", d.id] });
		},
	});

	const assignAnalyzer = (input: { itemId: string; analyzerId: string | null }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تعيين الجهاز...",
			success: () => (input.analyzerId ? "تم تعيين جهاز التحليل" : "أُلغي تعيين الجهاز"),
			error: (err: Error) => err.message || "فشل تعيين الجهاز",
		});
		return p;
	};

	return { assignAnalyzer, isPending: mutation.isPending };
};
