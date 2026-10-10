import { useMemo, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EnrollmentDetailSheet } from "@/features/finance/care-plans/components/enrollment-detail-sheet";
import { useEnrollments } from "@/features/finance/care-plans/hooks/use-enrollments";
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

function EnrollmentRow({
	enrollment,
	onOpen,
}: {
	enrollment: CarePlanEnrollmentListItemResponse;
	onOpen: (id: string) => void;
}) {
	const progress =
		enrollment.visitsTotal > 0
			? Math.round((enrollment.visitsCompleted / enrollment.visitsTotal) * 100)
			: 0;
	const meta = STATUS_META[enrollment.status];

	return (
		<TableRow
			className="cursor-pointer"
			onClick={() => onOpen(enrollment.id)}
		>
			<TableCell>
				<div className="flex flex-col">
					<span className="font-medium text-foreground">{enrollment.patient.name}</span>
					<span className="text-[10px] text-muted-foreground">{enrollment.code}</span>
				</div>
			</TableCell>
			<TableCell>{enrollment.carePlan.name}</TableCell>
			<TableCell>
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
			</TableCell>
			<TableCell>{Number(enrollment.priceSnapshot).toLocaleString("ar-SA")} ر.س</TableCell>
			<TableCell>{new Date(enrollment.startedAt).toLocaleDateString("ar-SA")}</TableCell>
			<TableCell>
				<span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", meta.className)}>
					{meta.label}
				</span>
			</TableCell>
		</TableRow>
	);
}

export function EnrollmentsTab() {
	const { enrollments, isLoading } = useEnrollments();
	const [openId, setOpenId] = useState<string | null>(null);

	const rows = useMemo(() => enrollments, [enrollments]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{!isLoading && rows.length === 0 ? (
				<div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
					لا توجد اشتراكات بعد — استخدم خطة رعاية على طفل للبدء.
				</div>
			) : (
				<div
					className="flex-1 overflow-auto"
					dir="rtl"
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>الطفل / المعرّف</TableHead>
								<TableHead>الخطة</TableHead>
								<TableHead>التقدّم</TableHead>
								<TableHead>السعر</TableHead>
								<TableHead>تاريخ البدء</TableHead>
								<TableHead>الحالة</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((enrollment) => (
								<EnrollmentRow
									key={enrollment.id}
									enrollment={enrollment}
									onOpen={setOpenId}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			<EnrollmentDetailSheet
				enrollmentId={openId}
				onOpenChange={(open) => !open && setOpenId(null)}
			/>
		</div>
	);
}
