import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import type { InboxActivity } from "@/features/inbox/types/inbox.type";
import { useI18n } from "@/hooks/use-i18n";

// شارة أحرف أولى للاسم (بلا صورة)
function InitialsBadge({ name }: { name: string }) {
	const initials = name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((p) => p[0] ?? "")
		.join("");
	return (
		<span className="flex size-[13px] shrink-0 items-center justify-center rounded-full bg-primary text-[8px] font-semibold text-white">
			{initials}
		</span>
	);
}

export function InboxActivityItem({ activity }: { activity: InboxActivity }) {
	const { lang } = useI18n();
	const relative = formatDistanceToNow(new Date(activity.createdAt), {
		addSuffix: true,
		locale: lang === "ar" ? arSA : enUS,
	});

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<span className="flex items-center gap-1 font-medium text-foreground">
					<InitialsBadge name={activity.actorName} />
					{activity.actorName}
				</span>
				<span>·</span>
				<span>{activity.action}</span>
				<span>{relative}</span>
				<span>·</span>
			</div>

			{activity.comment ? (
				<p className="me-8 rounded-md border bg-card p-2.5 text-sm whitespace-pre-wrap">
					{activity.comment}
				</p>
			) : null}
		</div>
	);
}
