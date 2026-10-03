import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AddTaskFormValues } from "@/features/dashboard/types/task.types";
import { useI18n } from "@/hooks/use-i18n";
import { uploadFiles } from "@/hooks/use-upload-files";
import { api } from "@/lib/api";

export const useAddTask = () => {
	const { t } = useI18n();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: AddTaskFormValues) => {
			const {
				emailNotification: _email,
				createMultiple: _multiple,
				images,
				deadline,
				...taskData
			} = data;

			const imagePaths = images.length > 0 ? await uploadFiles(images) : [];

			const res = await api.tasks.post({
				...taskData,
				images: imagePaths,
				deadline: deadline?.toISOString(),
			});

			if (res.error) throw new Error(t("dashboard.addTaskModal.toasts.error"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	const addTask = async (data: AddTaskFormValues) =>
		toast.promise(mutation.mutateAsync(data), {
			loading: t("dashboard.addTaskModal.toasts.loading"),
			success: t("dashboard.addTaskModal.toasts.success"),
			error: (err: Error) => err.message || t("dashboard.addTaskModal.toasts.error"),
		});

	return { addTask, isPending: mutation.isPending };
};
