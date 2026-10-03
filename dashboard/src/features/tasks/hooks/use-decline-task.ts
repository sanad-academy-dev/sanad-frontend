import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import type { DeclineTaskFormInput } from "@/server/tasks/tasks.type";

/** رفض مهمة من الطابور — تُلغى مع تسجيل السبب ولا تدخل سير العمل */
export const useDeclineTask = (
	taskId: string | null,
	options?: { onSuccess?: () => void },
) => {
	const { t } = useI18n();
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: DeclineTaskFormInput) => {
			if (!taskId) return;
			const res = await api.tasks({ id: taskId }).decline.post({
				comment: data.comment,
				reason: data.reason,
				assigneeIds: data.assigneeIds,
			});
			if (res.error) throw new Error(t("tasks.toasts.declineError"));
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			void queryClient.invalidateQueries({ queryKey: ["task-activity", taskId] });
			options?.onSuccess?.();
		},
	});

	const declineTask = (data: DeclineTaskFormInput) =>
		toast.promise(mutateAsync(data), {
			loading: t("tasks.toasts.declineLoading"),
			success: t("tasks.toasts.declineSuccess"),
			error: (err: Error) => err.message || t("tasks.toasts.declineError"),
		});

	return { declineTask, isDeclining: isPending };
};
