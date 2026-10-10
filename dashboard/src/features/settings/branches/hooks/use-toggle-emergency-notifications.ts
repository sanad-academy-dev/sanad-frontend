import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useToggleEmergencyNotifications = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
			const res = await api.branches({ id }).patch({ emergencyNotifications: enabled });
			if (res.error) throw new Error("فشل تحديث إشعارات الطوارئ");
			return res.data;
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["branches", id] });
		},
	});

	const toggleEmergencyNotifications = (id: string, enabled: boolean) =>
		toast.promise(mutation.mutateAsync({ id, enabled }), {
			loading: "جارٍ تحديث الإعداد...",
			success: enabled ? "تم تفعيل إشعارات الطوارئ" : "تم تعطيل إشعارات الطوارئ",
			error: (err: Error) => err.message || "فشل تحديث إشعارات الطوارئ",
		});

	return { toggleEmergencyNotifications, isPending: mutation.isPending };
};
