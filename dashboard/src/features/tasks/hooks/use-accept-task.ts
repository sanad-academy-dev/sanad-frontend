import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import type { AcceptTaskFormInput } from "@/server/tasks/tasks.type";

/** قبول مهمة من الطابور — تنتقل إلى «قيد الانتظار» بأولوية وموعد تسليم اختياريين */
export const useAcceptTask = (taskId: string | null, options?: { onSuccess?: () => void }) => {
	const { t } = useI18n();
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: AcceptTaskFormInput) => {
			if (!taskId) return;
			const res = await api.tasks({ id: taskId }).accept.post({
				comment: data.comment,
				deadline: data.deadline?.toISOString(),
				priority: data.priority,
			});
			if (res.error) throw new Error(t("tasks.toasts.acceptError"));
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["task", taskId] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			void queryClient.invalidateQueries({ queryKey: ["task-activity", taskId] });
			options?.onSuccess?.();
		},
	});

	const acceptTask = (data: AcceptTaskFormInput) =>
		toast.promise(mutateAsync(data), {
			loading: t("tasks.toasts.acceptLoading"),
			success: t("tasks.toasts.acceptSuccess"),
			error: (err: Error) => err.message || t("tasks.toasts.acceptError"),
		});

	return { acceptTask, isAccepting: isPending };
};
