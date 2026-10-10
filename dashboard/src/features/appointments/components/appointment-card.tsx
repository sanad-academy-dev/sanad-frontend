import {
	IconAlertTriangleFilled,
	IconChevronDown,
	IconClock,
	IconMessage,
	IconPlus,
	IconSparkles,
} from "@tabler/icons-react";
import type { MouseEvent } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentCardFooter } from "@/features/appointments/components/appointment-card-footer";
import { PRIORITY_META, QUEUE_STATUS_META } from "@/features/appointments/data/status-meta";
import { useUpdateAppointmentQueueStatus } from "@/features/appointments/hooks/use-update-appointment-queue-status";
import type { AppointmentCardData } from "@/features/appointments/types/appointment.types";
import { QueueStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
	data: AppointmentCardData;
	onSelect?: (data: AppointmentCardData) => void;
}

export function AppointmentCard({ data, onSelect }: AppointmentCardProps) {
	const showWarning = data.column === "check-in";
	const queueMeta = data.queueStatus ? QUEUE_STATUS_META[data.queueStatus] : null;
	const QueueIcon = queueMeta?.icon ?? null;
	const priorityMeta = data.priority ? PRIORITY_META[data.priority] : null;
	const { updateQueueStatus, isPending } = useUpdateAppointmentQueueStatus();

	const stop = (e: MouseEvent) => e.stopPropagation();

	const handleQueueStatus = (e: MouseEvent, status: QueueStatus) => {
		e.stopPropagation();
		if (data.queueStatus === status) return;
		void updateQueueStatus({ id: data.id, queueStatus: status });
	};

	return (
		<Card
			className="cursor-pointer gap-3 rounded-md border bg-background p-3 shadow-sm"
			dir="ltr"
			onClick={() => onSelect?.(data)}
		>
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-muted-foreground">{data.code}</span>
					{priorityMeta && (
						<Badge
							variant="outline"
							className={cn("gap-1 py-0.5 text-[10px]", priorityMeta.className)}
						>
							{priorityMeta.label}
						</Badge>
					)}
				</div>
				{/* اسم وليّ الأمر بجانب اسم الطفل */}
				<div className="flex min-w-0 items-center gap-1.5">
					<span className="truncate text-xs text-muted-foreground">{data.ownerName}</span>
					<span className="shrink-0 text-xs text-muted-foreground">•</span>
					<h3 className="truncate text-sm font-bold text-foreground">{data.patientName}</h3>
					<Avatar size="sm">
						<AvatarFallback className="bg-primary text-[10px] font-semibold text-white">
							{data.patientInitials}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-3 text-xs text-muted-foreground">
					<span className="flex items-center gap-1">
						<span>{data.duration}</span>
						<IconClock className="size-3.5" />
					</span>
					<span className="flex items-center gap-1">
						<span>{data.time}</span>
						<IconClock className="size-3.5" />
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					{data.isEmergency && (
						<Badge className="gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
							<IconAlertTriangleFilled className="size-3" />
							طوارئ
						</Badge>
					)}
					<span className="text-xs text-muted-foreground">{data.dateLabel}</span>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<Button
						size="icon-xs"
						variant="outline"
						className="size-7"
						onClick={stop}
					>
						<IconMessage />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={stop}
					>
						<IconPlus />
						إضافة SOAP
					</Button>
				</div>
			</div>

			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					<Badge
						variant="outline"
						className="gap-1 py-1"
					>
						<IconMessage />
						تعليقات {data.commentsCount}
					</Badge>
				</div>

				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-foreground">{data.doctorName}</span>
					<Avatar size="sm">
						<AvatarFallback className="bg-blue-600 text-[10px] font-semibold text-white">
							{data.doctorInitials}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<AppointmentCardFooter data={data} />

			{/* آخر طبقة في البطاقة — الحدّ العلوي يمتد لكامل العرض عبر ‎-mx-3‎.
			    البطاقة LTR: أول عنصر = يسار (حالة الطابور)، وآخر عنصر = يمين (السبب).
			    الوسم لا يظهر قبل تسجيل الدخول — عندها يضبطه الخادم «مؤكد» ويبقى قابلًا
			    للتغيير يدويًا في أي وقت (docs/appointments-workflow.md) */}
			<div className="-mx-3 -mb-3 flex items-center justify-between gap-2 border-t px-3 pb-3 pt-2.5">
				{queueMeta && QueueIcon ? (
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={stop}
						>
							<Badge
								variant="outline"
								className={cn(
									"shrink-0 cursor-pointer gap-1 py-0.5 text-[10px]",
									queueMeta.color,
								)}
							>
								<QueueIcon className="size-3" />
								{queueMeta.label}
								<IconChevronDown className="size-3 text-muted-foreground" />
							</Badge>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							onClick={stop}
						>
							{Object.values(QueueStatus).map((status) => {
								const meta = QUEUE_STATUS_META[status];
								const Icon = meta.icon;
								return (
									<DropdownMenuItem
										key={status}
										onClick={(e) => handleQueueStatus(e, status)}
										disabled={isPending}
									>
										<Icon className={`size-4 ${meta.color}`} />
										{meta.label}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					// عنصر نائب يبقي السبب لاصقًا باليمين حين لا توجد حالة طابور
					<span />
				)}

				<div className="flex min-w-0 items-center gap-1.5 text-xs">
					<IconSparkles className="size-3.5 shrink-0 text-amber-500" />
					<span className="truncate font-semibold text-foreground">{data.reason}</span>
					{showWarning && (
						<IconAlertTriangleFilled className="size-3.5 shrink-0 text-amber-500" />
					)}
				</div>
			</div>
		</Card>
	);
}
