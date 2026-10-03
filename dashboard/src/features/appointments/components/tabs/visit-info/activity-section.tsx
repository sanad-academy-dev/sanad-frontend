import { IconArrowUp } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ActivityItem } from "@/features/appointments/components/tabs/visit-info/activity-item";
import { useAppointmentActivity } from "@/features/appointments/hooks/use-appointment-activity";
import { useCreateAppointmentComment } from "@/features/appointments/hooks/use-create-appointment-comment";

interface ActivitySectionProps {
	appointmentId: string;
}

export function ActivitySection({ appointmentId }: ActivitySectionProps) {
	const { activity, isLoading } = useAppointmentActivity(appointmentId);
	const { addComment, isPending } = useCreateAppointmentComment(appointmentId);
	const [draft, setDraft] = useState("");

	const handleSubmit = async () => {
		const trimmed = draft.trim();
		if (trimmed.length === 0) return;
		await addComment(trimmed);
		setDraft("");
	};

	return (
		<section className="flex flex-col gap-3">
			<p className="font-semibold text-base">النشاط</p>

			{isLoading ? (
				<ActivitySectionSkeleton />
			) : (
				<div className="flex flex-col gap-4">
					{activity.map((item) => (
						<ActivityItem
							key={item.id}
							activity={item}
						/>
					))}
				</div>
			)}

			<div className="relative rounded-md border bg-card">
				<Textarea
					placeholder="أضف تعليقًا..."
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
					disabled={isPending}
				/>
				<Button
					size="icon-xs"
					variant="outline"
					className="absolute bottom-2 end-2 size-7 rounded-full border"
					onClick={handleSubmit}
					disabled={isPending || draft.trim().length === 0}
				>
					<IconArrowUp className="size-3.5" />
				</Button>
			</div>
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
			<ActivityOneLineSkeleton />
			<ActivityCommentSkeleton />
			<ActivityOneLineSkeleton />
		</div>
	);
}
