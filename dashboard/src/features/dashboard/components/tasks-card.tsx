import { IconCircle, IconCircleCheck, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BaseDashboardCard } from "@/features/dashboard/components/base-dashboard-card";
import { useTasks } from "@/features/dashboard/hooks/use-tasks";
import type { DashboardCardProps } from "@/features/dashboard/types/dashboard-card.types";
import { AddTaskModal } from "@/features/tasks/components/add-task-modal";
import { useI18n } from "@/hooks/use-i18n";
import { getDateFormatter } from "@/lib/locale-format";

export function TasksCard({ expanded, onToggleExpanded }: DashboardCardProps) {
	const { t, lang } = useI18n();
	const { tasks, isLoading, isError } = useTasks();

	const dateFormatter = getDateFormatter(lang, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<BaseDashboardCard
			cardId="card-6"
			expanded={expanded}
			onToggleExpanded={onToggleExpanded}
			headerAction={
				<AddTaskModal
					trigger={
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8"
							aria-label={t("dashboard.addTaskModal.trigger")}
						>
							<IconPlus className="size-4" />
						</Button>
					}
				/>
			}
		>
			<CardContent className="pt-0 flex-1">
				{isLoading ? (
					<div className="divide-y">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-3 px-3 py-2"
							>
								<Skeleton className="size-4 shrink-0 rounded-full" />
								<div className="flex flex-1 flex-col gap-1">
									<Skeleton className="h-3 w-3/4" />
									<Skeleton className="h-2.5 w-1/2" />
								</div>
							</div>
						))}
					</div>
				) : isError ? (
					<div className="border rounded-md p-2.5 flex justify-between items-center">
						<p className="flex flex-col gap-1">
							<span className="font-bold">{t("dashboard.cards.tasks.errorTitle")}</span>
							<span className="text-sm text-muted-foreground">
								{t("common.states.checkConnection")}
							</span>
						</p>
					</div>
				) : tasks.length > 0 ? (
					<div className="divide-y">
						{tasks.map((task) => {
							const deadlineDate = task.deadline ? new Date(task.deadline) : null;
							const isOverdue = Boolean(deadlineDate && deadlineDate < new Date());
							const isCompleted = task.status === "COMPLETED";

							return (
								<div
									key={task.id}
									className="flex items-center justify-between gap-3 px-3 py-1"
								>
									<div className="min-w-0 flex-1 flex items-center gap-2">
										<span className="shrink-0">
											{isOverdue ? (
												<IconCircleCheck className="size-4.5 text-red-500" />
											) : isCompleted ? (
												<IconCircleCheck className="size-4.5 text-green-500" />
											) : (
												<IconCircle className="size-4.5 text-muted-foreground" />
											)}
										</span>

										<div className="flex flex-col gap-0.5">
											<p className="truncate text-xs font-semibold">{task.title}</p>
											<div className="text-[11px] text-muted-foreground">
												<span className="font-medium">
													{deadlineDate ? dateFormatter.format(deadlineDate) : "—"}
												</span>
												<span className="mx-1">•</span>
												<span>
													{task.assignees.length > 0
														? task.assignees.map((a) => a.name).join("، ")
														: t("dashboard.cards.tasks.unassigned")}
												</span>
											</div>
										</div>
									</div>

									{isOverdue ? (
										<span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
											<span className="font-medium">
												{deadlineDate ? dateFormatter.format(deadlineDate) : "—"}
											</span>
											<span>{t("dashboard.cards.tasks.late")}</span>
										</span>
									) : null}
								</div>
							);
						})}
					</div>
				) : (
					<div className="border rounded-md p-2.5 flex justify-between items-center">
						<p className="flex flex-col gap-1">
							<span className="font-bold">{t("dashboard.cards.tasks.emptyTitle")}</span>
							<span className="text-sm text-muted-foreground">
								{t("dashboard.cards.tasks.emptyDescription")}
							</span>
						</p>

						<AddTaskModal />
					</div>
				)}
			</CardContent>
		</BaseDashboardCard>
	);
}
