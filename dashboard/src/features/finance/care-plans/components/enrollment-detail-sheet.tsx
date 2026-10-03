import { IconX } from "@tabler/icons-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EnrollmentVisitsTimeline } from "@/features/finance/care-plans/components/enrollment-visits-timeline";
import { useEnrollment } from "@/features/finance/care-plans/hooks/use-enrollment";

export function EnrollmentDetailSheet({
	enrollmentId,
	onOpenChange,
}: {
	enrollmentId: string | null;
	onOpenChange: (open: boolean) => void;
}) {
	const open = !!enrollmentId;
	const { enrollment } = useEnrollment(enrollmentId ?? undefined);

	const total = enrollment?.visits.length ?? 0;
	const completed = enrollment?.visits.filter((v) => v.status === "COMPLETED").length ?? 0;
	const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

	return (
		<Sheet
			open={open}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className="w-full gap-0 p-0 sm:max-w-lg"
			>
				<div className="relative flex h-full flex-col">
					<button
						type="button"
						onClick={() => onOpenChange(false)}
						className="absolute top-3 left-3 flex size-7 items-center justify-center rounded hover:bg-muted"
					>
						<IconX className="size-4" />
						<span className="sr-only">إغلاق</span>
					</button>

					{/* Header */}
					<div className="border-b px-4 py-2">
						<h2 className="text-base font-bold text-foreground">
							{enrollment?.patient.name ?? "اشتراك"}
						</h2>
						<p className="mt-0.5 text-xs text-muted-foreground">
							{enrollment?.carePlan.name}
							{enrollment?.code ? ` — ${enrollment.code}` : ""}
						</p>

						{/* Progress */}
						<div className="mt-3 flex items-center gap-2">
							<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<span className="shrink-0 text-xs text-muted-foreground">
								{completed} من {total} زيارات ({progress}%)
							</span>
						</div>
					</div>

					{/* Visits — الجدول الزمني لزيارات المتابعة */}
					<EnrollmentVisitsTimeline
						enrollmentId={enrollmentId}
						className="flex-1 overflow-y-auto p-4"
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}
