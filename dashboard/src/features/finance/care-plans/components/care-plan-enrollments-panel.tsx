import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EnrollmentVisitsTimeline } from "@/features/finance/care-plans/components/enrollment-visits-timeline";
import { useEnrollments } from "@/features/finance/care-plans/hooks/use-enrollments";
import { AssignCarePlanSheet } from "@/features/services/patients/components/assign-care-plan-sheet";
import { cn } from "@/lib/utils";
import type {
	CarePlanEnrollmentListItemResponse,
	CarePlanEnrollmentStatus,
} from "@/server/care-plans/care-plans.type";

const STATUS_META: Record<CarePlanEnrollmentStatus, { label: string; className: string }> = {
	ACTIVE: { label: "نشط", className: "bg-primary/10 text-primary" },
	COMPLETED: { label: "مكتمل", className: "bg-emerald-50 text-emerald-700" },
	CANCELLED: { label: "ملغى", className: "bg-muted text-muted-foreground" },
};

function EnrollmentItem({
	enrollment,
	open,
	onOpenChange,
}: {
	enrollment: CarePlanEnrollmentListItemResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const progress =
		enrollment.visitsTotal > 0
			? Math.round((enrollment.visitsCompleted / enrollment.visitsTotal) * 100)
			: 0;
	const meta = STATUS_META[enrollment.status];

	return (
		<Collapsible
			open={open}
			onOpenChange={onOpenChange}
			className="rounded-lg border bg-white"
		>
			<CollapsibleTrigger className="group flex w-full items-center gap-3 p-3 text-right">
				<IconChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />

				<div className="flex flex-1 flex-col gap-0.5">
					<span className="font-medium text-foreground">{enrollment.carePlan.name}</span>
					<span className="text-[10px] text-muted-foreground">{enrollment.code}</span>
				</div>

				<div className="flex items-center gap-2">
					<div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<span className="text-xs tabular-nums text-muted-foreground">
						{enrollment.visitsCompleted}/{enrollment.visitsTotal}
					</span>
				</div>

				<span className="text-xs tabular-nums text-muted-foreground">
					{Number(enrollment.priceSnapshot).toLocaleString("ar-SA")} ر.س
				</span>

				<span className="text-xs tabular-nums text-muted-foreground">
					{new Date(enrollment.startedAt).toLocaleDateString("ar-SA")}
				</span>

				<span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", meta.className)}>
					{meta.label}
				</span>
			</CollapsibleTrigger>

			<CollapsibleContent>
				{/* لا نجلب الزيارات إلا عند فتح العنصر */}
				{open && (
					<EnrollmentVisitsTimeline
						enrollmentId={enrollment.id}
						className="border-t p-3"
					/>
				)}
			</CollapsibleContent>
		</Collapsible>
	);
}

export function CarePlanEnrollmentsPanel({
	patientId,
	sourceAppointmentId,
	className,
}: {
	patientId: string | null;
	// عند التعيين من داخل موعد مفتوح — يُمرَّر لإنشاء جلسات مجدولة لكل زيارة
	sourceAppointmentId?: string | null;
	className?: string;
}) {
	const { enrollments, isLoading } = useEnrollments();
	const [openId, setOpenId] = useState<string | null>(null);
	const [assignOpen, setAssignOpen] = useState(false);

	const rows = useMemo(
		() => enrollments.filter((e) => e.patient.id === patientId),
		[enrollments, patientId],
	);

	return (
		<div
			className={cn("flex flex-col gap-3", className)}
			dir="rtl"
		>
			<div className="flex justify-end">
				<Button
					size="sm"
					disabled={!patientId}
					onClick={() => setAssignOpen(true)}
				>
					<IconPlus className="size-3.5" />
					تعيين خطة علاجية
				</Button>
			</div>

			{!isLoading && rows.length === 0 ? (
				<p className="text-sm text-muted-foreground">لا توجد اشتراكات لهذا الطفل</p>
			) : (
				<div className="flex flex-col gap-2">
					{rows.map((enrollment) => (
						<EnrollmentItem
							key={enrollment.id}
							enrollment={enrollment}
							open={openId === enrollment.id}
							onOpenChange={(next) => setOpenId(next ? enrollment.id : null)}
						/>
					))}
				</div>
			)}

			<AssignCarePlanSheet
				patientId={patientId}
				sourceAppointmentId={sourceAppointmentId}
				open={assignOpen}
				onOpenChange={setAssignOpen}
			/>
		</div>
	);
}
