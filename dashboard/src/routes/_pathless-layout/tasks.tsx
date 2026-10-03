import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Stats } from "@/components/common/stats";
import { TasksHeader, type TasksView } from "@/features/tasks/components/tasks-header";
import { TasksKanban } from "@/features/tasks/components/tasks-kanban";
import { TasksToolbar } from "@/features/tasks/components/tasks-toolbar";
import { useTasksStats } from "@/features/tasks/hooks/use-tasks-stats";
import { useI18n } from "@/hooks/use-i18n";

const VALID_VIEWS: TasksView[] = ["all", "for-me", "done"];

export const Route = createFileRoute("/_pathless-layout/tasks")({
	validateSearch: (search): { view: TasksView; openTask?: string } => {
		const raw = (search as { view?: string }).view;
		const view = VALID_VIEWS.includes(raw as TasksView) ? (raw as TasksView) : "all";
		// معرّف مهمة لفتح تفاصيلها مباشرة (من إشعار الوارد مثلًا)
		const rawOpen = (search as { openTask?: string }).openTask;
		const openTask = typeof rawOpen === "string" && rawOpen ? rawOpen : undefined;
		return { view, openTask };
	},
	component: RouteComponent,
});

function TasksStats() {
	const { stats } = useTasksStats();
	const { t } = useI18n();

	return (
		<Stats
			className="px-4"
			stats={[
				{
					title: t("tasks.stats.total.title"),
					value: stats.total,
					tooltip: t("tasks.stats.total.tooltip"),
				},
				{
					title: t("tasks.stats.pending.title"),
					value: stats.pending,
					tooltip: t("tasks.stats.pending.tooltip"),
				},
				{
					title: t("tasks.stats.inProgress.title"),
					value: stats.inProgress,
					tooltip: t("tasks.stats.inProgress.tooltip"),
				},
				{
					title: t("tasks.stats.completed.title"),
					value: stats.completed,
					tooltip: t("tasks.stats.completed.tooltip"),
				},
				{
					title: t("tasks.stats.cancelled.title"),
					value: stats.cancelled,
					tooltip: t("tasks.stats.cancelled.tooltip"),
				},
			]}
		/>
	);
}

function RouteComponent() {
	const { view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const handleViewChange = (next: TasksView) => {
		void navigate({ search: { view: next }, replace: true });
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TasksHeader
				active={view}
				onChange={handleViewChange}
			/>
			<TasksStats />
			<hr className="my-2" />
			<TasksToolbar />
			<hr className="my-2" />
			<TasksKanban view={view} />
		</div>
	);
}
