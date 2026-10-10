import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/features/reminders/data/reminders";
import type { ScheduledJobStatus } from "@/generated/prisma/enums";
import type { ScheduledJobResponse } from "@/server/scheduler/scheduler.type";

/**
 * [RC1] وظائف المُجدوِل.
 *
 * الشاشة تجيب سؤالًا كان بلا جواب في هذا المستودع: **«هل عمل التذكير أمس؟»**.
 * قبلها كان الجواب يحتاج فتح سجلّات الخادم، ومع غياب المُجدوِل أصلًا لم يكن
 * السؤال يُطرح.
 *
 * و`result` يُعرض ملخَّصًا لا خامًا: «٣ قواعد · ١٢ رسالة» هو ما يريد الإنسان
 * قراءته، لا كائن JSON.
 */

const STATUS_META: Record<
	ScheduledJobStatus,
	{ label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
	QUEUED: { label: "بالانتظار", variant: "outline" },
	IN_PROGRESS: { label: "قيد التنفيذ", variant: "secondary" },
	COMPLETED: { label: "اكتملت", variant: "default" },
	FAILED: { label: "فشلت", variant: "destructive" },
	CANCELLED: { label: "أُلغيت", variant: "outline" },
};

const JOB_LABELS: Record<string, string> = {
	"reminders.sweep": "مسح الاستحقاقات",
	"reminders.dispatch": "تسليم الرسائل",
};

export function JobsTable({
	jobs,
	isLoading,
}: {
	jobs: ScheduledJobResponse[];
	isLoading: boolean;
}) {
	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton
						key={i}
						className="h-12 w-full rounded-md"
					/>
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>الحالة</TableHead>
					<TableHead>الوظيفة</TableHead>
					<TableHead>الموعد</TableHead>
					<TableHead>النتيجة</TableHead>
					<TableHead>المحاولات</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{jobs.map((job) => {
					const meta = STATUS_META[job.status];
					return (
						<TableRow key={job.id}>
							<TableCell>
								<Badge
									variant={meta.variant}
									className="text-xs"
								>
									{meta.label}
								</Badge>
							</TableCell>
							<TableCell className="text-sm">
								{JOB_LABELS[job.jobType] ?? job.jobType}
							</TableCell>
							<TableCell className="whitespace-nowrap text-muted-foreground text-xs">
								{formatDateTime(job.finishedAt ?? job.scheduledFor)}
							</TableCell>
							<TableCell className="max-w-[320px] text-sm">
								{job.errorMessage ? (
									<span className="text-destructive text-xs">{job.errorMessage}</span>
								) : (
									<span className="text-muted-foreground text-xs">
										{summarise(job.result)}
									</span>
								)}
							</TableCell>
							<TableCell className="text-muted-foreground text-xs">
								{job.attempts}/{job.maxAttempts}
							</TableCell>
						</TableRow>
					);
				})}

				{jobs.length === 0 && (
					<TableRow>
						<TableCell
							colSpan={5}
							className="py-12 text-center text-muted-foreground text-sm"
						>
							لا وظائف بعد. تُنشأ تلقائيًّا مع أوّل نبضة cron، أو بزرّ «شغّل الآن».
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

/**
 * ملخّص مقروء لنتيجة الوظيفة.
 *
 * `result` عمود JSON، وشكلُه يختلف بحسب نوع الوظيفة — فالقراءة دفاعية: حقلٌ غائب
 * أو شكلٌ غير متوقّع يعطي «—» لا يرمي داخل عرضٍ للجدول.
 */
function summarise(result: unknown): string {
	if (!result || typeof result !== "object") return "—";
	const value = result as Record<string, unknown>;

	if (typeof value.totalQueued === "number") {
		const rules = typeof value.rules === "number" ? value.rules : 0;
		return `${rules} قاعدة · ${value.totalQueued} رسالة أُدرجت`;
	}
	if (typeof value.sent === "number") {
		const manual = typeof value.awaitingManual === "number" ? value.awaitingManual : 0;
		const skipped = typeof value.skipped === "number" ? value.skipped : 0;
		return `سُلّمت ${value.sent} · يدويّ ${manual} · متعذّرة ${skipped}`;
	}
	return "—";
}
