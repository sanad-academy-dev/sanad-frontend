import { IconArrowUp } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MentionTextarea } from "@/features/appointments/components/tabs/visit-info/mention-textarea";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { TaskActivityItem } from "@/features/tasks/components/task-activity-item";
import { useTaskActivity } from "@/features/tasks/hooks/use-task-activity";
import { useTaskSettings } from "@/features/tasks/hooks/use-task-settings";
import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";

interface TaskActivitySectionProps {
	taskId: string;
}

export function TaskActivitySection({ taskId }: TaskActivitySectionProps) {
	const { t } = useI18n();
	const queryClient = useQueryClient();
	const { activity, isLoading } = useTaskActivity(taskId);
	const { settings: taskSettings } = useTaskSettings(t);
	const { staff } = useStaff();
	const [draft, setDraft] = useState("");
	const [mentionedStaffIds, setMentionedStaffIds] = useState<string[]>([]);

	// الإشارات (@) مشروطة بتفعيلها في إعدادات المهام — وإلا لا تظهر قائمة
	const mentionsEnabled = taskSettings.mentions;
	const mentionables = useMemo(
		() => (mentionsEnabled ? staff.map((s) => ({ id: s.id, name: s.name })) : []),
		[mentionsEnabled, staff],
	);

	const { mutate: addComment, isPending } = useMutation({
		mutationFn: async (input: { content: string; mentionedStaffIds: string[] }) => {
			const res = await api.tasks({ id: taskId }).comments.post(input);
			if (res.error) throw new Error(t("tasks.errors.addComment"));
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["task-activity", taskId] });
			void queryClient.invalidateQueries({ queryKey: ["tasks"] });
			setDraft("");
			setMentionedStaffIds([]);
		},
	});

	const handleSubmit = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		addComment({ content: trimmed, mentionedStaffIds });
	};

	return (
		<section className="flex flex-col gap-3">
			<p className="font-semibold text-sm">{t("tasks.sheet.activity")}</p>

			{isLoading ? (
				<ActivitySectionSkeleton />
			) : activity.length === 0 ? (
				<p className="text-sm text-muted-foreground">{t("tasks.activity.empty")}</p>
			) : (
				<div className="flex flex-col gap-4">
					{activity.map((item) => (
						<TaskActivityItem
							key={item.id}
							activity={item}
						/>
					))}
				</div>
			)}

			{taskSettings.comments ? (
				<div className="relative rounded-md border bg-card">
					<MentionTextarea
						value={draft}
						onChange={setDraft}
						users={mentionables}
						onMentionsChange={setMentionedStaffIds}
						placeholder={t("tasks.activity.commentPlaceholder")}
						className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
						disabled={isPending}
					/>
					<Button
						size="icon-xs"
						variant="outline"
						className="absolute bottom-2 end-2 z-10 size-7 rounded-full border"
						onClick={handleSubmit}
						disabled={isPending || draft.trim().length === 0}
					>
						<IconArrowUp className="size-3.5" />
					</Button>
				</div>
			) : (
				<p className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
					التعليقات معطلة لهذا الفرع
				</p>
			)}
		</section>
	);
}

function ActivityOneLineSkeleton() {
	return (
		<div className="flex items-center gap-2">
			<Skeleton className="size-6 shrink-0 rounded-full" />
			<Skeleton className="h-3 w-full max-w-64" />
		</div>
	);
}

function ActivityCommentSkeleton() {
	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center gap-2">
				<Skeleton className="size-6 shrink-0 rounded-full" />
				<Skeleton className="h-3 w-40" />
			</div>
			<div className="me-8 flex flex-col gap-1.5 rounded-md border bg-card p-3">
				<Skeleton className="h-3 w-full" />
				<Skeleton className="h-3 w-2/3" />
			</div>
		</div>
	);
}

function ActivitySectionSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<ActivityOneLineSkeleton />
			<ActivityCommentSkeleton />
			<ActivityOneLineSkeleton />
		</div>
	);
}
