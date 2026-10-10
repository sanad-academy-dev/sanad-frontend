import { format, formatDistanceToNow } from "date-fns";
import { arSA } from "date-fns/locale";

import { STATUS_META } from "@/features/appointments/data/status-meta";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { useI18n } from "@/hooks/use-i18n";
import type { AppointmentActivityResponse } from "@/server/appointments/appointments.type";

interface ActivityItemProps {
	activity: AppointmentActivityResponse;
}

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

function statusLabel(status: unknown): string {
	if (typeof status !== "string") return "";
	return STATUS_META[status as AppointmentStatus]?.label ?? status;
}

export function ActivityItem({ activity }: ActivityItemProps) {
	const { lang } = useI18n();
	const relative = formatDistanceToNow(new Date(activity.createdAt), {
		addSuffix: true,
		locale: arSA,
	});

	if (activity.type === "COMMENT") {
		return (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<Avatar name={activity.author.name} />
					<span className="font-semibold text-foreground">{activity.author.name}</span>
					<span>•</span>
					<span>علّق</span>
					<span>•</span>
					<span>{relative}</span>
				</div>
				<div className="me-8 rounded-md border bg-card p-3">
					<p className="whitespace-pre-wrap text-sm">{activity.body}</p>
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
					غيّر الحالة من {statusLabel(meta.from)} إلى {statusLabel(meta.to)}
				</span>
				<span>•</span>
				<span>{relative}</span>
			</div>
		);
	}

	if (activity.type === "RESCHEDULED") {
		const meta = (activity.metadata ?? {}) as {
			previousStartsAt?: string;
			newStartsAt?: string;
		};
		const dateLocale = lang === "ar" ? arSA : undefined;
		const formatStamp = (iso: string | undefined) => {
			if (!iso) return "";
			try {
				return format(new Date(iso), "PPp", { locale: dateLocale });
			} catch {
				return iso;
			}
		};
		return (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<Avatar name={activity.author.name} />
					<span className="font-semibold text-foreground">{activity.author.name}</span>
					<span>•</span>
					<span>
						أعاد الجدولة من {formatStamp(meta.previousStartsAt)} إلى{" "}
						{formatStamp(meta.newStartsAt)}
					</span>
					<span>•</span>
					<span>{relative}</span>
				</div>
				{activity.body && (
					<div className="me-8 rounded-md border bg-card p-3">
						<p className="whitespace-pre-wrap text-sm">{activity.body}</p>
					</div>
				)}
			</div>
		);
	}

	if (activity.type === "STAFF_REASSIGNED") {
		const meta = (activity.metadata ?? {}) as {
			previousStaffName?: string;
			newStaffName?: string;
		};
		return (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-muted-foreground text-xs">
					<Avatar name={activity.author.name} />
					<span className="font-semibold text-foreground">{activity.author.name}</span>
					<span>•</span>
					<span>
						أحال الزيارة من {meta.previousStaffName ?? ""} إلى {meta.newStaffName ?? ""}
					</span>
					<span>•</span>
					<span>{relative}</span>
				</div>
				{activity.body && (
					<div className="me-8 rounded-md border bg-card p-3">
						<p className="whitespace-pre-wrap text-sm">{activity.body}</p>
					</div>
				)}
			</div>
		);
	}

	if (activity.type === "EXAM_STARTED" || activity.type === "EXAM_COMPLETED") {
		const verb = activity.type === "EXAM_STARTED" ? "بدأ الفحص السريري" : "أنهى الفحص السريري";
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<Avatar name={activity.author.name} />
				<span className="font-semibold text-foreground">{activity.author.name}</span>
				<span>•</span>
				<span>{verb}</span>
				<span>•</span>
				<span>{relative}</span>
			</div>
		);
	}

	if (activity.type === "DOCUMENT_ADDED" || activity.type === "DOCUMENT_REMOVED") {
		const meta = (activity.metadata ?? {}) as { kind?: string };
		const isLink = meta.kind === "LINK";
		const verb =
			activity.type === "DOCUMENT_ADDED"
				? isLink
					? "أضاف رابطًا"
					: "أضاف مستندًا"
				: isLink
					? "حذف رابطًا"
					: "حذف مستندًا";
		return (
			<div className="flex items-center gap-2 text-muted-foreground text-xs">
				<Avatar name={activity.author.name} />
				<span className="font-semibold text-foreground">{activity.author.name}</span>
				<span>•</span>
				<span>{verb}</span>
				{activity.body && (
					<>
						<span>•</span>
						<span className="text-foreground">{activity.body}</span>
					</>
				)}
				<span>•</span>
				<span>{relative}</span>
			</div>
		);
	}

	// CREATED
	return (
		<div className="flex items-center gap-2 text-muted-foreground text-xs">
			<Avatar name={activity.author.name} />
			<span className="font-semibold text-foreground">{activity.author.name}</span>
			<span>•</span>
			<span>طلب زيارة</span>
			<span>•</span>
			<span>{relative}</span>
		</div>
	);
}
