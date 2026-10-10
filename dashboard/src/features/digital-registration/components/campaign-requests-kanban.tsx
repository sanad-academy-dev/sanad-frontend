import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { IconClock, IconFileDescription, IconUser, IconPlayerPauseFilled, IconActivity, IconHourglass, IconCheck, IconX } from "@tabler/icons-react";

import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanProvider,
} from "@/components/kanban";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AppointmentColumnHeader } from "@/features/appointments/components/appointment-column-header";
import type { AppointmentColumn, AppointmentColumnId } from "@/features/appointments/types/appointment.types";
import { CampaignRequestDialog } from "./campaign-request-dialog";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

// Dummy columns matching the Appointments style
const CAMPAIGN_COLUMNS: AppointmentColumn[] = [
	{ id: "queue" as AppointmentColumnId, name: "طابور الانتظار", count: 0, icon: <IconClock className="size-4" />, accent: "neutral" },
	{ id: "in-service" as AppointmentColumnId, name: "قيد المراجعة", count: 0, icon: <IconActivity className="size-4" />, accent: "amber" },
	{ id: "awaiting-payment" as AppointmentColumnId, name: "انتظار الرد", count: 0, icon: <IconHourglass className="size-4" />, accent: "blue" },
	{ id: "done" as AppointmentColumnId, name: "تم القبول", count: 0, icon: <IconCheck className="size-4" />, accent: "emerald" },
	{ id: "cancelled" as AppointmentColumnId, name: "مرفوض", count: 0, icon: <IconX className="size-4" />, accent: "red" },
];

export type CampaignRequestItem = {
	id: string;
	name: string;
	column: AppointmentColumnId;
	code: string;
	statusLabel: string;
	statusVariant: "warning" | "info" | "default";
	patientName: string;
	patientDetails: string;
	date: string;
	guardianName: string;
	tags: { label: string; variant: "warning" | "destructive" | "default" }[];
	documents: { count: number; total: number; status: string };
};

export function CampaignRequestsKanban() {
	const mockData: CampaignRequestItem[] = [
		{
			id: "1",
			name: "ليان محمد",
			column: "queue",
			code: "APP-1001",
			statusLabel: "معلق",
			statusVariant: "warning",
			patientName: "ليان محمد",
			patientDetails: "2 سنوات - أنثى",
			date: "1/02/2026",
			guardianName: "محمد السالم",
			tags: [
				{ label: "حساسية فول سوداني", variant: "warning" },
				{ label: "ربو خفيف", variant: "destructive" },
			],
			documents: { count: 2, total: 3, status: "ناقص" },
		},
		{
			id: "2",
			name: "يوسف عبدالله",
			column: "in-service",
			code: "APP-1016",
			statusLabel: "قيد المراجعة",
			statusVariant: "info",
			patientName: "يوسف عبدالله",
			patientDetails: "4 سنوات - ذكر",
			date: "16/02/2026",
			guardianName: "عبدالله حسن",
			tags: [],
			documents: { count: 3, total: 3, status: "مكتمل" },
		},
	];

	const [data, setData] = useState<CampaignRequestItem[]>(mockData);
	const [selectedRequest, setSelectedRequest] = useState<CampaignRequestItem | null>(null);

	const columns = useMemo(() => {
		return CAMPAIGN_COLUMNS.map(col => ({
			...col,
			count: data.filter(d => d.column === col.id).length
		}));
	}, [data]);

	const handleDataChange = (nextData: CampaignRequestItem[]) => {
		setData(nextData);
	};

	return (
		<div className="min-h-0 flex-1 overflow-x-auto px-4 mt-4">
			<KanbanProvider
				className="h-full auto-cols-[minmax(20rem,1fr)]"
				collisionDetection={collisionDetection}
				columns={columns}
				data={data}
				onDataChange={handleDataChange}
			>
				{(column) => (
					<KanbanBoard
						key={column.id}
						id={column.id}
						className="bg-muted/40"
					>
						<AppointmentColumnHeader column={column as AppointmentColumn} />
						
						<KanbanCards id={column.id}>
							{(item: CampaignRequestItem) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<Card 
										className="cursor-pointer flex flex-col gap-3 rounded-md border bg-background p-3 shadow-sm text-start hover:border-primary/50 transition-colors" 
										dir="rtl"
										onClick={() => setSelectedRequest(item)}
									>
										{/* Top row: Status Badge and Code */}
										<div className="flex items-start justify-between gap-2">
											<span className="text-[13px] font-medium text-muted-foreground">{item.code}</span>
											<Badge
												variant="outline"
												className={cn(
													"gap-1 py-1 px-3 text-[11px] font-semibold border",
													item.statusVariant === "warning" && "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
													item.statusVariant === "info" && "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
												)}
											>
												{item.statusVariant === "warning" && <IconPlayerPauseFilled size={12} className="me-1" />}
												{item.statusLabel}
											</Badge>
										</div>

										{/* Middle row: Patient info and Date */}
										<div className="flex items-start justify-between gap-2">
											{/* Right side: Patient info */}
											<div className="flex items-start gap-3">
												<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500 border border-pink-100 dark:bg-pink-950 dark:border-pink-900 dark:text-pink-400 mt-0.5">
													<IconUser size={14} />
												</div>
												<div className="flex flex-col gap-0.5">
													<h3 className="truncate text-[15px] font-bold text-foreground">{item.patientName}</h3>
													<span className="text-[12px] text-muted-foreground">{item.patientDetails}</span>
												</div>
											</div>
											{/* Left side: Date */}
											<span className="text-xs text-muted-foreground mt-1">{item.date}</span>
										</div>

										{/* Guardian & Tags */}
										<div className="flex flex-col gap-1.5 pe-11">
											<span className="text-[12px] text-muted-foreground mb-1">{item.guardianName}</span>
											{item.tags.length > 0 && (
												<div className="flex flex-col items-start gap-1.5">
													{item.tags.map((tag, idx) => (
														<Badge
															key={idx}
															variant="outline"
															className={cn(
																"gap-1 py-0.5 px-2 text-[10px] font-medium rounded-sm border-0",
																tag.variant === "warning" && "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
																tag.variant === "destructive" && "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
															)}
														>
															{tag.label}
														</Badge>
													))}
												</div>
											)}
										</div>

										{/* Bottom row: Documents */}
										<div className="-mx-3 -mb-3 flex items-center justify-between gap-2 border-t px-3 pb-3 pt-2.5 mt-2">
											<div className="flex min-w-0 items-center gap-1.5 text-[11px]">
												<IconFileDescription className="size-3.5 shrink-0 text-muted-foreground" />
												<span className="truncate text-muted-foreground">{item.documents.count}/{item.documents.total} مستندات</span>
											</div>
											{item.documents.status && (
												<span className={cn(
													"truncate font-semibold text-[11px]",
													item.documents.status === "ناقص" ? "text-amber-500" : "text-emerald-500"
												)}>
													{item.documents.status}
												</span>
											)}
										</div>
									</Card>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<CampaignRequestDialog 
				request={selectedRequest}
				open={!!selectedRequest}
				onOpenChange={(open) => !open && setSelectedRequest(null)}
			/>
		</div>
	);
}
