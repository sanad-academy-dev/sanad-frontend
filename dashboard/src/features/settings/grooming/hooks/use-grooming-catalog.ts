import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	GroomingCapacityResponse,
	GroomingServiceDefinitionResponse,
} from "@/server/grooming-definitions/grooming-definitions.type";

export const groomingCatalogKeys = {
	all: ["grooming-catalog"] as const,
	capacity: (branchId: string) => [...groomingCatalogKeys.all, "capacity", branchId] as const,
	definition: (serviceId: string) =>
		[...groomingCatalogKeys.all, "definition", serviceId] as const,
};

/** سعة الفرع — الغياب يعني «لم تُضبط بعد»، والحفظ يُنشئ الصفّ عند أول مرة */
export const useGroomingCapacity = (branchId: string) => {
	const qc = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: groomingCatalogKeys.capacity(branchId),
		enabled: !!branchId,
		queryFn: async () => {
			const { data, error } = await api["grooming-definitions"].capacity({ branchId }).get();
			if (error) throw new Error("تعذّر تحميل إعدادات التجميل");
			return data as unknown as GroomingCapacityResponse | null;
		},
	});

	const save = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api["grooming-definitions"]
				.capacity({ branchId })
				.put(body as never);
			if (error) throw new Error("تعذّر حفظ إعدادات التجميل");
			return data;
		},
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: groomingCatalogKeys.capacity(branchId) }),
	});

	return {
		capacity: data ?? null,
		isLoading,
		isSaving: save.isPending,
		saveCapacity: (body: Record<string, unknown>) => {
			const promise = save.mutateAsync(body);
			toast.promise(promise, {
				loading: "جارٍ الحفظ...",
				success: "حُفظت إعدادات التجميل",
				error: (e: Error) => e.message,
			});
			return promise;
		},
	};
};

/** تعريف دورة تجميل واحدة — يُقرأ ويُحفظ من ورقة التعريف داخل جدول الدورات */
export const useGroomingDefinition = (serviceId: string | null) => {
	const qc = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: groomingCatalogKeys.definition(serviceId ?? ""),
		enabled: !!serviceId,
		queryFn: async () => {
			const { data, error } = await api["grooming-definitions"]
				.service({ serviceId: serviceId as string })
				.get();
			if (error) throw new Error("تعذّر تحميل تعريف الدورة");
			return data as unknown as GroomingServiceDefinitionResponse | null;
		},
	});

	const save = useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const { data, error } = await api["grooming-definitions"]
				.service({ serviceId: serviceId as string })
				.put(body as never);
			if (error) throw new Error("تعذّر حفظ تعريف الدورة");
			return data;
		},
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: groomingCatalogKeys.all });
			void qc.invalidateQueries({ queryKey: ["grooming"] });
		},
	});

	return {
		definition: data ?? null,
		isLoading,
		isSaving: save.isPending,
		saveDefinition: (body: Record<string, unknown>) => {
			const promise = save.mutateAsync(body);
			toast.promise(promise, {
				loading: "جارٍ الحفظ...",
				success: "حُفظ تعريف دورة التجميل",
				error: (e: Error) => e.message,
			});
			return promise;
		},
	};
};
