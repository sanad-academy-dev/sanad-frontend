import {
	IconCalendarEvent,
	IconCalendarX,
	IconChevronDown,
	IconMessage,
} from "@tabler/icons-react";
import type { MouseEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTaskTypeLabel, TASK_TYPE_BADGE } from "@/features/tasks/data/task-columns";
import type { TaskCardData } from "@/features/tasks/types/task.types";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface TaskCardProps {
	data: TaskCardData;
	onSelect?: (data: TaskCardData) => void;
	onAccept?: (data: TaskCardData) => void;
	onDecline?: (data: TaskCardData) => void;
}

export function TaskCard({ data, onSelect, onAccept, onDecline }: TaskCardProps) {
	const { t } = useI18n();
	const stop = (e: MouseEvent) => e.stopPropagation();
	const typeLabel = getTaskTypeLabel(t, data.type);
	const typeBadgeClass =
		TASK_TYPE_BADGE[data.type] ?? "bg-slate-100 text-slate-700 border-slate-200";
	const hasSubtasks = data.subtasksTotal > 0;
	// بطاقات الطابور تعرض إجراءي الموافقة مباشرة — بقية الأعمدة دخلت سير العمل بالفعل
	const isQueued = data.column === "queue";

	return (
		<Card
			className="cursor-pointer gap-2 rounded-md border bg-background p-3 shadow-sm"
			onClick={() => onSelect?.(data)}
		>
			<div className="flex items-start justify-between gap-2">
				<h3 className="flex-1 text-start font-bold text-foreground text-sm leading-snug">
					{data.title}
				</h3>
				<span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
					{data.code}
				</span>
			</div>

			{hasSubtasks && (
				<div className="flex items-center gap-2">
					<p className="text-xs text-muted-foreground shrink-0">
						{t("tasks.card.subtasksProgress", {
							completed: data.subtasksCompleted,
							total: data.subtasksTotal,
						})}
					</p>
					<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{
								width: `${Math.round((data.subtasksCompleted / data.subtasksTotal) * 100)}%`,
							}}
						/>
					</div>
				</div>
			)}

			<div className="flex items-center justify-between gap-2">
				{data.deadlineLabel ? (
					<span className="text-xs text-muted-foreground">{data.deadlineLabel}</span>
				) : (
					<span />
				)}
				<Badge
					variant="outline"
					className={cn("text-[11px] py-0.5 px-1.5 font-medium", typeBadgeClass)}
				>
					{typeLabel}
				</Badge>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<Button
						size="icon-xs"
						variant="ghost"
						className="h-6 w-auto px-1.5 gap-1 text-xs text-muted-foreground"
						onClick={stop}
					>
						<IconMessage className="size-3.5" />
						<span>{t("tasks.card.comments", { count: data.commentsCount })}</span>
					</Button>
					<Button
						size="icon-xs"
						variant="ghost"
						onClick={stop}
					>
						<IconChevronDown className="size-3.5 text-muted-foreground" />
					</Button>
				</div>

				{data.assigneeName ? (
					<div className="flex items-center gap-1.5">
						<span className="text-xs text-muted-foreground truncate max-w-[100px]">
							{data.assigneeName}
						</span>
						<Avatar className="size-6 shrink-0">
							<AvatarFallback className="text-[10px]">{data.assigneeInitials}</AvatarFallback>
						</Avatar>
					</div>
				) : null}
			</div>

			{isQueued && (onAccept || onDecline) && (
				<div className="flex items-center gap-1.5 border-t pt-2">
					{onAccept && (
						<Button
							size="sm"
							className="h-7 flex-1 gap-1 text-xs"
							onClick={(e) => {
								stop(e);
								onAccept(data);
							}}
						>
							<IconCalendarEvent className="size-3.5" />
							{t("tasks.card.accept")}
						</Button>
					)}
					{onDecline && (
						<Button
							size="sm"
							variant="outline"
							className="h-7 flex-1 gap-1 text-xs text-destructive hover:text-destructive"
							onClick={(e) => {
								stop(e);
								onDecline(data);
							}}
						>
							<IconCalendarX className="size-3.5" />
							{t("tasks.card.decline")}
						</Button>
					)}
				</div>
			)}
		</Card>
	);
}
