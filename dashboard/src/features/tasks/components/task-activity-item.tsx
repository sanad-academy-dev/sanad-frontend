import { IconCalendarEvent, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import { getTaskPriorityLabel, getTaskStatusLabel } from "@/features/tasks/data/task-columns";
import { useI18n } from "@/hooks/use-i18n";
import type { TaskActivityResponse } from "@/server/tasks/tasks.type";

function Avatar({ name }: { name: string }) {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0] ?? "")
		.join("");
	return (
		<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
			{initials}
		</div>
	);
}

interface TaskActivityItemProps {
	activity: TaskActivityResponse;
}

// يُبرز رموز الإشارة (@اسم) المطابقة للموظفين المُشار إليهم داخل نص التعليق
function renderBody(body: string, mentions: TaskActivityResponse["mentions"]) {
	if (mentions.length === 0) return body;
	// أطول الأسماء أولًا لتفادي مطابقة جزئية لاسم يبدأ باسم آخر
	const names = mentions
		.map((m) => m.staff.name)
		.sort((a, b) => b.length - a.length)
		.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`@(?:${names.join("|")})`, "g");
	const parts = body.split(pattern);
	const tokens = body.match(pattern) ?? [];
	return parts.flatMap((part, i) => {
		const token = tokens[i];
		return [
			part,
			token ? (
				<span
					key={`m-${i}`}
					className="font-medium text-primary"
				>
					{token}
				</span>
			) : null,
		];
	});
}

export function TaskActivityItem({ activity }: TaskActivityItemProps) {
	const { t, lang } = useI18n();
	const relative = formatDistanceToNow(new Date(activity.createdAt), {
		addSuffix: true,
		locale: lang === "ar" ? arSA : enUS,
	});

	if (activity.type === "COMMENT") {
		return (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<Avatar name={activity.author.name} />
					<span className="font-semibold text-foreground">{activity.author.name}</span>
					<span>•</span>
					<span>{t("tasks.activity.commented")}</span>
					<span>•</span>
					<span>{relative}</span>
				</div>
				<div className="me-8 rounded-md border bg-card p-3">
					<p className="whitespace-pre-wrap text-sm">
						{renderBody(activity.body ?? "", activity.mentions)}
					</p>
				</div>
			</div>
		);
	}

	if (activity.type === "STATUS_CHANGED") {
		const meta = (activity.metadata ?? {}) as { from?: string; to?: string };
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<Avatar name={activity.author.name} />
				<span className="font-semibold text-foreground">{activity.author.name}</span>
				<span>•</span>
				<span>
					{t("tasks.activity.statusChanged", {
						from: getTaskStatusLabel(t, meta.from ?? ""),
						to: getTaskStatusLabel(t, meta.to ?? ""),
					})}
				</span>
				<span>•</span>
				<span>{relative}</span>
			</div>
		);
	}

	if (activity.type === "TASK_ACCEPTED") {
		const meta = (activity.metadata ?? {}) as { priority?: string; deadline?: string };
		const parts: string[] = [];
		if (meta.priority)
			parts.push(
				t("tasks.activity.priorityPart", {
					priority: getTaskPriorityLabel(t, meta.priority),
				}),
			);
		if (meta.deadline)
			parts.push(
				t("tasks.activity.deadlinePart", {
					deadline: new Intl.DateTimeFormat(lang === "ar" ? "ar-SA" : "en-US", {
						day: "numeric",
						month: "long",
						year: "numeric",
					}).format(new Date(meta.deadline)),
				}),
			);
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<Avatar name={activity.author.name} />
				<span className="font-semibold text-foreground">{activity.author.name}</span>
				<span>•</span>
				<span className="flex items-center gap-1 text-green-600">
					<IconCircleCheck className="size-3.5" />
					{t("tasks.activity.accepted")}
				</span>
				{parts.length > 0 && (
					<>
						<span>•</span>
						<span>{parts.join(" · ")}</span>
					</>
				)}
				<span>•</span>
				<IconCalendarEvent className="size-3 shrink-0" />
				<span>{relative}</span>
			</div>
		);
	}

	if (activity.type === "TASK_DECLINED") {
		const meta = (activity.metadata ?? {}) as { reason?: string };
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<Avatar name={activity.author.name} />
				<span className="font-semibold text-foreground">{activity.author.name}</span>
				<span>•</span>
				<span className="flex items-center gap-1 text-destructive">
					<IconCircleX className="size-3.5" />
					{t("tasks.activity.declined")}
				</span>
				{meta.reason && (
					<>
						<span>•</span>
						<span className="italic">{meta.reason}</span>
					</>
				)}
				<span>•</span>
				<span>{relative}</span>
			</div>
		);
	}

	return null;
}
