import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { RadiologyMachineAvailability } from "@/server/radiology/radiology-machines.service";

const EMPTY: RadiologyMachineAvailability[] = [];

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** أجهزة التصوير في فرع الطلب مع إشغالها الحالي */
export const useRadiologyMachines = (itemId: string | null) => {
	const { data, isLoading } = useQuery<RadiologyMachineAvailability[]>({
		queryKey: ["radiology", "machines", itemId],
		enabled: !!itemId,
		queryFn: async () => {
			const res = await api.radiology.items({ itemId: itemId as string }).machines.get();
			if (res.error) throw new Error("فشل جلب أجهزة التصوير");
			return res.data as RadiologyMachineAvailability[];
		},
		staleTime: 15_000,
	});

	return { machines: data ?? EMPTY, isLoading };
};

/** تعيين جهاز التصوير — الخادم يرفض المعطّل والمشغول */
export const useAssignRadiologyMachine = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			itemId,
			machineId,
		}: {
			itemId: string;
			machineId: string | null;
		}) => {
			const res = await api.radiology.items({ itemId }).machine.patch({ machineId });
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعيين الجهاز"));
			return res.data;
		},
		onSuccess: (d) => {
			void queryClient.invalidateQueries({ queryKey: ["radiology"] });
			if (d && "id" in d) {
				void queryClient.invalidateQueries({ queryKey: ["radiology-order", d.id] });
			}
		},
	});

	const assignMachine = (input: { itemId: string; machineId: string | null }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ تعيين الجهاز...",
			success: input.machineId ? "تم تعيين جهاز التصوير" : "أُلغي تعيين الجهاز",
			error: (err: Error) => err.message || "فشل تعيين الجهاز",
		});
		return p;
	};

	return { assignMachine, isPending: mutation.isPending };
};
