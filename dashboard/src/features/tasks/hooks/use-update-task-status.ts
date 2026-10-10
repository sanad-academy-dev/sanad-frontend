import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TaskStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export const useUpdateTaskStatus = () => {
	const queryClient = useQueryClient();

	const { mutate: updateStatus } = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
			const res = await api.tasks({ id }).patch({ status });
			if (res.error) throw new Error("Failed to update task status");
			return res.data;
		},
		onSuccess: (_, { id }) => {
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			void queryClient.invalidateQueries({ queryKey: ["task", id] });
		},
	});

	return { updateStatus };
};
